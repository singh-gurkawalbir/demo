/* eslint-disable camelcase */
import { call, put, select, takeLatest, race, take } from 'redux-saga/effects';
import moment from 'moment';
import actionTypes from '../../../actions/types';
import actions from '../../../actions';
import { requestReferences } from '../../resources';
import { apiCallWithRetry } from '../..';
import { selectors } from '../../../reducers';
import {RESOURCE_TYPE_PLURAL_TO_SINGULAR} from '../../../constants/resource';
import getFetchLogsPath from './utils';

export function* getScriptDependencies({scriptId = '',
  flowId = '',
}) {
  let resourceReferences;

  try {
    resourceReferences = yield call(requestReferences, {
      resourceType: 'scripts',
      id: scriptId,
    });
  } catch (e) {
    return;
  }
  const references = [];

  if (flowId) {
    const flowResource = yield select(selectors.resource, 'flows', flowId);

    flowResource?.pageGenerators?.forEach(({_exportId}) => {
      const resource = resourceReferences?.exports?.find(({id}) => id === _exportId);

      if (resource) {
        references.push({type: 'export', id: resource.id, name: resource.name});
      }
    });

    flowResource?.pageProcessors?.forEach(({type: ppType, _importId, _exportId}) => {
      const resource = (ppType === 'export')
        ? resourceReferences?.exports?.find(({id}) => id === _exportId)
        : resourceReferences?.imports?.find(({id}) => id === _importId);

      if (resource) {
        references.push({
          type: ppType === 'export' ? 'export' : 'import',
          id: resource.id,
          name: resource.name,
        });
      }
    });
  } else {
    Object.keys(resourceReferences).forEach(resourceType => {
      resourceReferences[resourceType].forEach(res => {
        // res.access => do we need it?
        references.push({type: RESOURCE_TYPE_PLURAL_TO_SINGULAR[resourceType], id: res.id, name: res.name});
      });
    });
  }
  yield put(actions.logs.scripts.setDependency({
    scriptId,
    flowId,
    resourceReferences: references,
  }));
}

export function* putReceivedAction({scriptId, flowId, logs = [], nextPageURL}) {
  const formattedLogs = logs.map(({time = '', ...others}) => {
    const utcISODateTime = moment(time, 'YYYY-MM-DD HH:mm:ss.SSS').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');

    return {time: utcISODateTime, ...others };
  });

  yield put(actions.logs.scripts.received({
    scriptId,
    flowId,
    logs: formattedLogs || [],
    nextPageURL,
  }));
}

export function* retryToFetchLogs({count = 0, fetchLogsPath, scriptId, flowId}) {
  let response;

  try {
    response = yield call(apiCallWithRetry, {
      path: fetchLogsPath.replace('/api', ''),
    });
  } catch (e) {
    return {
      errorMsg: 'Request failed',
    };
  }

  const {logs = [], nextPageURL} = response;
  const newCount = count + logs.length;

  if (!nextPageURL) {
    yield call(putReceivedAction, {scriptId, flowId, logs});

    return yield put(
      actions.logs.scripts.setFetchStatus(
        {scriptId, flowId, fetchStatus: 'completed'}
      )
    );
  }

  if (newCount >= 1000) {
    yield call(putReceivedAction, {scriptId, flowId, logs, nextPageURL});

    return yield put(
      actions.logs.scripts.setFetchStatus(
        {scriptId, flowId, fetchStatus: 'paused'}
      )
    );
  }

  if (newCount < 1000) {
    yield call(putReceivedAction, {scriptId, flowId, logs, nextPageURL});
    yield put(
      actions.logs.scripts.setFetchStatus(
        {scriptId, flowId, fetchStatus: 'inProgress'}
      )
    );
    // continue
  }

  return yield call(retryToFetchLogs, {count: newCount, fetchLogsPath: nextPageURL, scriptId, flowId });
}

export function* requestScriptLogs({isInit, field, ...props}) {
  if (field === 'logLevel') {
    // do not fetch data in case of log level change. Log level is a ui level filter
    return;
  }
  const {scriptId, flowId, fetchNextPage} = props;

  if (isInit) {
    yield put(actions.logs.scripts.getDependency({scriptId, flowId}));
  }
  const logState = yield select(selectors.scriptLog, {scriptId, flowId});
  const fetchLogsPath = getFetchLogsPath({...logState, fetchNextPage });
  const { errorMsg, logs = [], nextPageURL } = yield call(retryToFetchLogs, {...props, fetchLogsPath});

  if (errorMsg) {
    return yield put(actions.logs.scripts.requestFailed({
      scriptId,
      flowId,
      errorMsg,
    }));
  }

  yield call(putReceivedAction, {scriptId, flowId, logs, nextPageURL});
}

export function* requestLogsWithCancel(params) {
  yield race({
    callAPI: call(requestScriptLogs, params),
    cancelCallAPI: take(action =>
      action.type === actionTypes.LOGS.SCRIPTS.CLEAR ||
      action.type === actionTypes.LOGS.SCRIPTS.PAUSE_FETCH
    ),
  });
}

export function* startDebug({scriptId, value}) {
  const patchSet = [
    {
      op: value !== '0' ? 'replace' : 'remove',
      path: '/debugUntil',
      value: moment().add(value, 'm').toISOString(),
    },
  ];

  yield put(actions.resource.patch('scripts', scriptId, patchSet));
}

export const scriptsLogSagas = [
  takeLatest([
    actionTypes.LOGS.SCRIPTS.REQUEST,
    actionTypes.LOGS.SCRIPTS.LOAD_MORE,
    actionTypes.LOGS.SCRIPTS.PATCH_FILTER,
    actionTypes.LOGS.SCRIPTS.REFRESH,
  ], requestLogsWithCancel),
  takeLatest(actionTypes.LOGS.SCRIPTS.START_DEBUG, startDebug),
  takeLatest(actionTypes.LOGS.SCRIPTS.GET_DEPENDENCY, getScriptDependencies),
];

