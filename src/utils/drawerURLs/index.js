const DRAWER_URL_REFS = {
  SUBSCRIPTION: ':env/:type', // TODO: add a name space in between env & type
  // ---------------------------------------------------------------------
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
  EDITOR: 'editor/:editorId',  // pending testing
  RESOURCE: ':operation(add|edit)/:resourceType/:id',  // pending testing
  INSTALL_TEMPLATE: 'installTemplate/preview/:templateId',
  FORM_INSTALL_STEP: 'form/:formType',  // not verified IA, addChild install/unistall
  CONFIGURE_RESOURCE_SETUP: 'configure/:resourceType/:resourceId',  // not verified IA, addChild install/unistall
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

