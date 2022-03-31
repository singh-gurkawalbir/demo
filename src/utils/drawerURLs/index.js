const DRAWER_URL_REFS = {
  SUBSCRIPTION: ':env/:type',
  INSTALL_INTEGRATION: 'installIntegration',
  SHARE_STACKS: 'share/stacks/:stackId',
  ADD_EDIT_LOOKUP: ['lookups/edit/:lookupName', 'lookups/add'],
  LOOKUP: 'lookup',
  MAPPING_SETTINGS: [
    'settings/:mappingKey',
    'settings/category/:editorId/sections/:sectionId/:depth/:mappingKey',
  ],
  CONDITIONAL_LOOKUP: ['conditionalLookup/edit/:lookupName', 'conditionalLookup/add'],
  MAPPINGS: [
    'mapping/:flowId/:importId/:subRecordMappingId/view',
    'mapping/:flowId/:importId/view',
    'mapping/:flowId/:importId',
    'mapping/:flowId',
  ],
  DB_MAPPINGS: 'dbMapping/:flowId/:importId', // pending testing
  SCRIPT_LOG_DETAILS: [  // pending testing
    'scriptLog/:scriptId/:flowId/:index',
    'scriptLog/:scriptId/:index',
  ],
  EDITOR: 'editor/:editorId',
  RESOURCE: ':operation(add|edit)/:resourceType/:id',
  ADD_RESOURCE: 'add/:resourceType/:id',
  EDIT_RESOURCE: 'edit/:resourceType/:id',
  INSTALL_TEMPLATE: 'installTemplate/preview/:templateId',
  FORM_INSTALL_STEP: 'form/:formType',  // not verified IA, addChild install/unistall
  CONFIGURE_RESOURCE_SETUP: 'configure/:resourceType/:resourceId',
  NS_SUB_RECORD: ['subrecords/:fieldId', 'subrecords'],
  SCRIPT_LOGS: 'viewLogs/:scriptId',
  CONNECTION_DEBUGGER: 'configDebugger/:connectionId',
  FLOW_GROUP_ADD_EDIT: ['flowgroups/add', 'flowgroups/edit'],
  FLOW_STEP_DEBUG_LOGS: 'logs',
  DYNA_EDITOR_EXPAND: 'expand/:formKey/:fieldId',
  EM_ERROR_DETAILS: ['errors/:resourceId/filter/:flowJobId/:errorType', 'errors/:resourceId/:errorType'],
  EM_DOWNLOAD_ERRORS: 'download/:type',
  EM_VIEW_ERROR_DETAILS: 'details/:errorId/:mode',
  JOB_VIEW_ERRORS: 'viewErrors',
  QUEUED_JOBS: ['flows/:flowId/queuedJobs', ':flowId/queuedJobs'],
  JOB_EDIT_RETRY: 'editRetry/:retryId',
  FLOW_RUN_HISTORY: ':flowId/runHistory',
  INVITE_USER: 'invite',
  MANAGE_NOTIFICATIONS_SETUP: ':userEmail/manageNotifications',
  MANAGE_USER_PERMISSIONS: 'edit/:userId',
  VIEW_NOTIFICATIONS_SETUP: ':userEmail/notifications',
  FLOW_BUILDER_HOOKS: 'hooks/:resourceType/:resourceId',
  FLOW_BUILDER_ANALYTICS: 'charts',
  REPLACE_CONNECTION: 'replaceConnection/:connId',
  FLOW_SCHEDULE: [':flowId/schedule', 'schedule'], // pending testing
  FLOW_BUILDER_SETTINGS: 'settings',
  ADD_CATEGORY_MAPPING: 'addCategory',
  CATEGORY_MAPPING: ':flowId/utilitymapping/:categoryId',
  VARIATION_MAPPING: [
    'depth/:depth/variations/:subCategoryId/:variation',
    'depth/:depth/variations/:subCategoryId',
  ],
  IA_FLOW_SETTINGS: ':flowId/settings',
  FLOW_ERROR_LIST: ':flowId/errorsList',
  ACCOUNT_UPGRADE: 'upgrade',  // not verified
  VIEW_REPORT_DETAILS: 'view/reportDetails/:reportId',
  CREATE_SNAPSHOT: 'snapshot/:revId/open',
  OPEN_PULL: 'pull/:revId/open',
  REVIEW_PULL_CHANGES: 'pull/:revisionId/review',
  MERGE_PULL_CHANGES: 'pull/:revisionId/merge',
  OPEN_REVERT: 'revert/:tempRevId/open/:revertTo/revision/:revisionId',
  REVIEW_REVERT_CHANGES: 'revert/:revisionId/review',
  FINAL_REVERT_STEP: 'revert/:revisionId/final',
  VIEW_REVISION_DETAILS: 'view/:revisionId/mode/:mode',
  VIEW_REVISION_ERROR_INFO: 'error/:errorId',
};

