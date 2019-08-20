import { call, put, takeEvery, delay } from 'redux-saga/effects';
import actions from '../../actions';
import actionTypes from '../../actions/types';
import { apiCallWithRetry } from '../index';

export function* displayToken({ id }) {
  const path = `/stacks/${id}/systemToken`;
  let response;

  try {
    response = yield call(apiCallWithRetry, {
      path,
      opts: {
        method: 'GET',
      },
      message: 'Getting Stack Token',
    });
  } catch (e) {
    return true;
  }

  yield put(actions.stack.tokenReceived({ ...response, _id: id }));
  yield delay(process.env.MASK_SENSITIVE_INFO_DELAY);
  yield put(actions.stack.maskToken({ _id: id }));
}

export function* generateToken({ id }) {
  const path = `/stacks/${id}/systemToken`;
  let response;

  try {
    yield call(apiCallWithRetry, {
      path,
      opts: {
        method: 'DELETE',
      },
      message: 'Deleting Stack Token',
    });

    response = yield call(apiCallWithRetry, {
      path,
      opts: {
        method: 'GET',
      },
      message: 'Generating Stack Token',
    });
  } catch (e) {
    return true;
  }

  yield put(actions.stack.tokenReceived({ ...response, _id: id }));
  yield delay(process.env.MASK_SENSITIVE_INFO_DELAY);
  yield put(actions.stack.maskToken({ _id: id }));
}

export const stackSagas = [
  takeEvery(actionTypes.STACK.TOKEN_DISPLAY, displayToken),
  takeEvery(actionTypes.STACK.TOKEN_GENERATE, generateToken),
];
