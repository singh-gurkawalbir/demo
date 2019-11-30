/*
 * Creating this file to support
 * 1.Existing flows
 * 2.Realtime Exports as PG in the new Flows
 * TODO:
 * 1. FTP, NS, SF, Webhook
 * 2. All exports which has sample data field inside resource object
 * Clues:
 * 1. FTP - sampleData process and send
 * 2. NS - fetch from state/call and process
 * 3. SF - fetch from state/call and process
 * 4. Webhook - return sampleData
 * Other places to change:
 * 1. FTP - on save click , save on sampleData field the way old exports are getting saved
 * 2. Add webhooks sample data field functionality
 */
import { call } from 'redux-saga/effects';
import {
  getLastExportDateTime,
  isUIDataExpectedForResource,
} from '../../../utils/flowData';
import requestRealTimeMetadata from '../realTimeMetadataUpdates';

function* getUIDataForResource({ resource }) {
  const { adaptorType, sampleData } = resource;

  if (adaptorType) {
    switch (adaptorType) {
      case 'NetSuiteExport': {
        return yield call(requestRealTimeMetadata, { resource });
      }

      case 'WebhookExport': {
        // Sample data exists on resource
        // TODO: @Raghu Add webhooks form field sample data feature
        return sampleData;
      }

      default:
    }
  }
}

export default function* getPreviewOptionsForResource({ resource }) {
  const uiData = isUIDataExpectedForResource(resource)
    ? yield call(getUIDataForResource, { resource })
    : {};
  const postData = {
    lastExportDateTime: getLastExportDateTime(),
  };
  const { type } = resource;

  return type === 'delta' ? { uiData, postData } : { uiData };
}
