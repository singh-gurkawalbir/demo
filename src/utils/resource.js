import { values, keyBy } from 'lodash';
import parseLinkHeader from 'parse-link-header';
import { generateId } from './string';
import { getAllPageProcessors, isPageGeneratorResource } from './flows';
import { USER_ACCESS_LEVELS, HELP_CENTER_BASE_URL, HELP_CENTER_BASE_URL_WITH_SIGN_IN, INTEGRATION_ACCESS_LEVELS, emptyList, emptyObject } from '../constants';
import { stringCompare } from './sort';
import { message } from './messageStore';
import customCloneDeep from './customCloneDeep';
import { applicationsList } from '../constants/applications';

export const UI_FIELDS = ['mockOutput', 'mockResponse'];
export const RESOURCES_WITH_UI_FIELDS = ['exports', 'imports'];
// accumulates all the UI fields from the resource
export const fetchUIFields = (resource = {}) =>
  UI_FIELDS.reduce((uiFields, field) => ({ ...uiFields, [field]: resource[field] }), {});

export const resourceWithoutUIFields = resource => {
  if (!resource || typeof resource !== 'object') return resource;

  return Object.keys(resource).reduce((acc, key) => {
    if (!UI_FIELDS.includes(key)) acc[key] = resource[key];

    return acc;
  }, {});
};

export const MODEL_PLURAL_TO_LABEL = Object.freeze({
  agents: 'Agent',
  accesstokens: 'API token',
  asyncHelpers: 'Async helper',
  connections: 'Connection',
  connectors: 'Integration app',
  exports: 'Export',
  filedefinitions: 'File definition',
  flows: 'Flow',
  iClients: 'iClient',
  imports: 'Import',
  integrations: 'Integration',
  scripts: 'Script',
  stacks: 'Stack',
  templates: 'Template',
  connectorLicenses: 'License',
  pageGenerator: 'Source',
  pageProcessor: 'Destination / lookup',
  apis: 'My API',
  eventreports: 'Event Report',
  users: 'User',
});

export const convertResourceLabelToLowercase = resourceLabel => {
  if (resourceLabel === 'iClient') return 'iClient';

  return resourceLabel.toLowerCase();
};
export const appTypeToAdaptorType = {
  salesforce: 'Salesforce',
  mongodb: 'Mongodb',
  postgresql: 'RDBMS',
  mysql: 'RDBMS',
  mssql: 'RDBMS',
  oracle: 'RDBMS',
  snowflake: 'RDBMS',
  bigquerydatawarehouse: 'RDBMS',
  redshiftdatawarehouse: 'RDBMS',
  netsuite: 'NetSuite',
  ftp: 'FTP',
  http: 'HTTP',
  rest: 'REST',
  s3: 'S3',
  wrapper: 'Wrapper',
  as2: 'AS2',
  webhook: 'Webhook',
  dynamodb: 'Dynamodb',
  graph_ql: 'GraphQL',
  van: 'VAN',
  netsuitejdbc: 'JDBC',
};

// the methods rdbmsSubTypeToAppType and rdbmsAppTypeToSubType are used to find rdbms subtype from the app.type of the application or vice-versa
export const rdbmsSubTypeToAppType = rdbmsSubType => {
  if (rdbmsSubType === 'bigquery') {
    return 'bigquerydatawarehouse';
  }

  if (rdbmsSubType === 'redshift') {
    return 'redshiftdatawarehouse';
  }

  return rdbmsSubType;
};

export const rdbmsAppTypeToSubType = appType => {
  if (appType === 'bigquerydatawarehouse') {
    return 'bigquery';
  }

  if (appType === 'redshiftdatawarehouse') {
    return 'redshift';
  }
  //

  return appType;
};

