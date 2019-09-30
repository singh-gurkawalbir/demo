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
});

export const PASSWORD_MASK = '******';
export const SUITESCRIPT_CONNECTORS = Object.freeze([
  {
    _id: 'suitescript-salesforce-netsuite',
    name: 'Salesforce - NetSuite Connector',
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
export const SECONDS_IN_A_DAY = 24 * 60 * 60 * 1000;
