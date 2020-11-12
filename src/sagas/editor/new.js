import {
  call,
  put,
  select,
  takeLatest,
  delay,
} from 'redux-saga/effects';
import actions from '../../actions';
import actionTypes from '../../actions/types';
import { selectors } from '../../reducers';
import { apiCallWithRetry } from '../index';
import { getResource, commitStagedChanges } from '../resources';
import processorLogic from '../../reducers/session/_editors/processorLogic';
import { SCOPES } from '../resourceForm';
import { requestSampleData } from '../sampleData/flows';
import { requestExportSampleData } from '../sampleData';
import { constructResourceFromFormValues } from '../sampleData/utils/exportSampleDataUtils';

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
  // const reqOpts = processorLogic.requestOptions(editor);
  const reqOpts = yield select(selectors._processorRequestOptions, id);

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
        const errJSON = JSON.parse(e.message);
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
  const patches = yield select(selectors._editorPatchSet, id);
  const editor = yield select(selectors._editor, id);

  if (!editor) {
    return; // nothing to do
  }

  if (!patches) {
    return yield put(actions._editor.saveFailed(id));
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

    // if all foregroundPatches succeed
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

  // editor is configured for autoEvaluate
  // we WANT a minimum delay to prevent immediate re-renders
  // while a user is typing.
  yield delay(500);

  return yield call(requestPreview, { id });
}

export function* requestEditorSampleData({
  id,
  requestedTemplateVersion,
}) {
  const editor = yield select(selectors._editor, id);

  if (!editor) return;

  const {flowId, resourceId, resourceType, fieldId, isEditorV2Supported, formKey, stage} = editor;

  const isPageGenerator = yield select(
    selectors.isPageGenerator,
    flowId,
    resourceId,
    resourceType
  );
  const { value: formValues } = yield select(selectors.formState, formKey) || {};
  const resource = yield call(constructResourceFromFormValues, {
    formValues,
    resourceId,
    resourceType,
  });
  let sampleData;

  if (isPageGenerator && isEditorV2Supported) {
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

  if (!isEditorV2Supported) {
    _sampleData = sampleData ? {
      data: sampleData,
    } : undefined;
  } else {
    const body = {
      sampleData: sampleData || { myField: 'sample' },
      templateVersion: requestedTemplateVersion,
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

  yield put(
    actions._editor.sampleDataReceived(
      id,
      JSON.stringify(data),
      templateVersion,
    )
  );
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

export function* initEditor({ id }) {
  const editor = yield select(selectors._editor, id);

  if (!editor) return;

  // load sample data only when its not received already
  if (!editor.initStatus || editor.initStatus === 'requested') {
    yield call(requestEditorSampleData, {id});
  }

  // get Helper functions when the editor initializes
  yield call(refreshHelperFunctions);

  return yield call(autoEvaluateProcessor, { id });
}

export function* toggleEditorVersion({ id, version }) {
  return yield call(requestEditorSampleData, {id, requestedTemplateVersion: version});
}

export default [
  takeLatest(
    [actionTypes._EDITOR.PATCH,
      actionTypes._EDITOR.TOGGLE_AUTO_PREVIEW],
    autoEvaluateProcessor
  ),
  takeLatest(actionTypes._EDITOR.INIT, initEditor),
  takeLatest(actionTypes._EDITOR.TOGGLE_VERSION, toggleEditorVersion),
  takeLatest(actionTypes._EDITOR.PREVIEW.REQUEST, requestPreview),
  takeLatest(actionTypes._EDITOR.SAVE.REQUEST, save),
];
