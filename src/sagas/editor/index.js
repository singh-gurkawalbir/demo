import {
  call,
  put,
  select,
  takeLatest,
  takeEvery,
  delay,
  take,
  race,
} from 'redux-saga/effects';
import { deepClone } from 'fast-json-patch';
import actions from '../../actions';
import actionTypes from '../../actions/types';
import { selectors } from '../../reducers';
import { apiCallWithRetry } from '../index';
import { getResource, commitStagedChanges } from '../resources';
import processorLogic, { featuresMap } from '../../reducers/session/editors/processorLogic';
import { SCOPES } from '../resourceForm';
import { requestSampleData } from '../sampleData/flows';
import { requestResourceFormSampleData } from '../sampleData/resourceForm';
import { constructResourceFromFormValues } from '../utils';
import { safeParse } from '../../utils/string';
import { getUniqueFieldId, dataAsString, FLOW_STAGES, HOOK_STAGES, previewDataDependentFieldIds } from '../../utils/editor';
import { isNewId } from '../../utils/resource';

/**
 * a util function to get resourcePath based on value / defaultPath
 * If user updated resourcePath, returns path from the value
 * Initially, returns resourcePath on saved resource
 */
export function extractResourcePath(value, initialResourcePath) {
  if (value) {
    const jsonValue = safeParse(value) || {};

    return jsonValue.resourcePath;
  }

  return initialResourcePath;
}

export function* invokeProcessor({ editorId, processor, body }) {
  let reqBody = body;

  // options should be passed to BE for handlebars processor
  // for correct HTML/URL encoding
  if (processor === 'handlebars' && editorId) {
    const timezone = yield select(selectors.userTimezone);
    const editor = yield select(selectors.editor, editorId);
    const {formKey, fieldId, resourceId, resourceType, supportsDefaultData} = editor;
    const formState = yield select(selectors.formState, formKey);
    const { value: formValues } = formState || {};
    const resource = yield call(constructResourceFromFormValues, {
      formValues,
      resourceId,
      resourceType,
    });
    const { _connectionId: connectionId } = resource;
    const connection = yield select(selectors.resource, 'connections', connectionId);

    reqBody = {
      ...body,
      options: {
        connection,
        [resourceType === 'imports' ? 'import' : 'export']: resource,
        fieldPath: fieldId,
        timezone,
      },
    };
    // for sql editors, modelMetadata needs to be passed inside options
    if (supportsDefaultData) {
      reqBody.options.modelMetadata = safeParse(editor.defaultData) || {};
    }
  }
  const path = `/processors/${processor}`;
  const opts = {
    method: 'POST',
    body: reqBody,
  };

  return yield call(apiCallWithRetry, { path, opts, hidden: true });
}

export function* requestPreview({ id }) {
  const editor = yield select(selectors.editor, id);

  const reqOpts = processorLogic.requestOptions(editor);

  if (!reqOpts) {
    return; // nothing to do...
  }

  const { violations, skipPreview, processor, body } = reqOpts;

  if (violations) {
    return yield put(actions.editor.validateFailure(id, violations));
  }

  let result;

  if (!skipPreview) {
    try {
      // we are hiding this comm activity from the network snackbar

      result = yield call(invokeProcessor, { editorId: id, processor, body });
    } catch (e) {
      // Error with status code between 400 and 500 are json, hence we can parse them
      if (e.status >= 400 && e.status < 500) {
        const errJSON = safeParse(e.message);

        if (errJSON) {
          // Receiving errors in different formats from BE, for now added below check
          // Can remove this once backend bug gets fixed (Id: IO-17172)
          const errorMessage = [`Message: ${errJSON.message || errJSON.errors?.[0]?.message || JSON.stringify(errJSON)}`];
          let errorLine;

          if (errJSON.location) {
            errorMessage.push(`Location: ${errJSON.location}`);
            try {
              if (/<anonymous>:(\d+)/.test(errJSON.location)) {
                errorLine = parseInt(/<anonymous>:(\d+)/.exec(errJSON.location)[1], 10);
              }
            } catch (e) {
            // do nothing
            }
          }
          if (errJSON.stack) {
            errorMessage.push(`Stack: ${errJSON.stack}`);
          }

          return yield put(actions.editor.previewFailed(id, {errorMessage, errorLine}));
        }
      }
    }
  }

  let finalResult;

  try {
    const processResult = processorLogic.processResult(editor);

    finalResult = processResult ? processResult(editor, result) : result;
  } catch (e) {
    return yield put(actions.editor.previewFailed(id, {errorMessage: e.message}));
  }

  return yield put(actions.editor.previewResponse(id, finalResult));
}

