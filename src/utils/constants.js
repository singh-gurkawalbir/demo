export const emptyList = [];
export const emptyObject = {};
export const ACCOUNT_IDS = Object.freeze({
  OWN: 'own',
});
export const FORM_SAVE_STATUS = Object.freeze({
  COMPLETE: 'complete',
  FAILED: 'failed',
  ABORTED: 'aborted',
  LOADING: 'loading',
});
export const USER_ACCESS_LEVELS = Object.freeze({
  ACCOUNT_ADMIN: 'administrator',
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
  FORM: 'form',
});
export const UNINSTALL_STEP_TYPES = Object.freeze({
  FORM: 'form',
  HIDDEN: 'hidden',
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
  name: 'Standalone flows',
});
export const INTEGRATION_MODES = Object.freeze({
  INSTALL: 'install',
  UNINSTALL: 'uninstall',
  SETTINGS: 'settings',
});

export const UI_FIELD_VALUES = Object.freeze(['/formView']);
export const SALESFORCE_DA_PACKAGE_URL =
  'https://login.salesforce.com/packaging/installPackage.apexp?p0=04t3m000000Y9kv';
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
  apis: {
    view: 'apis.view',
    create: 'apis.create',
    edit: 'apis.edit',
    delete: 'apis.delete',
  },
});

