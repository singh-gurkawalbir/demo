const PATCH_FILTER = 'PATCH_FILTER';
const CLEAR_FILTER = 'CLEAR_FILTER';
const EDITOR_INIT = 'EDITOR_INIT';
const EDITOR_CHANGE_LAYOUT = 'EDITOR_CHANGE_LAYOUT';
const EDITOR_PATCH = 'EDITOR_PATCH';
const EDITOR_RESET = 'EDITOR_RESET';
const EDITOR_EVALUATE_REQUEST = 'EDITOR_EVALUATE_REQUEST';
const EDITOR_EVALUATE_RESPONSE = 'EDITOR_EVALUATE_RESPONSE';
const EDITOR_EVALUATE_FAILURE = 'EDITOR_EVALUATE_FAILURE';
const EDITOR_VALIDATE_FAILURE = 'EDITOR_VALIDATE_FAILURE';
const EDITOR_SAVE = 'EDITOR_SAVE';
const EDITOR_SAVE_FAILED = 'EDITOR_SAVE_FAILED';
const EDITOR_SAVE_COMPLETE = 'EDITOR_SAVE_COMPLETE';

export const CREATED = 'CREATED';
export const REQUEST = 'REQUEST';
export const REQUEST_COLLECTION = 'REQUEST_COLLECTION';
export const RECEIVED = 'RECEIVED';
export const RECEIVED_COLLECTION = 'RECEIVED_COLLECTION';
export const UPDATED = 'UPDATED';
const DELETE = 'DELETE';
const PATCH = 'PATCH';
const DELETED = 'DELETED';
const REFERENCES_REQUEST = 'REFERENCES_REQUEST';
const REFERENCES_CLEAR = 'REFERENCES_CLEAR';
const REFERENCES_RECEIVED = 'REFERENCES_RECEIVED';
const DOWNLOAD_FILE = 'DOWNLOAD_FILE';
const CLEAR_COLLECTION = 'CLEAR_COLLECTION';
const UPDATE_NOTIFICATIONS = 'UPDATE_NOTIFICATIONS';
const METADATA = {
  REQUEST: 'REQUEST_METADATA',
  REFRESH: 'REFRESH_METADATA',
  RECEIVED: 'RECEIVED_METADATA',
  RECEIVED_ERROR: 'RECEIVED_ERROR',
  ASSISTANT_REQUEST: 'REQUEST_ASSISTANT',
  ASSISTANT_RECEIVED: 'RECEIVED_ASSISTANT',
  ASSISTANT_PREVIEW_RECEIVED: 'METADATA_ASSISTANT_PREVIEW_RECEIVED',
  ASSISTANT_PREVIEW_REQUESTED: 'METADATA_ASSISTANT_PREVIEW_REQUESTED',
  ASSISTANT_PREVIEW_RESET: 'METADATA_ASSISTANT_PREVIEW_RESET',
};
const FILE_DEFINITIONS = {
  PRE_BUILT: {
    REQUEST: 'REQUEST_PRE_BUILT_FILE_DEFINITIONS',
    RECEIVED: 'RECEIVED_PRE_BUILT_FILE_DEFINITIONS',
    RECEIVED_ERROR: 'RECEIVED_PRE_BUILT_FILE_DEFINITIONS_ERROR',
  },
  DEFINITION: {
    PRE_BUILT: {
      UPDATE: 'UPDATE_PRE_BUILT_DEFINITION',
      RECEIVED: 'RECEIVED_PRE_BUILT_DEFINITION',
      RECEIVED_ERROR: 'RECEIVED_PRE_BUILT_DEFINITION_ERROR',
    },
    USER_DEFINED: {
      SAVE: 'SAVE_USER_DEFINED_FILE_DEFINITION',
    },
  },
};
const CONNECTORS = {
  METADATA_REQUEST: 'CONNECTORS_REFRESH_METADATA',
  METADATA_RECEIVED: 'CONNECTORS_RECEIVED_METADATA',
  METADATA_FAILURE: 'CONNECTORS_RECEIVED_ERROR_REFRESH_METADATA',
  METADATA_CLEAR: 'CONNECTORS_METADATA_CLEAR',
  INSTALLBASE: {
    UPDATE: 'UPDATE',
  },
};
const NETSUITE_USER_ROLES = {
  REQUEST: 'NETSUITE_USER_ROLES_REQUEST',
  RECEIVED: 'NETSUITE_USER_ROLES_RECEIVED',
  FAILED: 'NETSUITE_USER_ROLES_REQUEST_FAILED',
  CLEAR: 'NETSUITE_USER_ROLES_CLEAR',
};
const TOKEN = {
  REQUEST: 'REQUEST_TOKEN',
  RECEIVED: 'RECEIVED_TOKEN',
  FAILED: 'REQUEST_TOKEN_FAILED',
  CLEAR: 'CLEAR_TOKEN',
};
const SAMPLEDATA = {
  REQUEST: 'REQUEST_SAMPLEDATA',
  LOOKUP_REQUEST: 'REQUEST_LOOKUP_SAMPLEDATA',
  RECEIVED: 'RECEIVED_SAMPLEDATA',
  RECEIVED_ERROR: 'RECEIVED_SAMPLEDATA_ERROR',
  UPDATE: 'UPDATE_SAMPLEDATA',
  SAVE_RAWDATA: 'SAVE_RAWDATA',
  RESET: 'RESET_SAMPLEDATA',
};
const IMPORT_SAMPLEDATA = {
  REQUEST: 'REQUEST_IMPORT_SAMPLEDATA',
};
const FLOW_DATA = {
  INIT: 'FLOW_DATA_INIT',
  PREVIEW_DATA_REQUEST: 'REQUEST_FLOW_DATA_PREVIEW',
  PREVIEW_DATA_RECEIVED: 'RECEIVED_FLOW_DATA_PREVIEW',
  PROCESSOR_DATA_REQUEST: 'REQUEST_FLOW_DATA_PROCESSOR',
  PROCESSOR_DATA_RECEIVED: 'RECEIVED_FLOW_DATA_PROCESSOR',
  RECEIVED_ERROR: 'RECEIVED_FLOW_DATA_ERROR',
  SAMPLE_DATA_REQUEST: 'REQUEST_FLOW_SAMPLE_DATA',
  STAGE_REQUEST: 'REQUEST_FLOW_DATA_STAGE',
  RESET: 'RESET_FLOW_DATA',
  FLOW_SEQUENCE_RESET: 'RESET_FLOW_SEQUENCE',
  FLOWS_FOR_RESOURCE_UPDATE: 'UPDATE_FLOWS_FOR_RESOURCE_FLOW_DATA',
  FLOW_UPDATE: 'UPDATE_FLOW_DATA',
  FLOW_RESPONSE_MAPPING_UPDATE: 'UPDATE_FLOW_DATA_RESPONSE_MAPPING',
};
const CANCEL_TASK = 'CANCEL_TASK';
const ICLIENTS = 'ICLIENTS';
const STAGE_PATCH = 'STAGE_PATCH';
const STAGE_CLEAR = 'STAGE_CLEAR';
const STAGE_UNDO = 'STAGE_UNDO';
const STAGE_REMOVE = 'STAGE_REMOVE';
const STAGE_COMMIT = 'STAGE_COMMIT';
const STAGE_CONFLICT = 'STAGE_CONFLICT';
const CLEAR_CONFLICT = 'CLEAR_CONFLICT';
const PATCH_FORM_FIELD = 'PATCH_FORM_FIELD';
const INIT_CUSTOM_FORM = 'INIT_CUSTOM_FORM';
// The API_* action types below are used for managing network activity.
// Typically this set of actions are only dispatched in Redux Sagas.
const API_REQUEST = 'API_REQUEST';
const API_COMPLETE = 'API_COMPLETE';
const API_RETRY = 'API_RETRY';
const API_FAILURE = 'API_FAILURE';
const AUTH_WARNING = 'AUTH_WARNING';
const AUTH_REQUEST_REDUCER = 'AUTH_REQUEST_REDUCER';
const AUTH_REQUEST = 'AUTH_REQUEST';
const AUTH_SIGNIN_WITH_GOOGLE = 'AUTH_SIGNIN_WITH_GOOGLE';
const AUTH_RE_SIGNIN_WITH_GOOGLE = 'AUTH_RE_SIGNIN_WITH_GOOGLE';
const AUTH_LINK_WITH_GOOGLE = 'AUTH_LINK_WITH_GOOGLE';
const AUTH_SUCCESSFUL = 'AUTH_SUCCESSFUL';
const AUTH_FAILURE = 'AUTH_FAILURE';
const AUTH_TIMESTAMP = 'AUTH_UPDATE_TIMESTAMP';
const USER_LOGOUT = 'USER_LOGOUT';
const USER_CHANGE_PASSWORD = 'USER_CHANGE_PASSWORD';
const USER_CHANGE_EMAIL = 'USER_CHANGE_EMAIL';
const CLEAR_STORE = 'CLEAR_STORE';
const DELETE_PROFILE = 'DELETE_PROFILE';
const UPDATE_PROFILE = 'UPDATE_PROFILE';
const UPDATE_PREFERENCES = 'UPDATE_PREFERENCES';
const UNLINK_WITH_GOOGLE = 'UNLINK_WITH_GOOGLE';
const UNLINKED_WITH_GOOGLE = 'UNLINKED_WITH_GOOGLE';
const TOGGLE_DEBUG = 'TOGGLE_DEBUG';
const INIT_SESSION = 'INIT_SESSION';
const POST_FEEDBACK = 'POST_FEEDBACK';
const APP_RELOAD = 'APP_RELOAD';
const APP_ERRORED = 'APP_ERRORED';
const APP_CLEAR_ERROR = 'APP_CLEAR_ERROR';
const APP_TOGGLE_DRAWER = 'APP_TOGGLE_DRAWER';
const APP_TOGGLE_BANNER = 'APP_TOGGLE_BANNER';
const CLEAR_COMMS = 'CLEAR_COMMS';
const CLEAR_COMM_BY_KEY = 'CLEAR_COMM_BY_KEY';
const EDITOR_UPDATE_HELPER_FUNCTIONS = 'EDITOR_UPDATE_HELPER_FUNCTIONS';
const EDITOR_REFRESH_HELPER_FUNCTIONS = 'EDITOR_REFRESH_HELPER_FUNCTIONS';
const MAPPING = {
  INIT: 'MAPPING_INIT',
  PATCH_FIELD: 'MAPPING_PATCH_FIELD',
  PATCH_INCOMPLETE_GENERATES: 'MAPPING_PATCH_INCOMPLETE_GENERATES',
  UPDATE_IMPORT_SAMPLE_DATA: 'MAPPING_UPDATE_IMPORT_SAMPLE_DATA',
  PATCH_SETTINGS: 'MAPPING_PATCH_SETTINGS',
  SET_VISIBILITY: 'MAPPING_SET_VISIBILITY',
  DELETE: 'MAPPING_DELETE',
  UPDATE_LOOKUP: 'MAPPING_UPDATE_LOOKUP',
  SAVE: 'MAPPING_SAVE',
  SAVE_COMPLETE: 'MAPPING_SAVE_COMPLETE',
  SAVE_FAILED: 'MAPPING_SAVE_FAILED',
  UPDATE_FLOW_DATA: 'MAPPING_UPDATE_FLOW_DATA',
  PREVIEW_REQUESTED: 'MAPPING_PREVIEW_REQUESTED',
  PREVIEW_RECEIVED: 'MAPPING_PREVIEW_RECEIVED',
  PREVIEW_FAILED: 'MAPPING_PREVIEW_FAILED',
  CHANGE_ORDER: 'MAPPING_CHANGE_ORDER',
};
const SEARCH_CRITERIA = {
  INIT: 'SEARCH_CRITERIA_INIT',
  PATCH_FIELD: 'SEARCH_CRITERIA_PATCH_FIELD',
  DELETE: 'SEARCH_CRITERIA_DELETE',
};
const baseResourceActions = [
  CREATED,
  REQUEST,
  REQUEST_COLLECTION,
  RECEIVED,
  RECEIVED_COLLECTION,
  UPDATED,
];
const stageResourceActions = [
  STAGE_PATCH,
  STAGE_CLEAR,
  STAGE_UNDO,
  STAGE_REMOVE,
  STAGE_COMMIT,
  STAGE_CONFLICT,
  CLEAR_CONFLICT,
  PATCH_FORM_FIELD,
  INIT_CUSTOM_FORM,
];
const resourceSpecificActions = [
  DELETE,
  DELETED,
  PATCH,
  REFERENCES_REQUEST,
  REFERENCES_CLEAR,
  REFERENCES_RECEIVED,
  DOWNLOAD_FILE,
  CLEAR_COLLECTION,
  UPDATE_NOTIFICATIONS,
];