export function* evaluateExternalProcessor({ processorData }) {
  const reqOpts = processorLogic.requestOptions(processorData);

  if (!reqOpts) {
    return; // nothing to do...
  }

  const { violations, processor, body } = reqOpts;

  // console.log('reqOpts', reqOpts);
  if (violations) {
    return { violations };
  }

  try {
    return yield call(invokeProcessor, { processor, body });
  } catch (e) {
    return { error: e };
  }
}

export function* save({ id, context }) {
  const editor = yield select(selectors.editor, id);

  if (!editor) {
    return; // nothing to do
  }

  const patches = processorLogic.getPatchSet(editor);
  const preSaveValidate = processorLogic.preSaveValidate(editor);

  // if preview before saving the editor is on, call the evaluateProcessor
  if (editor.previewOnSave) {
    const evaluateResponse = yield call(requestPreview, { id });

    if (
      evaluateResponse &&
          (evaluateResponse.error || evaluateResponse.violations)
    ) {
      return yield put(actions.editor.saveFailed(id));
    }
  }

  // check for any pre save validations
  if (preSaveValidate) {
    const {saveError, message} = preSaveValidate(editor);

    if (saveError) {
      return yield put(actions.editor.saveFailed(id, message));
    }
  }

  if (!editor.onSave && !patches) {
    return yield put(actions.editor.saveFailed(id));
  }

  if (editor.onSave) {
    editor.onSave(editor);
  }

  /**
         *Editor will not be closed unless 'foregroundPatches' terminates. After success/failure of foreground patches, 'backgroundPatches' run in background.
         backgroundPatches and foregroundPatches are arrays consisting of resource patch and/or actions
        Example:
        foregroundPatches = [{
            patch: [{ op: 'replace', path:${path}, value: ${value} }],
            resourceType: ${resourceType},
            resourceId: ${resourceId},
         },

            patch: [{ op: 'replace', path:${path}, value: ${value} }],
            resourceType: ${resourceType},
            resourceId: ${resourceId},
         }];
         backgroundPatches=[
          {
              patch: [
                {
                  op: 'replace',
                  path: '/content',
                  value: ${code},
                },
              ],
              resourceType: 'scripts',
              resourceId: ${scriptId},
          },
          actions.analytics.gainsight.trackEvent('actionName')
          ];
         */

  const { foregroundPatches, backgroundPatches } = patches || {};

  if (foregroundPatches && Array.isArray(foregroundPatches)) {
    for (let index = 0; index < foregroundPatches.length; index += 1) {
      const { action, patch, resourceType, resourceId } =
            foregroundPatches[index] || {};

      // check if foregroundPatch is an action
      if (action) {
        yield put(foregroundPatches[index].action);
      } else if (!!patch && !!resourceType && !!resourceId) {
        yield put(
          actions.resource.patchStaged(resourceId, patch, SCOPES.VALUE)
        );
        const error = yield call(commitStagedChanges, {
          resourceType,
          id: resourceId,
          scope: SCOPES.VALUE,
          context,
        });

        // trigger save failed in case of error
        if (error) {
          return yield put(actions.editor.saveFailed(id));
        }
      } else {
        // trigger save failed in case any among patch, resourceType and resourceId is missing
        return yield put(actions.editor.saveFailed(id));
      }
    }

    yield put(actions.editor.saveComplete(id));
  } else {
    // trigger save complete in case editor doesnt have any foreground processes
    yield put(actions.editor.saveComplete(id));
  }

  if (backgroundPatches && Array.isArray(backgroundPatches)) {
    for (let index = 0; index < backgroundPatches.length; index += 1) {
      const { action, patch, resourceType, resourceId } =
            backgroundPatches[index] || {};

      // check if backgroundPatch is an action
      if (action) {
        yield put(backgroundPatches[index].action);
      } else if (!!patch && !!resourceType && !!resourceId) {
        yield put(actions.resource.patchStaged(resourceId, patch, 'value'));
        yield put(
          actions.resource.commitStaged(resourceType, resourceId, 'value')
        );
      }
    }
  }
}

export function* autoEvaluateProcessor({ id }) {
  const editor = yield select(selectors.editor, id);
  const editorViolations = yield select(selectors.editorViolations, id);

  if (!editor || (editorViolations && editorViolations.length)) {
    return; // nothing to do...
  }

  if (!editor.autoEvaluate) return;

  // we WANT a minimum delay to prevent immediate re-renders
  // while a user is typing.
  yield delay(500);

  return yield call(requestPreview, { id });
}

