/* eslint-disable camelcase */
import { call, takeEvery, put, select } from 'redux-saga/effects';
import actionTypes from '../../../actions/types';
import actions from '../../../actions';
// import { requestReferences } from '../../resources';
import { apiCallWithRetry } from '../..';
import { selectors } from '../../../reducers';
import openExternalUrl from '../../../utils/window';
// import { selectors } from '../../../reducers';

export function* requestConnectionDebugLogs({ connectionId }) {
  let response;
  const path = `/connections/${connectionId}/debug`;

  try {
    response = yield call(apiCallWithRetry, { path });
    yield put(
      actions.logs.connection.received(
        connectionId,
        response || 'There are no logs available for this connection. Please run your flow so that we can record the outgoing and incoming traffic to this connection.',
      )
    );
  } catch (error) {
    actions.logs.connection.requestFailed(connectionId);
  }
}
export function* deleteConnectionDebugLogs({ connectionId}) {
  const path = `/connections/${connectionId}/debug`;

  try {
    yield call(apiCallWithRetry, { path, opts: { method: 'DELETE'}});
  } catch (e) {
    // do nothing
  }
}

export function* downloadConnectionDebugLogs({ connectionId}) {
  const url = `/connections/${connectionId}/debug`;
  const additionalHeaders = yield select(selectors.accountShareHeader, url);
  let _url = `/api${url}`;

  if (additionalHeaders && additionalHeaders['integrator-ashareid']) {
    _url += `?integrator-ashareid=${
      additionalHeaders['integrator-ashareid']
    }`;
  }
  openExternalUrl({ url: _url });
}
export const connectionsLogSagas = [
  takeEvery(actionTypes.LOGS.CONNECTION.REQUEST, requestConnectionDebugLogs),
  takeEvery(actionTypes.LOGS.CONNECTION.REFRESH, requestConnectionDebugLogs),
  takeEvery(actionTypes.LOGS.CONNECTION.DELETE, deleteConnectionDebugLogs),
  takeEvery(actionTypes.LOGS.CONNECTION.DOWNLOAD, downloadConnectionDebugLogs),
];
