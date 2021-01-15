/* eslint-disable camelcase */
import { call, put, select, takeLatest } from 'redux-saga/effects';
import moment from 'moment';
import actionTypes from '../../../actions/types';
import actions from '../../../actions';
import { requestReferences } from '../../resources';
import { apiCallWithRetry } from '../..';
import { selectors } from '../../../reducers';
import { convertUtcToTimezone } from '../../../utils/date';
import {RESOURCE_TYPE_PLURAL_TO_SINGULAR} from '../../../constants/resource';

function getFetchLogsPath({
  dateRange,
  selectedResources,
  functionType,
  nextPageURL,
  flowId,
  scriptId,
  fetchNextPage = false,
}) {
  let path;

  if (fetchNextPage && nextPageURL) {
    path = nextPageURL.replace('/api', '');
  } else {
    path = `/scripts/${scriptId}/logs?time_gt=${dateRange?.startDate?.getTime()}&time_lte=${dateRange?.endDate?.getTime()}`;

    if (flowId) {
      path += `&_flowId=${flowId}`;
    }
    if (selectedResources?.length) {
      selectedResources.forEach(res => {
        if (res.type === 'flows') {
          path += `&_flowId=${res.id}`;
        } else {
          path += `&_resourceId=${res.id}`;
        }
      });
    }
    if (functionType) {
      path += `&functionType=${functionType}`;
    }
  }

  return path;
}
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

    flowResource.pageGenerators.forEach(({_exportId}) => {
      const resource = resourceReferences?.exports?.find(({id}) => id === _exportId);

      if (resource) {
        references.push({type: 'export', id: resource.id, name: resource.name});
      }
    });

    flowResource.pageProcessors.forEach(({type: ppType, _importId, _exportId}) => {
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

export function* retryToFetchLogs(props) {
  const {retryCount = 0, fetchLogsPath} = props;
  const opts = {
    method: 'GET',
  };

  if (retryCount > 3) {
    return {
      nextPageURL: fetchLogsPath,
      logs: [],
    };
  }

  let response;

  try {
    response = yield call(apiCallWithRetry, {
      path: fetchLogsPath,
      opts,
    });
  } catch (e) {
    response = {};
  }

  const {logs, nextPageURL} = response;

  if (logs?.length || !nextPageURL) {
    return {logs, nextPageURL};
  }

  return yield call(retryToFetchLogs, {...props, retryCount: retryCount + 1, fetchLogsPath: nextPageURL.replace('/api', '') });
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
  const { logs = [], nextPageURL } = yield call(retryToFetchLogs, {...props, fetchLogsPath});

  // dispatch error action
  // change logs utc datetime to local date time
  const {dateFormat, timeFormat, timezone } = yield select(selectors.userProfilePreferencesProps);

  const formattedLogs = logs.map(({time = '', ...others}) => {
    const utcISODateTime = moment(time, 'YYYY-MM-DD HH:mm:ss.SSS').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
    const localDateTime = convertUtcToTimezone(utcISODateTime, dateFormat, timeFormat, timezone);

    return {time: localDateTime, ...others };
  });

  yield put(actions.logs.scripts.received({
    scriptId,
    flowId,
    logs: formattedLogs || [],
    nextPageURL,
  }));
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
  ], requestScriptLogs),
  takeLatest(actionTypes.LOGS.SCRIPTS.START_DEBUG, startDebug),
  takeLatest(actionTypes.LOGS.SCRIPTS.GET_DEPENDENCY, getScriptDependencies),
];

