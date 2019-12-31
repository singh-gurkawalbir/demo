import { adaptorTypeMap } from './resource';

/*
 * All utility functions related to Exports panel
 */

// Applications list which include Preview panel as part of the resource drawer
const applicationsWithPreviewPanel = ['http', 'netsuite'];
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
      return [
        { label: 'HTTP response', value: 'raw' },
        { label: 'Parsed', value: 'parse' },
      ];
    default:
      return emptyList;
  }
};

/*
 * This fn return true for all applications that support Preview Panel
 * List of supported applications are in applicationsWithPreviewPanel above
 * Currently we support only Exports as it is an Incremental release
 */
export const isPreviewPanelAvailable = (resource, resourceType) => {
  if (resourceType !== 'exports') return false;
  const { adaptorType } = resource || {};
  const appType = adaptorTypeMap[adaptorType];

  return applicationsWithPreviewPanel.indexOf(appType) !== -1;
};
