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
import { getResource } from '../resources';
import processorLogic from '../../reducers/session/editors/processorLogic';

export function* invokeProcessor({ processor, body }) {
  const path = `/processors/${processor}`;
  const opts = {
    method: 'POST',
    body,
  };

  return yield call(apiCallWithRetry, { path, opts, hidden: true });
}

export function* evaluateProcessor({ id }) {
  const reqOpts = yield select(selectors.processorRequestOptions, id);

  if (!reqOpts) {
    return; // nothing to do...
  }

  const { violations, processor, body } = reqOpts;

  if (violations) {
    return yield put(actions.editor.validateFailure(id, violations));
  }

  // console.log(`editorProcessorOptions for ${id}`, processor, body);

  try {
    // we are hiding this comm activity from the network snackbar

    const results = yield call(invokeProcessor, { processor, body });

    return yield put(actions.editor.evaluateResponse(id, results));
  } catch (e) {
    // Error with status code between 400 and 500 are json, hence we can parse them
    if (e.status >= 400 && e.status < 500) {
      const errJSON = JSON.parse(e.message);

      return yield put(actions.editor.evaluateFailure(id, errJSON.message));
    }
  }
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
];
