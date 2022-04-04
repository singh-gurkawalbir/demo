export const DRAWER_URL_PREFIX = 'ui-drawer';

export const drawerPaths = {
  MAPPINGS: { // done
    DB: 'dbMapping/:flowId/:importId', // pending testing
    SUB_RECORD: 'mapping/:flowId/:importId/:subRecordMappingId/view',
    QUERY_BUILDER: 'queryBuilder/:flowId/:importId/:index/view', // pending testing
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
  ACCOUNT: { // done
    VIEW_REPORT_DETAILS: 'view/reportDetails/:reportId',
    SUBSCRIPTION: ':env/:type',
    UPGRADE: 'upgrade',
    INVITE_USER: 'invite',
    MANAGE_NOTIFICATIONS_SETUP: ':userEmail/manageNotifications',
    MANAGE_USER_PERMISSIONS: 'edit/:userId',
    VIEW_NOTIFICATIONS_SETUP: ':userEmail/notifications',
  },
  LCM: { // done
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
  INSTALL: { // done
    INTEGRATION: 'installIntegration',
    INTEGRATION_PREVIEW: 'preview/:templateId',
    TEMPLATE_PREVIEW: 'installTemplate/preview/:templateId',
    FORM_STEP: 'form/:formType',
    CONFIGURE_RESOURCE_SETUP: 'configure/:resourceType/:resourceId',
  },
  FLOW_BUILDER: { // done
    RUN_HISTORY: ':flowId/runHistory',
    HOOKS: 'hooks/:resourceType/:resourceId',
    ANALYTICS: 'charts',
    SCHEDULE: 'schedule',
    FLOW_SCHEDULE: ':flowId/schedule',
    SETTINGS: 'settings',
    IA_SETTINGS: ':flowId/settings',
  },
  ERROR_MANAGEMENT: {
    V1: { // done
      VIEW_JOB_ERRORS: 'viewErrors',
      FLOW_LEVEL_QUEUED_JOBS: ':flowId/queuedJobs',
      INTEGRATION_LEVEL_QUEUED_JOBS: 'flows/:flowId/queuedJobs',
      JOB_EDIT_RETRY: 'editRetry/:retryId',
    },
    V2: { // done
      ERROR_DETAILS: 'errors/:resourceId/:errorType',
      JOB_ERROR_DETAILS: 'errors/:resourceId/filter/:flowJobId/:errorType',
      DOWNLOAD_ERRORS: 'download/:type',
      VIEW_ERROR_DETAILS: 'details/:errorId/:mode',
      FLOW_ERROR_LIST: ':flowId/errorsList',
    },
  },
  LOGS: { // done
    SCRIPT: 'viewLogs/:scriptId',
    FLOW_SCRIPT_DETAIL: 'scriptLog/:scriptId/:flowId/:index',
    SCRIPT_DETAIL: 'scriptLog/:scriptId/:index',
    FLOW_STEP_DEBUG: 'logs',
  },
  RESOURCE: { // done
    ROOT: ':operation(add|edit)/:resourceType/:id',
    ADD: 'add/:resourceType/:id',
    EDIT: 'edit/:resourceType/:id',
  },
  CONNECTION: { // done
    DEBUGGER: 'configDebugger/:connectionId',
    REPLACE: 'replaceConnection/:connId',
  },
  NS_SUB_RECORD: { // done
    ADD: 'subrecords',
    EDIT: 'subrecords/:fieldId',
  },
  FLOW_GROUP: { // done
    ADD: 'flowgroups/add',
    EDIT: 'flowgroups/edit',
  },
  LOOKUP: { // done
    ROOT: 'lookup',
    ADD: 'lookup/add',
    EDIT: 'lookup/edit',
  },
  LOOKUPS: { // done
    ADD: 'lookups/add',
    EDIT: 'lookups/edit/:lookupName',
  },
  SHARE_STACKS: 'share/stacks/:stackId', // done
  EDITOR: 'editor/:editorId', // done
  DYNA_EDITOR_EXPAND: 'expand/:formKey/:fieldId', // done
};

export const hasMultipleDrawers = url =>
  !!(url.match(new RegExp(DRAWER_URL_PREFIX, 'g'))?.length > 1);

/**
 *
 * @param {drawerType} Key for the DRAWER_URLS to get to the target URL
 * @param {drawerIndex} Index for the list of urls against the passed key , if the DRAWER_URLS[key] is an array
 * @param {prefix}
 * ...pathProps - values for the configurable paths to replace with and get the actual path
 * Ex: For path 'settings/:mappingKey', pathProps = {mappingKey: 'key-123' }
 * Final path would be 'settings/key-123'
 */
export const buildDrawerUrl = ({ path, baseUrl = '', params = {} }) => {
  if (!path) return '';

  const drawerPath = Object.keys(params).reduce(
    (url, param) => url.replace(`:${param}`, params[param]),
    path);

  return `${baseUrl}/${DRAWER_URL_PREFIX}/${drawerPath}`;
};
