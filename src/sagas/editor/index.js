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
import { requestSampleData } from '../sampleData/flows';
import { requestResourceFormSampleData } from '../sampleData/resourceForm';
import { constructResourceFromFormValues } from '../utils';
import { safeParse } from '../../utils/string';
import { isValidDisplayAfterRef, isDisplayRefSupportedType, getDisplayRef } from '../../utils/httpConnector';
import { getUniqueFieldId, dataAsString, previewDataDependentFieldIds } from '../../utils/editor';
import { isNewId, isOldRestAdaptor } from '../../utils/resource';
import { restToHttpPagingMethodMap } from '../../utils/http';
import { fetchMetadataFieldList } from '../../utils/form/metadata';
import mappingUtil, { buildV2MappingsFromTree, hasV2MappingsInTreeData, findAllParentExtractsForNode } from '../../utils/mapping';
import responseMappingUtil from '../../utils/responseMapping';
import { RESOURCE_TYPE_PLURAL_TO_SINGULAR, STANDALONE_INTEGRATION, emptyObject } from '../../constants';
import { getLastExportDateTime } from '../flows';
import errorMessageStore from '../../utils/errorStore';

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
  const editor = yield select(selectors.editor, editorId);
  const {formKey, fieldId, resourceId, resourceType, supportsDefaultData, data, flowId, editorType} = editor;

  // options should be passed to BE for handlebars processor
  // for correct HTML/URL encoding
  if (processor === 'handlebars' && editorId) {
    const timezone = yield select(selectors.userTimezone);
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
        [RESOURCE_TYPE_PLURAL_TO_SINGULAR[resourceType]]: resource,
        // TODO: Siddharth, revert this change after completion of https://celigo.atlassian.net/browse/IO-25372
        fieldPath: fieldId === 'webhook.successBody' ? 'dataURITemplate' : fieldId,
        timezone,
      },
    };
    // for sql editors, modelMetadata needs to be passed inside options
    if (supportsDefaultData) {
      reqBody.options.modelMetadata = safeParse(editor.defaultData) || {};
    }
  } else if (processor === 'mapperProcessor') {
    const flowSampleData = safeParse(data);
    const importResource = yield select(selectors.resource, 'imports', resourceId);
    const options = {};
    let _mappings;

    if (editor.mappingPreviewType) {
      // wait for previewMappings saga to complete the api call if its status is requested
      const previewStatus = (yield select(selectors.mapping))?.preview?.status;

      if (previewStatus === 'requested') {
        yield take([
          actionTypes.MAPPING.PREVIEW_RECEIVED,
          actionTypes.MAPPING.PREVIEW_FAILED,
        ]);
      }

      // for salesforce and netsuite we return the previewMappings updated state
      return (yield select(selectors.mapping))?.preview;
    }
    if (editorType === 'mappings') {
      const lookups = (yield select(selectors.mapping))?.lookups;
      const v2TreeData = (yield select(selectors.mapping))?.v2TreeData;

      // give preference to v2 mappings always
      if (hasV2MappingsInTreeData(v2TreeData, lookups)) {
        const connection = yield select(selectors.resource, 'connections', importResource?._connectionId);
        const flow = yield select(selectors.resource, 'flows', flowId);
        const _mappingsV2 = buildV2MappingsFromTree({v2TreeData, lookups});

        _mappings = {mappings: _mappingsV2, lookups};
        options.connection = connection;
        options._flowId = flowId;
        options._integrationId = flow?._integrationId;
        options.import = importResource;
      } else {
        const mappings = (yield select(selectors.mapping))?.mappings;
        const exportResource = yield select(selectors.firstFlowPageGenerator, flowId);

        _mappings = mappingUtil.generateFieldsAndListMappingForApp({
          mappings,
          isGroupedSampleData: Array.isArray(flowSampleData),
          isPreviewSuccess: !!flowSampleData,
          importResource,
          exportResource,
        });
        _mappings = {..._mappings, lookups};
      }
    } else if (editorType === 'responseMappings') {
      const mappings = (yield select(selectors.responseMapping))?.mappings;

      _mappings = responseMappingUtil.generateMappingFieldsAndList(mappings);
    }

    reqBody = {
      rules: {
        rules: [_mappings],
      },
      data: data ? [flowSampleData] : [],
      options,
    };
  }

  const path = `/processors/${processor}`;
  const opts = {
    method: 'POST',
    body: reqBody,
  };

  return yield call(apiCallWithRetry, { path, opts, hidden: true });
}

