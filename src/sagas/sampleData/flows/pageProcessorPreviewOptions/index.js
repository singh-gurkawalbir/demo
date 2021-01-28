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
} from '../../../../utils/flowData';
import requestRealTimeMetadata from '../../sampleDataGenerator/realTimeSampleData';
import requestFileAdaptorSampleData from '../../sampleDataGenerator/fileAdaptorSampleData';
import {
  isBlobTypeResource,
  isRestCsvMediaTypeExport,
  isRealTimeOrDistributedResource,
  isFileProviderAssistant,
} from '../../../../utils/resource';
import { selectors } from '../../../../reducers';
import { isIntegrationApp } from '../../../../utils/flows';
import { EMPTY_RAW_DATA } from '../../../../utils/constants';

export function* _getUIDataForResource({ resource, connection, flow, refresh }) {
  const { adaptorType, type, sampleData } = resource || {};
  const isDataLoader = type === 'simple';

  if (isBlobTypeResource(resource)) return getBlobResourceSampleData();

  // Incase of Data Loader/ Rest CSV Exports, flow is same as File Adaptors
  if (isRestCsvMediaTypeExport(resource, connection) || isDataLoader || isFileProviderAssistant(resource, connection)) return yield call(requestFileAdaptorSampleData, { resource });

  if (adaptorType) {
    switch (adaptorType) {
      case 'NetSuiteExport':
      case 'SalesforceExport':
        // Only incase of real time resources, this 'requestRealTimeMetadata' saga is called
        // Incase of other NS/SF exports -
        // Non IAs : pageProcessorPreview call fetches sampleData
        // IAs: If there is sampledata on resource, returns it as uiData below at line:60
        if (isRealTimeOrDistributedResource(resource)) return yield call(requestRealTimeMetadata, { resource, refresh });
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

  // if not hard refresh, then send sample data stored on resource, otherwise let preview handle it.
  if (isIntegrationApp(flow) && sampleData && !refresh) return sampleData;
}

export default function* getPreviewOptionsForResource({ resource, flow, refresh, runOffline }) {
  const connection = yield select(
    selectors.resource,
    'connections',
    resource?._connectionId
  );

  const uiData = isUIDataExpectedForResource(resource, connection)
    ? yield call(_getUIDataForResource, { resource, connection, flow, refresh })
    : undefined;
  const postData = {
    lastExportDateTime: getLastExportDateTime(),
  };
  const { type, rawData } = resource || {};

  // check for raw data on resource
  // skip runOffline in case of hard refresh
  if (!refresh && runOffline && rawData && rawData !== EMPTY_RAW_DATA) {
    const runOfflineOptions = {
      runOffline: true,
      runOfflineSource: 'db',
    };

    return type === 'delta' ? { runOfflineOptions, postData } : { runOfflineOptions };
  }

  return type === 'delta' ? { uiData, postData } : { uiData };
}
