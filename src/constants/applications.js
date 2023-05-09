import { stringCompare } from '../utils/sort';
import {CONNECTORS_TO_IGNORE, REST_ASSISTANTS, WEBHOOK_ONLY_APPLICATIONS} from '.';
import { getConnectorId } from '../utils/assistant';

// Schema details:
// ---------------
// id: Required. Any unique token.
// name: Required. Display name used in UI. (example: app selection list)
// type: Required - maps to connector type (previously called adaptor)
// assistant: Optional - set if App is a variant (Assistant)
// connections: Optional - if application supports multiple connection
//   types, list them. Concur and Constant Contact are examples.
// keyword: any words in combination with the name that will be used for search.
// group: optional. If present used to group connectors together in the UI when
//   listing them.

const connectors = [
  // tech connectors
  {
    id: 'http',
    name: 'HTTP',
    type: 'http',
    keywords: 'technology,protocol',
    group: 'tech',
  },
  {
    id: 'rest',
    name: 'REST API (HTTP)',
    type: 'rest',
    keywords: 'technology,protocol',
    group: 'tech',
  },
  {
    id: 'ftp',
    name: 'FTP',
    type: 'ftp',
    keywords: 'sftp,ftps,technology,protocol',
    group: 'tech',
  },
  {
    id: 'wrapper',
    name: 'Wrapper',
    type: 'wrapper',
    keywords: 'technology',
    group: 'tech',
    helpURL: 'https://docs.celigo.com/hc/en-us/articles/360050836031-Set-up-a-wrapper-connection',
  },
  {
    id: 'webhook',
    name: 'Webhook',
    type: 'webhook',
    keywords: 'technology, realtime',
    group: 'tech',
    webhookOnly: true,
  },
  {
    id: 'travis-org',
    type: 'webhook',
    name: 'Travis Org',
    webhookOnly: true,
    icon: 'travis-org',
  },
  {
    id: 'helpscout',
    type: 'webhook',
    name: 'Help Scout',
    webhookOnly: true,
  },
  {
    id: 'errorception',
    type: 'webhook',
    name: 'Errorception',
    webhookOnly: true,
  },
  {
    id: 'aha',
    type: 'webhook',
    name: 'Aha!',
    webhookOnly: true,
  },
  {
    id: 'mailparser-io',
    type: 'webhook',
    name: 'Mailparser',
    webhookOnly: true,
  },
  {
    id: 'as2',
    name: 'AS2',
    type: 'as2',
    keywords: 'technology,protocol',
    group: 'tech',
  },
  {
    id: 'van',
    name: 'VAN (Value-added network)',
    type: 'van',
    keywords: 'technology,protocol',
    group: 'tech',
  },
  // Database connectors
  {
    id: 'mongodb',
    name: 'MongoDB',
    type: 'mongodb',
    keywords: 'database,db',
    group: 'db',
  },
  {
    id: 'mssql',
    name: 'Microsoft SQL',
    type: 'mssql',
    keywords: 'database,rdbms,db',
    group: 'db',
  },
  {
    id: 'mysql',
    name: 'MySQL',
    type: 'mysql',
    keywords: 'database,rdbms,db',
    group: 'db',
  },
  {
    id: 'oracle',
    name: 'Oracle DB (SQL)',
    type: 'oracle',
    keywords: 'database,rdbms,db',
    group: 'db',
  },
  {
    id: 'postgresql',
    name: 'PostgreSQL',
    type: 'postgresql',
    keywords: 'database,rdbms,db',
    group: 'db',
  },
  {
    id: 'snowflake',
    name: 'Snowflake',
    type: 'snowflake',
    keywords: 'database,rdbms,db',
    group: 'db',
  },
  {
    id: 'dynamodb',
    name: 'DynamoDB',
    type: 'dynamodb',
    keywords: 'database,db',
    group: 'db',
  },
  {
    id: 'bigquerydatawarehouse',
    name: 'Google BigQuery',
    type: 'bigquerydatawarehouse',
    keywords: 'database,db',
    group: 'db',
    helpURL: 'https://docs.celigo.com/hc/en-us/articles/360042825892-Set-up-a-connection-to-Google-BigQuery',
  },
  {
    id: 'redshiftdatawarehouse',
    name: 'Amazon Redshift',
    type: 'redshiftdatawarehouse',
    keywords: 'database,db',
    group: 'db',
    helpURL: 'https://docs.celigo.com/hc/en-us/articles/360042875872-Set-up-a-connection-to-Amazon-Redshift',
  },
  {
    id: 'netsuitejdbc',
    name: 'NetSuite JDBC',
    type: 'netsuitejdbc',
    keywords: 'database,db',
    group: 'db',
    exportOnly: true,
    helpURL: 'https://docs.celigo.com/hc/en-us/articles/13668167418779',
  },
  {
    id: 'graph_ql',
    name: 'GraphQL',
    type: 'graph_ql',
    group: 'tech',
    helpURL: 'https://docs.celigo.com/hc/en-us/articles/4843857027227',
  },
  // Application connectors
  {
    id: 'activecampaign',
    name: 'ActiveCampaign',
    type: 'http',
    assistant: 'activecampaign',
    webhook: true,
  },
  // is this supported? no image in CDN..
  // { id: 'allbound', name: 'allbound', type: 'http', assistant: 'allbound' },
  // { id: 'amazonaws', name: 'Amazon AWS', type: 'http', assistant: 'amazonaws' },

  { id: 'sapariba', name: 'SAP Ariba', type: 'webhook', webhookOnly: true },
  {
    id: 'github',
    name: 'GitHub',
    type: 'rest',
    assistant: 'github',
    webhook: true,
  },
  {
    id: 'hubspot',
    name: 'HubSpot',
    type: 'rest',
    assistant: 'hubspot',
    webhook: true,
  },
  {
    id: 'integratorio',
    name: 'integrator.io',
    type: 'rest',
    assistant: 'integratorio',
    webhook: true,
  },
  {
    id: 'intercom',
    name: 'Intercom',
    type: 'http',
    assistant: 'intercom',
    webhook: true,
  },
  {
    id: 'jira',
    name: 'Jira Software',
    type: 'rest',
    assistant: 'jira',
    webhook: true,
  },
  {
    id: 'mailchimp',
    name: 'MailChimp',
    type: 'rest',
    assistant: 'mailchimp',
    webhook: true,
  },
  { id: 'netsuite', name: 'NetSuite', type: 'netsuite' },
  {
    id: 'parseur',
    name: 'Parseur',
    type: 'rest',
    assistant: 'parseur',
    webhook: true,
  },
  {
    id: 'postmark',
    name: 'Postmark',
    type: 'rest',
    assistant: 'postmark',
    webhook: true,
  },
  {
    id: 'recurly',
    name: 'Recurly',
    type: 'http',
    assistant: 'recurly',
    webhook: true,
  },
  {
    id: 'pagerduty',
    name: 'PagerDuty',
    type: 'http',
    assistant: 'pagerduty',
    webhook: true,
  },
  // { id: 'replicon', name: 'replicon', type: 'http', assistant: 'replicon' },

  {
    id: 'salesforce',
    name: 'Salesforce',
    type: 'salesforce',
  },
  { id: 'segment', name: 'segment', type: 'http', webhook: true, assistant: 'segment', icon: 'segment' },
  {
    id: 'shipwire',
    name: 'Shipwire',
    type: 'rest',
    assistant: 'shipwire',
    webhook: true,
  },
  {
    id: 'shopify',
    name: 'Shopify',
    type: 'rest',
    assistant: 'shopify',
    webhook: true,
  },
  {
    id: 'slack',
    name: 'Slack',
    type: 'rest',
    assistant: 'slack',
    webhook: true,
  },
  {
    id: 'stripe',
    name: 'Stripe',
    type: 'rest',
    assistant: 'stripe',
    webhook: true,
  },
  {
    id: 'travis',
    name: 'Travis CI',
    type: 'http',
    webhookOnly: true,
    icon: 'travis',
  },
  { id: 's3', name: 'Amazon S3', type: 's3'},
  // Metadata doesn't exist for below connectors. Only connections are available as of now.
  {id: 'banking', name: 'Banking', type: 'http', assistant: 'banking'},
  {id: 'clover', name: 'Clover', type: 'http', assistant: 'clover'},
  {id: 'dcl', name: 'DCL Logistics', type: 'http', assistant: 'dcl'},
  {id: 'facebookads', name: 'Facebook Ads', type: 'http', assistant: 'facebookads'},
  {id: 'ramplogistics', name: 'Ramp Logistics', type: 'http', assistant: 'ramplogistics'},
  {id: 'ariba', name: 'SAP Ariba', type: 'http', assistant: 'ariba'},
];
// These can be removed once metadata gets updated.
const newConnections = [
  {id: 'googledrive',
    name: 'Google Drive',
    type: 'http',
    assistant: 'googledrive',
    helpURL: 'https://docs.celigo.com/hc/en-us/articles/360056026892-Set-up-a-connection-to-Google-Drive',
  },
  {id: 'box',
    name: 'Box',
    type: 'http',
    assistant: 'box',
    helpURL: 'https://docs.celigo.com/hc/en-us/articles/11282046646299-Set-up-a-connection-to-Box',
  },
  {id: 'dropbox',
    name: 'Dropbox',
    helpURL: 'https://docs.celigo.com/hc/en-us/articles/11282086837275-Set-up-a-connection-to-Dropbox',
    type: 'http',
    assistant: 'dropbox',
  },
  {id: 'azurestorageaccount', name: 'Azure Blob Storage', type: 'http', assistant: 'azurestorageaccount', helpURL: 'https://docs.celigo.com/hc/en-us/articles/4405704367771-Set-up-a-connection-to-Azure-Blob-Storage'},
  {
    id: 'constantcontact',
    name: 'Constant Contact',
    type: 'http',
    assistant: 'constantcontact',
    export: 'true',
    import: 'true',
    helpURL: 'https://docs.celigo.com/hc/en-us/articles/360038589232-Set-up-a-connection-to-Constant-Contact',
  },
  {id: 'amazonsellingpartner', name: 'Amazon Seller Central', type: 'http', assistant: 'amazonsellingpartner'},
  {id: 'recurlyv3', name: 'Recurly v3', type: 'http', assistant: 'recurlyv3'},
  {id: 'loopreturnsv2', name: 'Loop Returns', type: 'http', assistant: 'loopreturnsv2'},
  {id: 'acumaticaecommerce', name: 'Acumatica', type: 'rest', assistant: 'acumaticaecommerce'},
  {id: 'acumaticamanufacturing', name: 'Acumatica', type: 'rest', assistant: 'acumaticamanufacturing'},
];

