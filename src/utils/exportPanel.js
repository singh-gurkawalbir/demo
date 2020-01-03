/*
 * All utility functions related to Exports Preview Panel
 */

import { adaptorTypeMap } from './resource';

// Applications list which include Preview panel as part of the resource drawer
const applicationsWithPreviewPanel = ['http', 'rest', 'Mongodb', 'rdbms'];
const emptyList = [];

export const getAvailablePreviewStages = resource => {
  const { adaptorType } = resource || {};
  const appType = adaptorTypeMap[adaptorType];

  if (!appType) return emptyList;

  switch (appType) {
    case 'http':
      return [
        // { label: 'HTTP request', value: 'request' },
        { label: 'HTTP response', value: 'raw' },
        { label: 'Output', value: 'parse' },
      ];
    case 'netsuite':
      return [{ label: 'Parsed Output', value: 'parse' }];
    case 'rest':
      return [{ label: 'Parsed Output', value: 'parse' }];
    case 'ftp':
      return [
        { label: 'Raw', value: 'raw' },
        { label: 'Parsed Output', value: 'parse' },
      ];
    case 'mongodb':
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
export const isPreviewPanelAvailable = (resource, resourceType) => {
  if (resourceType !== 'exports') return false;
  const { adaptorType } = resource || {};
  const appType = adaptorTypeMap[adaptorType];

  return applicationsWithPreviewPanel.includes(appType);
};
