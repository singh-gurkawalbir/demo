export const ACCOUNT_IDS = Object.freeze({
  OWN: 'own',
});
export const USER_ACCESS_LEVELS = Object.freeze({
  ACCOUNT_OWNER: 'owner',
  ACCOUNT_MANAGE: 'manage',
  ACCOUNT_MONITOR: 'monitor',
  TILE: 'tile',
});
export const INTEGRATION_ACCESS_LEVELS = Object.freeze({
  OWNER: 'owner',
  MANAGE: 'manage',
  MONITOR: 'monitor',
});
export const INSTALL_STEP_TYPES = Object.freeze({
  CONNECTION: 'Connection',
  INSTALL_PACKAGE: 'installPackage',
  STACK: 'Stack',
});
export const TILE_STATUS = Object.freeze({
  IS_PENDING_SETUP: 'is_pending_setup',
  UNINSTALL: 'uninstall',
  HAS_OFFLINE_CONNECTIONS: 'has_offline_connections',
  HAS_ERRORS: 'has_errors',
  SUCCESS: 'success',
});
export const STANDALONE_INTEGRATION = Object.freeze({
  id: 'none',
  name: 'Standalone Flows',
});
export const INTEGRATION_MODES = Object.freeze({
  INSTALL: 'install',
  UNINSTALL: 'uninstall',
  SETTINGS: 'settings',
});

export const UI_FIELD_VALUES = Object.freeze(['/formView']);
export const SALESFORCE_DA_PACKAGE_URL =
  'https://login.salesforce.com/packaging/installPackage.apexp?p0=04t1N000002Gl8y';
export const NETSUITE_BUNDLE_URL =
  '/app/bundler/bundledetails.nl?sourcecompanyid=TSTDRV916910&domain=PRODUCTION&config=F&id=20038';
export const PERMISSIONS = Object.freeze({
  accessLevel: 'accessLevel',
  accesstokens: {
    view: 'accesstokens.view',
    create: 'accesstokens.create',
    edit: 'accesstokens.edit',
    delete: 'accesstokens.delete',
  },
  agents: {
    view: 'agents.view',
    create: 'agents.create',
    edit: 'agents.edit',
    delete: 'agents.delete',
  },
  audits: {
    view: 'audits.view',
  },
  connections: {
    view: 'connections.view',
    create: 'connections.create',
    edit: 'connections.edit',
    delete: 'connections.delete',
  },
  connectors: {
    publish: 'connectors.publish',
    view: 'connectors.view',
    create: 'connectors.create',
    edit: 'connectors.edit',
    delete: 'connectors.delete',
  },
  integrations: {
    create: 'integrations.create',
    install: 'integrations.install',
  },
  recyclebin: {
    view: 'recyclebin.view',
    restore: 'recyclebin.restore',
    download: 'recyclebin.download',
    purge: 'recyclebin.purge',
  },
  scripts: {
    view: 'scripts.view',
    create: 'scripts.create',
    edit: 'scripts.edit',
    delete: 'scripts.delete',
  },
  stacks: {
    view: 'stacks.view',
    create: 'stacks.create',
    edit: 'stacks.edit',
    delete: 'stacks.delete',
  },
  subscriptions: {
    view: 'subscriptions.view',
    requestUpgrade: 'subscriptions.requestUpgrade',
  },
  templates: {
    publish: 'templates.publish',
    view: 'templates.view',
    create: 'templates.create',
    edit: 'templates.edit',
    delete: 'templates.delete',
  },
  transfers: {
    view: 'transfers.view',
    create: 'transfers.create',
    edit: 'transfers.edit',
    delete: 'transfers.delete',
  },
  users: {
    view: 'users.view',
    create: 'users.create',
    edit: 'users.edit',
    delete: 'users.delete',
  },
  exports: {
    view: 'exports.view',
    create: 'exports.create',
    edit: 'exports.edit',
    delete: 'exports.delete',
  },
  imports: {
    view: 'imports.view',
    create: 'imports.create',
    edit: 'imports.edit',
    delete: 'imports.delete',
  },
});

