import { call, put, takeEvery, delay } from 'redux-saga/effects';
import actions from '../../actions';
import actionTypes from '../../actions/types';
import { apiCallWithRetry } from '../index';
import getRequestOptions from '../../utils/requestOptions';
import { MASK_AGENT_TOKEN_DELAY } from '../../utils/constants';

export function* displayToken({ id }) {
  const requestOptions = getRequestOptions(actionTypes.AGENT_TOKEN_DISPLAY, {
    resourceId: id,
  });
  const { path, opts } = requestOptions;
  let response;

  try {
    response = yield call(apiCallWithRetry, {
      path,
      opts,
      message: 'Getting Agent Token',
    });
  } catch (e) {
    return true;
  }

  yield put(actions.agentToken.tokenReceived({ ...response, _id: id }));
  yield delay(MASK_AGENT_TOKEN_DELAY);
  yield put(actions.agentToken.maskToken({ _id: id }));
}

export function* changeToken({ id }) {
  const requestOptions = getRequestOptions(actionTypes.AGENT_TOKEN_CHANGE, {
    resourceId: id,
  });
  const { path, opts } = requestOptions;
  let response;

  try {
    response = yield call(apiCallWithRetry, {
      path,
      opts,
      message: 'Changing Agent Token',
    });
  } catch (e) {
    return true;
  }

  yield put(actions.agentToken.tokenReceived({ ...response, _id: id }));
  yield delay(MASK_AGENT_TOKEN_DELAY);
  yield put(actions.agentToken.maskToken({ _id: id }));
}

export const agentTokenSagas = [
  takeEvery(actionTypes.AGENT_TOKEN_DISPLAY, displayToken),
  takeEvery(actionTypes.AGENT_TOKEN_CHANGE, changeToken),
];
