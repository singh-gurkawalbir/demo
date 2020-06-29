
import { put, select, takeLatest } from 'redux-saga/effects';
import actions from '../../../../actions';
import actionTypes from '../../../../actions/types';
import * as selectors from '../../../../reducers';

export function* requestSampleData({ ssLinkedConnectionId, integrationId, flowId, options = {} }) {
  const { refreshCache } = options;
  const flow = yield select(
    selectors.suiteScriptFlowDetail,
    {
      integrationId,
      ssLinkedConnectionId,
      flowId
    }
  );
  const { import: importConfig} = flow;
  const {type: importType, _connectionId, netsuite, salesforce} = importConfig;
  if (importType === 'netsuite') {
    const { recordType } = netsuite;

    const commMetaPath = `netsuite/metadata/suitescript/connections/${ssLinkedConnectionId}/recordTypes/${recordType}`;
    yield put(
      actions.metadata.request(ssLinkedConnectionId, commMetaPath, { refreshCache })
    );
  } else if (importType === 'salesforce') {
    const { sObjects } = options;

    if (sObjects && Array.isArray(sObjects)) {
      for (let i = 0; i < sObjects.length; i += 1) {
        yield put(
          actions.metadata.request(
            ssLinkedConnectionId,
            `suitescript/connections/${ssLinkedConnectionId}/connections/${_connectionId}/sObjectTypes/${sObjects[i]}`,
            { ignoreCache: true }
          )
        );
      }
    } else {
      const { sObjectType } = salesforce;
      yield put(
        actions.metadata.request(
          ssLinkedConnectionId,
          `suitescript/connections/${ssLinkedConnectionId}/connections/${_connectionId}/sObjectTypes/${sObjectType}`,
          { ignoreCache: true }
        )
      );
    }
  } else if (['rakuten', 'sears', 'newegg'].includes(importType)) {
    let method;
    if (importType === 'sears') {
      const { sears } = importConfig;
      method = sears.method;
    } else if (importType === 'rakuten') {
      // TODO confirm with Shiva on this
      const { rakuten } = importConfig;
      method = rakuten.method;
    } else if (importType === 'newegg') {
      const { newegg } = importConfig;
      method = newegg.method;
    }

    const connections = yield select(selectors.suiteScriptResourceList, {ssLinkedConnectionId, resourceType: 'connections'});
    const connection = connections.find(conn => conn.id === _connectionId);
    if (connection) {
      const methodObj = connection.apiMethods.find(m => m.id === method);
      const { fields } = methodObj;
      const previewData = fields.map(({label, id}) => ({id, name: label}));
      console.log('previewData', previewData);
      return yield put(
        actions.suiteScript.importSampleData.received({ ssLinkedConnectionId, integrationId, flowId, data: previewData}));
      // );
      // return yield put(
      //   actions.suiteScript.importSampleData.receivedError({ ssLinkedConnectionId, integrationId, flowId, error: parsedError})
      // );
    }
  }
}
export const importSampleDataSagas = [
  takeLatest(actionTypes.SUITESCRIPT.IMPORT_SAMPLEDATA.REQUEST, requestSampleData),

];
