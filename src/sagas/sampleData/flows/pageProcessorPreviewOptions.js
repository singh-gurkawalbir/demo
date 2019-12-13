/*
 * Creating this file to support
 * 1.Existing flows
 * 2.Real time Exports as PG in the new Flows
 * 3. FTP, NS, SF, AS2, Web hook
 */
import { call } from 'redux-saga/effects';
import {
  getLastExportDateTime,
  isUIDataExpectedForResource,
  getBlobResourceSampleData,
} from '../../../utils/flowData';
import requestRealTimeMetadata from '../sampleDataGenerator/realTimeSampleData';
import requestFileAdaptorSampleData from '../sampleDataGenerator/fileAdaptorSampleData';
import { isBlobTypeResource } from '../../../utils/resource';

function* getUIDataForResource({ resource }) {
  const { adaptorType, sampleData } = resource;

  if (isBlobTypeResource(resource)) return getBlobResourceSampleData();

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
  const uiData = isUIDataExpectedForResource(resource)
    ? yield call(getUIDataForResource, { resource })
    : undefined;
  const postData = {
    lastExportDateTime: getLastExportDateTime(),
  };
  const { type } = resource;

  return type === 'delta' ? { uiData, postData } : { uiData };
}
