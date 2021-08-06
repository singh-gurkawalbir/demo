
import { put, select, takeLatest, call } from 'redux-saga/effects';
import { deepClone } from 'fast-json-patch/lib/core';
import actions from '../../../../actions';
import actionTypes from '../../../../actions/types';
import { selectors } from '../../../../reducers';
import { apiCallWithRetry } from '../../..';
import requestFileAdaptorSampleData from '../../../sampleData/sampleDataGenerator/fileAdaptorSampleData';
import { getExtractPaths } from '../../../../utils/suiteScript/mapping';
import { safeParse } from '../../../../utils/string';

export function* requestFlowSampleData({ ssLinkedConnectionId, integrationId, flowId, options = {}}) {
  const {refreshCache } = options;
  const flow = yield select(
    selectors.suiteScriptFlowDetail,
    {
      integrationId,
      ssLinkedConnectionId,
      flowId,
    }
  );

  if (!flow) {
    return;
  }
  const { export: exportConfig } = flow;
  const {type: exportType, _connectionId } = exportConfig;

  if (exportConfig.netsuite && exportConfig.netsuite.type === 'realtime') {
    const {recordType} = exportConfig.netsuite.realtime;
    const commMetaPath = `netsuite/metadata/suitescript/connections/${ssLinkedConnectionId}/recordTypes/${recordType}`;

    yield put(
      actions.metadata.request(ssLinkedConnectionId, commMetaPath, { refreshCache })
    );
  } else if (exportType === 'salesforce') {
    const {sObjectType} = exportConfig.salesforce;

    yield put(actions.metadata.request(
      ssLinkedConnectionId,
      `suitescript/connections/${ssLinkedConnectionId}/connections/${_connectionId}/sObjectTypes/${sObjectType}`,
      { refreshCache, ignoreCache: true }
    ));
  } else if (['fileCabinet', 'ftp'].includes(exportType)) {
    const _exp = deepClone(exportConfig);

    _exp.file.type = 'csv';
    const previewData = yield call(requestFileAdaptorSampleData, {resource: _exp});
    const extractList = getExtractPaths(
      previewData,
    );

    yield put(actions.suiteScript.sampleData.received({ ssLinkedConnectionId, integrationId, flowId, previewData: extractList}));
    // ftp => export.sampleData
  } else if (['rakuten', 'sears', 'newegg'].includes(exportType)) {
    let method;

    if (exportType === 'sears') {
      const { sears } = exportConfig;

      method = sears.method;
    } else if (exportType === 'rakuten') {
      // for rakuten, method is inside export/file
      const { file } = exportConfig;

      method = file.method;
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
    const path = `/suitescript/connections/${ssLinkedConnectionId}/export/preview`;

    try {
      const body = exportConfig;
      const previewData = yield call(apiCallWithRetry, {
        path,
        opts: { method: 'POST', body },
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
        const parsedError = safeParse(e.message);

        return yield put(
          actions.suiteScript.sampleData.receivedError({ ssLinkedConnectionId, integrationId, flowId, error: parsedError})
        );
      }
    }
  }
}

export function* onResourceUpdate({ master, ssLinkedConnectionId, integrationId, resourceType }) {
  if (resourceType === 'exports') {
    const {_id: flowId} = master;

    return yield put(
      actions.suiteScript.sampleData.reset({ ssLinkedConnectionId, integrationId, flowId})
    );
  }
}
export const flowSampleDataSagas = [
  takeLatest(actionTypes.SUITESCRIPT.SAMPLEDATA.REQUEST, requestFlowSampleData),
  takeLatest(actionTypes.SUITESCRIPT.RESOURCE.UPDATED, onResourceUpdate),

];
