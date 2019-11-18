import { values } from 'lodash';
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
  templates: 'Template',
  connectorLicenses: 'License',
  pageGenerator: 'Page generator',
  pageProcessor: 'Page processor',
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
        path = `/${type}/edit/${type}/${id}`;
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
        path = `/${type}/${id}/flows`;
        break;

      default:
        path = undefined;
    }
  }

  return getRoutePath(path);
}

export const appTypeToAdaptorType = {
  salesforce: 'Salesforce',
  mongodb: 'Mongodb',
  postgresql: 'RDBMS',
  mysql: 'RDBMS',
  mssql: 'RDBMS',
  netsuite: 'NetSuite',
  ftp: 'FTP',
  http: 'HTTP',
  rest: 'REST',
  s3: 'S3',
  wrapper: 'Wrapper',
  as2: 'AS2',
  webhook: 'Webhook',
};

export const adaptorTypeMap = {
  NetSuiteExport: 'netsuite',
  NetSuiteImport: 'netsuite',
  NetSuiteDistributedImport: 'netsuite',
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
  SalesforceImport: 'salesforce',
  SalesforceExport: 'salesforce',
  WebhookExport: 'webhook',
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

export function getResourceSubTypeFromAdaptorType(adaptorType) {
  return {
    type: adaptorTypeMap[adaptorType],
    resourceType: inferResourceType(adaptorType),
  };
}

// fn to consolidate this simple expression in case we ever
// change how we identify new resources..
export const isNewId = id => id && id.startsWith('new');

export const getDomain = () =>
  window.document.location.hostname.replace('www.', '');

export const getDomainUrl = () => {
  const domain = getDomain();

  if (domain === 'localhost.io') {
    return `http://${window.document.location.host}`;
  }

  return `https://${domain}`;
};

export const getApiUrl = () => getDomainUrl().replace('://', '://api.');

export const getWebhookUrl = (formValues, resourceId) => {
  let whURL = '';

  if (resourceId) {
    whURL = `${getApiUrl()}/v1/exports/`;
    whURL = whURL.concat(resourceId);
    const provider = formValues['/webhook/provider'];

    if (
      [
        'activecampaign',
        'aha',
        'box',
        'intercom',
        'jira',
        'mailchimp',
        'pagerduty',
        'postmark',
        'recurly',
        'segment',
        'stripe',
        'mailparser-io',
        'parseur',
        'custom',
        'sapariba',
      ].indexOf(provider) > -1
    ) {
      whURL += `/${formValues['/webhook/token']}`;
    }

    whURL += '/data';
  }

  return whURL;
};

/*
 * Returns Boolean
 * checks whether passed scriptId is present in hooks of passed Resource (Export/Import))
 */
export const isScriptIdUsedInResource = (resource, scriptId) => {
  if (!scriptId) return false;
  const { hooks = {} } = resource || {};
  const selectedHooks = values(hooks);

  return !!selectedHooks.find(hook => hook._scriptId === scriptId);
};

/*
 * Returns Boolean
 * checks whether passed FileDefinitionID is present in passed Resource (Export/Import))
 */
export const isFileDefinitionIdUsedInResource = (
  resource,
  fileDefinitionId
) => {
  if (!fileDefinitionId) return false;
  const { file = {} } = resource || {};

  return !!(
    file.fileDefinition &&
    file.fileDefinition._fileDefinitionId === fileDefinitionId
  );
};

/*
 * Checks for resourceReferenceId inside resource
 * resource can be Export/ Import
 * resourceReferenceType be Scripts/ FileDefs
 * resourceReferenceType: Page Processors / Page Generators used incase of flow context
 * resourceReferenceId: ID of the resourceReferenceType ( ScriptId/FileDefID/exportId/importId)
 */
export function isValidResourceReference(
  resource,
  resourceId,
  resourceReferenceType,
  resourceReferenceId
) {
  switch (resourceReferenceType) {
    case 'scripts':
      return isScriptIdUsedInResource(resource, resourceReferenceId);
    case 'filedefinitions':
      return isFileDefinitionIdUsedInResource(resource, resourceReferenceId);
    case 'exports':
    case 'imports':
      return resourceId === resourceReferenceId;
    default:
  }
}

export function salesforceExportSelectOptions(data, fieldName) {
  let options;

  switch (fieldName) {
    case 'deltaExportDateFields':
      options = data.filter(f => ['datetime', 'date'].indexOf(f.type) > -1);
      break;
    case 'onceExportBooleanFields':
      options = data.filter(f => f.type === 'boolean' && f.updateable);
      break;
    case 'externalIdFields':
      options = data.filter(f => f.externalId || f.name === 'Id');
      break;
    case 'referenceFields':
      options = data.filter(f => f.referenceTo.length !== 0);
      break;
    default:
      options = data;
  }

  return options.map(op => ({ label: op.label, value: op.value }));
}

/*
 * Given a resource, returns true if it is File Export
 * FTP / S3 / DataLoader
 */
export function isFileExport(resource) {
  if (!resource) return false;

  return resource.adaptorType
    ? ['ftp', 's3'].includes(adaptorTypeMap[resource.adaptorType])
    : resource.type === 'simple';
}
