import { call, select } from 'redux-saga/effects';
import { getNetsuiteOrSalesforceMeta } from '../../resources/meta';
import { getMetadataOptions } from '../../../reducers';
import {
  getNetsuiteRealTimeSampleData,
  getSalesforceRealTimeSampleData,
} from '../../../utils/sampleData';

/*
 * Should return sample data back from this saga
 * const sampleData = yield call(requestRealTimeMetadata, {resource})
 * Used in 2 places
 * 1. While constructing options.uiData for page processor preview call
 * 2. Pass on for export preview call
 */

export default function* requestRealTimeMetadata({ resource }) {
  const { adaptorType } = resource;

  if (adaptorType) {
    switch (adaptorType) {
      case 'NetSuiteExport': {
        const { _connectionId: connectionId, netsuite = {} } = resource;
        const recordType =
          netsuite.distributed && netsuite.distributed.recordType;

        if (!recordType) return;
        const commMetaPath = `netsuite/metadata/suitescript/connections/${connectionId}/recordTypes/${recordType}`;
        let nsMetadata = yield select(getMetadataOptions, {
          connectionId,
          commMetaPath,
          filterKey: 'raw',
        });

        if (!nsMetadata || !nsMetadata.data) {
          yield call(getNetsuiteOrSalesforceMeta, {
            connectionId,
            commMetaPath,
          });
          nsMetadata = yield select(getMetadataOptions, {
            connectionId,
            commMetaPath,
            filterKey: 'raw',
          });
        }

        const { data: metadata } = nsMetadata;

        return getNetsuiteRealTimeSampleData(metadata, recordType);
      }

      case 'SalesforceExport': {
        // Adding basic flow for Salesforce Sample data
        // Need to add actual logic and return the same
        const { _connectionId: connectionId, salesforce } = resource;
        const commMetaPath = `salesforce/metadata/connections/${connectionId}/sObjectTypes/${salesforce.sObjectType}`;
        let sfMetadata = yield select(getMetadataOptions, {
          connectionId,
          commMetaPath,
          filterKey: 'raw',
        });

        if (!sfMetadata || !sfMetadata.data) {
          yield call(getNetsuiteOrSalesforceMeta, {
            connectionId,
            commMetaPath,
          });
          sfMetadata = yield select(getMetadataOptions, {
            connectionId,
            commMetaPath,
            filterKey: 'raw',
          });
        }

        const { data: metadata } = sfMetadata;

        return getSalesforceRealTimeSampleData(metadata);
      }

      default:
    }
  }
}
