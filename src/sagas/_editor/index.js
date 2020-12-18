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
import processorLogic, { featuresMap } from '../../reducers/session/_editors/processorLogic';
import { SCOPES } from '../resourceForm';
import { requestSampleData } from '../sampleData/flows';
import { requestExportSampleData } from '../sampleData/exports';
import { constructResourceFromFormValues } from '../utils';
import { safeParse } from '../../utils/string';

export function dataAsString(data) {
  return typeof data === 'string'
    ? data
    : JSON.stringify(data, null, 2);
}

export function* invokeProcessor({ processor, body }) {
  const path = `/processors/${processor}`;
  const opts = {
    method: 'POST',
    body,
  };

  return yield call(apiCallWithRetry, { path, opts, hidden: true });
}

export function* requestPreview({ id }) {
  const editor = yield select(selectors._editor, id);

  const reqOpts = processorLogic.requestOptions(editor);

  if (!reqOpts) {
    return; // nothing to do...
  }

  const { violations, skipPreview, processor, body } = reqOpts;

  if (violations) {
    return yield put(actions._editor.validateFailure(id, violations));
  }

  let result;

  if (!skipPreview) {
    try {
      // we are hiding this comm activity from the network snackbar

      result = yield call(invokeProcessor, { processor, body });
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

          return yield put(actions._editor.previewFailed(id, {errorMessage, errorLine}));
        }
      }
    }
  }

  let finalResult;

  try {
    const processResult = processorLogic.processResult(editor);

    finalResult = processResult ? processResult(editor, result) : result;
  } catch (e) {
    return yield put(actions._editor.previewFailed(id, {errorMessage: e.message}));
  }

  return yield put(actions._editor.previewResponse(id, finalResult));
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
  const editor = yield select(selectors._editor, id);
  const patches = processorLogic.getPatchSet(editor);

  if (!editor) {
    return; // nothing to do
  }

  // if preview before saving the editor is on, call the evaluateProcessor
  if (editor.previewOnSave) {
    const evaluateResponse = yield call(requestPreview, { id });

    if (
      evaluateResponse &&
          (evaluateResponse.error || evaluateResponse.violations)
    ) {
      return yield put(actions._editor.saveFailed(id));
    }
  }

  if (editor.onSave) {
    editor.onSave(editor);

    // we might have use cases in future where onSave and patches , both need to be called
    // in that case we should not return from here and continue to run the patchSet also
    return yield put(actions._editor.saveComplete(id));
  }

  if (!patches) {
    return yield put(actions._editor.saveFailed(id));
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

  let { foregroundPatches } = patches || {};
  const { backgroundPatches } = patches || {};

  // for backward compatibility
  foregroundPatches =
        foregroundPatches && !Array.isArray(foregroundPatches)
          ? [foregroundPatches]
          : foregroundPatches;

  if (foregroundPatches) {
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
          return yield put(actions._editor.saveFailed(id));
        }
      } else {
        // trigger save failed in case any among patch, resourceType and resourceId is missing
        return yield put(actions._editor.saveFailed(id));
      }
    }

    yield put(actions._editor.saveComplete(id));
  } else {
    // trigger save complete in case editor doesnt have any foreground processes
    yield put(actions._editor.saveComplete(id));
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
  const editor = yield select(selectors._editor, id);
  const editorViolations = yield select(selectors._editorViolations, id);

  if (!editor || (editorViolations && editorViolations.length)) {
    return; // nothing to do...
  }

  if (!editor.autoEvaluate) return;

  // we WANT a minimum delay to prevent immediate re-renders
  // while a user is typing.
  yield delay(500);

  return yield call(requestPreview, { id });
}

