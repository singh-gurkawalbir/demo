import { invert } from 'lodash';

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

export const RESOURCE_TYPE_SINGULAR_TO_PLURAL = Object.freeze({
  accesstoken: 'accesstokens',
  agent: 'agents',
  asynchelper: 'asynchelpers',
  connection: 'connections',
  connector: 'connectors',
  export: 'exports',
  filedefinition: 'filedefinitions',
  flow: 'flows',
  iclient: 'iclients',
  import: 'imports',
  integration: 'integrations',
  script: 'scripts',
  stack: 'stacks',
});
export const RESOURCE_TYPE_PLURAL_TO_SINGULAR = Object.freeze(
  invert(RESOURCE_TYPE_SINGULAR_TO_PLURAL)
);
export const RESOURCE_TYPE_SINGULAR_TO_LABEL = Object.freeze({
  accesstoken: 'API Token',
  asynchelper: 'Async Helper',
  connection: 'Connection',
  connector: 'Connector',
  export: 'Export',
  filedefinition: 'File Definition',
  flow: 'Flow',
  iclient: 'IClient',
  import: 'Import',
  integration: 'Integration',
  script: 'Script',
  stack: 'Stack',
});
export const PASSWORD_MASK = '******';
export const MASK_ACCESSTOKEN_TOKEN_DELAY = 5000; // milliseconds
