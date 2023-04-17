/*
 * All utility functions related to Exports Preview Panel
 */
import isEmpty from 'lodash/isEmpty';
import { FILE_PROVIDER_ASSISTANTS } from '../../constants';
import { adaptorTypeMap } from '../resource';
import {HTTP_BASED_ADAPTORS} from '../http';
import { wrapExportFileSampleData } from '../sampleData';

export const DEFAULT_RECORD_SIZE = 10;

// Applications list which include Preview panel as part of the resource drawer

const applicationsWithPreviewPanel = [
  'http',
  'graph_ql',
  'rest',
  'mongodb',
  'rdbms',
  'jdbc',
  'dynamodb',
  'netsuite',
  'salesforce',
  'ftp',
  's3',
  'simple',
  'as2',
  'van',
];

const emptyList = [];

export const HTTP_STAGES = [
  { label: 'HTTP request', value: 'request' },
  { label: 'HTTP response', value: 'raw' },
  { label: 'Parsed output', value: 'preview' },
];

Object.freeze(HTTP_STAGES);
export const PREVIEW_STAGE = [{ label: 'Parsed output', value: 'preview' }];

Object.freeze(PREVIEW_STAGE);
export const getAvailablePreviewStages = (resource, { isDataLoader, isRestCsvExport }) => {
  const { adaptorType, assistant } = resource || {};
  const appType = adaptorTypeMap[adaptorType];

  // Handles File based preview stage
  const fileAdaptorAppTypes = ['ftp', 's3', 'as2', 'van'];

  if (isDataLoader || isRestCsvExport || fileAdaptorAppTypes.includes(appType) || FILE_PROVIDER_ASSISTANTS.includes(assistant)) {
    return PREVIEW_STAGE;
  }

  if (!appType) return emptyList;

  switch (appType) {
    case 'http':
      return HTTP_STAGES;
    case 'netsuite':
    case 'salesforce':
      return PREVIEW_STAGE;
    case 'rest':
      return HTTP_STAGES;
    case 'graph_ql':
      return HTTP_STAGES;
    case 'mongodb':
    case 'dynamodb':
    case 'rdbms':
      return PREVIEW_STAGE;
    case 'jdbc':
      return PREVIEW_STAGE;
    default:
      return emptyList;
  }
};

/*
 * This fn return true for all applications that support Preview Panel
 * List of supported applications are in applicationsWithPreviewPanel above
 * Currently we support only Exports as it is an Incremental release
 * @params - resource , resourceType and connection obj
 */
export const isPreviewPanelAvailable = (resource, resourceType, connection) => {
  if (!resource) return false;
  if (resourceType === 'imports') {
    if (FILE_PROVIDER_ASSISTANTS.includes(resource.assistant)) return false;

    return resource.adaptorType === 'HTTPImport' ||
    (connection && HTTP_BASED_ADAPTORS.includes(connection.type || connection.http?.formType));
  }

  if (resourceType !== 'exports') return false;

  // for blob exports, preview panel is not applicable
  if (resource.type === 'blob' || resource.file?.output === 'blobKeys' || resource.resourceType === 'lookupFiles') {
    return false;
  }

  // Panel is shown for assistants
  if (resource && resource.assistant) return true;
  const { adaptorType } = resource || {};
  const appType = adaptorTypeMap[adaptorType];

  // If appType is not part of supported applications list, return false
  return applicationsWithPreviewPanel.includes(appType);
};

export const getPreviewDataPageSizeLength = (previewData, resourceType) => {
  if (resourceType === 'imports') return 1;
  if (!previewData || isEmpty(previewData.data)) return 0;
  const records = previewData.data;
  const pageSize = Array.isArray(records) ? records.length : 1;

  return pageSize;
};

export const getPreviewDataPageSizeInfo = (previewData, resourceType) =>
  `1 Page, ${getPreviewDataPageSizeLength(previewData, resourceType)} ${getPreviewDataPageSizeLength(previewData, resourceType) === 1 ? 'Record' : 'Records'}`;

export const previewFileData = (previewData, recordSize) => {
  if (!previewData || !Array.isArray(previewData) || !recordSize || Number.isNaN(recordSize)) {
    return previewData;
  }

  // if preview data is an array
  return previewData.slice(0, recordSize);
};

export const getParsedData = (resourceType, previewStageDataList, numRecords) => {
  if (!previewStageDataList) return;
  let previewData = previewStageDataList.preview?.data;

  if (numRecords && previewData) {
    previewData = previewData.slice(0, numRecords);
  }

  return resourceType === 'imports' ? previewData : wrapExportFileSampleData(previewData);
};

export const getLatestReqResData = (previewData, stage) => {
  const reqResData = previewData?.[stage]?.data;

  if (Array.isArray(reqResData) && reqResData.length) {
    // Incase of series of requests or responses, we need to show the latest(final) one to the user
    // That will be  the last item in the reqResData
    return reqResData[reqResData.length - 1];
  }
};

export const getRequestURL = previewData => getLatestReqResData(previewData, 'request')?.url;
export const getDecodedURL = url => {
  if (!url) return;

  let decodedUrl;

  try {
    decodedUrl = decodeURIComponent(url);
  } catch (e) {
    // console.log(e);
  }

  return decodedUrl;
};

export const IMPORT_PREVIEW_ERROR_TYPES = [
  { label: 'Preview', value: 'preview' },
  { label: 'Send', value: 'send' },
];