export function* autoEvaluateProcessorWithCancel(params) {
  const { id } = params || {};

  yield race({
    editorEval: call(autoEvaluateProcessor, params),
    cancelEditorEval: take(action =>
      action.type === actionTypes.EDITOR.CLEAR &&
      action.id === id
    ),
  });
}

export function* refreshHelperFunctions() {
  const localStorageData = JSON.parse(localStorage.getItem('helperFunctions'));
  let { updateTime, helperFunctions } = localStorageData || {};

  // if update time is not defined its missing in the local storage
  // hence we have to retrieve the helper functions and
  // persist it in the local storage

  if (
    !updateTime ||
          Date.now() - updateTime > +process.env.HELPER_FUNCTIONS_INTERVAL_UPDATE
  ) {
    const allHelperFunctions = yield call(getResource, {
      resourceType: 'processors',
      message: 'Getting Helper functions',
    });

    // if the response is undefined
    // the call must have failed for some collection call failure
    // it could be because of an authentication issue
    // In that case don't update helperfunctions in localStorage
    // and its timestamp
    if (!allHelperFunctions) return;
    // destructuring for handlebars helperFunctions
    const {
      handlebars: { helperFunctions: tmpHelperFunctions },
    } = allHelperFunctions;

    helperFunctions = tmpHelperFunctions;
    updateTime = Date.now();
    localStorage.setItem(
      'helperFunctions',
      JSON.stringify({
        updateTime,
        helperFunctions,
      })
    );
  }

  yield put(actions.editor.updateHelperFunctions(helperFunctions));
}

export function* requestEditorSampleData({
  id,
  requestedTemplateVersion,
}) {
  const editor = yield select(selectors.editor, id);

  if (!editor) return;

  const {editorType, flowId, resourceId, resourceType, fieldId, formKey, stage, ssLinkedConnectionId} = editor;
  // for some fields only v2 data is supported (not v1)
  const editorSupportsOnlyV2Data = yield select(selectors.editorSupportsOnlyV2Data, id);

  const isPageGenerator = yield select(
    selectors.isPageGenerator,
    flowId,
    resourceId,
    resourceType
  );
  const formState = yield select(selectors.formState, formKey);
  const { value: formValues } = formState || {};
  let resource = {};

  if (formValues && !ssLinkedConnectionId) {
    resource = yield call(constructResourceFromFormValues, {
      formValues,
      resourceId,
      resourceType,
    });
  } else {
    resource = yield select(selectors.resource, resourceType, resourceId);
  }
  let sampleData;

  // for my apis, no sample data is shown
  if (resourceType === 'apis') {
    return { data: {}};
  }
  // default sample data is shown for as2 routing rules
  if (stage === 'contentBasedFlowRouter') {
    return {
      data: {
        httpHeaders: {
          'as2-from': 'OpenAS2_appA',
          'as2-to': 'OpenAS2_appB',
        },
        mimeHeaders: {
          'content-type': 'application/edi-x12',
          'content-disposition': 'Attachment; filename=rfc1767.dat',
        },
        rawMessageBody: 'sample message',
      },
    };
  }
  // for csv and xml parsers, simply get the file sample data
  if (editorType === 'csvParser' || editorType === 'xmlParser') {
    const fileType = editorType === 'csvParser' ? 'csv' : 'xml';

    const fileData = yield select(selectors.fileSampleData, { resourceId, resourceType, fileType, ssLinkedConnectionId});

    return { data: fileData};
  }

  // for file definition editors, sample data is read from network call
  // adding this check here, in case network call is delayed
  if (editorType === 'structuredFileGenerator' || editorType === 'structuredFileParser') { return {}; }

  // for exports resource with 'once' type fields, exported preview data is shown and not the flow input data
  const showPreviewStageData = resourceType === 'exports' && (fieldId?.includes('once') || fieldId === 'dataURITemplate' || fieldId === 'traceKeyTemplate');
  // for exports with paging method configured, preview stages data needs to be passed for getContext to get proper editor sample data
  const needPreviewStagesData = resourceType === 'exports' && !!resource?.http?.paging?.method && previewDataDependentFieldIds.includes(fieldId);

  if (showPreviewStageData || needPreviewStagesData) {
    yield call(requestResourceFormSampleData, { formKey });
  }

  if (showPreviewStageData) {
    const parsedData = yield select(
      selectors.getResourceSampleDataWithStatus,
      resourceId,
      'parse'
    );

    sampleData = parsedData?.data;
  } else {
    const flowSampleData = yield select(selectors.getSampleDataContext, {
      flowId,
      resourceId,
      resourceType,
      stage,
    });

    sampleData = flowSampleData?.data;
  }

  if (!sampleData && (!isPageGenerator || FLOW_STAGES.includes(stage) || HOOK_STAGES.includes(stage))) {
    // sample data not present, trigger action to get sample data
    yield call(requestSampleData, {
      flowId,
      resourceId,
      resourceType,
      stage,
    });
    // get sample data from the selector once loaded
    const flowSampleData = yield select(selectors.getSampleDataContext, {
      flowId,
      resourceId,
      resourceType,
      stage,
    });

    sampleData = flowSampleData?.data;
  }
  let _sampleData = null;
  let templateVersion;

  const {shouldGetContextFromBE, sampleData: uiSampleData} = yield select(selectors.shouldGetContextFromBE, id, sampleData);

  // BE doesn't support /getContext for some use cases
  if (!shouldGetContextFromBE) {
    _sampleData = uiSampleData;
  } else {
    const filterPath = (stage === 'inputFilter' && resourceType === 'exports') ? 'inputFilter' : 'filter';
    const defaultData = (isPageGenerator && !stage.includes('Filter')) ? undefined : { myField: 'sample' };
    const body = {
      sampleData: sampleData || defaultData,
      templateVersion: editorSupportsOnlyV2Data ? 2 : requestedTemplateVersion,
    };

    if (!isNewId(flowId)) {
      body.flowId = flowId;
    }
    const flow = yield select(selectors.resource, 'flows', flowId);

    body.integrationId = flow?._integrationId;

    body[resourceType === 'imports' ? 'import' : 'export'] = resource || {};
    body.fieldPath = fieldId || filterPath;

    if (needPreviewStagesData) {
      body.previewData = yield select(selectors.getResourceSampleDataStages, resourceId);
    }

    const opts = {
      method: 'POST',
      body,
    };
    const path = '/processors/handleBar/getContext';

    try {
      const response = yield call(apiCallWithRetry, {
        path,
        opts,
        message: 'Loading',
        hidden: false,
      });

      if (response) {
        _sampleData = response.context;
        templateVersion = response.templateVersion;
      } else {
        // TODO: test this
        yield put(
          actions.editor.sampleDataFailed(
            id
          )
        );
      }
    } catch (e) {
      // TODO: How do we show error in case getContext api fails with some response
      yield put(
        actions.editor.sampleDataFailed(
          id,
          e.message
        )
      );
    }
  }

  // don't wrap with context for below editors
  if (editorType !== 'csvGenerator' &&
  stage !== 'outputFilter' &&
  stage !== 'exportFilter' &&
  stage !== 'inputFilter' &&
  stage !== 'importMappingExtract') {
    const { data } = yield select(selectors.sampleDataWrapper, {
      sampleData: {
        data: _sampleData,
        templateVersion,
        status: 'received',
      },
      flowId,
      resourceId,
      resourceType,
      fieldType: fieldId,
      stage,
    });

    return { data, templateVersion};
  }

  return { data: _sampleData, templateVersion};
}

