export const AUDIT_LOG_SOURCE_LABELS = {
  ui: 'UI',
  api: 'API',
  connector: 'Integration app',
  stack: 'Stack',
  system: 'System',
  sso: 'SSO',
};
export const AUDIT_LOG_EVENT_LABELS = {
  create: 'Create',
  update: 'Update',
  delete: 'Delete',
  signin: 'Sign in',
  signout: 'Sign out',
  view: 'View',
};

export const DEFAULT_ROWS_PER_PAGE = 50;
export const ROWS_PER_PAGE_OPTIONS = [50, 100, 500, 1000];
export const AUDIT_LOG_PAGING_FILTER_KEY = 'auditLogs';
