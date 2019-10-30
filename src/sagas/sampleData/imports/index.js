import { takeLatest, select, call } from 'redux-saga/effects';
import actionTypes from '../../../actions/types';
import { resourceData } from '../../../reducers';
import { SCOPES } from '../../resourceForm';
import { getNetsuiteOrSalesforceMeta } from '../../resources/meta';

function* fetchAssistantSampleData() {
  // Fetch assistant's sample data logic
}

function* requestSampleData({ resourceId }) {
  const { merged: resource } = yield select(
    resourceData,
    'imports',
    resourceId,
    SCOPES.VALUE
  );
  const { adaptorType, assistant } = resource;

  if (assistant) {
    yield call(fetchAssistantSampleData, { resource });
  }

  if (adaptorType) {
    switch (adaptorType) {
      case 'NetSuiteDistributedImport': {
        // eslint-disable-next-line camelcase
        const { _connectionId, netsuite_da } = resource;

        yield call(getNetsuiteOrSalesforceMeta, {
          connectionId: _connectionId,
          metadataType: 'recordTypes',
          mode: 'suitescript',
          recordType: netsuite_da.recordType,
          filterKey: `record-${netsuite_da.recordType}`,
        });
        break;
      }

      case 'SalesforceImport': {
        const { _connectionId, salesforce } = resource;

        yield call(getNetsuiteOrSalesforceMeta, {
          connectionId: _connectionId,
          metadataType: 'sObjectTypes',
          mode: 'salesforce',
          recordType: salesforce.sObjectType,
        });
        break;
      }

      default:
    }
  }
}

export default [
  takeLatest(actionTypes.IMPORT_SAMPLEDATA.REQUEST, requestSampleData),
];