export function* initSampleData({ id }) {
// re-fetching the editor from state to get latest editor (in case init processorLogic made any changes)
  const editor = yield select(selectors.editor, id);

  if (!editor) return;

  // if data is already passed during init, save it to state directly
  if (editor.data) {
    yield put(
      actions.editor.sampleDataReceived(
        id,
        dataAsString(editor.data),
      )
    );
  } else if (!editor.sampleDataStatus || editor.sampleDataStatus === 'requested') {
  // load sample data only when its not received already
    const {data, templateVersion} = yield call(requestEditorSampleData, {id});

    yield put(
      actions.editor.sampleDataReceived(
        id,
        dataAsString(data),
        templateVersion,
      )
    );
  }

  // get Helper functions when the editor initializes
  yield call(refreshHelperFunctions);

  return yield call(autoEvaluateProcessorWithCancel, { id });
}

export function* initEditor({ id, editorType, options }) {
  const { formKey, integrationId, resourceId, resourceType, flowId, sectionId, fieldId, ssLinkedConnectionId} = options || {};

  let fieldState = {};
  let formState = {};

  if (formKey) {
    fieldState = yield select(selectors.fieldState, formKey, fieldId);
    formState = yield select(selectors.formState, formKey);
  }
  const { value: formValues } = formState;
  let resource = {};

  if (formValues && !ssLinkedConnectionId) {
    resource = yield call(constructResourceFromFormValues, {
      formValues,
      resourceId,
      resourceType,
    });
  } else {
    resource = yield select(selectors.resource, resourceType, resourceId);
  }

  const flow = yield select(selectors.resource, 'flows', flowId);
  const {onSave, ...rest} = options;
  let formattedOptions = deepClone(rest);

  const init = processorLogic.init(editorType);

  if (init) {
    if (editorType === 'handlebars' || editorType === 'sql' || editorType === 'databaseMapping') {
      const { _connectionId: connectionId } = resource || {};
      const connection = yield select(selectors.resource, 'connections', connectionId);
      const isPageGenerator = yield select(selectors.isPageGenerator, flowId, resourceId, resourceType);

      formattedOptions = init({options: formattedOptions, resource, formValues, fieldState, connection, isPageGenerator});
    } else if (editorType === 'settingsForm') {
      let parentResource = {};
      const sectionMeta = yield select(selectors.getSectionMetadata, resourceType, resourceId, sectionId || 'general');
      const { settingsForm, settings} = sectionMeta || {};
      const integrationAllSections = yield select(selectors.getAllSections, 'integrations', integrationId);

      if (resource?._parentId) {
        parentResource = yield select(selectors.resource, resourceType, resource._parentId);
      }
      const isIAResource = !!(resource?._connectorId);
      let license;
      let parentLicense;

      // license is only available for IAs
      if (isIAResource) {
        const licenses = yield select(selectors.licenses);

        license = licenses.find(l => l._integrationId === integrationId);

        if (license?._parentId) {
          parentLicense = licenses.find(l => l._id === license._parentId);
        }
      }

      formattedOptions = init({
        options: formattedOptions,
        settingsForm,
        settings,
        integrationAllSections: integrationAllSections?.allSections,
        resourceDocs: {resource, parentResource, license, parentLicense},
      });
    } else if (editorType === 'structuredFileGenerator' || editorType === 'structuredFileParser') {
      const {userDefinitionId, fileDefinitionResourcePath, value: fieldValue, options: fieldOptions} = fieldState;
      const { format, definitionId } = fieldOptions || {};
      const resourcePath = extractResourcePath(fieldValue, fileDefinitionResourcePath);

      // todo: once all file sampledata selectors are merged we can use the same one
      const fileDefinitionData = yield select(selectors.fileDefinitionSampleData, {
        userDefinitionId,
        resourceType,
        options: { format, definitionId, resourcePath },
      });

      formattedOptions = init({options: formattedOptions, resource, fieldState, fileDefinitionData});
    } else if (editorType === 'javascript') {
      const scriptContext = yield select(selectors.getScriptContext, {flowId, contextType: 'hook'});

      formattedOptions = init({options: formattedOptions, resource, fieldState, flow, scriptContext});
    } else {
      formattedOptions = init({options: formattedOptions, resource, fieldState, flow});
    }
  }

  let originalRule = formattedOptions.rule;

  if (typeof originalRule === 'object' && !Array.isArray(originalRule)) {
    originalRule = {...formattedOptions.rule};
  }
  const stateOptions = {
    editorType,
    ...formattedOptions,
    fieldId: getUniqueFieldId(fieldId, resource),
    ...featuresMap(formattedOptions)[editorType],
    originalRule,
    sampleDataStatus: 'requested',
    onSave,
  };

  yield put(actions.editor.initComplete(
    id,
    stateOptions,
  ));

  return yield call(initSampleData, { id });
}

