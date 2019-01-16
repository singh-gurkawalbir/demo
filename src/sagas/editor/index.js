import { delay } from 'redux-saga';
import { call, put, select, takeEvery, takeLatest } from 'redux-saga/effects';
import actions from '../../actions';
import actionTypes from '../../actions/types';
import * as selectors from '../../reducers';
import { apiCallWithRetry } from '../index';
import { getResource } from '../resources';

export function* evaluateProcessor({ id }) {
  const reqOpts = yield select(selectors.processorRequestOptions, id);

  if (!reqOpts) {
    return; // nothing to do...
  }

  const { violations, processor, body, resourcePath } = reqOpts;

  if (processor === 'xmlParser') body.rules = { ...body.rules, resourcePath };

  if (violations) {
    return yield put(actions.editor.validateFailure(id, violations));
  }

  // console.log(`editorProcessorOptions for ${id}`, processor, body);
  const path = `/processors/${processor}`;
  const opts = {
    method: 'post',
    body,
  };

  try {
    const results = yield call(apiCallWithRetry, path, opts);

    return yield put(actions.editor.evaluateResponse(id, results));
  } catch (e) {
    return yield put(actions.editor.evaluateFailure(id, e.message));
  }
}

export function* autoEvaluateProcessor({ id }) {
  const editor = yield select(selectors.editor, id);

  if (!editor || (editor.violations && editor.violations.length)) {
    return; // nothing to do...
  }

  if (!editor.autoEvaluate) return;

  if (editor.autoEvaluateDelay) {
    yield call(delay, editor.autoEvaluateDelay);
  }

  return yield call(evaluateProcessor, { id });
}

export function* checkToUpdateHelperFunctions() {
  const localStorageData = JSON.parse(localStorage.getItem('helperFunctions'));
  let { updateTime, helperFunctions } = localStorageData || {};

  // if update time is not defined its missing in the local storage
  // hence we have to retrieve the helper functions and
  // persit it in the local storage
  console.log(`check ${process.env.HELPER_FUNCTIONS_INTERVAL_UPDATE}`);

  if (
    !updateTime ||
    Date.now() - updateTime > +process.env.HELPER_FUNCTIONS_INTERVAL_UPDATE
  ) {
    const allHelperFunctions = yield call(getResource, {
      resourceType: 'processors',
      message: 'Getting Helper functions',
    });
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
    actionTypes.EDITOR_GET_HELPER_FUNCTIONS,
    checkToUpdateHelperFunctions
  ),
  takeEvery(actionTypes.EDITOR_INIT, autoEvaluateProcessor),
  takeLatest(actionTypes.EDITOR_PATCH, autoEvaluateProcessor),
  takeEvery(actionTypes.EDITOR_EVALUATE_REQUEST, evaluateProcessor),
];