// todo ashu , check this, we may not need this with afe refactor changes
function* autoEvaluateProcessorWithCancel(params) {
  const { id } = params;

  yield race({
    editorEval: call(autoEvaluateProcessor, params),
    cancelEditorEval: take(action =>
      action.type === actionTypes._EDITOR.CLEAR &&
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

  yield put(actions._editor.updateHelperFunctions(helperFunctions));
}

export function* requestEditorSampleData({
  id,
  requestedTemplateVersion,
}) {
  const editor = yield select(selectors._editor, id);

  if (!editor) return;

  const {editorType, flowId, resourceId, resourceType, fieldId, editorSupportsV1V2data, formKey, stage} = editor;
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
  const resource = yield call(constructResourceFromFormValues, {
    formValues,
    resourceId,
    resourceType,
  });
  let sampleData;

  // no /getContext call for FB actions yet
  if (stage === 'outputFilter' || stage === 'transform') {
    yield call(requestSampleData, {
      flowId,
      resourceId,
      resourceType,
      stage,
    });
    const { data } = yield select(selectors.sampleDataWrapper, {
      flowId,
      resourceId,
      resourceType,
      stage,
    });

    return {data};
  }

  // for csv and xml parsers, simply get the file sample data
  if (editorType === 'csvParser' || editorType === 'xmlParser') {
    const fileType = editorType === 'csvParser' ? 'csv' : 'xml';

    const fileData = yield select(selectors.fileSampleData, { resourceId, resourceType, fileType});

    return { data: fileData};
  }

  if (isPageGenerator && editorSupportsV1V2data) {
    yield call(requestExportSampleData, { resourceId, resourceType, values: formValues });
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

  if (!sampleData && !isPageGenerator) {
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

  // dont make /getContext call when v2 data is not supported
  if (!editorSupportsV1V2data && !editorSupportsOnlyV2Data) {
    _sampleData = sampleData ? {
      data: sampleData,
    } : undefined;
  } else {
    const body = {
      sampleData: sampleData || { myField: 'sample' },
      templateVersion: editorSupportsOnlyV2Data ? 2 : requestedTemplateVersion,
    };

    body[resourceType === 'imports' ? 'import' : 'export'] = resource;
    body.fieldPath = fieldId;

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
          actions._editor.sampleDataFailed(
            id
          )
        );
      }
    } catch (e) {
      // TODO: How do we show error in case getContext api fails with some response
      yield put(
        actions._editor.sampleDataFailed(
          id,
          e.message
        )
      );
    }
  }

  // dont wrap with context for csv generator
  if (editorType !== 'csvGenerator') {
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
  const editor = yield select(selectors._editor, id);

  // if data is already passed during init, save it to state directly
  if (editor.data) {
    yield put(
      actions._editor.sampleDataReceived(
        id,
        dataAsString(editor.data),
      )
    );
  } else if (!editor.sampleDataStatus || editor.sampleDataStatus === 'requested') {
  // load sample data only when its not received already
    const {data, templateVersion} = yield call(requestEditorSampleData, {id});

    yield put(
      actions._editor.sampleDataReceived(
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

export function* initEditor({ id, editorType, options = {} }) {
  let fieldState;

  if (options.formKey) {
    fieldState = yield select(selectors.fieldState, options.formKey, options.fieldId);
  }
  const resource = yield select(selectors.resource, options.resourceType, options.resourceId);

  let editorRule = options.rule;
  const ruleLogic = processorLogic.getRule(editorType);

  if (editorRule === undefined && ruleLogic) {
    editorRule = ruleLogic({resource, options, fieldState});
  }
  const {onSave, ...rest} = options;
  let formattedOptions = deepClone(rest);

  formattedOptions.rule = editorRule;
  const init = processorLogic.init(editorType);

  if (init) {
    // for now we need all below props for handlebars init only
    if (editorType === 'handlebars' || editorType === 'sql') {
      const { formKey, resourceId, resourceType, flowId} = options;
      const formState = yield select(selectors.formState, formKey);
      const { value: formValues } = formState || {};
      const resource = yield call(constructResourceFromFormValues, {
        formValues,
        resourceId,
        resourceType,
      });
      const { _connectionId: connectionId } = resource;
      const connection = yield select(selectors.resource, 'connections', connectionId);
      const isPageGenerator = yield select(selectors.isPageGenerator, flowId, resourceId, resourceType);

      formattedOptions = init({id, options: formattedOptions, resource, formValues, fieldState, connection, isPageGenerator});
    } else {
      formattedOptions = init(formattedOptions);
    }
  }

  let originalRule = editorRule;

  if (typeof originalRule === 'object') {
    originalRule = {...editorRule};
  }
  const stateOptions = {
    editorType,
    ...formattedOptions,
    ...featuresMap(options)[editorType],
    originalRule,
    lastChange: Date.now(),
    sampleDataStatus: 'requested',
    onSave,
  };

  yield put(actions._editor.initComplete(
    id,
    stateOptions,
  ));

  return yield call(initSampleData, { id });
}

export function* toggleEditorVersion({ id, version }) {
  const {data, templateVersion} = yield call(requestEditorSampleData, {id, requestedTemplateVersion: version});

  return yield put(
    actions._editor.sampleDataReceived(
      id,
      dataAsString(data),
      templateVersion,
    )
  );
}

export default [
  takeLatest(
    [actionTypes._EDITOR.PATCH.DATA,
      actionTypes._EDITOR.PATCH.RULE,
      actionTypes._EDITOR.TOGGLE_AUTO_PREVIEW],
    autoEvaluateProcessorWithCancel
  ),
  takeEvery(actionTypes._EDITOR.INIT, initEditor),
  takeLatest(actionTypes._EDITOR.TOGGLE_VERSION, toggleEditorVersion),
  takeLatest(actionTypes._EDITOR.PREVIEW.REQUEST, requestPreview),
  takeLatest(actionTypes._EDITOR.SAVE.REQUEST, save),
];