export function* toggleEditorVersion({ id, version }) {
  const editorData = yield call(requestEditorSampleData, {id, requestedTemplateVersion: version});

  if (!editorData) return;
  const {data, templateVersion} = editorData;

  return yield put(
    actions.editor.sampleDataReceived(
      id,
      dataAsString(data),
      templateVersion,
    )
  );
}

export default [
  takeLatest(
    [actionTypes.EDITOR.PATCH.DATA,
      actionTypes.EDITOR.PATCH.RULE,
      actionTypes.EDITOR.TOGGLE_AUTO_PREVIEW],
    autoEvaluateProcessorWithCancel
  ),
  // added a separate effect for DynaFileKeyColumn as
  // both, csv parser and file key editor can be in use and would require
  // the preview API call parallel
  takeLatest(actionTypes.EDITOR.PATCH.FILE_KEY_COLUMN, autoEvaluateProcessorWithCancel),
  takeEvery(actionTypes.EDITOR.INIT, initEditor),
  takeLatest(actionTypes.EDITOR.TOGGLE_VERSION, toggleEditorVersion),
  takeLatest(actionTypes.EDITOR.PREVIEW.REQUEST, requestPreview),
  takeLatest(actionTypes.EDITOR.SAVE.REQUEST, save),
  takeLatest(actionTypes.EDITOR.REFRESH_HELPER_FUNCTIONS, refreshHelperFunctions),
];
