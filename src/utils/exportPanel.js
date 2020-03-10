/*
 * All utility functions related to Exports Preview Panel
 */
import deepClone from 'lodash/cloneDeep';
import { adaptorTypeMap } from './resource';
import { isJsonString } from './string';

// Applications list which include Preview panel as part of the resource drawer

const applicationsWithPreviewPanel = [
  'http',
  'rest',
  'mongodb',
  'rdbms',
  'dynamodb',
];
const emptyList = [];

export const getAvailablePreviewStages = resource => {
  const { adaptorType } = resource || {};
  const appType = adaptorTypeMap[adaptorType];

  if (!appType) return emptyList;

  switch (appType) {
    case 'http':
      return [
        { label: 'HTTP request', value: 'request' },
        { label: 'HTTP response', value: 'raw' },
        { label: 'Output', value: 'parse' },
      ];
    case 'netsuite':
      return [{ label: 'Parsed Output', value: 'parse' }];
    case 'rest':
      return [
        { label: 'HTTP request', value: 'request' },
        { label: 'HTTP response', value: 'raw' },
        { label: 'Parsed Output', value: 'parse' },
      ];
    case 'ftp':
      return [
        { label: 'Raw', value: 'raw' },
        { label: 'Parsed Output', value: 'parse' },
      ];
    case 'mongodb':
    case 'dynamodb':
    case 'rdbms':
      return [{ label: 'Parsed Output', value: 'parse' }];
    default:
      return emptyList;
  }
};

/*
 * This fn return true for all applications that support Preview Panel
 * List of supported applications are in applicationsWithPreviewPanel above
 * Currently we support only Exports as it is an Incremental release
 */
export const isPreviewPanelAvailable = (resource, resourceType, connection) => {
  if (resourceType !== 'exports') return false;

  // Panel is shown for assistants
  if (resource && resource.assistant) return true;
  const { adaptorType } = resource || {};
  const appType = adaptorTypeMap[adaptorType];

  // If appType is not part of supported applications list, return false
  if (!applicationsWithPreviewPanel.includes(appType)) {
    return false;
  }

  // In rest 'csv' media type export is not supported
  if (
    appType === 'rest' &&
    connection &&
    connection.rest &&
    connection.rest.mediaType === 'csv'
  ) {
    return false;
  }

  // Other than rest 'csv' type all are supported , so return true
  return true;
};

const formatPreviewData = records => {
  // eslint-disable-next-line camelcase
  const page_of_records = [];

  if (!records) return { page_of_records };

  if (Array.isArray(records)) {
    records.forEach(record => page_of_records.push({ record }));
  } else {
    page_of_records.push({ record: records });
  }

  return { page_of_records };
};

const formatBodyForRawStage = previewData => {
  const formattedData = deepClone(previewData);

  if (formattedData && formattedData.data) {
    if (formattedData.data.body && isJsonString(formattedData.data.body)) {
      // eslint-disable-next-line no-param-reassign
      formattedData.data.body = JSON.parse(formattedData.data.body);
    }
  }

  return formattedData;
};

export const getStringifiedPreviewData = (previewData, stage) => {
  // stage specific formatting is done here
  let formattedPreviewData;

  if (stage === 'raw') {
    formattedPreviewData = formatBodyForRawStage(previewData);
  }

  formattedPreviewData = formatPreviewData(previewData && previewData.data);

  return JSON.stringify(formattedPreviewData, null, 2);
};

export const getPreviewDataPageSizeInfo = previewData => {
  if (!previewData || !previewData.data) return '1 Page 0 Records';
  const records = previewData.data;
  const pageSize = Array.isArray(records) ? records.length : 1;

  if (pageSize === 1) {
    return '1 Page 1 Record';
  }

  return `1 Page ${pageSize} Records`;
};

export const getPanelType = (resource = {}, panelType) => {
  // Incase of http/rest for panel type req, response type is tab
  // For all others it is default
  // Many more can come
  const appType = adaptorTypeMap[resource.adaptorType];

  if (
    ['http', 'rest'].includes(appType) &&
    ['request', 'raw'].includes(panelType)
  )
    return 'tab';

  return 'default';
};

export const getBodyHeaderFieldsForPreviewData = (previewData = {}, stage) => {
  const parsedPreviewData =
    stage === 'raw' ? formatBodyForRawStage(previewData) : previewData;
  const bodyHeaderData = parsedPreviewData.data;
  const { headers, ...rest } = bodyHeaderData;

  return {
    body: JSON.stringify(rest, null, 2),
    header: JSON.stringify(headers, null, 2),
  };
};