function createResourceActionTypes(base, supportedActions) {
  return supportedActions.reduce((acc, type) => {
    acc[type] = `${base}_${type}`;

    return acc;
  }, {});
}

const PROFILE = createResourceActionTypes('PROFILE', baseResourceActions);
const RESOURCE = createResourceActionTypes('RESOURCE', [
  ...baseResourceActions,
  ...stageResourceActions,
  ...resourceSpecificActions,
]);
const RESOURCE_FORM = {
  INIT: 'RESOURCE_FORM_INIT',
  INIT_COMPLETE: 'RESOURCE_FORM_INIT_COMPLETE',
  CLEAR_INIT_DATA: 'RESOURCE_FORM_CLEAR_INIT_DATA',
  SHOW_FORM_VALIDATION_ERRORS: 'RESOURCE_FORM_SHOW_FORM_VALIDATION_ERRORS',
  SUBMIT: 'RESOURCE_FORM_SUBMIT',
  SUBMIT_COMPLETE: 'RESOURCE_FORM_SUBMIT_COMPLETE',
  SUBMIT_FAILED: 'RESOURCE_FORM_SUBMIT_FAILED',
  SUBMIT_ABORTED: 'RESOURCE_FORM_SUBMIT_ABORTED',
  CLEAR: 'RESOURCE_FORM_CLEAR',
  SAVE_AND_AUTHORIZE: 'SAVE_AND_AUTHORIZE',
  COMMIT_AND_AUTHORIZE: 'COMMIT_AND_AUTHORIZE',
  SAVE_AND_CONTINUE: 'SAVE_AND_CONTINUE',
};
const INTEGRATION_APPS = {
  INSTALLER: {
    STEP: {
      REQUEST: 'INTEGRATION_APPS_STEP_REQUEST',
      UPDATE: 'INTEGRATION_APPS_STEP_UPDATE',
      DONE: 'INTEGRATION_APPS_STEP_COMPLETE',
      SCRIPT_REQUEST: 'INTEGRATION_APPS_STEP_SCRIPT_REQUEST',
    },
  },
  UNINSTALLER: {
    PRE_UNINSTALL: 'INTEGRATION_APPS_UNINSTALLER_PRE_UNINSTALL',
    RECEIVED_STEPS: 'INTEGRATION_APPS_UNINSTALLER_RECEIVED_STEPS',
    DELETE_INTEGRATION: 'INTEGRATION_APPS_UNINSTALLER_DELETE_INTEGRATION',
    FAILED_UNINSTALL_STEPS:
      'INTEGRATION_APPS_UNINSTALLER_FAILED_UNINSTALL_STEPS',
    STEP: {
      UPDATE: 'INTEGRATION_APPS_UNINSTALL_UPDATE',
      REQUEST: 'INTEGRATION_APPS_UNINSTALLER_STEP_UNINSTALL',
      CLEAR: 'INTEGRATION_APPS_UNINSTALLER_STEP_CLEAR',
    },
  },
  STORE: {
    ADD: 'INTEGRATION_APPS_STORE_ADD',
    CLEAR: 'INTEGRATION_APPS_STORE_CLEAR',
    FAILURE: 'INTEGRATION_APPS_STORE_NEW_STEPSS_FAILURE',
    INSTALL: 'INTEGRATION_APPS_STORE_INSTALL',
    COMPLETE: 'INTEGRATION_APPS_STORE_INSTALL_COMPLETE',
    UPDATE: 'INTEGRATION_APPS_STORE_UPDATE',
    RECEIVED: 'INTEGRATION_APPS_STORE_STEPS_RECEIVED',
  },
  SETTINGS: {
    FORM: {
      INIT_COMPLETE: 'INTEGRATION_APPS_SETTINGS_INIT_COMPLETE',
      SHOW_FORM_VALIDATION_ERRORS:
        'INTEGRATION_APPS_SETTINGS_SHOW_FORM_VALIDATION_ERRORS',
      CLEAR: 'INTEGRATION_APPS_SETTINGS_FORM_CLEAR',
      SUBMIT_COMPLETE: 'INTEGRATION_APPS_SETTINGS_FORM_SUBMIT_COMPLETE',
      SUBMIT_FAILED: 'INTEGRATION_APPS_SETTINGS_FORM_SUBMIT_FAILED',
    },
    CATEGORY_MAPPINGS: {
      INIT: 'INTEGRATION_APPS_SETTINGS_CATEGORY_MAPPINGS_INIT',
      DELETE: 'INTEGRATION_APPS_SETTINGS_CATEGORY_MAPPINGS_DELETE',
      CLEAR: 'INTEGRATION_APPS_SETTINGS_CATEGORY_MAPPINGS_CLEAR',
      CLEAR_SAVE_STATUS:
        'INTEGRATION_APPS_SETTINGS_CATEGORY_MAPPINGS_CLEAR_SAVE_STATUS',
      UPDATE_GENERATES:
        'INTEGRATION_APPS_SETTINGS_CATEGORY_MAPPINGS_UPDATE_GENERATES',
      PATCH_FIELD: 'INTEGRATION_APPS_SETTINGS_CATEGORY_MAPPINGS_PATCH_FIELD',
      PATCH_INCOMPLETE_GENERATES:
        'INTEGRATION_APPS_SETTINGS_CATEGORY_MAPPINGS_PATCH_INCOMPLETE_GENERATES',
      PATCH_SETTINGS:
        'INTEGRATION_APPS_SETTINGS_CATEGORY_MAPPINGS_PATCH_SETTINGS',
      COLLAPSE_ALL: 'INTEGRATION_APPS_CATEGORY_MAPPINGS_COLLAPSE_ALL',
      EXPAND_ALL: 'INTEGRATION_APPS_CATEGORY_MAPPINGS_EXPAND_ALL',
      CLEAR_COLLAPSE_STATUS:
        'INTEGRATION_APPS_CATEGORY_MAPPINGS_CLEAR_COLLAPSE_STATUS',
      UPDATE_LOOKUP:
        'INTEGRATION_APPS_SETTINGS_CATEGORY_MAPPINGS_UPDATE_LOOKUP',
      CANCEL_VARIATION_MAPPINGS:
        'INTEGRATION_APPS_SETTINGS_CATEGORY_MAPPINGS_CLEAR_VARIATION_MAPPINGS',
      SAVE_VARIATION_MAPPINGS:
        'INTEGRATION_APPS_SETTINGS_CATEGORY_MAPPINGS_SAVE_VARIATION_MAPPINGS',
      SAVE: 'INTEGRATION_APPS_SETTINGS_CATEGORY_MAPPINGS_SAVE',
      SAVE_COMPLETE:
        'INTEGRATION_APPS_SETTINGS_CATEGORY_MAPPINGS_SAVE_COMPLETE',
      SAVE_FAILED: 'INTEGRATION_APPS_SETTINGS_CATEGORY_MAPPINGS_SAVE_FAILED',
      SET_VISIBILITY:
        'INTEGRATION_APPS_SETTINGS_CATEGORY_MAPPINGS_SET_VISIBILITY',
    },
    REQUEST_CATEGORY_MAPPING_METADATA:
      'INTEGRATION_APPS_SETTINGS_REQUEST_CATEGORY_MAPPING_METADATA',
    RECEIVED_CATEGORY_MAPPINGS_DATA:
      'INTEGRATION_APPS_SETTINGS_RECEIVED_CATEGORY_MAPPINGS_DATA',
    RECEIVED_CATEGORY_MAPPING_GENERATES_METADATA:
      'INTEGRATION_APPS_RECEIVED_CATEGORY_MAPPING_GENERATES_METADATA',
    RECEIVED_CATEGORY_MAPPING_METADATA:
      'INTEGRATION_APPS_SETTINGS_RECEIVED_CATEGORY_MAPPING_METADATA',
    CATEGORY_MAPPING_FILTERS:
      'INTEGRATION_APPS_SETTINGS_CATEGORY_MAPPING_FILTERS',
    CLEAR_VARIATION_MAPPINGS: 'INTEGRATION_APS_SETTINGS_CLEAR_VARIATIONS',
    SAVE_VARIATION_MAPPINGS:
      'INTEGRATION_APPS_SETTINGS_SAVE_VARIATION_MAPPINGS',
    ADD_CATEGORY: 'INTEGRATION_APPS_SETTINGS_ADD_CATEGORY',
    DELETE_CATEGORY: 'INTEGRATION_APPS_SETTINGS_DELETE_CATEGORY',
    RESTORE_CATEGORY: 'INTEGRATION_APPS_SETTINGS_RESTORE_CATEGORY',
    REDIRECT: 'INTEGRATION_APPS_SETTINGS_REDIRECT',
    CLEAR_REDIRECT: 'INTEGRATION_APPS_SETTINGS_CLEAR_REDIRECT',
    UPGRADE: 'INTEGRATION_APPS_SETTINGS_UPGRADE',
    REQUEST_UPGRADE: 'INTEGRATION_APPS_SETTINGS_REQUEST_UPGRADE',
    UPGRADE_REQUESTED: 'INTEGRATION_APPS_SETTINGS_UPGRADE_REQUESTED',
    UPDATE: 'INTEGRATION_APPS_SETTINGS_UPDATE',
    ADDON_LICENSES_METADATA: 'ADDON_LICENSES_METADATA',
    ADDON_LICENSES_METADATA_UPDATE: 'ADDON_LICENSES_METADATA_UPDATE',
    MAPPING_METADATA_REQUEST: 'MAPPING_METADATA_REQUEST',
    MAPPING_METADATA_UPDATE: 'MAPPING_METADATA_UPDATE',
    MAPPING_METADATA_ERROR: 'MAPPING_METADATA_ERROR',
  },
  ADDON: {
    RECEIVED_INSTALL_STATUS: 'INTEGRATION_APPS_RECEIVED_ADDON_INSTALL_STATUS',
  },
  CLONE: {
    STATUS: 'INTEGRATION_APPS_RECEIVED_CLONE_STATUS',
  },
};
const AGENT = {
  TOKEN_DISPLAY: 'AGENT_TOKEN_DISPLAY',
  TOKEN_CHANGE: 'AGENT_TOKEN_CHANGE',
  TOKEN_MASK: 'AGENT_TOKEN_MASK',
  TOKEN_RECEIVED: 'AGENT_TOKEN_RECEIVED',
  DOWNLOAD_INSTALLER: 'AGENT_DOWNLOAD_INSTALLER',
};
const FILE = {
  UPLOAD: 'UPLOAD',
  PROCESS: 'FILE_PROCESS',
  PROCESSED: 'PROCESSED_FILE_RECEIVED',
  PROCESS_ERROR: 'PROCESSED_FILE_ERROR',
  RESET: 'FILE_RESET',
  PREVIEW_ZIP: 'PREVIEW_ZIP',
};
const STACK = {
  TOKEN_DISPLAY: 'TOKEN_DISPLAY',
  TOKEN_GENERATE: 'TOKEN_GENERATE',
  TOKEN_MASK: 'TOKEN_MASK',
  TOKEN_RECEIVED: 'TOKEN_RECEIVED',
  TOKEN_DELETE: 'TOKEN_DELETE',
  SHARE_USER_INVITE: 'SHARE_USER_INVITE',
  USER_SHARING_TOGGLE: 'USER_SHARING_TOGGLE',
  USER_SHARING_TOGGLED: 'USER_SHARING_TOGGLED',
  USER_REINVITE: 'USER_REINVITE',
};
const CONNECTION = {
  TEST: 'CONNECTION_TEST',
  TEST_ERRORED: 'CONNECTION_TEST_ERRORED',
  TEST_CANCELLED: 'CONNECTION_TEST_CANCELLED',
  TEST_SUCCESSFUL: 'CONNECTION_TEST_SUCCESSFUL',
  TEST_CLEAR: 'CONNECTION_TEST_CLEAR',
  REFRESH_STATUS: 'REFRESH_CONNECTION_STATUS',
  REGISTER_REQUEST: 'REGISTER_REQUEST',
  REGISTER_COMPLETE: 'REGISTER_COMPLETE',
  DEREGISTER_REQUEST: 'DEREGISTER_REQUEST',
  DEREGISTER_COMPLETE: 'DEREGISTER_COMPLETE',
  AUTHORIZED: 'CONNECTION_AUTHORIZED',
  UPDATE_ICLIENTS: 'UPDATE_ICLIENTS',
  DEBUG_LOGS_REQUEST: 'DEBUG_LOGS_REQUEST',
  DEBUG_LOGS_RECEIVED: 'DEBUG_LOGS_RECEIVED',
  DEBUG_LOGS_CLEAR: 'DEBUG_LOGS_CLEAR',
  QUEUED_JOBS_REQUEST: 'QUEUED_JOBS_REQUEST',
  QUEUED_JOBS_RECEIVED: 'QUEUED_JOBS_RECEIVED',
  QUEUED_JOB_CANCEL: 'QUEUED_JOB_CANCEL',
  MADE_ONLINE: 'CONNECTION_MADE_ONLINE',
  UPDATE_STATUS: 'CONNECTION_UPDATE_STATUS',
  REVOKE_REQUEST: 'REVOKE_REQUEST',
  PING_AND_UPDATE: 'CONNECTION_PING_AND_UPDATE',
};
const MARKETPLACE = {
  CONNECTORS_REQUEST: 'CONNECTORS_REQUEST',
  TEMPLATES_REQUEST: 'TEMPLATES_REQUEST',
  CONNECTORS_RECEIVED: 'CONNECTORS_RECEIVED',
  TEMPLATES_RECEIVED: 'TEMPLATES_RECEIVED',
  CONNECTOR_INSTALL: 'CONNECTOR_INSTALL',
  SALES_CONTACT: 'SALES_CONTACT',
};
const CLONE = {
  PREVIEW_REQUEST: 'CLONE_PREVIEW_REQUEST',
  CREATE_COMPONENTS: 'CLONE_CREATE_COMPONENTS',
};
const TEMPLATE = {
  ZIP_DOWNLOAD: 'ZIP_DOWNLOAD',
  ZIP_GENERATE: 'ZIP_GENERATE',
  PREVIEW_REQUEST: 'TEMPLATE_PREVIEW',
  FAILURE: 'TEMPLATE_PREVIEW_FAILED',
  INSTALL_FAILURE: 'TEMPLATE_INSTALL_FAILURE',
  RECEIVED_PREVIEW: 'TEMPLATE_RECEIVED_PREVIEW',
  STEPS_RECEIVED: 'TEMPLATE_STEPS_RECEIVED',
  UPDATE_STEP: 'TEMPLATE_STEPS_UPDATE',
  CREATE_COMPONENTS: 'TEMPLATE_CREATE_COMPONENTS',
  VERIFY_BUNDLE_INSTALL: 'TEMPLATE_VERIFY_BUNDLE_INSTALL',
  CLEAR_TEMPLATE: 'TEMPLATE_CLEAR_TEMPLATE',
  CLEAR_UPLOADED: 'TEMPLATE_CLEAR_UPLOADED',
  CREATED_COMPONENTS: 'TEMPLATE_CREATED_COMPONENTS',
};
const LICENSE_TRIAL_REQUEST = 'LICENSE_TRIAL_REQUEST';
const LICENSE_NUM_ENABLED_FLOWS_REQUEST = 'LICENSE_NUM_ENABLED_FLOWS_REQUEST';
const LICENSE_NUM_ENABLED_FLOWS_RECEIVED = 'LICENSE_NUM_ENABLED_FLOWS_RECEIVED';
const LICENSE_TRIAL_ISSUED = 'LICENSE_TRIAL_ISSUED';
const LICENSE_UPGRADE_REQUEST = 'LICENSE_UPGRADE_REQUEST';
const LICENSE_UPDATE_REQUEST = 'LICENSE_UPDATE_REQUEST';
const LICENSE_UPGRADE_REQUEST_SUBMITTED = 'LICENSE_UPGRADE_REQUEST_SUBMITTED';
const ACCOUNT_LEAVE_REQUEST = 'ACCOUNT_LEAVE_REQUEST';
const ACCOUNT_SWITCH = 'ACCOUNT_SWITCH';
const DEFAULT_ACCOUNT_SET = 'DEFAULT_ACCOUNT_SET';
const USER_CREATE = 'USER_CREATE';
const USER_CREATED = 'USER_CREATED';
const USER_UPDATE = 'USER_UPDATE';
const USER_UPDATED = 'USER_UPDATED';
const USER_DELETE = 'USER_DELETE';
const USER_DELETED = 'USER_DELETED';
const USER_DISABLE = 'USER_DISABLE';
const USER_DISABLED = 'USER_DISABLED';
const USER_MAKE_OWNER = 'USER_MAKE_OWNER';
const AUDIT_LOGS_CLEAR = 'AUDIT_LOGS_CLEAR';
const ACCESSTOKEN_UPDATED_COLLECTION = 'ACCESSTOKEN_UPDATED_COLLECTION';
const ACCESSTOKEN_TOKEN_DISPLAY = 'ACCESSTOKEN_TOKEN_DISPLAY';
const ACCESSTOKEN_TOKEN_RECEIVED = 'ACCESSTOKEN_TOKEN_RECEIVED';
const ACCESSTOKEN_TOKEN_MASK = 'ACCESSTOKEN_TOKEN_MASK';
const ACCESSTOKEN_TOKEN_GENERATE = 'ACCESSTOKEN_TOKEN_GENERATE';
const ACCESSTOKEN_CREATE = 'ACCESSTOKEN_CREATE';
const ACCESSTOKEN_CREATED = 'ACCESSTOKEN_CREATED';
const ACCESSTOKEN_UPDATE = 'ACCESSTOKEN_UPDATE';
const ACCESSTOKEN_UPDATED = 'ACCESSTOKEN_UPDATED';
const ACCESSTOKEN_DELETE = 'ACCESSTOKEN_DELETE';
const ACCESSTOKEN_DELETED = 'ACCESSTOKEN_DELETED';
const ACCESSTOKEN_REVOKE = 'ACCESSTOKEN_REVOKE';
const ACCESSTOKEN_ACTIVATE = 'ACCESSTOKEN_ACTIVATE';
const ACCESSTOKEN_DELETE_PURGED = 'ACCESSTOKEN_DELETE_PURGED';
const JOB = {
  REQUEST_COLLECTION: 'JOB_REQUEST_COLLECTION',
  RECEIVED_COLLECTION: 'JOB_RECEIVED_COLLECTION',
  REQUEST_FAMILY: 'JOB_REQUEST_FAMILY',
  RECEIVED_FAMILY: 'JOB_RECEIVED_FAMILY',
  CLEAR: 'JOB_CLEAR',
  REQUEST_IN_PROGRESS_JOBS_STATUS: 'JOB_REQUEST_IN_PROGRESS_JOBS_STATUS',
  NO_IN_PROGRESS_JOBS: 'JOB_NO_IN_PROGRESS_JOBS',
  REQUEST_DIAGNOSTICS_FILE_URL: 'JOB_REQUEST_DIAGNOSTICS_FILE_URL',
  DOWNLOAD_FILES: 'JOB_DOWNLOAD_FILES',
  REQUEST_DOWNLOAD_FILES_URL: 'JOB_REQUEST_DOWNLOAD_FILES_URL',
  CANCEL: 'JOB_CANCEL',
  RESOLVE: 'JOB_RESOLVE',
  RESOLVE_INIT: 'JOB_RESOLVE_INIT',
  RESOLVE_UNDO: 'JOB_RESOLVE_UNDO',
  RESOLVE_COMMIT: 'JOB_RESOLVE_COMMIT',
  RESOLVE_ALL_PENDING: 'JOB_RESOLVE_ALL_PENDING',
  RESOLVE_SELECTED: 'JOB_RESOLVE_SELECTED',
  RESOLVE_ALL: 'JOB_RESOLVE_ALL',
  RESOLVE_ALL_INIT: 'JOB_RESOLVE_ALL_INIT',
  RESOLVE_ALL_UNDO: 'JOB_RESOLVE_ALL_UNDO',
  RESOLVE_ALL_COMMIT: 'JOB_RESOLVE_ALL_COMMIT',
  RESOLVE_ALL_IN_INTEGRATION_COMMIT: 'JOB_RESOLVE_ALL_IN_INTEGRATION_COMMIT',
  RESOLVE_ALL_IN_FLOW_COMMIT: 'JOB_RESOLVE_ALL_IN_FLOW_COMMIT',
  RETRY_SELECTED: 'JOB_RETRY_SELECTED',
  RETRY_FLOW_JOB: 'JOB_RETRY_FLOW_JOB',
  RETRY_INIT: 'JOB_RETRY_INIT',
  RETRY_COMMIT: 'JOB_RETRY_COMMIT',
  RETRY_FLOW_JOB_COMMIT: 'JOB_RETRY_FLOW_JOB_COMMIT',
  RETRY_UNDO: 'JOB_RETRY_UNDO',
  RETRY_ALL_PENDING: 'JOB_RETRY_ALL_PENDING',
  RETRY_ALL: 'JOB_RETRY_ALL',
  RETRY_ALL_INIT: 'JOB_RETRY_ALL_INIT',
  RETRY_ALL_UNDO: 'JOB_RETRY_ALL_UNDO',
  RETRY_ALL_COMMIT: 'JOB_RETRY_ALL_COMMIT',
  RETRY_ALL_IN_INTEGRATION_COMMIT: 'JOB_RETRY_ALL_IN_INTEGRATION_COMMIT',
  RETRY_ALL_IN_FLOW_COMMIT: 'JOB_RETRY_ALL_IN_FLOW_COMMIT',
  REQUEST_RETRY_OBJECT_COLLECTION: 'JOB_REQUEST_RETRY_OBJECT_COLLECTION',
  RECEIVED_RETRY_OBJECT_COLLECTION: 'JOB_RECEIVED_RETRY_OBJECT_COLLECTION',
  REQUEST_ERROR_FILE_URL: 'JOB_REQUEST_ERROR_FILE_URL',
  ERROR: {
    REQUEST_COLLECTION: 'JOB_ERROR_REQUEST_COLLECTION',
    RECEIVED_COLLECTION: 'JOB_ERROR_RECEIVED_COLLECTION',
    RESOLVE_SELECTED: 'JOB_ERROR_RESOLVE_SELECTED',
    RESOLVE_SELECTED_INIT: 'JOB_ERROR_RESOLVE_SELECTED_INIT',
    RETRY_SELECTED: 'JOB_ERROR_RETRY_SELECTED',
    REQUEST_RETRY_DATA: 'JOB_ERROR_REQUEST_RETRY_DATA',
    RECEIVED_RETRY_DATA: 'JOB_ERROR_RECEIVED_RETRY_DATA',
    UPDATE_RETRY_DATA: 'JOB_ERROR_UPDATE_RETRY_DATA',
    CLEAR: 'JOB_ERROR_CLEAR',
    RETRY_PROCESSED_ERRORS: 'JOB_ERROR_RETRY_PROCESSED_ERRORS',
    PREVIEW: {
      REQUEST: 'JOB_PROCESSED_ERRORS_PREVIEW_REQUEST',
      RECEIVED: 'JOB_PROCESSED_ERRORS_PREVIEW_RECEIVED',
      ERROR: 'JOB_PROCESSED_ERRORS_PREVIEW_ERROR',
      CLEAR: 'JOB_PROCESSED_ERRORS_PREVIEW_CLEAR',
    },
  },
  PAGING: {
    SET_ROWS_PER_PAGE: 'JOB_PAGING_SET_ROWS_PER_PAGE',
    SET_CURRENT_PAGE: 'JOB_PAGING_SET_CURRENT_PAGE',
  },
};
const FLOW = {
  RUN: 'FLOW_RUN',
  RUN_DATA_LOADER: 'FLOW_DATA_LOADER_RUN',
  REQUEST_LAST_EXPORT_DATE_TIME: 'FLOW_REQUEST_LAST_EXPORT_DATE_TIME',
  RECEIVED_LAST_EXPORT_DATE_TIME: 'FLOW_RECEIVED_LAST_EXPORT_DATE_TIME',
  RECEIVED_ON_OFF_ACTION_STATUS: 'FLOW_RECEIVED_ON_OFF_ACTION_STATUS',
};
const RESPONSE_MAPPING = {
  INIT: 'RESPONSE_MAPPING_INIT',
  PATCH_FIELD: 'RESPONSE_MAPPING_PATCH_FIELD',
  DELETE: 'RESPONSE_MAPPING_DELETE',
  SAVE: 'RESPONSE_MAPPING_SAVE',
  SAVE_COMPLETE: 'RESPONSE_MAPPING_SAVE_COMPLETE',
  SAVE_FAILED: 'RESPONSE_MAPPING_SAVE_FAILED',
  SET_FORMATTED_MAPPING: 'RESPONSE_MAPPING_SET_FORMATTED_MAPPING',
};
const RECYCLEBIN = {
  RESTORE: 'RESTORE',
  PURGE: 'PURGE',
};
const ANALYTICS = {
  GAINSIGHT: {
    TRACK_EVENT: 'ANALYTICS_GAINSIGHT_TRACK_EVENT',
  },
};
const TRANSFER = {
  CANCEL: 'TRANSFER_CANCEL',
  PREVIEW: 'TRANSFER_PREVIEW',
  RECEIVED_PREVIEW: 'TRANSFER_RECEIVED_PREVIEW',
  CLEAR_PREVIEW: 'TRANSFER_CLEAR_PREVIEW',
  CREATE: 'TRANSFER_CREATE',
  CANCELLED: 'TRANSFER_CANCELLED',
};
const SHARED_NOTIFICATION_ACCEPT = 'SHARED_NOTIFICATION_ACCEPT';
const SHARED_NOTIFICATION_ACCEPTED = 'SHARED_NOTIFICATION_ACCEPTED';
const SHARED_NOTIFICATION_REJECT = 'SHARED_NOTIFICATION_REJECT';

