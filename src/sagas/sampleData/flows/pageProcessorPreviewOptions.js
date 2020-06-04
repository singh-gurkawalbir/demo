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
  isRealTimeOrDistributedResource,
} from '../../../utils/resource';
import * as selectors from '../../../reducers';
import { isIntegrationApp } from '../../../utils/flows';

function* getUIDataForResource({ resource, connection, flow }) {
  const { adaptorType, type, sampleData } = resource;
  const isDataLoader = type === 'simple';

  if (isBlobTypeResource(resource)) return getBlobResourceSampleData();

  // Incase of Data Loader/ Rest CSV Exports, flow is same as File Adaptors
  if (isRestCsvMediaTypeExport(resource, connection) || isDataLoader) return yield call(requestFileAdaptorSampleData, { resource });

  if (adaptorType) {
    switch (adaptorType) {
      case 'NetSuiteExport':
      case 'SalesforceExport':
        // Only incase of real time resources, this 'requestRealTimeMetadata' saga is called
        // Incase of other NS/SF exports -
        // Non IAs : pageProcessorPreview call fetches sampleData
        // IAs: If there is sampledata on resource, returns it as uiData below at line:60
        if (isRealTimeOrDistributedResource(resource)) return yield call(requestRealTimeMetadata, { resource });
        break;
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

  if (isIntegrationApp(flow) && sampleData) return sampleData;
}

export default function* getPreviewOptionsForResource({ resource, flow }) {
  const connection = yield select(
    selectors.resource,
    'connections',
    resource && resource._connectionId
  );
  const uiData = isUIDataExpectedForResource(resource, connection, flow)
    ? yield call(getUIDataForResource, { resource, connection, flow })
    : undefined;
  const postData = {
    lastExportDateTime: getLastExportDateTime(),
  };
  const { type } = resource;

  return type === 'delta' ? { uiData, postData } : { uiData };
}
