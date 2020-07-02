import {
  call,
  put,
  select,
  takeEvery,
  takeLatest,
  delay,
} from 'redux-saga/effects';
import actions from '../../actions';
import actionTypes from '../../actions/types';
import * as selectors from '../../reducers';
import { apiCallWithRetry } from '../index';
import { getResource, commitStagedChanges } from '../resources';
import processorLogic from '../../reducers/session/editors/processorLogic';
import { SCOPES } from '../resourceForm';

export function* invokeProcessor({ processor, body }) {
  const path = `/processors/${processor}`;
  const opts = {
    method: 'POST',
    body,
  };

  return yield call(apiCallWithRetry, { path, opts, hidden: true });
}

export function* evaluateProcessor({ id }) {
  const editor = yield select(selectors.editor, id);
  // const reqOpts = processorLogic.requestOptions(editor);
  const reqOpts = yield select(selectors.processorRequestOptions, id);

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

      result = yield call(invokeProcessor, { processor, body });
    } catch (e) {
      // Error with status code between 400 and 500 are json, hence we can parse them
      if (e.status >= 400 && e.status < 500) {
        const errJSON = JSON.parse(e.message);

        return yield put(actions.editor.evaluateFailure(id, errJSON.message));
      }
    }
  }

  let finalResult;

  try {
    const processResult = processorLogic.processResult(editor);

    finalResult = processResult ? processResult(editor, result) : result;
  } catch (e) {
    return yield put(actions.editor.evaluateFailure(id, e.message));
  }

  return yield put(actions.editor.evaluateResponse(id, finalResult));
}

export function* evaluateExternalProcessor({ processorData }) {
  const reqOpts = processorLogic.requestOptions(processorData);

  if (!reqOpts) {
    return; // nothing to do...
  }

  const { violations, processor, body } = reqOpts;

  if (violations) {
    return { violations };
  }

  try {
    return yield call(invokeProcessor, { processor, body });
  } catch (e) {
    return { error: e };
  }
}

export function* saveProcessor({ id, context }) {
  const patches = yield select(selectors.editorPatchSet, id);
  const editor = yield select(selectors.editor, id);

  if (!editor) {
    return; // nothing to do
  }

  if (!patches) {
    return yield put(actions.editor.saveFailed(id));
  }

  // if preview before saving the editor is on, call the evaluateProcessor
  if (editor.previewOnSave) {
    const evaluateResponse = yield call(evaluateProcessor, { id });

    if (
      evaluateResponse &&
      (evaluateResponse.error || evaluateResponse.violations)
    ) {
      return yield put(actions.editor.saveFailed(id));
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
          return yield put(actions.editor.saveFailed(id));
        }
      } else {
        // trigger save failed in case any among patch, resourceType and resourceId is missing
        return yield put(actions.editor.saveFailed(id));
      }
    }

    // if all foregroundPatches succeed
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

  if (editor.autoEvaluateDelay) {
    yield delay(editor.autoEvaluateDelay);
  } else {
    // editor is configured for autoEvaluate, but no delay.
    // we WANT a minimum delay to prevent immediate re-renders
    // while a user is typing.
    yield delay(1000);
  }

  return yield call(evaluateProcessor, { id });
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

export default [
  takeEvery(
    actionTypes.EDITOR_REFRESH_HELPER_FUNCTIONS,
    refreshHelperFunctions
  ),

  takeLatest(
    [actionTypes.EDITOR_INIT, actionTypes.EDITOR_PATCH],
    autoEvaluateProcessor
  ),
  takeLatest(actionTypes.EDITOR_EVALUATE_REQUEST, evaluateProcessor),
  takeLatest(actionTypes.EDITOR_SAVE, saveProcessor),
];
