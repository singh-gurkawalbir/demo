export const ACCOUNT_IDS = Object.freeze({
  OWN: 'own',
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
export const ACCOUNT_SSO_STATUS = Object.freeze({
  NOT_LINKED: 'not_linked',
  LINKED_TO_THIS_ACCOUNT: 'this_account',
  LINKED_TO_OTHER_ACCOUNT: 'other_account',
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
  iClients: {
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
export const SIGNUP_SEARCH_PARAMS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_term',
  'utm_content',
  'session_id',
  'referer',
  'site_url',
];