connectors.sort(stringCompare('name'));
const getAssistants = () => {
  let localStorageAssistants;

  // localStorage is browser specific one. It is breaking testcases. Below code changes are to
  // avoid test case breakages.
  // TODO: Need to see alternate solution here.
  try {
    localStorageAssistants = JSON.parse(localStorage.getItem('assistants')) || [];
  } catch (e) {
    localStorageAssistants = [];
  }
  newConnections.forEach(asst => {
    localStorageAssistants.push(asst);
  });

  return localStorageAssistants;
};

export const getPublishedHttpConnectors = () => {
  let localStoragePublishedHttpAssistants;

  try {
    localStoragePublishedHttpAssistants = JSON.parse(localStorage.getItem('publishedHttpConnectors')) || [];
  } catch (e) {
    localStoragePublishedHttpAssistants = [];
  }

  return localStoragePublishedHttpAssistants;
};
const publishedConnectors = getPublishedHttpConnectors();

export const getPublishedHttpConnectorsIdsList = () => {
  let list = [];

  publishedConnectors.forEach(pc => {
    if (pc.legacyIds) {
      list = [...list, ...pc.legacyIds];
    }
    const connId = getConnectorId(pc.legacyId, pc.name);

    if (connId) {
      list.push(connId);
    }
  });

  return list;
};
const publishedConnectorsIds = getPublishedHttpConnectorsIdsList();

