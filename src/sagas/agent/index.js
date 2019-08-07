import { call, put, takeEvery, delay } from 'redux-saga/effects';
import actions from '../../actions';
import actionTypes from '../../actions/types';
import { apiCallWithRetry } from '../index';
import getRequestOptions from '../../utils/requestOptions';
import { MASK_AGENT_TOKEN_DELAY } from '../../utils/constants';

export function* displayToken({ id }) {
  const requestOptions = getRequestOptions(actionTypes.AGENT.TOKEN_DISPLAY, {
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

  yield put(actions.agent.tokenReceived({ ...response, _id: id }));
  yield delay(MASK_AGENT_TOKEN_DELAY);
  yield put(actions.agent.maskToken({ _id: id }));
}

export function* changeToken({ id }) {
  const requestOptions = getRequestOptions(actionTypes.AGENT.TOKEN_CHANGE, {
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

  yield put(actions.agent.tokenReceived({ ...response, _id: id }));
  yield delay(MASK_AGENT_TOKEN_DELAY);
  yield put(actions.agent.maskToken({ _id: id }));
}

export function* downloadInstaller({ osType, id }) {
  const requestOptions = getRequestOptions(
    actionTypes.AGENT.DOWNLOAD_INSTALLER,
    {
      osType,
      resourceId: id,
    }
  );
  const { path, opts } = requestOptions;
  let response;

  try {
    response = yield call(apiCallWithRetry, {
      path,
      opts,
      message: 'Download Installer',
    });
    window.open(response.signedURL, 'target=_blank', response.options, false);
  } catch (e) {
    return true;
  }
}

export const agentSagas = [
  takeEvery(actionTypes.AGENT.TOKEN_DISPLAY, displayToken),
  takeEvery(actionTypes.AGENT.TOKEN_CHANGE, changeToken),
  takeEvery(actionTypes.AGENT.DOWNLOAD_INSTALLER, downloadInstaller),
];
