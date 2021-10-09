/* eslint-disable camelcase */
import { call, takeEvery, put, select, fork, take, cancel, takeLatest} from 'redux-saga/effects';
import moment from 'moment';
import actionTypes from '../../../actions/types';
import actions from '../../../actions';
// import { requestReferences } from '../../resources';
import { apiCallWithRetry } from '../..';
import { selectors } from '../../../reducers';
import openExternalUrl from '../../../utils/window';
import { convertUtcToTimezone } from '../../../utils/date';
import {pollApiRequests} from '../../app';
// import { selectors } from '../../../reducers';
const UTCDateTimeRegex = '^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}.[0-9]{3}Z';

export function* getConnectionDebugLogs({ connectionId }) {
  const path = `/connections/${connectionId}/debug`;

  let logs;

  try {
    logs = yield call(apiCallWithRetry, { path });
  } catch (error) {
    return yield put(actions.logs.connections.requestFailed(connectionId));
  }
  const {dateFormat, timeFormat } = yield select(selectors.userProfilePreferencesProps);
  const timezone = yield select(selectors.userTimezone);

  const updatedTimeZonelogs = logs?.split('\n').map(log => {
    let logTmp = log;
    const matchedUTCDateTime = logTmp.match(UTCDateTimeRegex)?.[0];

    if (matchedUTCDateTime) {
      const localDateTime = convertUtcToTimezone(matchedUTCDateTime, dateFormat, timeFormat, timezone);

      logTmp = logTmp.replace(matchedUTCDateTime, localDateTime);
    }

    return logTmp || '';
  }).join('\n');

  yield put(
    actions.logs.connections.received(
      connectionId,
      updatedTimeZonelogs || '',
    )
  );
}

export function* pollToGetConnectionLogs({connectionId}) {
  const connection = yield select(selectors.resource, 'connections', connectionId);
  const { debugDate } = connection || {};

  // check if debug time expired. Check only after polling starts.
  if ((!debugDate || moment().isAfter(moment(debugDate)))) {
    return {terminatePolling: true};
  }

  yield call(getConnectionDebugLogs, { connectionId });
}

export function* pollForConnectionLogs({ connectionId }) {
  yield call(getConnectionDebugLogs, { connectionId });
  yield call(pollApiRequests, {pollSaga: pollToGetConnectionLogs, pollSagaArgs: {connectionId}, duration: 5 * 1000});
}
export function* startPollingForConnectionDebugLogs({ connectionId }) {
  const isConnectionLogsNotSupported = yield select(selectors.isConnectionLogsNotSupported, connectionId);

  if (isConnectionLogsNotSupported) {
    return yield put(actions.logs.connections.requestFailed(connectionId));
  }

  const watcher = yield fork(pollForConnectionLogs, {connectionId});

  yield take(action => {
    if ([actionTypes.LOGS.CONNECTIONS.REQUEST, actionTypes.LOGS.CONNECTIONS.PAUSE].includes(action.type) && action.connectionId === connectionId) {
      return true;
    }
    if (action.type === actionTypes.LOGS.CONNECTIONS.CLEAR) {
      // in case of flow builder close, all connection logs are cleared
      if (action.clearAllLogs) {
        return true;
      }

      // user can manually choose to close particular connection debug log.
      return action.connectionId === connectionId;
    }
  });

  yield cancel(watcher);
}
export function* refreshConnectionDebugLogs({ connectionId }) {
  const isConnectionLogsNotSupported = yield select(selectors.isConnectionLogsNotSupported, connectionId);

  if (!isConnectionLogsNotSupported) {
    yield call(getConnectionDebugLogs, { connectionId });
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
  yield call(openExternalUrl, { url: _url });
}
export function* startDebug({connectionId, value}) {
  const isConnectionLogsNotSupported = yield select(selectors.isConnectionLogsNotSupported, connectionId);

  if (isConnectionLogsNotSupported) {
    return;
  }
  const patchSet = [
    {
      op: value !== '0' ? 'replace' : 'remove',
      path: '/debugDate',
      value: moment().add(value, 'm').toISOString(),
    },
  ];

  yield put(actions.resource.patch('connections', connectionId, patchSet));
  if (value !== '0') {
    // start connection log polling
    yield put(actions.logs.connections.request(connectionId));
  } else {
    // stop connection log polling
    yield put(actions.logs.connections.pause(connectionId));
  }
}
export const connectionsLogSagas = [
  takeEvery(actionTypes.LOGS.CONNECTIONS.REQUEST, startPollingForConnectionDebugLogs),
  takeLatest(actionTypes.LOGS.CONNECTIONS.DELETE, deleteConnectionDebugLogs),
  takeLatest(actionTypes.LOGS.CONNECTIONS.DOWNLOAD, downloadConnectionDebugLogs),
  takeLatest(actionTypes.LOGS.CONNECTIONS.START_DEBUG, startDebug),
  takeLatest(actionTypes.LOGS.CONNECTIONS.REFRESH, refreshConnectionDebugLogs),
];
