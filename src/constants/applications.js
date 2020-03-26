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
    id: 'pagerduty',
    type: 'webhook',
    name: 'PagerDuty',
    webhookOnly: true,
  },
  {
    id: 'surveymonkey',
    type: 'webhook',
    name: 'SurveyMonkey',
    webhookOnly: true,
  },
  {
    id: 'mailparser-io',
    type: 'webhook',
    name: 'Mailparser',
    webhookOnly: true,
  },
  {
    id: 'integrator-extension',
    type: 'webhook',
    name: 'integrator.io extension',
    icon: 'integratorio',
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
    id: 'postgresql',
    name: 'PostgreSQL',
    type: 'postgresql',
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

  {
    id: 'concurall',
    name: 'Concur',
    type: 'rest',
    assistant: 'concurall',
    icon: 'concur',
  },
  {
    id: 'concurv4',
    name: 'Concur',
    type: 'rest',
    assistant: 'concurv4',
    icon: 'concur',
  },
  {
    id: 'constantcontactv2',
    name: 'Constant Contact V2',
    type: 'rest',
    assistant: 'constantcontactv2',
    icon: 'constantcontactv3',
  },
  {
    id: 'constantcontactv3',
    name: 'Constant Contact V3',
    type: 'rest',
    assistant: 'constantcontactv3',
    icon: 'constantcontactv3',
  },

  {
    id: 'dropbox',
    name: 'Dropbox',
    type: 'rest',
    assistant: 'dropbox',
    webhook: true,
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
    id: 'intercom',
    name: 'Intercom',
    type: 'http',
    assistant: 'intercom',
    webhook: true,
  },

  {
    id: 'mailchimp',
    name: 'Mailchimp',
    type: 'rest',
    assistant: 'mailchimp',
    webhook: true,
  },

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
    name: 'Travis',
    type: 'http',
    assistant: 'travis',
    webhook: true,
  },
];

export const groupApplications = (
  resourceType,
  { assistants, appType, isSimpleImport }
) => {
  // Here i need to update Connectors
  if (
    assistants &&
    assistants.http.applications &&
    assistants.rest.applications
  ) {
    assistants.http.applications.forEach(asst => {
      if (!connectors.find(a => a.id === asst._id))
        connectors.push({
          id: asst._id,
          name: asst.name,
          type: 'http',
          assistant: asst._id,
        });
    });
    assistants.rest.applications.forEach(asst => {
      if (
        !connectors.find(a => a.id === asst._id) &&
        !['surveymonkey', 'yammer', 'hybris', 'etsy'].includes(asst._id)
      ) {
        connectors.push({
          id: asst._id,
          name: asst.name,
          type: 'rest',
          assistant: asst._id,
        });
      }
    });
  }

  connectors.sort((a, b) => {
    const nameA = a.name ? a.name.toUpperCase() : '';
    const nameB = b.name ? b.name.toUpperCase() : '';

    if (nameA < nameB) return -1;

    if (nameA > nameB) return 1;

    return 0; // names must be equal
  });

  const filteredConnectors = connectors.filter(connector => {
    if (connector.assistant && assistants && resourceType !== 'connections') {
      let assistant = assistants.http.applications.find(
        a => a._id === connector.assistant
      );

      if (assistant) {
        if (appType === 'import') {
          return assistant.import;
        } else if (appType === 'export') {
          return assistant.export;
        }

        return true;
      }

      assistant = assistants.rest.applications.find(
        a => a._id === connector.assistant
      );

      if (assistant) {
        if (appType === 'import') {
          return assistant.import;
        } else if (appType === 'export') {
          return assistant.export;
        }

        return true;
      }

      return false;
    }

    // Do not show FTP import for DataLoader flows
    if (
      resourceType === 'pageProcessor' &&
      appType === 'import' &&
      isSimpleImport
    ) {
      return connector.id !== 'ftp' && !connector.webhookOnly;
    }

    // Webhooks are shown only for exports and for page generators in flow context
    if (resourceType && !['exports', 'pageGenerator'].includes(resourceType)) {
      // for pageProcessor lookups even ftps are not shown
      if (resourceType === 'pageProcessor' && appType === 'export') {
        return connector.id !== 'ftp' && !connector.webhookOnly;
      }

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

export const getApplicationConnectors = () => connectors.filter(c => !c.group);
export const getWebhookConnectors = () => connectors.filter(c => !!c.webhook);
export const getDatabaseConnectors = () =>
  connectors.filter(c => c.group === 'db');
export const getWebhookOnlyConnectors = () =>
  connectors.filter(c => !!c.webhookOnly);

export const getApp = (type, assistant) => {
  const id = assistant || type;

  return connectors.find(c => c.id === id) || {};
};

export default connectors;
