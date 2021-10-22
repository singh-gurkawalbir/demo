import { call, takeEvery, put, select, delay, takeLatest, take, fork, cancel, race} from 'redux-saga/effects';
import moment from 'moment';
import actionTypes from '../../../actions/types';
import actions from '../../../actions';
import { apiCallWithRetry } from '../..';
import { selectors } from '../../../reducers';
import getRequestOptions from '../../../utils/requestOptions';
import { FILTER_KEY } from '../../../utils/flowStepLogs';
import {pollApiRequests} from '../../app';

export function* fetchNewLogs({ flowId, exportId, timeGt }) {
  const opts = {
    method: 'GET',
  };
  const path = `/flows/${flowId}/${exportId}/requests?time_gt=${timeGt || Date.now() - (20 * 1000)}`;

  let response;

  try {
    response = yield call(apiCallWithRetry, {
      path,
      opts,
    });

    if (response?.requests?.length) {
      yield put(
        actions.logs.flowStep.stopLogsPoll(
          exportId,
          true,
        )
      );
    }
  // eslint-disable-next-line no-empty
  } catch (e) {
  }
}

export function* pollForLatestLogs({ flowId, exportId, timeGt }) {
  const POLLING_DURATION = 15000;

  yield call(fetchNewLogs, { flowId, exportId, timeGt });
  yield delay(POLLING_DURATION);

  yield race({
    pollApiRequests: call(pollApiRequests, {pollSaga: fetchNewLogs, pollSagaArgs: { flowId, exportId }, disableSlowPolling: true, duration: POLLING_DURATION}),
    abortPoll: take(actionTypes.POLLING.STOP),
  });
  const pollingLastStoppedAt = Date.now();

  yield take(actionTypes.POLLING.RESUME);
  yield call(pollForLatestLogs, { flowId, exportId, timeGt: pollingLastStoppedAt });
}

export function* startPollingForRequestLogs({flowId, exportId}) {
  const logsList = yield select(selectors.logsSummary, exportId);
  // the first poll should start from latest log captured time
  const timeGt = logsList[0]?.time;
  const watcher = yield fork(pollForLatestLogs, {flowId, exportId, timeGt});

  const stopAction = yield take([
    actionTypes.LOGS.FLOWSTEP.DEBUG.STOP,
    actionTypes.LOGS.FLOWSTEP.STOP_POLL,
    actionTypes.LOGS.FLOWSTEP.CLEAR,
  ]);

  yield cancel(watcher);
  if (stopAction.type === actionTypes.LOGS.FLOWSTEP.DEBUG.STOP) {
    // do a final fetch to cover any gaps
    yield call(fetchNewLogs, {flowId, exportId});
  }
}

export function* putReceivedAction({exportId, requests = [], nextPageURL, loadMore}) {
  const formattedLogs = requests.map(({time = '', ...others}) => {
    const utcDateTime = moment(time);

    return { utcDateTime, time, ...others };
  });

  yield put(
    actions.logs.flowStep.received({
      exportId,
      logs: formattedLogs,
      nextPageURL,
      loadMore,
    }
    )
  );
}

export function* retryToFetchRequests({freshCall, count = 0, fetchRequestsPath, loadMore, exportId}) {
  // when user makes fresh request, we want to reset the logs and don't append the logs to existing logs state
  // but when we are retrying on our end to fetch logs, we want to keep loadMore as true so logs gets added to the existing list
  const shouldAppendLogs = loadMore || !freshCall;
  let response;

  try {
    response = yield call(apiCallWithRetry, {
      path: fetchRequestsPath.replace('/api', ''),
    });
  } catch (e) {
    return {};
  }

  const {requests = [], nextPageURL} = response;
  const newCount = count + requests.length;

  if (!nextPageURL) {
    yield call(putReceivedAction, {exportId, requests, loadMore: !!shouldAppendLogs});

    return yield put(
      actions.logs.flowStep.setFetchStatus(
        exportId,
        'completed'
      )
    );
  }

  if (newCount >= 1000) {
    yield call(putReceivedAction, {exportId, requests, nextPageURL, loadMore: !!shouldAppendLogs});

    return yield put(
      actions.logs.flowStep.setFetchStatus(
        exportId,
        'paused'
      )
    );
  }

  if (newCount < 1000) {
    yield call(putReceivedAction, {exportId, requests, nextPageURL, loadMore: !!shouldAppendLogs});
    yield put(
      actions.logs.flowStep.setFetchStatus(
        exportId,
        'inProgress'
      )
    );
    // continue
  }

  return yield call(retryToFetchRequests, {count: newCount, fetchRequestsPath: nextPageURL, loadMore, exportId });
}

export function* requestLogs({ flowId, exportId, loadMore }) {
  const { nextPageURL, debugOn } = yield select(selectors.listenerLogs, exportId);

  const filters = yield select(selectors.filter, FILTER_KEY);

  const requestOptions = getRequestOptions(
    actionTypes.LOGS.FLOWSTEP.REQUEST,
    { flowId, exportId, filters, nextPageURL, loadMore }
  );
  const { path } = requestOptions;

  yield call(retryToFetchRequests, {freshCall: true, fetchRequestsPath: path, loadMore, exportId });

  // get the hasNewLogs again from the state once logs are received
  const hasNewLogs = yield select(selectors.hasNewLogs, exportId);

  // only when the debugger is on and there are no new logs, we do the polling
  if (debugOn && !hasNewLogs) {
    yield call(startPollingForRequestLogs, {flowId, exportId});
  }
}

export function* requestLogsWithCancel(params) {
  yield race({
    callAPI: call(requestLogs, params),
    cancelCallAPI: take(action =>
      action.type === actionTypes.LOGS.FLOWSTEP.CLEAR ||
      action.type === actionTypes.LOGS.FLOWSTEP.PAUSE_FETCH
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
    actions.logs.flowStep.receivedLogDetails(
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
  yield put(actions.logs.flowStep.logDeleted(exportId, deleted[0]));
  if (errors.length) {
    yield put(actions.logs.flowStep.failed(exportId, errors[0]));
  }
}

export default [
  takeLatest(actionTypes.LOGS.FLOWSTEP.REQUEST, requestLogsWithCancel),
  takeEvery(actionTypes.LOGS.FLOWSTEP.LOG.REQUEST, requestLogDetails),
  takeLatest(actionTypes.LOGS.FLOWSTEP.DEBUG.START, toggleDebug),
  takeLatest(actionTypes.LOGS.FLOWSTEP.DEBUG.STOP, toggleDebug),
  takeEvery(actionTypes.LOGS.FLOWSTEP.LOG.REMOVE, removeLogs),
  takeLatest(actionTypes.LOGS.FLOWSTEP.START_POLL, startPollingForRequestLogs),
];