// should return correct resourceType for given notification audit log
export const getNotificationResourceType = auditLog => {
  if (auditLog.fieldChange?.fieldPath === '_connectionId') {
    return 'connections';
  }

  if (auditLog.fieldChange?.fieldPath === '_flowId') {
    return 'flows';
  }

  return 'integrations';
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
  GraphQLExport: 'graph_ql',
  GraphQLImport: 'graph_ql',
  S3Export: 's3',
  RDBMSExport: 'rdbms',
  MongodbExport: 'mongodb',
  WrapperExport: 'wrapper',
  AS2Export: 'as2',
  VANExport: 'van',
  MongodbImport: 'mongodb',
  S3Import: 's3',
  WrapperImport: 'wrapper',
  AS2Import: 'as2',
  VANImport: 'van',
  RDBMSImport: 'rdbms',
  SalesforceImport: 'salesforce',
  SalesforceExport: 'salesforce',
  WebhookExport: 'webhook',
  DynamodbImport: 'dynamodb',
  DynamodbExport: 'dynamodb',
  SimpleExport: 'file',
  JDBCExport: 'jdbc',
};

export const multiStepSaveResourceTypes = [
  'imports',
  'exports',
  'connections',
  'pageGenerator',
  'pageProcessor',
];

export const inferResourceType = adaptorType => {
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

  // Note that "simple" (data-loader) exports may or may not have an adaptorType,
  // but DO have a type prop with value "simple".
  let resourceType;

  if (type === 'simple') {
    resourceType = type;
  } else {
    resourceType = adaptorTypeMap[adaptorType] || type;
  }

  const out = {
    id: resource._id,
    type: resourceType,
    assistant,
    resourceType: inferResourceType(adaptorType),
  };

  if (resource.offline === true) out.offline = true;

  return out;
}

