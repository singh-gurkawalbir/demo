import { difference, values } from 'lodash';
import {
  getResourceSubType,
  isRealTimeOrDistributedResource,
  adaptorTypeMap,
} from './resource';
import scriptHookStubs from './scriptHookStubs';

export const importHooksList = [
  'preMap',
  'postMap',
  'postSubmit',
  'postAggregate',
];

const externalScripts = ['transform', 'filter', 'handleRequest', 'router', 'formInit'];
/*
 * Used for showing suggestions to select hook type in the application
 */
export const hooksList = [
  'preSavePage' /* Used for Exports */,
  ...importHooksList,
  'contentBasedFlowRouter' /* Used in AS2 Connection */,
  ...externalScripts, /* Used in transformation and filters Scripts */
];

export const getImportSuiteScriptHooksList = isNSApiVersion2Selected => {
  const importSuiteScriptHooksList = ['postMap', 'postSubmit'];

  if (!isNSApiVersion2Selected) {
    importSuiteScriptHooksList.unshift('preMap');
  }

  return importSuiteScriptHooksList;
};

export const hooksToFunctionNamesMap = {
  preSavePage: 'preSavePage',
  preMap: 'preMap',
  postMap: 'postMap',
  postSubmit: 'postSubmit',
  postAggregate: 'postAggregate',
  postResponseMap: 'postResponseMap',
  contentBasedFlowRouter: 'contentBasedFlowRouter',
  transform: 'transform',
  filter: 'filter',
  handleRequest: 'handleRequest',
  formInit: 'formInit',
  router: 'branching',
};

export const hooksToHelpKeyMap = {
  preSavePage: 'export.hooks.preSavePage',
  preMap: 'import.hooks.preMap',
  postMap: 'import.hooks.postMap',
  postSubmit: 'import.hooks.postSubmit',
  postAggregate: 'import.hooks.postAggregate',
  postResponseMap: 'import.hooks.postResponseMap',
};

export const getScriptHookStub = hook => scriptHookStubs[hook];

export const hooksLabelMap = {
  preSavePage: 'Pre save page',
  preSend: 'Pre send',
  preMap: 'Pre map',
  postMap: 'Post map',
  postSubmit: 'Post submit',
  postAggregate: 'Post aggregate',
  postResponseMap: 'Post response map',
  contentBasedFlowRouter: 'Content based flow router',
  transform: 'Transform',
  filter: 'Filter',
  formInit: 'Form init',
  handleRequest: 'Handle request',
  router: 'Branching',
};
export function getSupportedHooksForResource(resource) {
  let unSupportedHooks = [];
  const { type: applicationId } = getResourceSubType(resource);

  switch (applicationId) {
    case 'postgresql':
    case 'mysql':
    case 'mssql':
    case 'oracle':
    case 'snowflake':
    case 'mongodb':
    case 'bigquerydatawarehouse':
    case 'redshiftdatawarehouse':
      unSupportedHooks = [];
      break;
    case 'ftp':
    case 'as2':
    case 'van':
    case 's3':
      unSupportedHooks = [];
      break;
    case 'netsuite':
      unSupportedHooks = ['postAggregate'];
      if (['suiteapp1.0', 'suitebundle'].includes(resource?.netsuite_da?.restletVersion) || !resource.netsuite_da?.useSS2Restlets) { // eslint-disable-line camelcase
        unSupportedHooks.push('postMap');
      }
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
  return !!(isEmptyHook || (func && (_scriptId || _stackId)));
};

export const isValidSuiteScriptHook = (value = {}) => {
  const { function: func, fileInternalId } = value;
  const isEmptyHook = !func && !fileInternalId;

  // accepts a hook if it is empty
  return !!(isEmptyHook || (func && fileInternalId));
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

export const getSelectedHooksPatchSet = (selectedHooks, resource, resourceType) => {
  const { hooks, suiteScriptHooks } = selectedHooks;
  const patchSet = [{ op: 'replace', path: '/hooks', value: hooks }];

  if (isSuiteScriptHooksSupportedForResource(resource, resourceType)) {
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