export const PASSWORD_MASK = '******';
export const SUITESCRIPT_CONNECTOR_IDS = { salesforce: 'suitescript-salesforce-netsuite', svb: 'suitescript-svb-netsuite'};
export const SUITESCRIPT_CONNECTORS = Object.freeze([
  {
    _id: 'suitescript-salesforce-netsuite',
    name: 'Salesforce - NetSuite Connector (V2)',
    urlName: 'sfns',
    ssName: 'Salesforce Connector',
    description: 'v2 is the legacy version of our Integration app that comes bundled with comprehensive out-of-the-box flows for the Lead-to-Cash process. With an intuitive setup that requires no coding, integrating platforms is a seamless process.',
    applications: ['salesforce', 'netsuite'],
    user: {
      name: 'Celigo',
      email: 'yrjcbv9kkq1azk@gmail.com',
      company: 'Celigo',
    },
    installSteps: Object.freeze([
      {
        name: 'NetSuite Connection',
        type: 'connection',
        connectionType: 'netsuite',
        description: 'Select a NetSuite connection or create a new one for your NetSuite account. Integrator.io will use this to connect to your NetSuite account.',
        imageURL: '/images/company-logos/netsuite.png',
        completed: false,
        __index: 1,
      },
      {
        imageURL: '/images/company-logos/netsuite.png',
        installURL: 'https://system.na1.netsuite.com/app/bundler/bundledetails.nl?sourcecompanyid=TSTDRV916910&domain=PRODUCTION&config=F&id=20038',
        completed: false,
        description: 'Install integrator bundle in NetSuite account.',
        name: 'Integrator Bundle',
        type: 'integrator-bundle',
        __index: 2,
      },
      {
        imageURL: '/images/company-logos/netsuite.png',
        installURL: 'https://system.na1.netsuite.com/app/bundler/bundledetails.nl?sourcecompanyid=TSTDRV916910&domain=PRODUCTION&config=F&id=48893',
        completed: false,
        description: 'Install Salesforce Connector bundle in NetSuite account.',
        name: 'Salesforce Bundle',
        type: 'connector-bundle',
        __index: 3,
      },
      {
        name: 'NetSuite Connection',
        type: 'ssConnection',
        connectionType: 'netsuite',
        description: 'Provide NetSuite account credentials. The Connector will use them to send data from Salesforce to NetSuite.',
        imageURL: '/images/company-logos/netsuite.png',
        completed: false,
        __index: 4,
      },
      {
        name: 'Salesforce Connection',
        type: 'ssConnection',
        connectionType: 'salesforce',
        description: 'Provide Salesforce account credentials. The Connector will use them to send data from NetSuite to Salesforce.',
        imageURL: '/images/company-logos/salesforce.png',
        completed: false,
        __index: 5,
      },
      {
        name: 'Integrator package',
        type: 'package',
        installURL: 'https://login.salesforce.com/packaging/installPackage.apexp?p0=04to0000000OIhq',
        installerFunction: 'verifyIntegratorPackage',
        description: 'Install integrator package in Salesforce.',
        imageURL: '/images/company-logos/salesforce.png',
        completed: false,
        __index: 6,
      },
      {
        name: 'Connector package',
        type: 'package',
        installURL: 'https://login.salesforce.com/packaging/installPackage.apexp?p0=04tj0000000LYeu',
        installerFunction: 'verifyConnectorPackage',
        description: 'Install NetSuite Connector package in Salesforce.',
        imageURL: '/images/company-logos/salesforce.png',
        completed: false,
        __index: 7,
      },
    ]),
  },
  {
    _id: 'suitescript-svb-netsuite',
    name: 'SVB - NetSuite Connector',
    urlName: 'svbns',
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
  'licenses',
  'preferences',
  'profile',
  'published',
  'shared/ashares',
];
// Regular Expression to Simple multiple email addresses separated by commas from regextester.com
export const MULTIPLE_EMAILS = /^(\s?[^\s,]+@[^\s,]+\.[^\s,]+\s?,)*(\s?[^\s,]+@[^\s,]+\.[^\s,]+)$/;
// Regular Expression to absolute url, e.g: (https|http)://abc.com but not relative urls such as www.abc.com or abc.com
export const ABS_URL_VALIDATION_PATTERN = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/i;
// eslint-disable-next-line no-useless-escape
// export const URI_VALIDATION_PATTERN = /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|localhost|127\.0\.0\.1|(?:(?:[a-z0-9\u00a1-\uffff][a-z0-9\u00a1-\uffff_-]{0,62})?[a-z0-9\u00a1-\uffff]\.)+(?:[a-z\u00a1-\uffff]{2,}\.?))(?::\d{2,5})?(?:[/?#]\S*)?$/i;
export const URI_VALIDATION_PATTERN = /(?:(?:https?:)?\/\/)?(?:\S+(?::\S*)?@)?(?:(?:(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:1\d\d|2[0-4]\d|25[0-4]|[1-9]\d?)))|\[(?:(?:[\da-f]{1,4}:){7,7}[\da-f]{1,4}|(?:[\da-f]{1,4}:){1,4}:(?:(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:1\d\d|2[0-4]\d|25[0-4]|[1-9]\d?)))|::(?:ffff(?::0{1,4}){0,1}:){0,1}(?:(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:1\d\d|2[0-4]\d|25[0-4]|[1-9]\d?)))|[\da-f]{1,4}:(?:(?::[\da-f]{1,4}){1,6})|(?:[\da-f]{1,4}:){1,2}(?::[\da-f]{1,4}){1,5}|(?:[\da-f]{1,4}:){1,3}(?::[\da-f]{1,4}){1,4}|(?:[\da-f]{1,4}:){1,4}(?::[\da-f]{1,4}){1,3}|(?:[\da-f]{1,4}:){1,5}(?::[\da-f]{1,4}){1,2}|(?:[\da-f]{1,4}:){1,6}:[\da-f]{1,4}|(?:[\da-f]{1,4}:){1,7}:|:(?:(?::[\da-f]{1,4}){1,7}|:))\]|(?:(?:[a-z0-9\u00a1-\uffff][a-z0-9\u00a1-\uffff_-]{0,62})?[a-z0-9\u00a1-\uffff]\.)+(?:[a-z\u00a1-\uffff]{2,}\.?))(?::\d{2,5})?(?:[/?#]\S*)?/i;
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
  'twilio',
  'woocommerce',
  'zendesk',
  'liquidplanner',
  'shipstation',
  'shipwire',
  'asana',
  'shopify',
  'slack',
  // 'desk',
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
/**
 * Zendesk SSO is enabled for production only and the user must have an integrator.io/eu.integrator.io
 * account to access help center. So redirect user to integrator.io when he try to access help center from
 * the non-production domains.
 */
export const HELP_CENTER_BASE_URL = `${['integrator.io', 'eu.integrator.io'].includes(window.document.location.hostname.replace('www.', '')) ? '' : 'https://integrator.io'}/zendesk/sso?return_to=https://docs.celigo.com`;
export const SUBMIT_TICKET_URL =
  `${HELP_CENTER_BASE_URL}/hc/en-us/requests/new?preview_as_role=end_user`;
export const WHATS_NEW_URL =
  `${HELP_CENTER_BASE_URL}/hc/en-us/categories/360002687611`;
export const ERROR_MANAGEMENT_DOC_URL = `${HELP_CENTER_BASE_URL}/hc/en-us/articles/360048814732`;
export const RDBMS_TYPES = ['mysql', 'postgresql', 'mssql', 'snowflake', 'oracle'];
export const AS2_URLS_STAGING = [
  {
    label: 'http://api.staging.integrator.io/v1/as2',
    value: 'http://api.staging.integrator.io/v1/as2',
  },
  {
    label: 'https://api.staging.integrator.io/v1/as2',
    value: 'https://api.staging.integrator.io/v1/as2',
  },
];
export const AS2_URLS_PRODUCTION = [
  {
    label: 'http://api.integrator.io/v1/as2',
    value: 'http://api.integrator.io/v1/as2',
  },
  {
    label: 'https://api.integrator.io/v1/as2',
    value: 'https://api.integrator.io/v1/as2',
  },
];
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

export const AMPERSAND_ROUTES = [
  '/flows/create',
  '/orchestrations/create',
  '/flow-builder/v1_5/create',
  '/integrations/create',
  '/:resourceType/create',
  '/:resourceType/:resourceId/edit',
  '/data-loader',
  '/integrations/:integrationId/data-loader',
  '/integrations/:integrationId/data-loader/:flowId/edit',
  '/integrations/:integrationId/flow-builder/v1_5/:flowId/create',
  '/integrations/:integrationId/flows/:flowId/edit',
  '/integrations/:integrationId/flow-builder/v1_5/:flowId/edit',
  '/integrations/:integrationId/orchestrations/:flowId/edit',
  '/integrations/:integrationId/orchestrations/:flowId/exports/create',
  '/integrations/:integrationId/orchestrations/:flowId/:resourceType/:resourceId/edit',
  '/integrations/:integrationId/orchestrations/:flowId/:resourceType/create',
  '/integrations/:integrationId/flows/create',
  '/integrations/:_integrationId/orchestrations/create',
  '/integrations/:integrationId/flow-builder/v1_5/create',
  '/connectors/:connectorId/licenses',
  '/connectors/:connectorId/licenses/create',
  '/connectors/:connectorId/licenses/:licenseId/edit',
  '/clone/integrations/:_integrationId/:resourceType/:resourceId/preview',
  '/clone/integrations/:_integrationId/:resourceType/:resourceId/setup',
  '/my-account/audit-log',
  '/my-account',
  '/my-account/:section',
  '/connectors/:integrationId/add-new-store-for-connector',
  '/connectors/:integrationId/settings',
  '/connectors/:integrationId/settings/tokens/:accessTokenId/:accessTokenAction',
  '/connectors/:integrationId/flows/:flowId/mapping',
  '/getting-started',
  '/licensing/flowLimitReached',
  '/licensing/orchestration',
  '/licensing/orchestrationLimitReached',
  '/licensing/needSandboxAddon',
  '/licensing/start',
  '/releasenotes/list',
  '/retry/edit',
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
    'salesforce.relatedLists.referencedFields',
    'salesforce.relatedLists.parentField',
    'salesforce.relatedLists.sObjectType',
    'salesforce.relatedLists.filter',
    'salesforce.relatedLists.orderBy',
    'salesforce.relatedLists.userDefined',
    'salesforce.distributed.batchSize',
    'salesforce.soql.query',
    'schedule',
    'timeZone',
    'activeTab',
    'frequency',
    'startTime',
    'endTime',
    'daysToRunOn',
    'dayToRunOn',
    '_keepDeltaBehindFlowId',
    '_keepDeltaBehindExportId',
    'uploadFile',
    'ftp.directoryPath',
    'ftp.fileNameStartsWith',
    'ftp.fileNameEndsWith',
    'sampleData',
    'file.decompressFiles',
    'file.compressionFormat',
    'file.skipDelete',
    'file.csv',
    'test.limit',
    'delta.dateField',
    'delta.lagOffset',
    'once.booleanField',
    'restlet.delta.dateField',
    'restlet.delta.lagOffset',
    'restlet.once.booleanField',
    'restlet.type',
    '_connectionId',
  ],
  imports: [
    '_connectionId',
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
  flows: [
    '_runNextFlowIds',
    'disabled',
    'schedule',
    'timeZone',
    'activeTab',
    'frequency',
    'startTime',
    'endTime',
    'daysToRunOn',
    'dayToRunOn',
    '_keepDeltaBehindFlowId',
    '_keepDeltaBehindExportId',
  ],
});
export const CLONING_SUPPORTED_IAS = ['sfnsio'];
export const ALLOWED_HTML_TAGS =
  ['p', 'pre', 's', 'b', 'a', 'small', 'i', 'font', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'hr', 'br', 'big', 'center', 'del', 'em', 'strong', 'sub', 'sup', 'table', 'td', 'tr', 'th', 'tt', 'title'];
export const LICENSE_TRIAL_ISSUED_MESSAGE = 'Congratulations! Your 30 days of unlimited flows starts now - what will you integrate next?';
export const LICENSE_UPGRADE_REQUEST_SUBMITTED_MESSAGE = 'Your request has been received. We will contact you soon.';
export const FILE_PROVIDER_ASSISTANTS = ['googledrive'];
export const CONNECTORS_TO_IGNORE = ['yammer',
  'hybris',
  'etsy',
  'concur',
  'concurall',
  'concurv4',
  'constantcontact'];

export const WEBHOOK_ONLY_APPLICATIONS = ['webhook', 'travis-org', 'helpscout', 'errorception', 'aha', 'pagerduty', 'mailparser-io', 'dropbox', 'travis', 'sapariba',
  'box', 'segment'];

