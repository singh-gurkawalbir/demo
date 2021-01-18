/* eslint-disable camelcase */
import { call, takeEvery, put, select, delay, fork, take, cancel, takeLatest} from 'redux-saga/effects';
import moment from 'moment';
import actionTypes from '../../../actions/types';
import actions from '../../../actions';
// import { requestReferences } from '../../resources';
import { apiCallWithRetry } from '../..';
import { selectors } from '../../../reducers';
import openExternalUrl from '../../../utils/window';
import { convertUtcToTimezone } from '../../../utils/date';
// import { selectors } from '../../../reducers';
const UTCDateTimeRegex = '^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}.[0-9]{3}Z';

export function* getConnectionDebugLogs({ connectionId }) {
  const path = `/connections/${connectionId}/debug`;

  try {
    const logs = yield call(apiCallWithRetry, { path });
    const {dateFormat, timeFormat, timezone } = yield select(selectors.userProfilePreferencesProps);
    const _logs = [];

    logs.split('\n').forEach(log => {
      let logTmp = log;
      const matchedUTCDateTime = logTmp.match(UTCDateTimeRegex)?.[0];

      if (matchedUTCDateTime) {
        const localDateTime = convertUtcToTimezone(matchedUTCDateTime, dateFormat, timeFormat, timezone);

        logTmp = logTmp.replace(matchedUTCDateTime, localDateTime);
      }
      _logs.push(logTmp || '');
    });
    yield put(
      actions.logs.connections.received(
        connectionId,
        _logs.join('\n'),
      )
    );
  } catch (error) {
    actions.logs.connections.requestFailed(connectionId);
  }
}

export function* pollForConnectionLogs({ connectionId }) {
  while (true) {
    yield call(getConnectionDebugLogs, { connectionId });
    yield delay(5 * 1000);
  }
}
export function* startPollingForConnectionDebugLogs({ connectionId }) {
  const watcher = yield fork(pollForConnectionLogs, {connectionId});
  let abortWatcher = false;

  while (!abortWatcher) {
    const {connectionId: newRequestedConnectionId} = yield take([
      actionTypes.LOGS.CONNECTIONS.CLEAR,
      actionTypes.LOGS.CONNECTIONS.REQUEST,
      actionTypes.LOGS.CONNECTIONS.REFRESH,
    ]);

    if (newRequestedConnectionId === connectionId) {
      yield cancel(watcher);
      abortWatcher = true;
    }
  }
}
export function* deleteConnectionDebugLogs({ connectionId}) {
  const path = `/connections/${connectionId}/debug`;

  try {
    yield call(apiCallWithRetry, { path, opts: { method: 'DELETE'}});
  } catch (e) {
    // do nothing
  }
  startPollingForConnectionDebugLogs();
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
export function* startDebug({connectionId, value}) {
  const patchSet = [
    {
      op: value !== '0' ? 'replace' : 'remove',
      path: '/debugDate',
      value: moment().add(value, 'm').toISOString(),
    },
  ];

  yield put(actions.resource.patch('connections', connectionId, patchSet));
}
export const connectionsLogSagas = [
  takeEvery([
    actionTypes.LOGS.CONNECTIONS.REQUEST,
    actionTypes.LOGS.CONNECTIONS.REFRESH,
  ], startPollingForConnectionDebugLogs),
  takeLatest(actionTypes.LOGS.CONNECTIONS.DELETE, deleteConnectionDebugLogs),
  takeLatest(actionTypes.LOGS.CONNECTIONS.DOWNLOAD, downloadConnectionDebugLogs),
  takeLatest(actionTypes.LOGS.CONNECTIONS.START_DEBUG, startDebug),
];
