
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
  }
}
export const importSampleDataSagas = [
  takeLatest(actionTypes.SUITESCRIPT.IMPORT_SAMPLEDATA.REQUEST, requestSampleData),

];
