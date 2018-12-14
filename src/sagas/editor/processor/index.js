import { delay } from 'redux-saga';
import { call, put, select, takeEvery, takeLatest } from 'redux-saga/effects';
import actions from '../../../actions';
import actionTypes from '../../../actions/types';
import * as selectors from '../../../reducers';
import { apiCallWithRetry } from '../../index';

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

export const processorSagas = [
  takeEvery(actionTypes.EDITOR_INIT, autoEvaluateProcessor),
  takeLatest(actionTypes.EDITOR_PATCH, autoEvaluateProcessor),
  takeEvery(actionTypes.EDITOR_EVALUATE_REQUEST, evaluateProcessor),
];
