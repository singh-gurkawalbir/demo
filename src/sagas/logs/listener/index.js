import { call, takeEvery, put, select, takeLatest, take, fork, cancel, delay} from 'redux-saga/effects';
import moment from 'moment';
import actionTypes from '../../../actions/types';
import actions from '../../../actions';
import { apiCallWithRetry } from '../..';
import { selectors } from '../../../reducers';
// import getRequestOptions from '../../../utils/requestOptions';
import { getMockRequests, getMockLogDetails, getMockDeleteResponse } from '../../../utils/listenerLogs';

export function* fetchNewLogs({ flowId, exportId, timeGt }) {
  const opts = {
    method: 'GET',
  };
  const path = `/flows/${flowId}/${exportId}/requests?time_gt=${timeGt || Date.now() - (70 * 1000)}&time_lte=${Date.now()}`;

  let response;

  try {
    response = yield call(apiCallWithRetry, {
      path,
      opts,
    });
  } catch (e) {
    return;
  }

  const {requests} = response;

  if (requests?.length) {
    yield put(
      actions.logs.listener.stopLogsPoll(
        exportId,
        true,
      )
    );
  }
}

export function* pollForLatestLogs({ flowId, exportId }) {
  const logsList = yield select(selectors.logsSummary, exportId);
  // the first poll should start from latest log captured time
  let timeGt = logsList[0]?.time;

  while (true) {
    yield call(fetchNewLogs, { flowId, exportId, timeGt });
    timeGt = '';
    yield delay(60 * 1000);
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

  // we try 3 times as BE route may not give all the results on first try (s3 limitation)
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
    return;
  }

  const {requests, nextPageURL} = response;

  if (requests?.length === 1000) {
    return {requests, nextPageURL};
  }
  // don't re-iterate in case nextPageURL is not present. Return control to parent
  if (!nextPageURL) {
    return {requests, nextPageURL};
  }

  return yield call(retryToFetchRequests, {retryCount: retryCount + 1, fetchRequestsPath: nextPageURL });
}

export function* requestLogs({ flowId, exportId, loadMore }) {
  const logsState = yield select(selectors.listenerLogs, exportId);

  // todo uncomment this once BE is live
  // const filters = yield select(selectors.filter, 'listenerLogs');

  // const requestOptions = getRequestOptions(
  //   actionTypes.LOGS.LISTENER.REQUEST,
  //   { flowId, exportId, filters, nextPageURL: logsState.nextPageURL, loadMore }
  // );
  // const { path } = requestOptions;
  // const { requests = [], nextPageURL } = yield call(retryToFetchRequests, {fetchRequestsPath: path});

  const requestsTemp = getMockRequests();
  const nextPageURLTemp = '/v1(api)/flows/:_flowId/:_exportId/requests?nextPageToken=NextContinuation';

  const formattedLogs = requestsTemp.map(({time = '', ...others}) => {
    const utcDateTime = moment(time);

    return { utcDateTime, time, ...others };
  });

  yield put(
    actions.logs.listener.received(
      exportId,
      formattedLogs,
      nextPageURLTemp,
      loadMore
    )
  );

  // only when the debugger is on, we do the polling
  if (logsState.debugOn) {
    yield call(startPollingForRequestLogs, {flowId, exportId});
  }
}

export function* requestLogDetails({ exportId, logKey }) {
  const logDetails = yield select(selectors.logDetails, exportId, logKey);

  // if log details already exists, no need to call API again
  if (logDetails.key) return;

  // todo uncomment this once BE is live
  // const path = `/flows/${flowId}/${exportId}/requests/${logKey}`;

  let log;

  try {
    // todo: fix this once BE is live
    // log = yield call(apiCallWithRetry, { path });
    log = getMockLogDetails(logKey);
  } catch (error) {
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

  const patchSet = [
    {
      op: minutes !== '0' ? 'replace' : 'remove',
      path: '/debugUntil',
      value: moment().add(minutes, 'm').toISOString(),
    },
  ];

  yield put(actions.resource.patch('exports', exportId, patchSet));
  // only when the debugger is on, we do the polling
  if (isDebugEnabled) {
    yield call(startPollingForRequestLogs, {flowId, exportId});
  }
}

export function* removeLogs({ exportId, logsToRemove }) {
  if (!logsToRemove || logsToRemove.length === 0) {
    return;
  }

  // todo uncomment this once BE is live
  // const path = `/flows/${flowId}/${exportId}/requests`;
  // const opts = {
  //   method: 'DELETE',
  //   body: {
  //     keys: logsToRemove,
  //   },
  // };

  let response;

  try {
    // todo: fix this once BE is live
    // response = yield call(apiCallWithRetry, { path, opts });
    response = getMockDeleteResponse(logsToRemove);
  } catch (error) {
    return;
  }
  const { deleted = [], errors = [] } = response || {};

  yield put(actions.logs.listener.logDeleted(exportId, deleted));
  if (errors.length) {
    yield put(actions.logs.listener.failed(exportId, errors[0]));
  }
}

export default [
  takeLatest(actionTypes.LOGS.LISTENER.REQUEST, requestLogs),
  takeEvery(actionTypes.LOGS.LISTENER.LOG.REQUEST, requestLogDetails),
  takeLatest(actionTypes.LOGS.LISTENER.DEBUG.START, toggleDebug),
  takeLatest(actionTypes.LOGS.LISTENER.DEBUG.STOP, toggleDebug),
  takeEvery(actionTypes.LOGS.LISTENER.LOG.REMOVE, removeLogs),
];
