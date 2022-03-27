const DRAWER_URL_REFS = {
  EDITOR: 'editor/:editorId',
  CONNECTION_DEBUGGER: 'configDebugger/:connectionId',
  FLOW_GROUP_ADD_EDIT: ['flowgroups/add', 'flowgroups/edit'],
  FLOW_STEP_DEBUG_LOGS: 'logs',
  INSTALL_INTEGRATION: 'installIntegration',
  INSTALL_TEMPLATE: 'installTemplate',
  LOOKUP: 'lookup', // has URL redirection for drawer content
  RESOURCE: ':operation(add|edit)/:resourceType/:id',
  DYNA_EDITOR_EXPAND: 'expand/:formKey/:fieldId',
  DYNA_NS_SUBRECORD: ['subrecords/:fieldId', 'subrecords'],
  CONDITIONAL_LOOKUP: ['conditionalLookup/edit/:lookupName', 'conditionalLookup/add'],
  ADD_EDIT_LOOKUP: ['lookups/edit/:lookupName', 'lookups/add'], // Is it linked with Line: 8 lookup ?
  EM_ERROR_DETAILS: ['errors/:resourceId/filter/:flowJobId/:errorType', 'errors/:resourceId/:errorType'], // done
  EM_DOWNLOAD_ERRORS: 'download/:type', // done
  EM_VIEW_ERROR_DETAILS: 'details/:errorId/:mode', // done
  FORM_INSTALL_STEP: 'form/:formType',
  JOB_VIEW_ERRORS: 'viewErrors',
  QUEUED_JOBS: ['flows/:flowId/queuedJobs', ':flowId/queuedJobs'],
  JOB_EDIT_RETRY: 'editRetry/:retryId',
  FLOW_RUN_HISTORY: ':flowId/runHistory',
  INVITE_USER: 'invite',
  MANAGE_NOTIFICATIONS_SETUP: ':userEmail/manageNotifications',
  MANAGE_USER_PERMISSIONS: 'edit/:userId',
  VIEW_NOTIFICATIONS_SETUP: ':userEmail/notifications',
  MAPPING_SETTINGS: [
    'settings/:mappingKey',
    'settings/category/:editorId/sections/:sectionId/:depth/:mappingKey',
  ],
  CONFIGURE_RESOURCE_SETUP: 'configure/:resourceType/:resourceId',
  SHARE_STACKS: 'share/stacks/:stackId',
  HOOKS: 'hooks/:resourceType/:resourceId',
  LINE_GRAPH: 'charts',
  REPLACE_CONNECTION: 'replaceConnection/:connId',
  FLOW_SCHEDULE: [':flowId/schedule', 'schedule'],
  SETTINGS: 'settings',
  ADD_CATEGORY_MAPPING: ':flowId/utilitymapping/:categoryId/addCategory',
  CATEGORY_MAPPING: ':flowId/utilitymapping/:categoryId',
  VARIATION_MAPPING_ATTRIBUTES: ':flowId/utilitymapping/:categoryId/depth/:depth/variationAttributes/:subCategoryId',
  VARIATION_MAPPING: [
    ':flowId/utilitymapping/:categoryId/depth/:depth/variations/:subCategoryId/:variation',
    ':flowId/utilitymapping/:categoryId/depth/:depth/variations/:subCategoryId',
  ],
  FLOW_SETTINGS: ':flowId/settings',
  FLOW_ERROR_LIST: ':flowId/errorsList',
  MAPPINGS: [
    'mapping/:flowId/:importId/:subRecordMappingId/view',
    'mapping/:flowId/:importId/view',
    'mapping/:flowId/:importId',
    'mapping/:flowId',
  ],
  DB_MAPPINGS: 'dbMapping/:flowId/:importId',
  UPGRADE: 'upgrade',
  SUBSCRIPTION: ':env/:type', // TODO: add a name space in between env & type
  VIEW_REPORT_DETAILS: 'view/reportDetails/:reportId',
  SCRIPT_LOG_DETAILS: [
    'scriptLog/:scriptId/:flowId/:index',
    'scriptLog/:scriptId/:index',
  ],
  SCRIPT_LOGS: 'viewLogs/:scriptId',
  CREATE_SNAPSHOT: 'snapshot/:revId/open',
  MERGE_PULL_CHANGES: 'pull/:revisionId/merge',
  OPEN_PULL: 'pull/:revId/open',
  REVIEW_PULL_CHANGES: 'pull/:revisionId/review',
  FINAL_REVERT_STEP: 'revert/:revisionId/final',
  OPEN_REVERT: 'revert/:tempRevId/open/:revertTo/revision/:revisionId',
  REVIEW_REVERT_CHANGES: 'revert/:revisionId/review',
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