export const getHttpConnector = httpConnectorId => publishedConnectors?.find(c => c._id === httpConnectorId);

export const groupApplications = (
  resourceType,
  { appType, isSimpleImport }
) => {
  let assistantConnectors = connectors.filter(c => !c.assistant);
  const assistants = getAssistants();

  if (assistants) {
    assistants.forEach(asst => {
      if (
        !CONNECTORS_TO_IGNORE.includes(asst.id)
      ) {
        assistantConnectors.push({
          id: asst.id,
          name: asst.name,
          type: asst.type,
          assistant: asst.id,
          export: asst.export,
          import: asst.import,
          webhook: asst.webhook,
          group: asst.group,
        });
      }
    });
  }
  assistantConnectors = assistantConnectors.filter(app =>
    !publishedConnectorsIds.includes(app.id)
  );
    publishedConnectors?.forEach(pc => {
      assistantConnectors.push({
        id: getConnectorId(pc.legacyId, pc.name),
        name: pc.name,
        type: 'http',
        export: true,
        import: true,
        icon: pc.legacyId || pc.name.toLowerCase().replace(/\.|\s/g, ''),
        assistant: pc.legacyId,
        _httpConnectorId: pc._id,
        helpURL: pc.helpURL,
        webhook: pc.supportsWebhook,
      });
    });

    assistantConnectors.sort(stringCompare('name'));

    const filteredConnectors = assistantConnectors.filter(connector => {
      if (
        connector.assistant &&
      assistants &&
      resourceType !== 'connections' &&
      appType
      ) {
        return true;
      }

      // Do not show FTP/S3 import for DataLoader flows
      if (resourceType === 'pageProcessor' && isSimpleImport) {
        return !['ftp', 's3'].includes(connector.id) && !connector.webhookOnly;
      }

      // connector having exportOnly true as property should not be shown in the list of standalone imports
      // It is different from webhookOnly because it has option to create connections also.
      if (resourceType === 'imports' && connector.exportOnly) {
        return false;
      }

      // Webhooks are shown only for exports and for page generators in flow context
      if (resourceType && !['exports', 'pageGenerator'].includes(resourceType)) {
      // all other resource types handled here
        return !connector.webhookOnly;
      }

      return true;
    });

    return [
      {
        label: 'Databases',
        connectors: filteredConnectors.filter(c => c.group === 'db'),
      },
      {
        label: 'Universal connectors',
        connectors: filteredConnectors.filter(c => c.group === 'tech'),
      },
      {
        label: 'Connectors',
        connectors: filteredConnectors.filter(c => !c.group),
      },
    ];
};
/* MISSING WEBHOOK PROVIDERS
  'travis-org',
  'helpscout',
  'errorception',
  'aha',
  'pagerduty',
  'surveymonkey',
  'mailparser-io',
  'integrator-extension',
*/
export const applicationsList = () => {
  const assistants = getAssistants();
  let applications = connectors.filter(connector => {
    const assistant = assistants.find(a => a.id === connector.assistant);

    return !assistant || !connector.assistant;
  });

  assistants.forEach(asst => {
    let {name} = asst;

    // TODO: Siddharth, temporary check to ensure consistency for constant contact
    // once constantcontactv2 & v3 are migrated to constantcontact in db
    // this should be removed https://celigo.atlassian.net/browse/IO-23182
    if (asst.id.includes('constantcontact')) {
      name = 'Constant Contact';
    }
    applications.push({
      id: asst.id,
      name,
      type: asst.type,
      assistant: asst.id,
      export: asst.export,
      import: asst.import,
      webhook: asst.webhook,
      helpURL: asst.helpURL,
    });
  });
  applications = applications.filter(app =>
    !publishedConnectorsIds.includes(app.id)
  );
  publishedConnectors?.forEach(pc => {
    applications.push({
      id: getConnectorId(pc.legacyId, pc.name),
      name: pc.name,
      type: 'http',
      export: true,
      import: true,
      assistant: pc.legacyId,
      application: pc.legacyId || getConnectorId(pc.legacyId, pc.name),
      _httpConnectorId: pc._id,
      helpURL: pc.helpURL,
      webhook: pc.supportsWebhook,
    });
  });

  return applications;
};