export const drawerPaths = {
  MAPPINGS: {
    SUB_RECORD: 'mapping/:flowId/:importId/:subRecordMappingId/view',
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
    TEMPLATE: 'installTemplate/preview/:templateId',
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
      JOB_VIEW_ERRORS: 'viewErrors',
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
  LOOKUP: 'lookup',
  ADD_LOOKUP: 'lookups/add',
  EDIT_LOOKUP: 'lookups/edit/:lookupName',
  SHARE_STACKS: 'share/stacks/:stackId',
  EDITOR: 'editor/:editorId',
  DYNA_EDITOR_EXPAND: 'expand/:formKey/:fieldId',
};

export const DRAWER_URL_PREFIX = 'ui-drawer';

function constructDrawerUrls() {
  const urlMap = {};

  Object.keys(DRAWER_URL_REFS).forEach(key => {
    const url = DRAWER_URL_REFS[key];

    if (Array.isArray(url)) {
      // updates all urls with drawer url prefix incase of multiple urls
      urlMap[key] = url.map(urlPath => `${DRAWER_URL_PREFIX}/${urlPath}`);
    } else {
      // updates the url with drawer prefix
      urlMap[key] = `${DRAWER_URL_PREFIX}/${url}`;
    }
  });

  return urlMap;
}

export const DRAWER_URLS = constructDrawerUrls();

export const hasMultipleDrawers = url =>
  !!(url.match(new RegExp(DRAWER_URL_PREFIX, 'g'))?.length > 1);

export const editorDrawerUrl = editorId => `/${DRAWER_URL_PREFIX}/editor/${editorId}`;

export const resourceUrl = (operation, resourceType, resourceId) => `/${DRAWER_URL_PREFIX}/${operation}/${resourceType}/${resourceId}`;

/**
 *
 * @param {drawerType} Key for the DRAWER_URLS to get to the target URL
 * @param {drawerIndex} Index for the list of urls against the passed key , if the DRAWER_URLS[key] is an array
 * @param {prefix}
 * ...pathProps - values for the configurable paths to replace with and get the actual path
 * Ex: For path 'settings/:mappingKey', pathProps = {mappingKey: 'key-123' }
 * Final path would be 'settings/key-123'
 */
export const getDrawerPath = ({ drawerType, prefix = '', ...pathProps}) => {
  if (!drawerType) return '';
  const drawerPath = DRAWER_URLS[drawerType];

  if (!drawerPath) return '';

  const drawerPathSegments = drawerPath.split('/').map(prop => {
    if (prop.startsWith(':')) {
      const param = prop.slice(1);

      if (!pathProps[param]) {
        throw new Error('Provide value for the Drawer path param', param);
      }

      // replace the prop with the actual value
      return pathProps[param];
    }

    return prop;
  });

  return `${prefix}/${drawerPathSegments.join('/')}`;
};
