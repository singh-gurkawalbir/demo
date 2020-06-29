
import { put, select, takeLatest, call } from 'redux-saga/effects';
import actions from '../../../../actions';
import actionTypes from '../../../../actions/types';
import * as selectors from '../../../../reducers';
import { apiCallWithRetry } from '../../..';

export function* requestFlowSampleData({ ssLinkedConnectionId, integrationId, flowId, options = {}}) {
  const flow = yield select(
    selectors.suiteScriptFlowDetail,
    {
      integrationId,
      ssLinkedConnectionId,
      flowId
    }
  );
  const { export: exportConfig } = flow;
  const {type: exportType, _connectionId } = exportConfig;

  if (exportConfig.netsuite && exportConfig.netsuite.type === 'realtime') {
    const {refreshCache} = options;
    const {netsuite} = exportConfig;
    const {recordType} = netsuite.realtime;
    let path = `/netsuite/metadata/suitescript/connections/${ssLinkedConnectionId}/recordTypes/${recordType}`;
    if (refreshCache) {
      path = `${path}?refreshCache=true`;
    }
    try {
      const response = yield call(apiCallWithRetry, {
        path,
        opts: { method: 'GET' },
        message: 'Fetching Preview',
        hidden: true,
      });

      const previewData = response.map(({id, name}) => ({id, name}));
      yield put(actions.suiteScript.sampleData.received({ ssLinkedConnectionId, integrationId, flowId, previewData}));
    } catch (e) {
      // Handling Errors with status code between 400 and 500
      if (e.status === 403 || e.status === 401) {
        // todo
        return;
      }
      if (e.status >= 400 && e.status < 500) {
        const parsedError = JSON.parse(e.message);

        return yield put(
          actions.suiteScript.sampleData.receivedError({ ssLinkedConnectionId, integrationId, flowId, error: parsedError})
        );
      }
    }
    // realtime data
  } else if (exportType === 'fileCabinet') {
    // ftp => export.sampleData
  } else if (['rakuten', 'sears', 'newegg'].includes(exportType)) {
    let method;
    if (exportType === 'sears') {
      const { sears } = exportConfig;
      method = sears.method;
    } else if (exportType === 'rakuten') {
      // TODO confirm with Shiva on this
      const { rakuten } = exportConfig;
      method = rakuten.method;
    } else if (exportType === 'newegg') {
      const { newegg } = exportConfig;
      method = newegg.method;
    }
    const connections = yield select(selectors.suiteScriptResourceList, {ssLinkedConnectionId, resourceType: 'connections'});
    const connection = connections.find(conn => conn.id === _connectionId);

    if (connection) {
      const methodObj = connection.apiMethods.find(m => m.id === method);
      const { fields } = methodObj;
      const previewData = fields.map(({label, id}) => ({id, name: label}));
      yield put(actions.suiteScript.sampleData.received({ ssLinkedConnectionId, integrationId, flowId, previewData}));
    }
  } else {
    // type == test , netsuite.type === 'restlet',
    const path = `/suitescript/connections/${ssLinkedConnectionId}/export/preview`;
    try {
      const body = exportConfig;
      const previewData = yield call(apiCallWithRetry, {
        path,
        opts: { method: 'POST', body },
        message: 'Fetching Preview',
        hidden: true,
      });

      yield put(actions.suiteScript.sampleData.received({ ssLinkedConnectionId, integrationId, flowId, previewData}));
    } catch (e) {
      // Handling Errors with status code between 400 and 500
      if (e.status === 403 || e.status === 401) {
        // todo
        return;
      }
      if (e.status >= 400 && e.status < 500) {
        const parsedError = JSON.parse(e.message);

        return yield put(
          actions.suiteScript.sampleData.receivedError({ ssLinkedConnectionId, integrationId, flowId, error: parsedError})
        );
      }
    }
  }
}
export const flowSampleDataSagas = [
  takeLatest(actionTypes.SUITESCRIPT.SAMPLEDATA.REQUEST, requestFlowSampleData),

];
