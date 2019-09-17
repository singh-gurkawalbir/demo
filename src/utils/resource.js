import getRoutePath from './routePaths';
import { RESOURCE_TYPE_SINGULAR_TO_PLURAL } from '../constants/resource';

export const MODEL_PLURAL_TO_LABEL = Object.freeze({
  agents: 'Agent',
  accesstokens: 'API Token',
  asynchelpers: 'Async Helper',
  connections: 'Connection',
  connectors: 'Connector',
  exports: 'Export',
  filedefinitions: 'File Definition',
  flows: 'Flow',
  iclients: 'IClient',
  imports: 'Import',
  integrations: 'Integration',
  scripts: 'Script',
  stacks: 'Stack',
});

/**
 * @param resourceDetails Details about the resource.
 * @param resourceDetails.type The type of the resource.
 * @param resourceDetails.id The id of the resource.
 * @param resourceDetails._integrationId _integrationId of the resource.
 */
export default function getExistingResourcePagePath(resourceDetails = {}) {
  let { type } = resourceDetails;
  const { id, _integrationId } = resourceDetails;
  let path;

  if (type) {
    if (RESOURCE_TYPE_SINGULAR_TO_PLURAL[type]) {
      type = RESOURCE_TYPE_SINGULAR_TO_PLURAL[type];
    }

    const routeMap = {
      accesstokens: 'tokens',
    };

    switch (type) {
      case 'exports':
      case 'imports':
      case 'stacks':
        path = `/${type}/${id}/edit`;
        break;

      case 'accesstokens':
      case 'connections':
        path = `/${routeMap[type] || type}?_id=${id}`;
        break;

      case 'flows':
        path = `/integrations/${_integrationId ||
          'none'}/settings/${type}/${id}/edit`;
        break;

      case 'integrations':
        path = `/${type}/${id}/settings/flows`;
        break;

      default:
        path = undefined;
    }
  }

  return getRoutePath(path);
}

export const adaptorTypeMap = {
  NetSuiteExport: 'netsuite',
  NetSuiteImport: 'netsuite',
  XMLImport: 'xml',
  XMLExport: 'xml',
  FTPExport: 'ftp',
  FTPImport: 'ftp',
  HTTPExport: 'http',
  HTTPImport: 'http',
  RESTImport: 'rest',
  RESTExport: 'rest',
  S3Export: 's3',
  RDBMSExport: 'rdbms',
  MongodbExport: 'mongodb',
  WrapperExport: 'wrapper',
  AS2Export: 'as2',
  MongodbImport: 'mongodb',
  S3Import: 's3',
  WrapperImport: 'wrapper',
  AS2Import: 'as2',
  RDBMSImport: 'rdbms',

  SalesforceExport: 'salesforce',
};

const inferResourceType = adaptorType => {
  if (!adaptorType) return 'connections';

  if (adaptorType.toLowerCase().indexOf('import') > 0) {
    return 'imports';
  }

  return 'exports';
};

// This method is used for only import/export/connection. Im not sure
// what to call this "class" of resource. It could be confusing to simply
// all this method "getResourceType"
export function getResourceSubType(resource) {
  if (!resource) return {};

  const { adaptorType, assistant, type } = resource;

  // Since this function is intended to be used for only imp/exp/conn,
  // we should have an adaptorType(imp/exp) or type for connection...
  // if not, we cant proceed.
  if (!adaptorType && !type) return {};

  return {
    type: adaptorTypeMap[adaptorType] || type,
    assistant,
    resourceType: inferResourceType(adaptorType),
  };
}

// fn to consolidate this simple expression in case we ever
// change how we identify new resources..
export const isNewId = id => id && id.startsWith('new');
