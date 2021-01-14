/*
 * All utility functions related to Exports Preview Panel
 */
import deepClone from 'lodash/cloneDeep';
import { adaptorTypeMap } from '../resource';
import { isJsonString } from '../string';
import { wrapExportFileSampleData } from '../sampleData';

export const DEFAULT_RECORD_SIZE = 1;

// Applications list which include Preview panel as part of the resource drawer

export const applicationsWithPreviewPanel = [
  'http',
  'rest',
  'mongodb',
  'rdbms',
  'dynamodb',
  'netsuite',
  'salesforce',
  'ftp',
  's3',
  'simple',
  'as2',
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
  const { adaptorType } = resource || {};
  const appType = adaptorTypeMap[adaptorType];

  // Handles File based preview stage
  const fileAdaptorAppTypes = ['ftp', 's3', 'as2'];

  if (isDataLoader || isRestCsvExport || fileAdaptorAppTypes.includes(appType)) {
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
    case 'mongodb':
    case 'dynamodb':
    case 'rdbms':
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
export const isPreviewPanelAvailable = (resource, resourceType) => {
  if (resourceType !== 'exports') return false;

  // for blob exports, preview panel is not applicable
  if (resource.type === 'blob' || resource.resourceType === 'lookupFiles') {
    return false;
  }

  // Panel is shown for assistants
  if (resource && resource.assistant) return true;
  const { adaptorType } = resource || {};
  const appType = adaptorTypeMap[adaptorType];

  // If appType is not part of supported applications list, return false
  return applicationsWithPreviewPanel.includes(appType);
};

/*
 * Incase of Raw stage, previewData contains body which is a JSON string
 * Need to be parsed to show in Preview panel
 * Returns updated previewData
 */
const formatBodyForRawStage = previewData => {
  const formattedData = deepClone(previewData);

  // Assuming body previewData.data is an array
  if (
    formattedData &&
    formattedData.data &&
    Array.isArray(formattedData.data)
  ) {
    const { body } = formattedData.data[0] || {};

    if (body && isJsonString(body)) {
      formattedData.data[0].body = JSON.parse(body);
    }
  }

  return formattedData;
};

/*
 * Used by View layer to show the preview data
 */
export const getFormattedPreviewData = previewData => wrapExportFileSampleData(previewData?.data);

export const getPreviewDataPageSizeInfo = previewData => {
  if (!previewData || !previewData.data) return '1 Page, 0 Records';
  const records = previewData.data;
  const pageSize = Array.isArray(records) ? records.length : 1;

  if (pageSize === 1) {
    return '1 Page, 1 Record';
  }

  return `1 Page, ${pageSize} Records`;
};

/*
 * Gives template type based on the resourceType and panelType selected
 * Available template types are 'default' and 'tab'
 * Incase of Http/Rest resources with panel type 'request' and 'raw', the template type is 'tab'
 * For all others template type is 'default'
 * Other types can be added here
 */
export const getPreviewBodyTemplateType = (resource = {}, panelType) => {
  const appType = adaptorTypeMap[resource.adaptorType];

  if (
    ['http', 'rest'].includes(appType) &&
    ['request', 'raw'].includes(panelType)
  ) return 'tab';

  return 'default';
};

export const getBodyHeaderFieldsForPreviewData = (previewData = {}, stage) => {
  const parsedPreviewData =
    stage === 'raw' ? formatBodyForRawStage(previewData) : previewData;
  const bodyHeaderData = parsedPreviewData.data;
  const { headers, ...rest } = bodyHeaderData?.[0] || {};
  const { body, url, ...others} = rest || {};

  return {
    body,
    headers,
    others,
  };
};

export const getRequestURL = requestData => requestData?.data?.[0]?.url;

export const previewFileData = (previewData, recordSize) => {
  if (!previewData || !Array.isArray(previewData) || !recordSize || Number.isNaN(recordSize)) {
    return previewData;
  }

  // if preview data is an array
  return previewData.slice(0, recordSize);
};

export const getRecordSizeOptions = () => Array.from(Array(10), (val, index) => {
  const stringifiedValue = `${(index + 1) * 10}`;

  return { label: stringifiedValue, value: stringifiedValue};
});
