const DRAWER_URL_REFS = {
  SUBSCRIPTION: ':env/:type', // TODO: add a name space in between env & type
  // ---------------------------------------------------------------------
  INSTALL_INTEGRATION: 'installIntegration', // done
  SHARE_STACKS: 'share/stacks/:stackId', // done
  ADD_EDIT_LOOKUP: ['lookups/edit/:lookupName', 'lookups/add'], // done
  LOOKUP: 'lookup', // done
  MAPPING_SETTINGS: [
    'settings/:mappingKey',
    'settings/category/:editorId/sections/:sectionId/:depth/:mappingKey',
  ], // done
  CONDITIONAL_LOOKUP: ['conditionalLookup/edit/:lookupName', 'conditionalLookup/add'], // done
  MAPPINGS: [ // done
    'mapping/:flowId/:importId/:subRecordMappingId/view',
    'mapping/:flowId/:importId/view',
    'mapping/:flowId/:importId',
    'mapping/:flowId',
  ],
  DB_MAPPINGS: 'dbMapping/:flowId/:importId', // done - pending testing
  SCRIPT_LOG_DETAILS: [ // done - pending testing
    'scriptLog/:scriptId/:flowId/:index',
    'scriptLog/:scriptId/:index',
  ],
  EDITOR: 'editor/:editorId', // done -  pending testing
  RESOURCE: ':operation(add|edit)/:resourceType/:id', // done - pending testing
  INSTALL_TEMPLATE: 'installTemplate/preview/:templateId', // done - global search not verified
  FORM_INSTALL_STEP: 'form/:formType', // done - not verified IA, addChild install/unistall
  CONFIGURE_RESOURCE_SETUP: 'configure/:resourceType/:resourceId', // done - not verified IA, addChild install/unistall
  NS_SUB_RECORD: ['subrecords/:fieldId', 'subrecords'],
  SCRIPT_LOGS: 'viewLogs/:scriptId',
  CONNECTION_DEBUGGER: 'configDebugger/:connectionId', // done
  FLOW_GROUP_ADD_EDIT: ['flowgroups/add', 'flowgroups/edit'], // done
  FLOW_STEP_DEBUG_LOGS: 'logs', // done
  DYNA_EDITOR_EXPAND: 'expand/:formKey/:fieldId', // done
  EM_ERROR_DETAILS: ['errors/:resourceId/filter/:flowJobId/:errorType', 'errors/:resourceId/:errorType'], // done
  EM_DOWNLOAD_ERRORS: 'download/:type', // done
  EM_VIEW_ERROR_DETAILS: 'details/:errorId/:mode', // done
  JOB_VIEW_ERRORS: 'viewErrors', // done
  QUEUED_JOBS: ['flows/:flowId/queuedJobs', ':flowId/queuedJobs'], // done
  JOB_EDIT_RETRY: 'editRetry/:retryId', // done
  FLOW_RUN_HISTORY: ':flowId/runHistory', // done
  INVITE_USER: 'invite', // done
  MANAGE_NOTIFICATIONS_SETUP: ':userEmail/manageNotifications', // done
  MANAGE_USER_PERMISSIONS: 'edit/:userId', // done
  VIEW_NOTIFICATIONS_SETUP: ':userEmail/notifications', // done
  FLOW_BUILDER_HOOKS: 'hooks/:resourceType/:resourceId', // done
  FLOW_BUILDER_ANALYTICS: 'charts', // done
  REPLACE_CONNECTION: 'replaceConnection/:connId', // done
  FLOW_SCHEDULE: [':flowId/schedule', 'schedule'], // done - pending testing
  FLOW_BUILDER_SETTINGS: 'settings', // done
  ADD_CATEGORY_MAPPING: 'addCategory', // done
  CATEGORY_MAPPING: ':flowId/utilitymapping/:categoryId', // done
  VARIATION_MAPPING: [ // done
    'depth/:depth/variations/:subCategoryId/:variation',
    'depth/:depth/variations/:subCategoryId',
  ],
  IA_FLOW_SETTINGS: ':flowId/settings', // done
  FLOW_ERROR_LIST: ':flowId/errorsList', // done
  ACCOUNT_UPGRADE: 'upgrade', // done - ** but not verified
  VIEW_REPORT_DETAILS: 'view/reportDetails/:reportId', // done
  CREATE_SNAPSHOT: 'snapshot/:revId/open', // done
  OPEN_PULL: 'pull/:revId/open', // done
  REVIEW_PULL_CHANGES: 'pull/:revisionId/review', // done
  MERGE_PULL_CHANGES: 'pull/:revisionId/merge', // done
  OPEN_REVERT: 'revert/:tempRevId/open/:revertTo/revision/:revisionId', // done
  REVIEW_REVERT_CHANGES: 'revert/:revisionId/review', // done
  FINAL_REVERT_STEP: 'revert/:revisionId/final', // done
  VIEW_REVISION_DETAILS: 'view/:revisionId/mode/:mode', // done
  VIEW_REVISION_ERROR_INFO: 'error/:errorId', // done
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

