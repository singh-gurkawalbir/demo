import { difference } from 'lodash';
import { getResourceSubType } from './resource';

export const importHooksList = [
  'preMap',
  'postMap',
  'postSubmit',
  'postAggregate',
];

export const hooksLabelMap = {
  preMap: 'Pre Map',
  postMap: 'Post Map',
  postSubmit: 'Post Submit',
  postAggregate: 'Post Aggregate',
};
export function getSupportedHooksForResource(resource) {
  let unSupportedHooks = [];
  const { type: applicationId } = getResourceSubType(resource);

  switch (applicationId) {
    case 'postgresql':
    case 'mysql':
    case 'mssql':
    case 'mongodb':
      unSupportedHooks = [];
      break;
    case 'ftp':
    case 'as2':
    case 's3':
      unSupportedHooks = [];
      break;
    case 'netsuite':
      unSupportedHooks = ['postMap', 'postAggregate'];
      break;
    case 'rest':
    case 'http':
    case 'salesforce':
      unSupportedHooks = ['postAggregate'];
      break;
    default:
      unSupportedHooks = ['postAggregate'];
      break;
  }

  return difference(importHooksList, unSupportedHooks);
}

export const isValidHook = (value = {}) => {
  const { function: func, _scriptId, _stackId } = value;
  const isEmptyHook = !func && !(_scriptId || _stackId);

  // accepts a hook if it is empty
  return isEmptyHook || (func && (_scriptId || _stackId));
};
