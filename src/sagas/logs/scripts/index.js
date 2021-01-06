/* eslint-disable camelcase */
import { call, takeEvery, put, select, takeLatest } from 'redux-saga/effects';
import actionTypes from '../../../actions/types';
import actions from '../../../actions';
import { requestReferences } from '../../resources';
import { apiCallWithRetry } from '../..';
import { selectors } from '../../../reducers';
import { convertUtcToTimezone } from '../../../utils/date';

export function* getScriptDependencies({scriptId = '',
  flowId = '',
}) {
  try {
    const resourceReferences = yield call(requestReferences, {
      resourceType: 'scripts',
      id: scriptId,
    });
    const references = [];

    if (flowId) {
      const flowResource = yield select(selectors.resource, 'flows', flowId);

      flowResource.pageGenerators.forEach(({_exportId}) => {
        const resource = resourceReferences?.exports?.find(({id}) => id === _exportId);

        if (resource) {
          references.push({type: 'exports', id: resource.id, name: resource.name});
        }
      });

      flowResource.pageProcessors.forEach(({type: ppType, _importId, _exportId}) => {
        const resource = (ppType === 'export')
          ? resourceReferences?.exports?.find(({id}) => id === _exportId)
          : resourceReferences?.imports?.find(({id}) => id === _importId);

        if (resource) {
          references.push({
            type: ppType === 'export' ? 'exports' : 'imports',
            id: resource.id,
            name: resource.name,
          });
        }
      });
    } else {
      Object.keys(resourceReferences).forEach(resourceType => {
        resourceReferences[resourceType].forEach(res => {
          // res.access => do we need it?
          references.push({type: resourceType, id: res.id, name: res.name});
        });
      });
    }
    yield put(actions.logs.scripts.setDependency({
      scriptId,
      flowId,
      resourceReferences: references,
    }));
  } catch (e) {
    // do nothing
  }
}

export function* fetchScriptLogs({scriptId = '', flowId = '', field, loadMore}) {
  if (field === 'logLevel') {
    // do not fetch data in case of log level change. Log level is a ui level filter
    return;
  }
  const {
    dateRange,
    selectedResources,
    functionType,
    nextPageURL,
  } = yield select(selectors.scriptLog, {scriptId, flowId});
  let path;

  if (loadMore && nextPageURL) {
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

  // tmp fix
  // path += `&searchGranularity=${10}`;

  let response;
  const opts = {
    method: 'GET',
  };

  try {
    response = yield call(apiCallWithRetry, {
      path,
      opts,
    });
  } catch (e) {
    return yield put(actions.logs.scripts.requestFailed(
      {
        scriptId,
        flowId,
      }));
  }

  // change logs utc datetime to local date time
  const {dateFormat, timeFormat, timezone } = yield select(selectors.userProfilePreferencesProps);

  const formattedLogs = response?.logs?.map(({time = '', ...others}) => {
    const timeArr = time.split(' ');
    const utcISODateTime = `${timeArr[0]}T${timeArr[1]}Z`;
    const localDateTime = convertUtcToTimezone(utcISODateTime, dateFormat, timeFormat, timezone);

    return {time: localDateTime, ...others };
  });

  return yield put(actions.logs.scripts.receivedLogs({
    scriptId,
    flowId,
    logs: formattedLogs || [],
    nextPageURL: response?.nextPageURL,
  }));

  // if no results then can automatically fetch next url
  // if (response.nextPageURL) yield put(actions.logs.scripts.loadMore({scriptId, flowId}));
}

export function* requestScriptLogs({
  scriptId = '',
  flowId = ''}) {
  // check if scripts not loaded. if not load from api
  yield call(getScriptDependencies, {scriptId, flowId});
  yield call(fetchScriptLogs, {scriptId, flowId});
}
export function* loadMoreLogs(opts) {
  // check if scripts not loaded. if not load from api
  yield call(fetchScriptLogs, {...opts, loadMore: true});
}

export const scriptsLogSagas = [
  takeEvery(actionTypes.LOGS.SCRIPTS.LOGS_REQUEST, requestScriptLogs),
  takeEvery(actionTypes.LOGS.SCRIPTS.LOGS_LOAD_MORE, loadMoreLogs),
  takeLatest(actionTypes.LOGS.SCRIPTS.PATCH_FILTER, fetchScriptLogs),
  takeLatest(actionTypes.LOGS.SCRIPTS.LOGS_REFRESH, fetchScriptLogs),
];
