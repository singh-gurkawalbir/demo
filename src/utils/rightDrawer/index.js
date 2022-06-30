export const DRAWER_URL_PREFIX = 'ui-drawer';

export const drawerPaths = {
  MAPPINGS: {
    DB: 'dbMapping/:flowId/:importId',
    SUB_RECORD: 'mapping/:flowId/:importId/:subRecordMappingId/view',
    QUERY_BUILDER: 'queryBuilder/:flowId/:importId/:index/view',
    IMPORT: {
      ROOT: 'mapping/:flowId/:importId',
      LIST_ALL: 'mapping/:flowId',
      VIEW: 'mapping/:flowId/:importId/view',
    },
    CATEGORY_MAPPING: {
      ROOT: ':flowId/utilitymapping/:categoryId',
      ADD: 'addCategory',
      VARIATION_MAPPING: {
        ROOT: 'depth/:depth/variations/:subCategoryId',
        VARIATION: 'depth/:depth/variations/:subCategoryId/:variation',
      },
    },
    SETTINGS: 'settings/:mappingKey',
    V2_SETTINGS: 'settings/v2/:nodeKey/:generate',
    CATEGORY_MAPPING_SETTINGS: 'settings/category/:editorId/sections/:sectionId/:depth/:mappingKey',
    CONDITIONAL_LOOKUP: {
      ADD: 'conditionalLookup/add',
      EDIT: 'conditionalLookup/edit/:lookupName',
    },
  },
  ACCOUNT: {
    VIEW_REPORT_DETAILS: 'view/reportDetails/:reportId',
    SUBSCRIPTION: ':env/:type',
    UPGRADE: 'upgrade',
    INVITE_USER: 'invite',
    MANAGE_NOTIFICATIONS_SETUP: ':userEmail/manageNotifications',
    MANAGE_USER_PERMISSIONS: 'edit/:userId',
    VIEW_NOTIFICATIONS_SETUP: ':userEmail/notifications',
  },
  LCM: {
    CREATE_SNAPSHOT: 'snapshot/:revId/open',
    OPEN_PULL: 'pull/:revId/open',
    REVIEW_PULL_CHANGES: 'pull/:revisionId/review',
    MERGE_PULL_CHANGES: 'pull/:revisionId/merge',
    OPEN_REVERT: 'revert/:tempRevId/open/:revertTo/revision/:revisionId',
    REVIEW_REVERT_CHANGES: 'revert/:revisionId/review',
    FINAL_REVERT_STEP: 'revert/:revisionId/final',
    VIEW_REVISION_DETAILS: 'view/:revisionId/mode/:mode',
    VIEW_REVISION_ERROR_INFO: 'error/:errorId',
  },
  INSTALL: {
    INTEGRATION: 'installIntegration',
    INTEGRATION_PREVIEW: 'preview/:templateId',
    TEMPLATE_PREVIEW: 'installTemplate/preview/:templateId',
    FORM_STEP: 'form/:formType',
    CONFIGURE_RESOURCE_SETUP: 'configure/:resourceType/:resourceId',
  },
  FLOW_BUILDER: {
    RUN_HISTORY: ':flowId/runHistory',
    HOOKS: 'hooks/:resourceType/:resourceId',
    ANALYTICS: 'charts',
    SCHEDULE: 'schedule',
    FLOW_SCHEDULE: ':flowId/schedule',
    SETTINGS: 'settings',
    IA_SETTINGS: ':flowId/settings',
  },
  ERROR_MANAGEMENT: {
    V1: {
      VIEW_JOB_ERRORS: 'viewErrors',
      FLOW_LEVEL_QUEUED_JOBS: ':flowId/queuedJobs',
      INTEGRATION_LEVEL_QUEUED_JOBS: 'flows/:flowId/queuedJobs',
      JOB_EDIT_RETRY: 'editRetry/:retryId',
    },
    V2: {
      ERROR_DETAILS: 'errors/:resourceId/:errorType',
      JOB_ERROR_DETAILS: 'errors/:resourceId/filter/:flowJobId/:errorType',
      DOWNLOAD_ERRORS: 'download/:type',
      VIEW_ERROR_DETAILS: 'details/:errorId/:mode',
      FLOW_ERROR_LIST: ':flowId/errorsList',
    },
  },
  LOGS: {
    SCRIPT: 'viewLogs/:scriptId',
    FLOW_SCRIPT_DETAIL: 'scriptLog/:scriptId/:flowId/:index',
    SCRIPT_DETAIL: 'scriptLog/:scriptId/:index',
    FLOW_STEP_DEBUG: 'logs',
  },
  RESOURCE: {
    ROOT: ':operation(add|edit)/:resourceType/:id',
    ADD: 'add/:resourceType/:id',
    EDIT: 'edit/:resourceType/:id',
  },
  CONNECTION: {
    DEBUGGER: 'configDebugger/:connectionId',
    REPLACE: 'replaceConnection/:connId',
  },
  NS_SUB_RECORD: {
    ADD: 'subrecords',
    EDIT: 'subrecords/:fieldId',
  },
  FLOW_GROUP: {
    ADD: 'flowgroups/add',
    EDIT: 'flowgroups/edit',
  },
  LOOKUP: {
    ROOT: 'lookup',
    ADD: 'lookup/add',
    EDIT: 'lookup/edit',
  },
  LOOKUPS: {
    ADD: 'lookups/add',
    EDIT: 'lookups/edit/:lookupName',
  },
  ALIASES: {
    ADD: 'add',
    EDIT: 'edit/:aliasId',
    VIEW_DETAILS: 'viewdetails/:aliasId',
    VIEW_INHERITED_DETAILS: 'viewdetails/:aliasId/inherited/:parentResourceId',
    MANAGE: 'aliases/manage',
    VIEW: 'aliases/view',
  },
  SHARE_STACKS: 'share/stacks/:stackId',
  EDITOR: 'editor/:editorId',
  DYNA_EDITOR_EXPAND: 'expand/:formKey/:fieldId',
  PREVIEW_PANEL_MOCK_INPUT: 'inputData',
};

export const hasMultipleDrawers = url =>
  !!(url.match(new RegExp(DRAWER_URL_PREFIX, 'g'))?.length > 1);

/**
 * @param {path} String Drawer path that the Drawer listens to
 * @param {baseUrl} String the base url to which the drawer path gets appended to
 * @param {params} Object values for the configurable paths to replace with and get the actual path
 * Ex: For path 'settings/:mappingKey', params = {mappingKey: 'key-123' }
 * Final path would be 'settings/key-123'
 */
export const buildDrawerUrl = ({ path, baseUrl = '', params = {} }) => {
  if (!path) return '';

  const drawerPath = Object.keys(params).reduce(
    (url, param) => url.replace(`:${param}`, params[param]),
    path);

  return `${baseUrl}/${drawerPath}`;
};
