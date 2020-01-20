/*
 * Creating this file to support
 * 1.Existing flows
 * 2.Real time Exports as PG in the new Flows
 * 3. FTP, NS, SF, AS2, Web hook
 */
import { call, select } from 'redux-saga/effects';
import {
  getLastExportDateTime,
  isUIDataExpectedForResource,
  getBlobResourceSampleData,
} from '../../../utils/flowData';
import requestRealTimeMetadata from '../sampleDataGenerator/realTimeSampleData';
import requestFileAdaptorSampleData from '../sampleDataGenerator/fileAdaptorSampleData';
import {
  isBlobTypeResource,
  isRestCsvMediaTypeExport,
} from '../../../utils/resource';
import * as selectors from '../../../reducers';

function* getUIDataForResource({ resource, connection }) {
  const { adaptorType, type, sampleData } = resource;
  const isDataLoader = type === 'simple';

  if (isBlobTypeResource(resource)) return getBlobResourceSampleData();

  // Incase of Data Loader/ Rest CSV Exports, flow is same as File Adaptors
  if (isRestCsvMediaTypeExport(resource, connection) || isDataLoader)
    return yield call(requestFileAdaptorSampleData, { resource });

  if (adaptorType) {
    switch (adaptorType) {
      case 'NetSuiteExport':
      case 'SalesforceExport':
        return yield call(requestRealTimeMetadata, { resource });
      case 'FTPExport':
      case 'S3Export':
      case 'AS2Export': {
        return yield call(requestFileAdaptorSampleData, { resource });
      }

      case 'WebhookExport': {
        // Sample data exists on resource
        // TODO: @Raghu Add webhooks form field sample data feature
        return sampleData || {};
      }

      default:
    }
  }
}

export default function* getPreviewOptionsForResource({ resource }) {
  const connection = yield select(
    selectors.resource,
    'connections',
    resource && resource._connectionId
  );
  const uiData = isUIDataExpectedForResource(resource, connection)
    ? yield call(getUIDataForResource, { resource, connection })
    : undefined;
  const postData = {
    lastExportDateTime: getLastExportDateTime(),
  };
  const { type } = resource;

  return type === 'delta' ? { uiData, postData } : { uiData };
}