export function filterAndSortResources(resources = emptyList, config = emptyObject, skipSort = false, comparer) {
  if (!Array.isArray(resources)) {
    return emptyList;
  }
  const { sort = emptyObject, searchBy, keyword } = config || {};
  const stringTest = r => {
    if (!keyword) return true;

    if (r.searchKey) {
      return r.searchKey.toUpperCase().indexOf(keyword.toUpperCase()) >= 0;
    }
    const searchableText =
      Array.isArray(searchBy) && searchBy.length
        ? `${searchBy.map(key => r[key]).join('|')}`
        : `${r._id}|${r.name}|${r.description}`;

    return searchableText.toUpperCase().indexOf(keyword.toUpperCase()) >= 0;
  };

  const defaultComparer = ({ order = 'asc', orderBy = 'name' }) =>
    order === 'desc' ? stringCompare(orderBy, true) : stringCompare(orderBy);

  const comparerFn = comparer || defaultComparer;

  const filteredResources = resources.filter(stringTest);

  return skipSort ? filteredResources : filteredResources.sort(comparerFn(sort));
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

export const getApiUrl = () => {
  if (getDomain() === 'localhost.io' && process.env?.API_ENDPOINT) {
    return process.env.API_ENDPOINT.replace('://', '://api.');
  }

  return getDomainUrl().replace('://', '://api.');
};

export const getAS2Url = () => {
  const apiUrl = getApiUrl();

  return `${apiUrl.substr(apiUrl.indexOf('://'))}/v1/as2`;
};

const getMediaTypeFromContentTypeHeader = headersArray => {
  let mediaType = null;

  if (!Array.isArray(headersArray) || headersArray.length === 0) {
    return mediaType;
  }

  const lcHeaderName = 'content-type';

  // eslint-disable-next-line no-restricted-syntax
  for (const headerObj of headersArray) {
    const headerName = headerObj.name;
    let headerValue = headerObj.value;

    if (headerName && headerName.trim().toLowerCase() === lcHeaderName && headerValue) {
      headerValue = headerValue.trim();
      headerValue = headerValue.toLowerCase();
      if (headerValue === 'application/json') {
        mediaType = 'json';

        return mediaType;
      } if (headerValue === 'application/xml') {
        mediaType = 'xml';

        return mediaType;
      } if (headerValue === 'application/x-www-form-urlencoded') {
        mediaType = 'urlencoded';

        return mediaType;
      } if (headerValue === 'text/csv') {
        mediaType = 'csv';

        return mediaType;
      }
    }
  }

  return mediaType;
};

export const getMediaTypeForImport = (conn, headers = []) => {
  let reqMediaType = getMediaTypeFromContentTypeHeader(headers);

  if (!reqMediaType) {
    reqMediaType = getMediaTypeFromContentTypeHeader(conn?.rest?.headers || []);
    reqMediaType = reqMediaType || ((conn?.rest?.mediaType === 'urlencoded') ? 'urlencoded' : 'json');
  }

  return reqMediaType;
};

export const getWebhookUrl = (options = {}, resourceId) => {
  let whURL = '';
  const { webHookProvider, webHookToken, webHookVerify} = options;

  if (resourceId) {
    whURL = `${getApiUrl()}/v1/exports/`;
    whURL = whURL.concat(resourceId);

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
      ].indexOf(webHookProvider) > -1
    ) {
      if (webHookToken && (webHookVerify === 'secret_url' || !webHookVerify)) whURL += `/${webHookToken}`;
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

export const isSignUpAllowed = () => (getDomain() === 'eu.integrator.io' ? ALLOW_SIGNUP_EU : ALLOW_SIGNUP) === 'true';
export const isGoogleSignInAllowed = () => (getDomain() === 'eu.integrator.io' ? ALLOW_GOOGLE_SIGNIN_EU : ALLOW_GOOGLE_SIGNIN) === 'true';

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

export function salesforceExportSelectOptions(data, type) {
  let options;

  switch (type) {
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
      options = data.filter(f => f.referenceTo?.length > 0);
      break;
    default:
      options = data;
  }

  return options?.map(op => ({ label: op.label, value: op.value }));
}

/*
 * Given a resource, returns true if it is File Export / Import
 * FTP / S3 / DataLoader
 * Note: DataLoader has an adaptorType 'SimpleExport' added recently
 * Update this util once we make changes through out the application replacing type with adaptorType
 */
export function isFileAdaptor(resource) {
  if (!resource) return false;

  return (
    ['ftp', 's3'].includes(adaptorTypeMap[resource.adaptorType]) ||
      resource.type === 'simple' ||
      (adaptorTypeMap[resource.adaptorType] === 'http' && resource?.http?.type === 'file') ||
      (resource.adaptorType === 'HTTPExport' && !!resource?.http?.response?.fileURLPaths)
  );
}

export const generateNewId = () => `new-${generateId()}`;

export function isRealTimeOrDistributedResource(
  resource,
  resourceType = 'exports'
) {
  if (!resource) return false;
  const { type, adaptorType } = resource;

  // For Exports
  if (resourceType === 'exports') {
    return (
      ['distributed', 'webhook'].includes(type) ||
      adaptorTypeMap[adaptorType] === 'as2'
    );
  }

  // For Imports Nestuite and Salesforce are Distributed Imports
  // Update If added any later
  return ['netsuite', 'salesforce'].includes(adaptorTypeMap[adaptorType]);
}

export function resourceCategory(resource = {}, isLookup, isImport) {
  // eslint-disable-next-line no-nested-ternary
  let blockType = isImport ? 'import' : isLookup ? 'lookup' : 'export';

  if (!isImport && !isLookup) {
    blockType = isRealTimeOrDistributedResource(resource)
      ? 'listener'
      : 'export';
  }

  if (resource.adaptorType === 'SimpleExport') {
    blockType = 'dataLoader';
  }

  if (
    (['RESTExport', 'HTTPExport', 'NetSuiteExport', 'SalesforceExport'].indexOf(
      resource.adaptorType
    ) >= 0 &&
      resource.type === 'blob') ||
      (isFileAdaptor(resource) && resource.adaptorType?.includes('Export'))
  ) {
    blockType = 'exportTransfer';
  } else if (
    (['RESTImport', 'HTTPImport', 'NetSuiteImport', 'SalesforceImport'].indexOf(
      resource.adaptorType
    ) >= 0 &&
      resource.blob) ||
      (isFileAdaptor(resource) && resource.adaptorType?.includes('Import'))
  ) {
    blockType = 'importTransfer';
  }

  return blockType;
}

// All resources with type 'blob' is a Blob export and with blob as true are blob imports
export const isBlobTypeResource = (resource = {}) =>
  resource?.type === 'blob' || resource?.blob;

export const isAS2Resource = resource => {
  const { adaptorType } = resource || {};

  return ['as2', 'van'].includes(adaptorTypeMap[adaptorType]);
};

export const isRestCsvMediaTypeExport = (resource, connection) => {
  const { adaptorType } = resource || {};

  // Returns false if it is not a rest export
  if (adaptorTypeMap[adaptorType] !== 'rest') {
    return false;
  }

  // Check for media type 'csv' from connection object
  return connection && connection.rest && connection.rest.mediaType === 'csv';
};

export const isFlowResource = (flow, resourceId, resourceType) => {
  const pageProcessors = getAllPageProcessors(flow);

  // If resource type is imports search in pps
  if (resourceType === 'imports') {
    return !!pageProcessors.find(pp => pp._importId === resourceId);
  }

  // isPageGeneratorResource checks for pgs when resource type is exports
  if (isPageGeneratorResource(flow, resourceId)) {
    return true;
  }

  // If resource type is exports and not part of pgs, search in pps
  return !!pageProcessors.find(pp => pp._exportId === resourceId);
};

export const getHelpUrlForConnector = (_connectorId, marketplaceConnectors) => {
  const domain = getDomain();

  let toReturn = false;
  let filteredConnectors = [];
  const supportBaseUrl = `${HELP_CENTER_BASE_URL}/hc/en-us/categories/`;
  let connectorToCategoryMap = {};

  if (domain === 'localhost.io') {
    filteredConnectors = marketplaceConnectors.filter(
      m => m._id === _connectorId
    );

    if (filteredConnectors.length === 1) {
      connectorToCategoryMap = {
        'Shopify - NetSuite Connector': '203963787',
        'Zendesk - NetSuite Connector': '203958808',
        'Cash Application Manager for NetSuite': '203958648',
        'Magento 2 - NetSuite Connector': '203996867',
        'JIRA - NetSuite Connector': '203963647',
        'Salesforce - NetSuite Connector (IO)': '360001649831',
      };

      if (connectorToCategoryMap[filteredConnectors[0].name]) {
        toReturn =
          supportBaseUrl + connectorToCategoryMap[filteredConnectors[0].name];
      }
    }
  } else {
    if (domain === 'staging.integrator.io' || domain === 'qa.staging.integrator.io') {
      connectorToCategoryMap = {
        '5656f5e3bebf89c03f5dd77e': '203963787',
        '5666865f67c1650309224904': '203958808',
        '56d3e8d3e24d0cf5090e5a18': '203996867',
        '568e4843d997f2b705f44082': '203963647',
        '570222ce6c99305e0beff026': '203958668',
        '56fbb1176691821844de2721': '203958768',
        '57b5c79c61314b461e1515b1': '204124807',
        '5773b7378910c875334053ba': '203959428',
        '57c8199e8489cc1a298cc6ea': '203958648',
        '57e10364a0047c23baeffa09': '204406407',
        '58ee6029319bd30cc2fee160': '115000327151',
        '5811aeea2095951e76c6ce64': '115000110228',
        '58777a2b1008fb325e6c0953': '115000816227',
        '5829bce6069ccb4460cdb34e': '115000860927',
        '58d3b1b7822f16187f873177': '115000968727',
        'suitescript-salesforce-netsuite': '203964847',
        'suitescript-svb-netsuite': '203958788',
        '5b61ae4aeb538642c26bdbe6': '360001649831',
      };
    } else if (domain === 'integrator.io') {
      connectorToCategoryMap = {
        '54fa0b38a7044f9252000036': '203963787',
        '55022fc3285348c76a000005': '203958808',
        '5717912fbc5a8ca446571f1e': '203996867',
        '56cc2a64a42f08124832753a': '203963647',
        '5728756afee45a8d11e79cb7': '203958668',
        '57179182e0a908200c2781d9': '203958768',
        '57dbed962eca42c50e6e22be': '204124807',
        '57a82017810491d30e1c9760': '203959428',
        '586cb88fc1d53d6a279d527e': '115000284767',
        '581cebf290a63a26daea6081': '204406407',
        '58c90bccc13f547763bf2fc1': '115000816227',
        '58d94e6b2e4b300dbf6b01bc': '115000860927',
        '5833ea9127b52153647f3b7e': '115000857348',
        '5845210ebfa3ab6faced62fb': '115000110228',
        '592e8679c95560380ff1325c': '115000327151',
        '58f772ed3c25f31c8041d5fe': '115000968727',
        'suitescript-salesforce-netsuite': '203964847',
        'suitescript-svb-netsuite': '203958788',
        '5c8f30229f701b3e9a0aa817': '360001649831',
      };
    } else if (domain === 'eu.integrator.io') {
      connectorToCategoryMap = {
        '5e8d6f912387e356b6769bc5': '115000816227',
        '5e8d6ca02387e356b6769bb8': '203963787',
        '5e7d921e2387e356b67669ce': '360001649831',
      };
    }

    if (connectorToCategoryMap[_connectorId]) {
      if (connectorToCategoryMap[_connectorId] === '115000327151') {
        toReturn =
          `${HELP_CENTER_BASE_URL}/hc/en-us/sections/115000327151`;
      } else {
        toReturn = supportBaseUrl + connectorToCategoryMap[_connectorId];
      }
    }
  }

  return toReturn;
};

export const getHelpUrl = (integrations, marketplaceConnectors) => {
  const domainUrl = getDomainUrl();
  const { href } = window.location;
  let connectorId;
  let helpUrl = `${HELP_CENTER_BASE_URL_WITH_SIGN_IN}/hc/en-us`; // platform help url
  const newurl = href.replace(`${domainUrl}/`, '').split('/');
  let integrationId;

  if (href.indexOf('/integrationapps') > 0) {
    [, , integrationId] = newurl;
  } else if (href.indexOf('/integrations') > 0) {
    [, integrationId] = newurl;
  }

  if (integrationId && integrations && integrations.find(i => i._id === integrationId)) {
    connectorId = integrations.find(i => i._id === integrationId)._connectorId;

    const connectorHelpUrl = getHelpUrlForConnector(connectorId, marketplaceConnectors);

    if (connectorHelpUrl) {
      helpUrl = connectorHelpUrl;
    }
    // Link https://celigosuccess.zendesk.com/hc/en-us/categories/203820768 seems to be broken recently.So we set https://celigosuccess.zendesk.com/hc/en-us as a default url in integration context.
    // else if (connectorId) {
    //   helpUrl = `${HELP_CENTER_BASE_URL}/hc/en-us`;
    // } else {
    //   helpUrl =
    //     `${HELP_CENTER_BASE_URL}/hc/en-us/categories/203820768`;
    // }
  }

  return helpUrl;
};

export const getUniversityUrl = '/litmos/sso';

export const getNetSuiteSubrecordLabel = (fieldId, subrecordType) => {
  if (!fieldId) {
    return '';
  }
  const subrecordLabelMap = {
    inventorydetail: 'Inventory Details',
    componentinventorydetail: 'Inventory Details',
    landedcost: 'Landed Cost',
  };
  const subrecordListLabelMap = {
    component: 'Components',
    item: 'Items',
    inventory: 'Adjustments',
  };
  const subrecordLabel = subrecordLabelMap[subrecordType] || fieldId;
  const fieldIdParts = fieldId.split('[*].');
  let listLabel = '';

  if (fieldIdParts.length > 1) {
    if (subrecordListLabelMap[fieldIdParts[0]]) {
      listLabel = subrecordListLabelMap[fieldIdParts[0]];
    } else {
      [listLabel] = fieldIdParts;
    }

    listLabel = `${listLabel} : `;
  }

  return `${listLabel}${subrecordLabel}`;
};

export const getNetSuiteSubrecordImportsFromMappings = mapping => {
  const srImports = [];

  if (mapping) {
    if (mapping.fields) {
      mapping.fields
        .filter(fld => fld.subRecordMapping && fld.subRecordMapping.recordType)
        .forEach(fld => {
          srImports.push({
            name: getNetSuiteSubrecordLabel(
              fld.generate,
              fld.subRecordMapping.recordType
            ),
            fieldId: fld.generate,
            recordType: fld.subRecordMapping.recordType,
            jsonPath: fld.subRecordMapping.jsonPath,
          });
        });
    }

    if (mapping.lists) {
      mapping.lists.forEach(list => {
        if (list.fields) {
          list.fields
            .filter(
              fld => fld.subRecordMapping && fld.subRecordMapping.recordType
            )
            .forEach(fld => {
              srImports.push({
                name: getNetSuiteSubrecordLabel(
                  `${list.generate}[*].${fld.generate}`,
                  fld.subRecordMapping.recordType
                ),
                fieldId: `${list.generate}[*].${fld.generate}`,
                recordType: fld.subRecordMapping.recordType,
                jsonPath: fld.subRecordMapping.jsonPath,
              });
            });
        }
      });
    }
  }

  return srImports;
};

export const getNetSuiteSubrecordImports = importDoc =>
  getNetSuiteSubrecordImportsFromMappings(
    importDoc && importDoc.netsuite_da && importDoc.netsuite_da.mapping
  );

export const updateMappingsBasedOnNetSuiteSubrecords = (
  mappingOriginal,
  subrecords
) => {
  let mapping = customCloneDeep(mappingOriginal);

  const subrecordsMap = customCloneDeep(keyBy(subrecords, 'fieldId'));

  if (mapping) {
    if (mapping.fields) {
      mapping.fields = mapping.fields
        .map(fld => {
          if (subrecordsMap[fld.generate]) {
            if (!fld.subRecordMapping) {
              // eslint-disable-next-line no-param-reassign
              fld.subRecordMapping = {};
            }
            // eslint-disable-next-line no-param-reassign
            fld.subRecordMapping.recordType =
              subrecordsMap[fld.generate].recordType;
            // eslint-disable-next-line no-param-reassign
            fld.subRecordMapping.jsonPath =
              subrecordsMap[fld.generate].jsonPath;
            subrecordsMap[fld.generate].updated = true;
          }

          return fld;
        })
        .filter(
          fld =>
            !fld.subRecordMapping ||
            !fld.subRecordMapping.recordType ||
            subrecordsMap[fld.generate]
        );
    }

    if (mapping.lists) {
      mapping.lists = mapping.lists
        .map(list => {
          if (list.fields) {
            // eslint-disable-next-line no-param-reassign
            list.fields = list.fields.map(fld => {
              const fieldId = `${list.generate}[*].${fld.generate}`;

              if (subrecordsMap[fieldId]) {
                if (!fld.subRecordMapping) {
                  // eslint-disable-next-line no-param-reassign
                  fld.subRecordMapping = {};
                }
                // eslint-disable-next-line no-param-reassign
                fld.subRecordMapping.recordType =
                  subrecordsMap[fieldId].recordType;
                // eslint-disable-next-line no-param-reassign
                fld.subRecordMapping.jsonPath = subrecordsMap[fieldId].jsonPath;
                subrecordsMap[fieldId].updated = true;
              }

              return fld;
            });
          }

          return list;
        })
        .map(list => {
          if (list.fields) {
            // eslint-disable-next-line no-param-reassign
            list.fields = list.fields.filter(
              fld =>
                !fld.subRecordMapping ||
                !fld.subRecordMapping.recordType ||
                subrecordsMap[`${list.generate}[*].${fld.generate}`]
            );
          }

          return list;
        });
    }
  }

  const newSubrecords = Object.keys(subrecordsMap)
    .map(fieldId => subrecordsMap[fieldId])
    .filter(sr => !sr.updated);

  if (newSubrecords.length > 0) {
    if (!mapping) {
      mapping = {};
    }

    if (!mapping.fields) {
      mapping.fields = [];
    }

    if (!mapping.lists) {
      mapping.lists = [];
    }

    newSubrecords.forEach(sr => {
      if (sr.fieldId.includes('[*].')) {
        const [listId, fieldId] = sr.fieldId.split('[*].');
        let listIndex = mapping.lists.findIndex(l => l.generate === listId);

        if (listIndex === -1) {
          mapping.lists.push({ generate: listId });
          listIndex = mapping.lists.length - 1;
        }

        const list = mapping.lists[listIndex];

        if (!list.fields) {
          list.fields = [];
        }

        list.fields.push({
          generate: fieldId,
          subRecordMapping: {
            recordType: sr.recordType,
            jsonPath: sr.jsonPath,
          },
        });
      } else {
        mapping.fields.push({
          generate: sr.fieldId,
          subRecordMapping: {
            recordType: sr.recordType,
            jsonPath: sr.jsonPath,
          },
        });
      }
    });
  }

  return mapping;
};

export const isOauth = connectionDoc =>
    connectionDoc?.rest?.authType === 'oauth' ||
    connectionDoc?.http?.auth?.type === 'oauth' ||
    !!connectionDoc?.salesforce?.oauth2FlowType ||
    connectionDoc?.netsuite?.authType === 'token-auto';

export function getConnectionType(resource) {
  const { assistant, type } = getResourceSubType(resource);

  if (['acumatica', 'shopify', 'hubspot', 'amazonmws'].includes(assistant)) {
    if (
      resource.http &&
      resource.http.auth &&
      resource.http.auth.type === 'oauth'
    ) {
      return `${assistant}-oauth`;
    }
  }
  if (['basic', 'token'].includes(resource?.http?.auth?.type)) {
    // small hack here. adding auth type to assistant, so the assistant wouldnt match in oauth applications list.
    return `${assistant}=${resource.http.auth.type}`;
  }

  if (assistant) return assistant;

  if (resource?.netsuite?.authType === 'token-auto') {
    return 'netsuite-oauth';
  }

  return type;
}
export function isTradingPartnerSupported({environment, licenseActionDetails, accessLevel} = {}) {
  const isSandbox = environment === 'sandbox';
  let enabled = false;

  if (!licenseActionDetails) {
    return enabled;
  }

  if (
    [
      USER_ACCESS_LEVELS.ACCOUNT_OWNER,
      USER_ACCESS_LEVELS.ACCOUNT_ADMIN,
      USER_ACCESS_LEVELS.ACCOUNT_MANAGE,
    ].includes(accessLevel)
  ) {
    if (licenseActionDetails.type === 'integrator') {
      return true;
    }

    if (isSandbox) {
      enabled = licenseActionDetails.type === 'endpoint' && licenseActionDetails.totalNumberofSandboxTradingPartners > 0;
    } else {
      enabled = licenseActionDetails.type === 'endpoint' && licenseActionDetails.totalNumberofProductionTradingPartners > 0;
    }
  }

  return enabled;
}

export function isNetSuiteBatchExport(exportRes) {
  return exportRes?.netsuite?.type === 'search' || exportRes?.netsuite?.restlet?.searchId !== undefined;
}
export const isQueryBuilderSupported = (importResource = {}) => {
  const {adaptorType} = importResource;

  if (['MongoDbImport', 'DynamodbImport'].includes(adaptorType)) {
    return true;
  }
  if (adaptorType === 'RDBMSImport' && !importResource.rdbms.queryType.find(q => ['BULK INSERT', 'MERGE'].includes(q))) {
    return true;
  }

  return false;
};

export const getUserAccessLevelOnConnection = (permissions = {}, ioIntegrations = [], connectionId) => {
  let accessLevelOnConnection;

  if (
    [
      USER_ACCESS_LEVELS.ACCOUNT_OWNER,
      USER_ACCESS_LEVELS.ACCOUNT_MANAGE,
      USER_ACCESS_LEVELS.ACCOUNT_MONITOR,
      USER_ACCESS_LEVELS.ACCOUNT_ADMIN,
    ].includes(permissions.accessLevel)
  ) {
    accessLevelOnConnection = permissions.accessLevel;
  } else if (USER_ACCESS_LEVELS.TILE === permissions.accessLevel) {
    const ioIntegrationsWithConnectionRegistered = ioIntegrations.filter(
      i =>
      i?._registeredConnectionIds &&
      i._registeredConnectionIds.includes(connectionId)
    );

    ioIntegrationsWithConnectionRegistered.forEach(i => {
      if ((permissions.integrations[i._id] || {}).accessLevel) {
        if (!accessLevelOnConnection) {
          accessLevelOnConnection = (permissions.integrations[i._id] || {})
            .accessLevel;
        } else if (
          accessLevelOnConnection === INTEGRATION_ACCESS_LEVELS.MONITOR
        ) {
          accessLevelOnConnection = (permissions.integrations[i._id] || {})
            .accessLevel;
        }
      }
    });
  }

  return accessLevelOnConnection;
};

export const getAssistantFromResource = resource => {
  if (!resource) return;
  let {assistant} = resource;

  if (assistant?.includes('constantcontact')) {
    return 'constantcontact';
  }

  if (assistant === 'ebay' || assistant === 'ebayfinance') {
    return 'ebay';
  }
  if (!assistant && resource?.http?._httpConnectorId) {
    const applications = applicationsList().filter(app => app._httpConnectorId);
    const app = applications.find(a => a._httpConnectorId === resource.http._httpConnectorId) || {};

    assistant = app.assistant || app.application;
  }

  return assistant;
};

export const isOldRestAdaptor = (resource, connection) => {
  const { adaptorType, _id } = resource || {};

  return (['RESTExport', 'RESTImport'].includes(adaptorType) && _id && !isNewId(_id)) || connection?.isHTTP === false;
};

// this util takes the link header string as argument
// and extract and returns the 'next' relation relative url
export const getNextLinkRelativeUrl = link => {
  if (!link) return '';
  if (!(typeof link === 'string' || link instanceof String)) return '';

  const linkHeaderRelation = 'next';

  let domainURL = getDomainUrl();

  if (domainURL.includes('localhost')) {
    domainURL = process.env.API_ENDPOINT;
  }
  try {
    const linkObj = parseLinkHeader(link);

    if (linkObj && linkObj[linkHeaderRelation]?.url) {
      return linkObj[linkHeaderRelation].url.replace(`${domainURL}/api`, '');
    }
  } catch (error) {
    return '';
  }

  return '';
};

export const validateAliasId = (aliasId, previousAliasId, aliases) => {
  if (!aliasId) {
    return {
      isValid: false,
      message: message.REQUIRED_MESSAGE,
    };
  }

  if (aliasId !== previousAliasId && aliases.some(ra => ra.alias === aliasId)) {
    return {
      isValid: false,
      message: message.ALIAS.DUPLICATE_ALIAS_ERROR_MESSAGE,
    };
  }

  if (!/^[a-zA-Z0-9-_]+$/.test(aliasId)) {
    return {
      isValid: false,
      message: message.ALIAS.VALIDATION_ERROR_MESSAGE,
    };
  }

  return {
    isValid: true,
  };
};

export const getResourceFromAlias = alias => {
  if (!alias) return {};

  if (alias._connectionId) {
    return {
      id: alias._connectionId,
      resourceType: 'connections',
    };
  }

  if (alias._flowId) {
    return {
      id: alias._flowId,
      resourceType: 'flows',
    };
  }

  if (alias._exportId) {
    return {
      id: alias._exportId,
      resourceType: 'exports',
    };
  }

  return {
    id: alias._importId,
    resourceType: 'imports',
  };
};

export const AUDIT_LOGS_RANGE_FILTERS = [
  {id: 'last1hour', label: 'Last hour'},
  {id: 'today', label: 'Today'},
  {id: 'last36hours', label: 'Last 36 hours'},
  {id: 'last7days', label: 'Last 7 days'},
  {id: 'last15days', label: 'Last 15 days'},
  {id: 'last30days', label: 'Last 30 days'},
  {id: 'custom', label: 'Custom'},
];

export const finalSuccessMediaType = (formValues, connection) => {
  const overridenSuccessMediaType = formValues?.['/http/successMediaType'];

  if (overridenSuccessMediaType) return overridenSuccessMediaType;
  const { mediaType } = connection?.http || emptyObject;

  return mediaType;
};