export const getWebhookConnectors = () => {
  const applications = applicationsList();

  return applications.filter(c => !!c.webhook);
};

export const getWebhookOnlyConnectors = () =>
  connectors.filter(c => !!c.webhookOnly);

export const getApp = (type, assistant, _httpConnectorId) => {
  const id = assistant || type;
  const applications = applicationsList();

  if (!assistant && _httpConnectorId) {
    return applications.find(c => c._httpConnectorId === _httpConnectorId) || {};
  }

  if (!id) return {};

  return applications.find(c => [c.id, c.assistant].includes(id)) || {};
};

export function getImportAdaptorType(resource) {
  const {adaptorType, assistant, http} = resource;

  if (adaptorType === 'HTTPImport') {
    if (http?.formType === 'assistant') {
      return REST_ASSISTANTS.includes(assistant) ? 'rest' : 'http';
    }

    return http?.formType === 'rest' ? 'rest' : 'http';
  }

  // for rest adaptors search by assistant type

  return REST_ASSISTANTS.includes(assistant) ? 'rest' : 'http';
}

export const getAssistantConnectorType = assistant => {
  const connectorType = getApp(null, assistant)?.type;

  if (connectorType) {
    return connectorType.toLowerCase() === 'rest' ? 'rest' : 'http';
  }

  return '';
};
export const applicationsPlaceHolderText = () => {
  const applications = applicationsList();

  return `Choose application or start typing to browse ${parseInt(applications.length / 10, 10) * 10}+ applications`;
};

export const connectorsList = () => {
  const connectors = [];
  let applications = applicationsList();

  applications = applications.filter(app =>
    !publishedConnectorsIds.includes(app.id)
  );

  applications.forEach(asst => {
    if (
      !CONNECTORS_TO_IGNORE.includes(asst.id) &&
      !WEBHOOK_ONLY_APPLICATIONS.includes(asst.id)
    ) {
      connectors.push({
        value: asst.id,
        label: asst.name,
        icon: asst.id,
        type: asst.type,
      });
    }
  });

  publishedConnectors?.forEach(pc => {
    connectors.push({
      value: getConnectorId(pc.legacyId, pc.name),
      label: pc.name,
      icon: pc.legacyId || pc.name.toLowerCase().replace(/\.|\s/g, ''),
      _httpConnectorId: pc._id,
      type: 'http',
      published: true,
    });
  });

  connectors.sort(stringCompare('label'));

  return connectors;
};

export const templatesList = () => {
  const templates = connectorsList();

  templates.push({ label: 'Salesforce.org', value: 'salesforce.org', icon: 'salesforce.org', type: 'salesforce.org' });
  templates.sort(stringCompare('label'));

  return templates;
};

export default connectors;
