import { stringCompare } from '../utils/sort';
import {CONNECTORS_TO_IGNORE, WEBHOOK_ONLY_APPLICATIONS} from '../utils/constants';

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
    name: 'REST API',
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

  { id: 'box', name: 'Box', type: 'http', webhookOnly: true, icon: 'box' },
  {
    id: 'dropbox',
    name: 'Dropbox',
    type: 'rest',
    webhookOnly: true,
    icon: 'dropbox',
  },
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
  { id: 'segment', name: 'segment', type: 'http', webhookOnly: true, icon: 'segment' },
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
  { id: 's3', name: 'Amazon S3', type: 's3', group: 'tech'},
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
  {id: 'googledrive', name: 'Google Drive', type: 'http', assistant: 'googledrive'},
  {id: 'azurestorageaccount', name: 'Azure Storage', type: 'http', assistant: 'azurestorageaccount'},
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

export const groupApplications = (
  resourceType,
  { appType, isSimpleImport }
) => {
  const assistantConnectors = connectors.filter(c => !c.assistant);
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
  const applications = connectors.filter(connector => {
    const assistant = assistants.find(a => a.id === connector.assistant);

    return !assistant || !connector.assistant;
  });

  assistants.forEach(asst => {
    applications.push({
      id: asst.id,
      name: asst.name,
      type: asst.type,
      assistant: asst.id,
      export: asst.export,
      import: asst.import,
      webhook: asst.webhook,
      helpURL: asst.helpURL,
    });
  });

  return applications;
};

export const getApplicationConnectors = () => connectors.filter(c => !c.group);
export const getWebhookConnectors = () => {
  const applications = applicationsList();

  return applications.filter(c => !!c.webhook);
};
export const getDatabaseConnectors = () =>
  connectors.filter(c => c.group === 'db');
export const getWebhookOnlyConnectors = () =>
  connectors.filter(c => !!c.webhookOnly);

export const getApp = (type, assistant) => {
  const id = assistant || type;
  const applications = applicationsList();

  return applications.find(c => c.id === id) || {};
};
export const applicationsPlaceHolderText = () => {
  const applications = applicationsList();

  return `Choose application or start typing to browse ${parseInt(applications.length / 10, 10) * 10}+ applications`;
};

export const connectorsList = () => {
  const connectors = [];
  const applications = applicationsList();

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