export function* validateCustomSettings({ id, result }) {
  const editor = yield select(selectors.editor, id);
  const { resourceType, resourceId } = editor;
  const formKey = `${resourceType}-${resourceId}`;
  // fetch form fields list of fields
  const formContext = yield select(selectors.formState, formKey);
  const csMetadata = result?.data || {};
  const { fieldMap } = csMetadata;
  const fields = fetchMetadataFieldList(csMetadata);
  const displayAfterFieldIds = fields.filter(fieldId => !!fieldMap[fieldId]?.displayAfter);
  const invalidFieldId = displayAfterFieldIds.find(fieldId => {
    const displayAfterRef = getDisplayRef(fieldMap[fieldId], resourceType);

    if (!displayAfterRef) return true;

    // if ref is settings  ref, pass settings metadata and validate against settings fields
    if (displayAfterRef.startsWith('settings.')) {
      const index = displayAfterRef.indexOf('.');
      const settingsRef = displayAfterRef.substr(index + 1);

      if (!isValidDisplayAfterRef(settingsRef, csMetadata)) {
        return true;
      }
    } else if (!isValidDisplayAfterRef(displayAfterRef, formContext.fieldMeta)) {
      // else, validate against resourceForm's metadata fields

      return true;
    }

    return false;
  });

  if (invalidFieldId) {
    const invalidFieldPath = fieldMap[invalidFieldId].displayAfter;

    return errorMessageStore('INVALID_DISPLAY_REF_CUSTOM_SETTINGS', { invalidFieldPath });
  }
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

  // since mappings are stored in separate state
  // we validate the same here
  if (editor.editorType === 'mappings') {
    const {mappings, lookups, v2TreeData, isGroupedSampleData} = yield select(selectors.mapping);
    const {errMessage} = mappingUtil.validateMappings(mappings, lookups, v2TreeData, isGroupedSampleData);

    if (errMessage) {
      const violations = {
        ruleError: errMessage,
      };

      return yield put(actions.editor.validateFailure(id, violations));
    }
    if (editor.mappingPreviewType) {
      yield put(actions.mapping.requestPreview(id));
    }
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

          return yield put(actions.editor.previewFailed(id, {errorMessage, errorLine, errSourceProcessor: editor.activeProcessor}));
        }
      }
    }
  }

  let finalResult;

  try {
    const processResult = processorLogic.processResult(editor);

    finalResult = processResult ? processResult(editor, result) : result;
  } catch (e) {
    return yield put(actions.editor.previewFailed(id, {errorMessage: e.message, errSourceProcessor: editor.activeProcessor}));
  }

  if (editor.editorType === 'settingsForm') {
    const isHttpConnector = yield select(selectors.isHttpConnector, editor?.resourceId, editor?.resourceType);

    if (isHttpConnector) {
      // validation of custom settings happen only for http connector 2.0 in simple view
      const errorMessage = yield call(validateCustomSettings, { id, result: finalResult });

      if (errorMessage) {
      // Incase of invalid displayAfter ref, we throw error for http connector simple view
        return yield put(actions.editor.previewFailed(id, { errorMessage }));
      }
    }
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

  const { foregroundPatches, backgroundPatches, options } = patches || {};

  if (foregroundPatches && Array.isArray(foregroundPatches)) {
    for (let index = 0; index < foregroundPatches.length; index += 1) {
      const { action, patch, resourceType, resourceId } =
            foregroundPatches[index] || {};

      // check if foregroundPatch is an action
      if (action) {
        yield put(foregroundPatches[index].action);
      } else if (!!patch && !!resourceType && !!resourceId) {
        yield put(
          actions.resource.patchStaged(resourceId, patch)
        );
        const error = yield call(commitStagedChanges, {
          resourceType,
          id: resourceId,
          context,
          options,
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
        yield put(actions.resource.patchAndCommitStaged(resourceType, resourceId, patch));
      }
    }
  }
}

export function* autoEvaluateProcessor({ id }) {
  const editor = yield select(selectors.editor, id);
  const {dataError, ruleError} = (yield select(selectors.editorViolations, id)) || {};

  if (!editor || dataError || ruleError) {
    return; // nothing to do...
  }

  if (!editor.autoEvaluate) return;

  // we WANT a minimum delay to prevent immediate re-renders
  // while a user is typing.
  yield delay(500);

  return yield put(actions.editor.previewRequest(id));
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

export function* getFlowSampleData({ flowId, resourceId, resourceType, stage, formKey, routerId, editorId }) {
  let flowSampleData = yield select(selectors.getSampleDataContext, {
    flowId,
    resourceId,
    resourceType,
    stage,
  });

  if (flowSampleData.status !== 'received') {
    yield call(requestSampleData, {
      flowId,
      routerId,
      resourceId,
      resourceType,
      stage,
      editorId,
      formKey,
    });
  }
  flowSampleData = yield select(selectors.getSampleDataContext, {
    flowId,
    resourceId,
    resourceType,
    stage,
  });

  return flowSampleData?.data;
}

export function* requestEditorSampleData({
  id,
  requestedTemplateVersion,
}) {
  const editor = yield select(selectors.editor, id);

  if (!editor) return;

  const {
    editorType,
    flowId,
    resourceId,
    resourceType,
    fieldId,
    formKey,
    stage,
    ssLinkedConnectionId,
    parentType,
    parentId,
    mapper2RowKey,
    router,
    integrationId,
  } = editor;
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

  const connection = yield select(selectors.resource, 'connections', resource?._connectionId);
  const isOldRestResource = isOldRestAdaptor(resource, connection);
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

  // for file definition editors, sample data is read from network call if stage (postMapOutput) is not defined
  // adding this check here, in case network call is delayed
  if ((editorType === 'structuredFileGenerator' || editorType === 'structuredFileParser') && !stage) { return {}; }

  // for exports resource with 'once' type fields, exported preview data is shown and not the flow input data
  const showPreviewStageData = resourceType === 'exports' && fieldId?.includes('once');
  // for exports with paging method configured, preview stages data needs to be passed for getContext to get proper editor sample data
  const isPagingMethodConfigured = !!(isOldRestResource ? resource?.rest?.pagingMethod : resource?.http?.paging?.method);
  const needPreviewStagesData = resourceType === 'exports' && isPagingMethodConfigured && previewDataDependentFieldIds.includes(fieldId);
  const isExportAdvancedField = resourceType === 'exports' && ['dataURITemplate', 'traceKeyTemplate', 'webhook.successBody'].includes(fieldId);
  const isStandaloneExportAdvancedField = !flowId && isExportAdvancedField;

  if (showPreviewStageData || needPreviewStagesData || isStandaloneExportAdvancedField) {
    // Incase of advanced fields , we need preSavePage hook's output
    yield call(requestResourceFormSampleData, { formKey, options: { executeProcessors: isStandaloneExportAdvancedField } });
  }

  if (showPreviewStageData) {
    const parsedData = yield select(
      selectors.getResourceSampleDataWithStatus,
      resourceId,
      'parse'
    );

    sampleData = parsedData?.data;
  } else if (formKey) {
    if (isStandaloneExportAdvancedField) {
      // Handles Standalone export's advanced field ID related sample data
      const parsedData = yield select(
        selectors.getResourceSampleDataWithStatus,
        resourceId,
        'preSavePageHook'
      );

      sampleData = parsedData?.data;
    } else if (stage && (isExportAdvancedField || (flowId && !isPageGenerator))) {
      // Handles all PPs and PG with advanced field ID  ( dataURI and traceKey and webhook.successBody )
      sampleData = yield call(getFlowSampleData, { flowId, resourceId, resourceType, stage, formKey });
    }
  } else if (stage) {
    // Handles sample data for all editors outside form context ( FB actions )
    sampleData = yield call(getFlowSampleData, { flowId, routerId: router?.id, resourceId, resourceType, stage, editorId: id });
  }

  let _sampleData = null;
  let templateVersion;

  const {shouldGetContextFromBE, sampleData: uiSampleData, isMapperField} = yield select(selectors.shouldGetContextFromBE, id, sampleData);

  // BE doesn't support /getContext for some use cases
  if (!shouldGetContextFromBE) {
    _sampleData = uiSampleData;
  } else {
    const filterPath = (editorType === 'inputFilter' && resourceType === 'exports') ? 'inputFilter' : 'filter';
    const defaultData = (isPageGenerator && !editorType.includes('Filter')) ? undefined : { myField: 'sample' };
    const body = {
      sampleData: sampleData || defaultData,
      templateVersion: editorSupportsOnlyV2Data ? 2 : requestedTemplateVersion,
    };

    if (!isNewId(flowId)) {
      body.flowId = flowId;
    }
    const flow = yield select(selectors.resource, 'flows', flowId);

    body.integrationId = flow?._integrationId || (integrationId !== STANDALONE_INTEGRATION.id ? integrationId : undefined);

    body.fieldPath = fieldId || filterPath;

    if (isMapperField) {
      body.uiContext = 'mapper2_0';
      // for v2 mappings, BE needs parent extracts to be passed
      // for correctly returning the iterating array context
      if (mapper2RowKey) {
        const {v2TreeData, isGroupedOutput} = yield select(selectors.mapping);
        const arrayExtracts = findAllParentExtractsForNode(v2TreeData, [], mapper2RowKey);

        body.mapper2_0 = {
          outputFormat: isGroupedOutput ? 'ROWS' : 'RECORD',
        };

        if (arrayExtracts.length) {
          body.mapper2_0.arrayExtracts = arrayExtracts;
        }
      }
    }

    if (needPreviewStagesData) {
      body.previewData = yield select(selectors.getResourceSampleDataStages, resourceId);
    }

    if (resourceType === 'connections') {
      const _userId = yield select(selectors.ownerUserId);

      body.type = 'connection';
      // _userId is required in BE to get integration settings
      body.connection = {
        _userId,
        ...(resource || {}),
      };

      if (parentType) {
        body[parentType === 'exports' ? 'exportId' : 'importId'] = parentId;
      }

      delete body.sampleData;
      delete body.templateVersion;
    } else if (resourceType === 'iClients') {
      body.type = 'iclient';
      body.iClient = resource || {};

      if (!isNewId(editor.connectionId)) {
        body.connectionId = editor.connectionId;
      }

      if (parentType) {
        body[parentType === 'exports' ? 'exportId' : 'importId'] = parentId;
      }

      delete body.sampleData;
      delete body.templateVersion;
    } else if (resourceType !== 'flows') {
      // As UI does oneToMany processing and we do not need BE changes w.r.to oneToMany, we make oneToMany prop as false  for getContext API
      resource = { ...resource, oneToMany: false };
      if (isOldRestResource && resource?.rest?.pagingMethod && !resource?.http?.paging?.method) {
        // create http sub doc with paging method as /getContext expects it
        // map rest paging method to http paging method
        resource.http = {
          paging: {
            method: restToHttpPagingMethodMap[resource.rest.pagingMethod],
          },
        };
      }
      body[RESOURCE_TYPE_PLURAL_TO_SINGULAR[resourceType]] = resource || {};
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
  const EDITORS_WITHOUT_CONTEXT_WRAP = ['structuredFileGenerator', 'csvGenerator', 'outputFilter', 'exportFilter', 'inputFilter', 'netsuiteLookupFilter', 'salesforceLookupFilter'];

  if (!EDITORS_WITHOUT_CONTEXT_WRAP.includes(editorType)) {
    if (flowId && !isNewId(flowId)) {
      const { status } = yield select(selectors.getLastExportDateTime, flowId) || emptyObject;

      if (!status) {
        yield call(getLastExportDateTime, { flowId });
      }
    }
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
      editorType,
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
  const connection = yield select(selectors.resource, 'connections', resource?._connectionId);
  const {onSave, ...rest} = options;
  let formattedOptions = deepClone(rest);

  const init = processorLogic.init(editorType);

  if (init) {
    if (editorType === 'handlebars' || editorType === 'sql' || editorType === 'databaseMapping') {
      const { _connectionId: connectionId } = resource || {};
      const connection = yield select(selectors.resource, 'connections', connectionId);
      const isPageGenerator = yield select(selectors.isPageGenerator, flowId, resourceId, resourceType);

      formattedOptions = init({
        options: formattedOptions,
        resource,
        formValues,
        fieldState,
        connection: resourceType === 'connections' ? resource : connection,
        isPageGenerator,
        isStandaloneResource: !flowId,
      });
    } else if (editorType === 'settingsForm') {
      let parentResource = {};
      let sectionMeta = yield select(selectors.getSectionMetadata, resourceType, resourceId, sectionId || 'general');

      if (isDisplayRefSupportedType(resourceType)) {
        // TODO : need to include in the existing above selector
        sectionMeta = (yield select(selectors.resourceData, resourceType, resourceId))?.merged;
      }
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
    } else {
      const scriptContext = yield select(selectors.getScriptContext, {flowId, contextType: 'hook', resourceType, resourceId });

      formattedOptions = init({options: formattedOptions, resource, fieldState, flow, scriptContext});
    }
  }

  let originalRule = formattedOptions.originalRule || formattedOptions.rule;

  if (typeof originalRule === 'object' && !Array.isArray(originalRule)) {
    originalRule = {...(formattedOptions.originalRule || formattedOptions.rule)};
  }
  const stateOptions = {
    editorType,
    ...formattedOptions,
    fieldId: getUniqueFieldId(fieldId, resource, connection, resourceType),
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

export function* requestChatCompletion({ id, prompt }) {
  let response;
  const editor = yield select(selectors.editor, id);
  const { data, rule: rawRule, chat } = editor;
  const { formKey, rulePath } = chat;

  let rule = rulePath ? rawRule[rulePath] : rawRule;

  if (typeof rule === 'object') {
    rule = JSON.stringify(rule, null, 2);
  }

  const chatFormValues = yield select(selectors.formValueTrimmed, formKey);
  // this is part of the openAI api spec
  // eslint-disable-next-line camelcase
  const { messages, temperature, top_p, max_tokens } = chatFormValues;
  const body = {
    model: 'gpt-3.5-turbo',
    max_tokens: parseInt(max_tokens, 10) || 512,
    temperature: parseFloat(temperature) || 0,
    top_p: parseFloat(top_p) || 1,
    messages: JSON.parse(messages),
  };

  body.messages.push({
    role: 'user',
    content: `The current rule is:\n ${JSON.stringify(rule)}\n
 The data to apply the rule to is:\n ${data}\n
 ${prompt}`,
  });

  try {
    response = yield call(apiCallWithRetry, {
      path: '/openai/chat/completions',
      opts: {
        method: 'POST',
        body,
      },
    });
  } catch (error) {
    return yield put(actions.editor.chat.failed(id, [error.message]));
  }
  // we have a successful response, but we do not know if the response itself
  // holds a valid result.
  const newRule = response.choices[0].message.content;

  const {isValid, validationErrors, parsedResponse} = processorLogic.validateChatResponse(editor, newRule);

  if (!isValid) {
    return yield put(actions.editor.chat.failed(id, validationErrors));
  }

  const value = rulePath ? {[rulePath]: parsedResponse} : parsedResponse;

  yield put(actions.editor.patchRule(id, value));
  yield put(actions.editor.chat.complete(id));
}

export default [
  takeLatest(
    [
      actionTypes.EDITOR.PATCH.DATA,
      actionTypes.EDITOR.PATCH.RULE,
      actionTypes.EDITOR.TOGGLE_AUTO_PREVIEW,
      actionTypes.EDITOR.PATCH.FEATURES,
    ],
    autoEvaluateProcessorWithCancel
  ),
  // added a separate effect for DynaFileKeyColumn as
  // both, csv parser and file key editor can be in use and would require
  // the preview API call parallel
  takeLatest(
    actionTypes.EDITOR.PATCH.FILE_KEY_COLUMN,
    autoEvaluateProcessorWithCancel
  ),
  takeEvery(actionTypes.EDITOR.INIT, initEditor),
  takeLatest(actionTypes.EDITOR.TOGGLE_VERSION, toggleEditorVersion),
  takeLatest(actionTypes.EDITOR.PREVIEW.REQUEST, requestPreview),
  takeLatest(actionTypes.EDITOR.SAVE.REQUEST, save),
  takeLatest(
    actionTypes.EDITOR.REFRESH_HELPER_FUNCTIONS,
    refreshHelperFunctions
  ),
  takeLatest(actionTypes.EDITOR.CHAT.REQUEST, requestChatCompletion),
];