export default {
  NETSUITE_USER_ROLES,
  METADATA,
  FILE_DEFINITIONS,
  CONNECTORS,
  CANCEL_TASK,
  TOKEN,
  POST_FEEDBACK,
  APP_ERRORED,
  APP_CLEAR_ERROR,
  APP_RELOAD,
  APP_TOGGLE_DRAWER,
  APP_TOGGLE_BANNER,
  INTEGRATION_APPS,
  UPDATE_PROFILE,
  UPDATE_PREFERENCES,
  UNLINK_WITH_GOOGLE,
  UNLINKED_WITH_GOOGLE,
  TOGGLE_DEBUG,
  USER_CHANGE_PASSWORD,
  USER_CHANGE_EMAIL,
  USER_LOGOUT,
  CLEAR_STORE,
  CLEAR_COMMS,
  CLEAR_COMM_BY_KEY,
  PATCH_FILTER,
  CLEAR_FILTER,
  EDITOR_INIT,
  EDITOR_CHANGE_LAYOUT,
  EDITOR_PATCH,
  EDITOR_RESET,
  EDITOR_EVALUATE_REQUEST,
  EDITOR_EVALUATE_RESPONSE,
  EDITOR_EVALUATE_FAILURE,
  EDITOR_VALIDATE_FAILURE,
  EDITOR_SAVE,
  EDITOR_SAVE_FAILED,
  EDITOR_SAVE_COMPLETE,
  EDITOR_UPDATE_HELPER_FUNCTIONS,
  EDITOR_REFRESH_HELPER_FUNCTIONS,
  PROFILE,
  RESOURCE,
  AGENT,
  STACK,
  API_REQUEST,
  API_COMPLETE,
  API_RETRY,
  API_FAILURE,
  AUTH_WARNING,
  AUTH_TIMESTAMP,
  AUTH_REQUEST_REDUCER,
  AUTH_REQUEST,
  AUTH_SIGNIN_WITH_GOOGLE,
  AUTH_RE_SIGNIN_WITH_GOOGLE,
  AUTH_LINK_WITH_GOOGLE,
  AUTH_SUCCESSFUL,
  AUTH_FAILURE,
  DELETE_PROFILE,
  INIT_SESSION,
  LICENSE_TRIAL_REQUEST,
  LICENSE_TRIAL_ISSUED,
  LICENSE_UPGRADE_REQUEST,
  LICENSE_UPDATE_REQUEST,
  LICENSE_UPGRADE_REQUEST_SUBMITTED,
  ACCOUNT_LEAVE_REQUEST,
  ACCOUNT_SWITCH,
  DEFAULT_ACCOUNT_SET,
  RESOURCE_FORM,
  USER_CREATE,
  USER_CREATED,
  USER_UPDATE,
  USER_UPDATED,
  USER_DELETE,
  USER_DELETED,
  USER_DISABLE,
  USER_DISABLED,
  USER_MAKE_OWNER,
  AUDIT_LOGS_CLEAR,
  ACCESSTOKEN_UPDATED_COLLECTION,
  ACCESSTOKEN_TOKEN_DISPLAY,
  ACCESSTOKEN_TOKEN_RECEIVED,
  ACCESSTOKEN_TOKEN_MASK,
  ACCESSTOKEN_TOKEN_GENERATE,
  ACCESSTOKEN_CREATE,
  ACCESSTOKEN_CREATED,
  ACCESSTOKEN_UPDATE,
  ACCESSTOKEN_UPDATED,
  ACCESSTOKEN_DELETE,
  ACCESSTOKEN_DELETED,
  ACCESSTOKEN_REVOKE,
  ACCESSTOKEN_ACTIVATE,
  ACCESSTOKEN_DELETE_PURGED,
  JOB,
  FLOW,
  SAMPLEDATA,
  IMPORT_SAMPLEDATA,
  FLOW_DATA,
  TEMPLATE,
  CLONE,
  FILE,
  CONNECTION,
  MARKETPLACE,
  RECYCLEBIN,
  ICLIENTS,
  MAPPING,
  SEARCH_CRITERIA,
  ANALYTICS,
  TRANSFER,
  SHARED_NOTIFICATION_ACCEPT,
  SHARED_NOTIFICATION_ACCEPTED,
  SHARED_NOTIFICATION_REJECT,
  LICENSE_NUM_ENABLED_FLOWS_REQUEST,
  LICENSE_NUM_ENABLED_FLOWS_RECEIVED,
  RESPONSE_MAPPING,
};
