import { call, takeEvery, put, select, takeLatest, take, fork, cancel, delay, race} from 'redux-saga/effects';
import moment from 'moment';
import actionTypes from '../../../actions/types';
import actions from '../../../actions';
import { apiCallWithRetry } from '../..';
import { selectors } from '../../../reducers';
import getRequestOptions from '../../../utils/requestOptions';
import { FILTER_KEY } from '../../../utils/listenerLogs';

export function* fetchNewLogs({ flowId, exportId, timeGt }) {
  const opts = {
    method: 'GET',
  };
  const path = `/flows/${flowId}/${exportId}/requests?time_gt=${timeGt || Date.now() - (20 * 1000)}&time_lte=${Date.now()}`;

  let response;

  try {
    response = yield call(apiCallWithRetry, {
      path,
      opts,
    });
    const {requests} = response || {};

    if (requests?.length) {
      yield put(
        actions.logs.listener.stopLogsPoll(
          exportId,
          true,
        )
      );
    }
  // eslint-disable-next-line no-empty
  } catch (e) {
  }
}

export function* pollForLatestLogs({ flowId, exportId }) {
  const logsList = yield select(selectors.logsSummary, exportId);
  // the first poll should start from latest log captured time
  let timeGt = logsList[0]?.time;

  while (true) {
    yield call(fetchNewLogs, { flowId, exportId, timeGt });
    timeGt = '';
    yield delay(15 * 1000);
  }
}

export function* startPollingForRequestLogs({flowId, exportId}) {
  const watcher = yield fork(pollForLatestLogs, {flowId, exportId});

  const stopAction = yield take([
    actionTypes.LOGS.LISTENER.DEBUG.STOP,
    actionTypes.LOGS.LISTENER.STOP_POLL,
    actionTypes.LOGS.LISTENER.CLEAR,
  ]);

  yield cancel(watcher);
  if (stopAction.type === actionTypes.LOGS.LISTENER.DEBUG.STOP) {
    // do a final fetch to cover any gaps
    yield call(fetchNewLogs, {flowId, exportId});
  }
}

export function* retryToFetchRequests({retryCount = 0, fetchRequestsPath}) {
  const opts = {
    method: 'GET',
  };

  // we try max of 4 times (to cover 1 hour window) as BE route may not give all the results on first try or after that (s3 limitation)
  if (retryCount > 3) {
    return {
      nextPageURL: fetchRequestsPath,
    };
  }

  let response;

  try {
    response = yield call(apiCallWithRetry, {
      path: fetchRequestsPath.replace('/api', ''),
      opts,
    });
  } catch (e) {
    return {};
  }

  const {requests, nextPageURL} = response;

  // don't re-iterate in case logs are found or nextPageURL is not present. Return control to parent
  if (requests?.length || !nextPageURL) {
    return {requests, nextPageURL};
  }

  return yield call(retryToFetchRequests, {retryCount: retryCount + 1, fetchRequestsPath: nextPageURL });
}

export function* requestLogs({ flowId, exportId, loadMore }) {
  const { nextPageURL, debugOn, hasNewLogs } = yield select(selectors.listenerLogs, exportId);

  const filters = yield select(selectors.filter, FILTER_KEY);

  const requestOptions = getRequestOptions(
    actionTypes.LOGS.LISTENER.REQUEST,
    { flowId, exportId, filters, nextPageURL, loadMore }
  );
  const { path } = requestOptions;
  const { requests = [], nextPageURL: nextPageURLResponse } = yield call(retryToFetchRequests, {fetchRequestsPath: path });

  const formattedLogs = requests.map(({time = '', ...others}) => {
    const utcDateTime = moment(time);

    return { utcDateTime, time, ...others };
  });

  yield put(
    actions.logs.listener.received(
      exportId,
      formattedLogs,
      nextPageURLResponse,
      loadMore
    )
  );

  // only when the debugger is on and there are no new logs, we do the polling
  if (debugOn && !hasNewLogs) {
    yield call(startPollingForRequestLogs, {flowId, exportId});
  }
}

export function* requestLogsWithCancel(params) {
  yield race({
    callAPI: call(requestLogs, params),
    cancelCallAPI: take(action =>
      action.type === actionTypes.LOGS.LISTENER.CLEAR
    ),
  });
}

export function* requestLogDetails({ flowId, exportId, logKey }) {
  const logDetails = yield select(selectors.logDetails, exportId, logKey);

  // if log details already exists, no need to call API again
  if (logDetails.key) return;

  const path = `/flows/${flowId}/${exportId}/requests/${logKey}`;

  let log;

  try {
    log = yield call(apiCallWithRetry, { path });
  } catch (e) {
    return;
  }

  yield put(
    actions.logs.listener.receivedLogDetails(
      exportId,
      logKey,
      log
    )
  );
}

export function* toggleDebug({ flowId, exportId, minutes }) {
  const isDebugEnabled = yield select(selectors.isDebugEnabled, exportId);
  const hasNewLogs = yield select(selectors.hasNewLogs, exportId);

  const patchSet = [
    {
      op: minutes !== '0' ? 'replace' : 'remove',
      path: '/debugUntil',
      value: moment().add(minutes, 'm').toISOString(),
    },
  ];

  yield put(actions.resource.patch('exports', exportId, patchSet));
  // only when the debugger is on and there are no new logs, we do the polling
  if (isDebugEnabled && !hasNewLogs) {
    yield call(startPollingForRequestLogs, {flowId, exportId});
  }
}

export function* removeLogs({ flowId, exportId, logsToRemove }) {
  if (!logsToRemove || logsToRemove.length === 0) {
    return;
  }

  const path = `/flows/${flowId}/${exportId}/requests`;
  const opts = {
    method: 'DELETE',
    body: {
      keys: logsToRemove,
    },
  };

  let response;

  try {
    response = yield call(apiCallWithRetry, { path, opts });
  } catch (e) {
    return;
  }
  const { deleted = [], errors = [] } = response || {};

  // user can only delete one log at a time from UI
  // hence we pick first index from 'deleted' and 'errors' array
  yield put(actions.logs.listener.logDeleted(exportId, deleted[0]));
  if (errors.length) {
    yield put(actions.logs.listener.failed(exportId, errors[0]));
  }
}

export default [
  takeLatest(actionTypes.LOGS.LISTENER.REQUEST, requestLogsWithCancel),
  takeEvery(actionTypes.LOGS.LISTENER.LOG.REQUEST, requestLogDetails),
  takeLatest(actionTypes.LOGS.LISTENER.DEBUG.START, toggleDebug),
  takeLatest(actionTypes.LOGS.LISTENER.DEBUG.STOP, toggleDebug),
  takeEvery(actionTypes.LOGS.LISTENER.LOG.REMOVE, removeLogs),
  takeLatest(actionTypes.LOGS.LISTENER.START_POLL, startPollingForRequestLogs),
];