export const PASSWORD_MASK = '******';
export const SUITESCRIPT_CONNECTORS = Object.freeze([
  {
    _id: 'suitescript-salesforce-netsuite',
    name: 'Salesforce - NetSuite Connector (V2)',
    ssName: 'Salesforce Connector',
    description:
      'Streamline your Lead-to-Cash process with the Salesforce - NetSuite Connector. Manage sales process effectively and in real-time. Packed with Celigo’s deep domain expertise and best practices, this Connector is the embodiment of several years of customer feedback, learning and growth.  With distributed adapters running only in NetSuite and Salesforce, our connector allows endless customization options.',
    applications: ['salesforce', 'netsuite'],
    user: {
      name: 'Celigo',
      email: 'yrjcbv9kkq1azk@gmail.com',
      company: 'Celigo',
    },
  },
  {
    _id: 'suitescript-svb-netsuite',
    name: 'SVB - NetSuite Connector',
    ssName: 'SVB Connector',
    description:
      'The Silicon Valley Bank – NetSuite Connector enables NetSuite customers to automatically import Silicon Valley Bank (SVB) transactions into NetSuite and reconcile efficiently using a wizard-driven process. The Connector offers an intuitive user interface, customized matching logic and automated import of SVB account transactions into NetSuite.',
    applications: ['svb', 'netsuite'],
    user: {
      name: 'Celigo',
      email: 'yrjcbv9kkq1azk@gmail.com',
      company: 'Celigo',
    },
  },
]);
export const JOB_TYPES = Object.freeze({
  FLOW: 'flow',
  IMPORT: 'import',
  EXPORT: 'export',
  RETRY: 'retry',
  BULK_RETRY: 'bulk_retry',
});
export const JOB_STATUS = Object.freeze({
  COMPLETED: 'completed',
  CANCELED: 'canceled',
  FAILED: 'failed',
  QUEUED: 'queued',
  RUNNING: 'running',
  RETRYING: 'retrying',
});
export const PATHS_DONT_NEED_INTEGRATOR_ASHAREID_HEADER = [
  'ashares',
  'licenses',
  'preferences',
  'profile',
  'published',
  'shared/ashares',
];
// eslint-disable-next-line no-useless-escape
export const URI_VALIDATION_PATTERN = /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|localhost|127\.0\.0\.1|(?:(?:[a-z0-9\u00a1-\uffff][a-z0-9\u00a1-\uffff_-]{0,62})?[a-z0-9\u00a1-\uffff]\.)+(?:[a-z\u00a1-\uffff]{2,}\.?))(?::\d{2,5})?(?:[/?#]\S*)?$/i;
export const REST_ASSISTANTS = [
  '3dcart',
  'certify',
  'chargify',
  'docusign',
  'dropbox',
  'jet',
  'jira',
  'jobvite',
  'magento',
  'namely',
  'servicenow',
  'squareup',
  'stripe',
  'surveymonkey',
  'twilio',
  'woocommerce',
  'zendesk',
  'liquidplanner',
  'shipstation',
  'shipwire',
  'asana',
  'shopify',
  'slack',
  'desk',
  'eventbrite',
  'smartsheet',
  'campaignmonitor',
  'mailchimp',
  'chargebee',
  'googlesheets',
  'googlemail',
  'googlecontacts',
  'hubspot',
  'freshdesk',
  'harvest',
  'integratorio',
  'bigcommerce',
  'github',
  'shiphawk',
  'atera',
  'freshbooks',
  'yammer',
  'pulseway',
  'newrelic',
  'tableau',
  'sageone',
  'googleanalytics',
  'lightspeed',
  'tesco',
  'accelo',
  'fieldaware',
  'avalara',
  'googleshopping',
  'taxjar',
  'zuora',
  'snapfulfil',
  'coupa',
  'microsoftdynamics365',
  'zohodesk',
  'quip',
  'greenhouse',
  'zohocrm',
  'shippo',
  'easypost',
  'microsoftbusinesscentral',
  'microsoftoutlookcalendar',
  'microsoftoutlookmail',
  'microsoftoutlookcontacts',
  'microsoftonenote',
  'zohobooks',
  'pitneybowes',
  'insightly',
  'pdffiller',
  'ebay',
  'expensify',
  'wish',
  'exacterp',
  'acumatica',
  'myobessentials',
  'zohomail',
  'bronto',
  'returnly',
  'klaviyo',
  'postmark',
  'procurify',
  'mailgun',
  'aptrinsic',
  'acton',
  'strata',
  'concur',
  'oandav20fxtrade',
  'tophatter',
  'spreecommerce',
  'concurv4',
  'powerbi',
  'sugarcrm',
  'oandaexchangerates',
  'marketo',
  'parseur',
  'grms',
  'sharepoint',
  'retailops',
  'concurall',
  'constantcontactv2',
  'constantcontactv3',
  'skubana',
  'dunandbradstreet',
  'miva',
];

export const MAX_FILE_SIZE = 10 * 1024 * 1024; /* 10 MB */
export const MAX_DATA_LOADER_FILE_SIZE = 100 * 1024 * 1024; /* 100 MB */
export const EMPTY_RAW_DATA = 'EMPTY RAW DATA';
export const USAGE_TIER_NAMES = {
  free: 'Free',
  light: 'Starter',
  moderate: 'Professional',
  heavy: 'Enterprise',
  custom: 'Custom',
};
export const USAGE_TIER_HOURS = {
  free: 1,
  light: 40,
  moderate: 400,
  heavy: 4000,
  custom: 10000,
};
export const SUBMIT_TICKET_URL =
  'https://celigosuccess.zendesk.com/hc/en-us/requests/new?preview_as_role=end_user';
export const WHATS_NEW_URL =
  'https://celigosuccess.zendesk.com/hc/en-us/categories/360002687611';
export const RDBMS_TYPES = ['mysql', 'postgresql', 'mssql', 'snowflake'];
export const AWS_REGIONS_LIST = [
  {
    label: 'US East (N. Virginia) [us-east-1]',
    value: 'us-east-1',
  },
  {
    label: 'US West (N. California) [us-west-1]',
    value: 'us-west-1',
  },
  {
    label: 'US West (Oregon) [us-west-2]',
    value: 'us-west-2',
  },
  {
    label: 'EU (Ireland) [eu-west-1]',
    value: 'eu-west-1',
  },
  {
    label: 'EU (Frankfurt) [eu-central-1]',
    value: 'eu-central-1',
  },
  {
    label: 'Asia Pacific (Tokyo) [ap-northeast-1]',
    value: 'ap-northeast-1',
  },
  {
    label: 'Asia Pacific (Seoul) [ap-northeast-2]',
    value: 'ap-northeast-2',
  },
  {
    label: 'Asia Pacific (Singapore) [ap-southeast-1]',
    value: 'ap-southeast-1',
  },
  {
    label: 'Asia Pacific (Sydney) [ap-southeast-2]',
    value: 'ap-southeast-2',
  },
  {
    label: 'South America (São Paulo) [sa-east-1]',
    value: 'sa-east-1',
  },
  {
    label: 'China (Beijing) [cn-north-1]',
    value: 'cn-north-1',
  },
  {
    label: 'US East (Ohio) [us-east-2]',
    value: 'us-east-2',
  },
  {
    label: 'Canada (Central) [ca-central-1]',
    value: 'ca-central-1',
  },
  {
    label: 'Asia Pacific (Mumbai) [ap-south-1]',
    value: 'ap-south-1',
  },
  {
    label: 'EU (London) [eu-west-2]',
    value: 'eu-west-2',
  },
  {
    label: 'EU (Stockholm) [eu-north-1]',
    value: 'eu-north-1',
  },
];

export const C_LOCKED_FIELDS = Object.freeze({
  exports: [
    'pageSize',
    'type',
    'netsuite.restlet.batchSize',
    'netsuite.restlet.searchId',
    'netsuite.distributed.executionContext',
    'netsuite.distributed.executionType',
    'netsuite.distributed.qualifier',
    'netsuite.distributed.sublists',
    'netsuite.distributed.forceReload',
    'netsuite.distributed.qualifier',
    'salesforce.relatedLists.referencedFields,',
    'salesforce.relatedLists.parentField,',
    'salesforce.relatedLists.sObjectType,',
    'salesforce.relatedLists.filter,',
    'salesforce.relatedLists.orderBy,',
    'salesforce.relatedLists.userDefined,',
    'salesforce.distributed.batchSize',
    'salesforce.soql.query',
  ],
  imports: [
    'lookups',
    'batchSize',
    'netsuite_da.batchSize',
    'netsuite_da.internalIdLookup.extract',
    'netsuite_da.internalIdLookup.searchField',
    'netsuite_da.internalIdLookup.operator',
    'netsuite_da.internalIdLookup.expression',
    'netsuite_da.mappings.lookups',
    'salesforce.idLookup.extract',
    'salesforce.idLookup.whereClause',
    'salesforce.upsert.externalIdField',
    'salesforce.lookups',
  ],
  flows: ['_runNextFlowIds', 'disabled'],
});
