import { adaptorTypeMap } from './resource';

/*
 * All utility functions related to Exports panel
 */
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

export const test = {};
