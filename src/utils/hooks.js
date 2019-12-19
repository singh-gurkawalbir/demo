import { difference, values } from 'lodash';
import {
  getResourceSubType,
  isRealTimeOrDistributedResource,
  adaptorTypeMap,
} from './resource';

export const importHooksList = [
  'preMap',
  'postMap',
  'postSubmit',
  'postAggregate',
];
export const importSuiteScriptHooksList = ['preMap', 'postMap', 'postSubmit'];

export const hooksToFunctionNamesMap = {
  preSavePage: 'preSavePageFunction',
  preMap: 'preMapFuncton',
  postMap: 'postMapFunction',
  postSubmit: 'postSubmitFunction',
  postAggregate: 'postAggregateFunction',
};

export const hooksLabelMap = {
  preSend: 'Pre Send',
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

export const isValidSuiteScriptHook = (value = {}) => {
  const { function: func, fileInternalId } = value;
  const isEmptyHook = !func && !fileInternalId;

  // accepts a hook if it is empty
  return isEmptyHook || (func && fileInternalId);
};

export const getHookType = (defaultValues = {}) => {
  const hooks = values(defaultValues);
  let defaultHookType = 'script';

  // consider one of the hooks to check for hook type based on script/stack ID
  if (hooks.length && hooks[0] && hooks[0]._stackId) {
    defaultHookType = 'stack';
  }

  return defaultHookType;
};

// For real time resources stacks are not shown
export const isStacksSupportedForResource = (resource, resourceType) =>
  !isRealTimeOrDistributedResource(resource, resourceType);

export const isSuiteScriptHooksSupportedForResource = (
  resource,
  resourceType
) => {
  const { adaptorType, netsuite = {} } = resource || {};

  // Invalid for resources other than 'Netsuite'
  if (adaptorTypeMap[adaptorType] !== 'netsuite') return false;

  // Invalid for Web services NS type
  if (resourceType === 'exports' && netsuite.type === 'search') return false;

  return true;
};

export const getSelectedHooksPatchSet = (selectedHooks, resource) => {
  const { hooks, suiteScriptHooks } = selectedHooks;
  const patchSet = [{ op: 'replace', path: '/hooks', value: hooks }];

  if (isSuiteScriptHooksSupportedForResource(resource)) {
    // Sample Paths for NS Export is : netsuite/distributed/hooks incase of real time NS Export
    // Path for NS Import is : '/netsuite_da/hooks' as netsuite_da is the only sub doc for NS Import
    // eslint-disable-next-line camelcase
    const { netsuite, netsuite_da } = resource || {};
    const netsuiteType = netsuite && netsuite.type;
    // eslint-disable-next-line camelcase
    const path = netsuite_da
      ? '/netsuite_da/hooks'
      : `/netsuite/${netsuiteType}/hooks`;

    patchSet.push({
      op: 'replace',
      path,
      value: suiteScriptHooks,
    });
  }

  return patchSet;
};

export const getDefaultValuesForHooks = resource => {
  if (!resource) return {};
  const defaultValues = {
    hooks: resource.hooks || {},
  };

  if (isSuiteScriptHooksSupportedForResource(resource)) {
    // netsuite prop for NS Export and netsuite_da prop incase of NS Import
    const { netsuite, netsuite_da: netsuiteImport } = resource || {};
    const netsuiteType = netsuite && netsuite.type;

    // Checks for NS Export netsuite prop , extracts hooks from that. Else checks in netsuiteImport ( netsuite_da ) prop for NS Import
    defaultValues.suiteScriptHooks = netsuite
      ? netsuite && netsuite[netsuiteType] && netsuite[netsuiteType].hooks
      : netsuiteImport && netsuiteImport.hooks;
    defaultValues.suiteScriptHooks = defaultValues.suiteScriptHooks || {};
  }

  return defaultValues;
};
