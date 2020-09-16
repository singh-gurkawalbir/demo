const PATCH_FILTER = 'PATCH_FILTER';
const CLEAR_FILTER = 'CLEAR_FILTER';
const EDITOR = {
  INIT: 'EDITOR_INIT',
  CHANGE_LAYOUT: 'EDITOR_CHANGE_LAYOUT',
  PATCH: 'EDITOR_PATCH',
  RESET: 'EDITOR_RESET',
  CLEAR: 'EDITOR_CLEAR',
  EVALUATE_REQUEST: 'EDITOR_EVALUATE_REQUEST',
  EVALUATE_RESPONSE: 'EDITOR_EVALUATE_RESPONSE',
  EVALUATE_FAILURE: 'EDITOR_EVALUATE_FAILURE',
  VALIDATE_FAILURE: 'EDITOR_VALIDATE_FAILURE',
  SAVE: 'EDITOR_SAVE',
  SAVE_FAILED: 'EDITOR_SAVE_FAILED',
  SAVE_COMPLETE: 'EDITOR_SAVE_COMPLETE',
  UPDATE_HELPER_FUNCTIONS: 'EDITOR_UPDATE_HELPER_FUNCTIONS',
  REFRESH_HELPER_FUNCTIONS: 'EDITOR_REFRESH_HELPER_FUNCTIONS',
};

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
const FORM = {
  INIT: 'FORM_INIT',
  CLEAR: 'FORM_CLEAR',
  FIELD: {
    FORCE_STATE: 'FORM_FIELD_STATE_FORCE',
    CLEAR_FORCE_STATE: 'FORM_FIELD_STATE_CLEAR',
    REGISTER: 'FORM_FIELD_REGISTER',
    ON_FIELD_CHANGE: 'FORM_FIELD_CHANGE',
    ON_FIELD_FOCUS: 'FORM_FIELD_FOCUS',
    ON_FIELD_BLUR: 'FORM_FIELD_BLUR',
  },
  UPDATE: 'FORM_UPDATE',
};
const METADATA = {
  REQUEST: 'REQUEST_METADATA',
  SET_REQUEST_STATUS: 'SET_REQUEST_STATUS_METADATA',
  REFRESH: 'REFRESH_METADATA',
  RECEIVED: 'RECEIVED_METADATA',
  RECEIVED_ERROR: 'RECEIVED_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  ASSISTANT_REQUEST: 'REQUEST_ASSISTANT',
  ASSISTANT_RECEIVED: 'RECEIVED_ASSISTANT',
  ASSISTANT_PREVIEW_RECEIVED: 'METADATA_ASSISTANT_PREVIEW_RECEIVED',
  ASSISTANT_PREVIEW_FAILED: 'METADATA_ASSISTANT_PREVIEW_FAILED',
  ASSISTANT_PREVIEW_REQUESTED: 'METADATA_ASSISTANT_PREVIEW_REQUESTED',
  ASSISTANT_PREVIEW_RESET: 'METADATA_ASSISTANT_PREVIEW_RESET',
  BUNDLE_INSTALL_STATUS: 'BUNDLE_INSTALL_STATUS',
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
  STATUS_CLEAR: 'CONNECTORS_METADATA_STATUS_CLEAR',
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
  IA_METADATA_REQUEST: 'IMPORT_IA_METADATA_REQUEST',
  IA_METADATA_RECEIVED: 'IMPORT_IA_METADATA_RECEIVED',
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
  RESET_STAGES: 'RESET_FLOW_DATA_STAGES',
  FLOW_SEQUENCE_RESET: 'RESET_FLOW_SEQUENCE',
  FLOWS_FOR_RESOURCE_UPDATE: 'UPDATE_FLOWS_FOR_RESOURCE_FLOW_DATA',
  FLOW_UPDATE: 'UPDATE_FLOW_DATA',
  FLOW_RESPONSE_MAPPING_UPDATE: 'UPDATE_FLOW_DATA_RESPONSE_MAPPING',
};
const EXPORTDATA = {
  REQUEST: 'EXPORTDATA_REQUEST',
  RECEIVED: 'EXPORTDATA_RECEIVED',
  ERROR_RECEIVED: 'EXPORTDATA_ERROR_RECEIVED',
};
const FLOW_METRICS = {
  REQUEST: 'FLOW_METRICS_REQUEST',
  RECEIVED: 'FLOW_METRICS_RECEIVED',
  FAILED: 'FLOW_METRICS_FAILED',
  CLEAR: 'FLOW_METRICS_CLEAR',
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
const AUTH_USER_ALREADY_LOGGED_IN = 'AUTH_USER_ALREADY_LOGGED_IN';
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
const ABORT_ALL_SAGAS = 'ABORT_ALL_SAGAS';
const DELETE_PROFILE = 'DELETE_PROFILE';
const UPDATE_PROFILE = 'UPDATE_PROFILE';
const UPDATE_PREFERENCES = 'UPDATE_PREFERENCES';
const UNLINK_WITH_GOOGLE = 'UNLINK_WITH_GOOGLE';
const UNLINKED_WITH_GOOGLE = 'UNLINKED_WITH_GOOGLE';
const TOGGLE_DEBUG = 'TOGGLE_DEBUG';
const INIT_SESSION = 'INIT_SESSION';
const POST_FEEDBACK = 'POST_FEEDBACK';
const APP_RELOAD = 'APP_RELOAD';
const UI_VERSION_FETCH = 'APP_UI_VERSION_FETCH';
const UI_VERSION_UPDATE = 'APP_UI_VERSION_UPDATE';
const USER_ACCEPTED_ACCOUNT_TRANSFER = 'APP_USER_ACCEPTED_ACCOUNT_TRANSFER';
const APP_ERRORED = 'APP_ERRORED';
const APP_CLEAR_ERROR = 'APP_CLEAR_ERROR';
const APP_TOGGLE_DRAWER = 'APP_TOGGLE_DRAWER';
const APP_TOGGLE_BANNER = 'APP_TOGGLE_BANNER';
const CLEAR_COMMS = 'CLEAR_COMMS';
const CLEAR_COMM_BY_KEY = 'CLEAR_COMM_BY_KEY';
const MAPPING = {
  INIT: 'MAPPING_INIT',
  INIT_COMPLETE: 'MAPPING_INIT_COMPLETE',
  PATCH_FIELD: 'MAPPING_PATCH_FIELD',
  PATCH_INCOMPLETE_GENERATES: 'MAPPING_PATCH_INCOMPLETE_GENERATES',
  PATCH_SETTINGS: 'MAPPING_PATCH_SETTINGS',
  DELETE: 'MAPPING_DELETE',
  ADD_LOOKUP: 'MAPPING_ADD_LOOKUP',
  UPDATE_LOOKUP: 'MAPPING_UPDATE_LOOKUP',
  SAVE: 'MAPPING_SAVE',
  SAVE_COMPLETE: 'MAPPING_SAVE_COMPLETE',
  SAVE_FAILED: 'MAPPING_SAVE_FAILED',
  PREVIEW_REQUESTED: 'MAPPING_PREVIEW_REQUESTED',
  PREVIEW_RECEIVED: 'MAPPING_PREVIEW_RECEIVED',
  PREVIEW_FAILED: 'MAPPING_PREVIEW_FAILED',
  SET_NS_ASSISTANT_FORM_LOADED: 'MAPPING_SET_NS_ASSISTANT_FORM_LOADED',
  REFRESH_GENERATES: 'MAPPING_REFRESH_GENERATES',
  UPDATE_LAST_TOUCHED_FIELD: 'MAPPING_UPDATE_LAST_TOUCHED_FIELD',
  UPDATE_LIST: 'MAPPING_UPDATE_LIST',
  CLEAR: 'MAPPING_CLEAR',
  SHIFT_ORDER: 'MAPPING_SHIFT_ORDER',
  SET_VALIDATION_MSG: 'MAPPING_SET_VALIDATION_MSG',
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
  INIT_FAILED: 'RESOURCE_FORM_INIT_FAILED',
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
  SHOW_BUNDLE_INSTALL_NOTIFICATION: 'SHOW_BUNDLE_INSTALL_NOTIFICATION',
  HIDE_BUNDLE_INSTALL_NOTIFICATION: 'HIDE_BUNDLE_INSTALL_NOTIFICATION',
};
const INTEGRATION_APPS = {
  INSTALLER: {
    RECEIVED_OAUTH_CONNECTION_STATUS: 'RECEIVED_OAUTH_CONNECTION_STATUS',
    INIT_CHILD: 'NTEGRATION_APPS_INSTALLER_INIT_CHILD',
    STEP: {
      REQUEST: 'INTEGRATION_APPS_STEP_REQUEST',
      UPDATE: 'INTEGRATION_APPS_STEP_UPDATE',
      DONE: 'INTEGRATION_APPS_STEP_COMPLETE',
      SCRIPT_REQUEST: 'INTEGRATION_APPS_STEP_SCRIPT_REQUEST',
      CURRENT_STEP: 'INTEGRATION_APPS_STEP_CURRENT_STEP',
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
  UNINSTALLER2: {
    INIT: 'INTEGRATION_APPS_UNINSTALLER2_INIT',
    FAILED:
      'INTEGRATION_APPS_UNINSTALLER2_FAILED',
    RECEIVED_STEPS: 'INTEGRATION_APPS_UNINSTALLER2_RECEIVED_STEPS',
    REQUEST_STEPS: 'INTEGRATION_APPS_UNINSTALLER2_REQUEST_STEPS',
    CLEAR_STEPS: 'INTEGRATION_APPS_UNINSTALLER2_CLEAR_STEPS',
    COMPLETE: 'INTEGRATION_APPS_UNINSTALLER2_COMPLETE',
    STEP: {
      UPDATE: 'INTEGRATION_APPS_UNINSTALLER2_STEP_UPDATE',
      UNINSTALL: 'INTEGRATION_APPS_UNINSTALLER2_STEP_UNINSTALL',
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
    ADDON_LICENSES_METADATA_FAILURE: 'ADDON_LICENSES_METADATA_FAILURE',
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
  TRADING_PARTNER_UPDATE: 'TRADING_PARTNER_UPDATE',
  DEREGISTER_COMPLETE: 'DEREGISTER_COMPLETE',
  TRADING_PARTNER_UPDATE_COMPLETE: 'TRADING_PARTNER_UPDATE_COMPLETE',
  AUTHORIZED: 'CONNECTION_AUTHORIZED',
  UPDATE_ICLIENTS: 'UPDATE_ICLIENTS',
  DEBUG_LOGS_REQUEST: 'DEBUG_LOGS_REQUEST',
  DEBUG_LOGS_RECEIVED: 'DEBUG_LOGS_RECEIVED',
  DEBUG_LOGS_CLEAR: 'DEBUG_LOGS_CLEAR',
  QUEUED_JOBS_REQUEST: 'QUEUED_JOBS_REQUEST',
  QUEUED_JOBS_REQUEST_POLL: 'QUEUED_JOBS_REQUEST_POLL',
  QUEUED_JOBS_CANCEL_POLL: 'QUEUED_JOBS_CANCEL_POLL',
  STATUS_REQUEST_POLL: 'STATUS_REQUEST_POLL',
  STATUS_CANCEL_POLL: 'STATUS_CANCEL_POLL',
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
const LICENSE_ENTITLEMENT_USAGE_REQUEST = 'LICENSE_ENTITLEMENT_USAGE_REQUEST';
const LICENSE_ENTITLEMENT_USAGE_RECEIVED = 'LICENSE_ENTITLEMENT_USAGE_RECEIVED';
const LICENSE_TRIAL_ISSUED = 'LICENSE_TRIAL_ISSUED';
const LICENSE_UPGRADE_REQUEST = 'LICENSE_UPGRADE_REQUEST';
const LICENSE_UPDATE_REQUEST = 'LICENSE_UPDATE_REQUEST';
const LICENSE_UPGRADE_REQUEST_SUBMITTED = 'LICENSE_UPGRADE_REQUEST_SUBMITTED';
const UPDATE_CHILD_INTEGRATION = 'UPDATE_CHILD_INTEGRATION';
const CLEAR_CHILD_INTEGRATION = 'CLEAR_CHILD_INTEGRATION';
const ACCOUNT_LEAVE_REQUEST = 'ACCOUNT_LEAVE_REQUEST';
const ACCOUNT_SWITCH = 'ACCOUNT_SWITCH';
const ACCOUNT_ADD_SUITESCRIPT_LINKED_CONNECTION = 'ACCOUNT_ADD_SUITESCRIPT_LINKED_CONNECTION';
const ACCOUNT_DELETE_SUITESCRIPT_LINKED_CONNECTION = 'ACCOUNT_DELETE_SUITESCRIPT_LINKED_CONNECTION';
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
  REQUEST_LATEST: 'JOB_REQUEST_LATEST',
  CLEAR: 'JOB_CLEAR',
  REQUEST_IN_PROGRESS_JOBS_STATUS: 'JOB_REQUEST_IN_PROGRESS_JOBS_STATUS',
  NO_IN_PROGRESS_JOBS: 'JOB_NO_IN_PROGRESS_JOBS',
  REQUEST_DIAGNOSTICS_FILE_URL: 'JOB_REQUEST_DIAGNOSTICS_FILE_URL',
  DOWNLOAD_FILES: 'JOB_DOWNLOAD_FILES',
  REQUEST_DOWNLOAD_FILES_URL: 'JOB_REQUEST_DOWNLOAD_FILES_URL',
  CANCEL: 'JOB_CANCEL',
  CANCEL_LATEST: 'JOB_CANCEL_LATEST',
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
const ERROR_MANAGER = {
  FLOW_OPEN_ERRORS: {
    REQUEST_FOR_POLL: 'FLOW_OPEN_ERRORS_REQUEST_FOR_POLL',
    REQUEST: 'FLOW_OPEN_ERRORS_REQUEST',
    RECEIVED: 'FLOW_OPEN_ERRORS_RECEIVED',
    CANCEL_POLL: 'FLOW_OPEN_ERRORS_CANCEL_POLL',
  },
  INTEGRATION_ERRORS: {
    REQUEST_FOR_POLL: 'INTEGRATION_ERRORS_REQUEST_FOR_POLL',
    REQUEST: 'INTEGRATION_ERRORS_REQUEST',
    RECEIVED: 'INTEGRATION_ERRORS_RECEIVED',
    CANCEL_POLL: 'INTEGRATION_ERRORS_CANCEL_POLL',
  },
  INTEGRATION_LATEST_JOBS: {
    REQUEST_FOR_POLL: 'INTEGRATION_LATEST_JOBS_REQUEST_FOR_POLL',
    REQUEST: 'INTEGRATION_LATEST_JOBS_REQUEST',
    RECEIVED: 'INTEGRATION_LATEST_JOBS_RECEIVED',
    CANCEL_POLL: 'INTEGRATION_LATEST_JOBS_CANCEL_POLL',
    ERROR: 'INTEGRATION_LATEST_JOBS_ERROR',
  },
  FLOW_ERROR_DETAILS: {
    REQUEST: 'FLOW_ERROR_DETAILS_REQUEST',
    RECEIVED: 'FLOW_ERROR_DETAILS_RECEIVED',
    ERROR: 'FLOW_ERROR_DETAILS_ERROR',
    SELECT_ERRORS: 'FLOW_ERROR_DETAILS_ERROR_SELECT_ERRORS',
    SELECT_ALL_ERRORS: 'FLOW_ERROR_DETAILS_ERROR_SELECT_ALL_ERRORS',
    RESET_SELECTION: 'FLOW_ERROR_DETAILS_ERROR_RESET_SELECTION',
    CLEAR: 'FLOW_ERROR_DETAILS_ERROR_CLEAR',
    REMOVE: 'FLOW_ERROR_DETAILS_ERROR_REMOVE_ERRORS',
    NOTIFY_UPDATE: 'FLOW_ERROR_DETAILS_ERROR_NOTIFY_UPDATE',
    ACTIONS: {
      SAVE_AND_RETRY: 'FLOW_ERROR_DETAILS_SAVE_AND_RETRY',
      RETRY: {
        REQUEST: 'FLOW_ERROR_DETAILS_RETRY_REQUEST',
        RECEIVED: 'FLOW_ERROR_DETAILS_RETRY_RECEIVED',
        ERROR: 'FLOW_ERROR_DETAILS_RETRY_ERROR',
      },
      RESOLVE: {
        REQUEST: 'FLOW_ERROR_DETAILS_RESOLVE_REQUEST',
        RECEIVED: 'FLOW_ERROR_DETAILS_RESOLVE_RECEIVED',
        ERROR: 'FLOW_ERROR_DETAILS_RESOLVE_ERROR',
      },
    },
  },
  RETRY_DATA: {
    REQUEST: 'ERROR_MANAGER_RETRY_DATA_REQUEST',
    RECEIVED: 'ERROR_MANAGER_RETRY_DATA_RECEIVED',
    RECEIVED_ERROR: 'ERROR_MANAGER_RETRY_DATA_RECEIVED_ERROR',
    UPDATE_REQUEST: 'ERROR_MANAGER_RETRY_DATA_UPDATE_REQUEST',
  },
  RETRY_STATUS: {
    REQUEST_FOR_POLL: 'ERROR_MANAGER_RETRY_STATUS_REQUEST_POLL',
    REQUEST: 'ERROR_MANAGER_RETRY_STATUS_REQUEST',
    RECEIVED: 'ERROR_MANAGER_RETRY_STATUS_RECEIVED',
    CLEAR: 'ERROR_MANAGER_RETRY_STATUS_CLEAR',
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
  RESTORE_REDIRECT_TO: 'RESTORE_REDIRECT_TO',
  RESTORE_CLEAR: 'RESTORE_CLEAR',

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
const SUITESCRIPT = {
  RESOURCE: {
    REQUEST: 'SUITESCRIPT_RESOURCE_REQUEST',
    RECEIVED: 'SUITESCRIPT_RESOURCE_RECEIVED',
    STAGE_COMMIT: 'SUITESCRIPT_RESOURCE_STAGE_COMMIT',
    UPDATED: 'SUITESCRIPT_RESOURCE_UPDATED',
    DELETED: 'SUITESCRIPT_RESOURCE_DELETED',
  },
  FEATURE_CHECK: {
    REQUEST: 'SUITESCRIPT_FEATURE_CHECK_REQUEST',
    SUCCESSFUL: 'SUITESCRIPT_FEATURE_CHECK_SUCCESSFUL',
    FAILED: 'SUITESCRIPT_FEATURE_CHECK_FAILED',
    CLEAR: 'SUITESCRIPT_FEATURE_CHECK_CLEAR',
  },
  IA_FORM: {
    INIT_COMPLETE: 'SUITESCRIPT_FORM_INIT_COMPLETE',
    INIT_CLEAR: 'SUITESCRIPT_FORM_CLEAR',
    SUBMIT: 'SUITESCRIPT_FORM_SUBMIT',
    SHOW_FORM_VALIDATION_ERRORS: 'SUITESCRIPT_SHOW_FORM_VALIDATION_ERRORS',
    SUBMIT_COMPLETE: 'SUITESCRIPT_FORM_SUBMIT_COMPLETE',
    SUBMIT_FAILED: 'SUITESCRIPT_FORM_SUBMIT_FAILED',
  },
  RESOURCE_FORM: {
    INIT: 'SUITESCRIPT_RESOURCE_FORM_INIT',
    INIT_COMPLETE: 'SUITESCRIPT_RESOURCE_FORM_INIT_COMPLETE',
    CLEAR_INIT_DATA: 'SUITESCRIPT_RESOURCE_FORM_CLEAR_INIT_DATA',
    SHOW_FORM_VALIDATION_ERRORS:
      'SUITESCRIPT_RESOURCE_FORM_SHOW_FORM_VALIDATION_ERRORS',
    SUBMIT: 'SUITESCRIPT_RESOURCE_FORM_SUBMIT',
    SUBMIT_COMPLETE: 'SUITESCRIPT_RESOURCE_FORM_SUBMIT_COMPLETE',
    SUBMIT_FAILED: 'SUITESCRIPT_RESOURCE_FORM_SUBMIT_FAILED',
    SUBMIT_ABORTED: 'SUITESCRIPT_RESOURCE_FORM_SUBMIT_ABORTED',
    CLEAR: 'SUITESCRIPT_RESOURCE_FORM_CLEAR',
    SAVE_AND_AUTHORIZE: 'SUITESCRIPT_RESOURCE_FORM_SAVE_AND_AUTHORIZE',
    COMMIT_AND_AUTHORIZE: 'SUITESCRIPT_RESOURCE_FORM_COMMIT_AND_AUTHORIZE',
    SAVE_AND_CONTINUE: 'SUITESCRIPT_RESOURCE_FORM_SAVE_AND_CONTINUE',
  },
  CONNECTION: {
    TEST: 'SUITESCRIPT_CONNECTION_TEST',
    TEST_ERRORED: 'SUITESCRIPT_CONNECTION_TEST_ERRORED',
    TEST_CANCELLED: 'SUITESCRIPT_CONNECTION_TEST_CANCELLED',
    TEST_SUCCESSFUL: 'SUITESCRIPT_CONNECTION_TEST_SUCCESSFUL',
    TEST_CLEAR: 'SUITESCRIPT_CONNECTION_TEST_CLEAR',
    LINK_INTEGRATOR: 'SUITESCRIPT_CONNECTION_LINK_INTEGRATOR',
  },
  FLOW_DATA: {
    INIT: 'SUITESCRIPT_FLOW_DATA_INIT',
    PREVIEW_DATA_REQUEST: 'SUITESCRIPT_REQUEST_FLOW_DATA_PREVIEW',
    PREVIEW_DATA_RECEIVED: 'SUITESCRIPT_RECEIVED_FLOW_DATA_PREVIEW',
    PROCESSOR_DATA_REQUEST: 'SUITESCRIPT_REQUEST_FLOW_DATA_PROCESSOR',
    PROCESSOR_DATA_RECEIVED: 'SUITESCRIPT_RECEIVED_FLOW_DATA_PROCESSOR',
    RECEIVED_ERROR: 'SUITESCRIPT_RECEIVED_FLOW_DATA_ERROR',
    SAMPLE_DATA_REQUEST: 'SUITESCRIPT_REQUEST_FLOW_SAMPLE_DATA',
    STAGE_REQUEST: 'SUITESCRIPT_REQUEST_FLOW_DATA_STAGE',
    RESET: 'SUITESCRIPT_RESET_FLOW_DATA',
    FLOW_SEQUENCE_RESET: 'SUITESCRIPT_RESET_FLOW_SEQUENCE',
    FLOWS_FOR_RESOURCE_UPDATE:
      'SUITESCRIPT_UPDATE_FLOWS_FOR_RESOURCE_FLOW_DATA',
    FLOW_UPDATE: 'SUITESCRIPT_UPDATE_FLOW_DATA',
    FLOW_RESPONSE_MAPPING_UPDATE:
      'SUITESCRIPT_UPDATE_FLOW_DATA_RESPONSE_MAPPING',
  },
  IMPORT_SAMPLEDATA: {
    REQUEST: 'SUITESCRIPT_REQUEST_IMPORT_SAMPLEDATA',
  },
  SAMPLEDATA: {
    REQUEST: 'SUITESCRIPT_REQUEST_SAMPLEDATA',
    // LOOKUP_REQUEST: 'REQUEST_LOOKUP_SAMPLEDATA',
    RECEIVED: 'SUITESCRIPT_RECEIVED_SAMPLEDATA',
    RECEIVED_ERROR: 'SUITESCRIPT_RECEIVED_SAMPLEDATA_ERROR',
    RESET: 'SUITESCRIPT_RESET_SAMPLEDATA',
    // RESET: 'SUITESCRIPT_CLEAR_SAMPLEDATA',
    // UPDATE: 'UPDATE_SAMPLEDATA',
    // SAVE_RAWDATA: 'SAVE_RAWDATA',

  },
  JOB: {
    CLEAR: 'SUITESCRIPT_JOB_CLEAR',
    REQUEST_COLLECTION: 'SUITESCRIPT_JOB_REQUEST_COLLECTION',
    RECEIVED_COLLECTION: 'SUITESCRIPT_JOB_RECEIVED_COLLECTION',
    REQUEST: 'SUITESCRIPT_JOB_REQUEST',
    RECEIVED: 'SUITESCRIPT_JOB_RECEIVED',
    REQUEST_IN_PROGRESS_JOBS_STATUS:
      'SUITESCRIPT_JOB_REQUEST_IN_PROGRESS_JOBS_STATUS',
    NO_IN_PROGRESS_JOBS: 'SUITESCRIPT_JOB_NO_IN_PROGRESS_JOBS',
    RESOLVE: 'SUITESCRIPT_JOB_RESOLVE',
    RESOLVE_INIT: 'SUITESCRIPT_JOB_RESOLVE_INIT',
    RESOLVE_UNDO: 'SUITESCRIPT_JOB_RESOLVE_UNDO',
    RESOLVE_COMMIT: 'SUITESCRIPT_JOB_RESOLVE_COMMIT',
    RESOLVE_SELECTED: 'SUITESCRIPT_JOB_RESOLVE_SELECTED',
    RESOLVE_SELECTED_INIT: 'SUITESCRIPT_JOB_RESOLVE_SELECTED_INIT',
    RESOLVE_ALL: 'SUITESCRIPT_JOB_RESOLVE_ALL',
    RESOLVE_ALL_INIT: 'SUITESCRIPT_JOB_RESOLVE_ALL_INIT',
    RESOLVE_ALL_UNDO: 'SUITESCRIPT_JOB_RESOLVE_ALL_UNDO',
    RESOLVE_ALL_COMMIT: 'SUITESCRIPT_JOB_RESOLVE_ALL_COMMIT',
    RESOLVE_ALL_PENDING: 'SUITESCRIPT_JOB_RESOLVE_ALL_PENDING',
    ERROR: {
      CLEAR: 'SUITESCRIPT_JOB_ERROR_CLEAR',
      REQUEST_COLLECTION: 'SUITESCRIPT_JOB_ERROR_REQUEST_COLLECTION',
      RECEIVED_COLLECTION: 'SUITESCRIPT_JOB_ERROR_RECEIVED_COLLECTION',
      RESOLVE_SELECTED: 'SUITESCRIPT_JOB_ERROR_RESOLVE_SELECTED',
      RESOLVE_SELECTED_INIT: 'SUITESCRIPT_JOB_ERROR_RESOLVE_SELECTED_INIT',
    },
  },
  PAGING: {
    JOB: {
      SET_ROWS_PER_PAGE: 'SUITESCRIPT_PAGING_JOB_SET_ROWS_PER_PAGE',
      SET_CURRENT_PAGE: 'SUITESCRIPT_PAGING_JOB_SET_CURRENT_PAGE',
    },
  },
  FLOW: {
    RUN: 'SUITESCRIPT_FLOW_RUN',
    ENABLE: 'SUITESCRIPT_FLOW_ENABLE',
    DISABLE: 'SUITESCRIPT_FLOW_DISABLE',
    RECEIVED_ON_OFF_ACTION_STATUS: 'SUITESCRIPT_FLOW_RECEIVED_ON_OFF_ACTION_STATUS',
    DELETE: 'SUITESCRIPT_FLOW_DELETE',
  },
  ACCOUNT: {
    RECEIVED_HAS_INTEGRATIONS: 'SUITESCRIPT_ACCOUNT_RECEIVED_HAS_INTEGRATIONS',
    CHECK_HAS_INTEGRATIONS: 'SUITESCRIPT_ACCOUNT_CHECK_HAS_INTEGRATIONS',
  },
  INSTALLER: {
    INIT_STEPS: 'SUITESCRIPT_INSTALLER_INIT_STEPS',
    REQUEST_PACKAGES: 'SUITESCRIPT_INSTALLER_REQUEST_PACKAGES',
    UPDATE: {
      STEP: 'SUITESCRIPT_INSTALLER_UPDATE_STEP',
      LINKED_CONNECTION: 'SUITESCRIPT_INSTALLER_UPDATE_LINKED_CONNECTION',
      SS_INTEGRATION_ID: 'SUITESCRIPT_INSTALLER_UPDATE_SS_INTEGRATION_ID',
      SS_CONNECTION: 'SUITESCRIPT_INSTALLER_UPDATE_SS_CONNECTION',
      PACKAGE: 'SUITESCRIPT_INSTALLER_UPDATE_PACKAGE',
    },
    CLEAR_STEPS: 'SUITESCRIPT_INSTALLER_CLEAR_STEPS',
    POST_INSTALL: 'SUITESCRIPT_INSTALLER_POST_INSTALL',
    DONE: 'SUITESCRIPT_INSTALLER_DONE',
    FAILED: 'SUITESCRIPT_INSTALLER_FAILED',
    VERIFY: {
      INTEGRATOR_BUNDLE: 'SUITESCRIPT_INSTALLER_VERIFY_INTEGRATOR_BUNDLE',
      CONNECTOR_BUNDLE: 'SUITESCRIPT_INSTALLER_VERIFY_CONNECTOR_BUNDLE',
      SS_CONNECTION: 'SUITESCRIPT_INSTALLER_VERIFY_SS_CONNECTION',
      PACKAGE: 'SUITESCRIPT_INSTALLER_VERIFY_PACKAGE',
    },
  },
  MAPPING: {
    INIT: 'SUITESCRIPT_MAPPING_INIT',
    INIT_COMPLETE: 'SUITESCRIPT_MAPPING_INIT_COMPLETE',
    PATCH_FIELD: 'SUITESCRIPT_MAPPING_PATCH_FIELD',
    DELETE: 'SUITESCRIPT_MAPPING_DELETE',
    PATCH_SETTINGS: 'SUITESCRIPT_MAPPING_PATCH_SETTINGS',
    PATCH_EXTRACT_LIST: 'SUITESCRIPT_MAPPING_PATCH_EXTRACT_LIST',
    UPDATE_LOOKUPS: 'SUITESCRIPT_UPDATE_LOOKUPS',
    CHANGE_ORDER: 'SUITESCRIPT_MAPPING_CHANGE_ORDER',
    SAVE: 'SUITESCRIPT_MAPPING_SAVE',
    SAVE_COMPLETE: 'SUITESCRIPT_MAPPING_SAVE_COMPLETE',
    SAVE_FAILED: 'SUITESCRIPT_MAPPING_SAVE_FAILED',
    REFRESH_GENEREATES: 'SUITESCRIPT_MAPPING_REFRESH_GENEREATES',
    PATCH_INCOMPLETE_GENERATES: 'SUITESCRIPT_MAPPING_PATCH_INCOMPLETE_GENERATES',
    UPDATE_MAPPINGS: 'SUITESCRIPT_MAPPING_UPDATE_MAPPINGS',
    UPDATE_LAST_TOUCHED_FIELD: 'SUITESCRIPT_MAPPING_UPDATE_LAST_TOUCHED_FIELD',
    CLEAR: 'SUITESCRIPT_MAPPING_CLEAR',
    CHECK_FOR_SF_SUBLIST_EXTRACT_PATCH: 'SUITESCRIPT_MAPPING_CHECK_FOR_SF_SUBLIST_EXTRACT_PATCH',
    SET_SF_SUBLIST_FIELD_NAME: 'SUITESCRIPT_MAPPING_SET_SF_SUBLIST_FIELD_NAME',
  },
};
const CUSTOM_SETTINGS = {
  FORM_REQUEST: 'CUSTOM_SETTINGS_FORM_REQUEST',
  FORM_RECEIVED: 'CUSTOM_SETTINGS_FORM_RECEIVED',
  FORM_ERROR: 'CUSTOM_SETTINGS_FORM_ERROR',
  FORM_CLEAR: 'CUSTOM_SETTINGS_FORM_CLEAR',
};
const EDITOR_SAMPLE_DATA = {
  REQUEST: 'EDITOR_SAMPLE_DATA_REQUEST',
  RECEIVED: 'EDITOR_SAMPLE_DATA_RECEIVED',
  FAILED: 'EDITOR_SAMPLE_DATA_FAILED',
  CLEAR: 'EDITOR_SAMPLE_DATA_CLEAR',
};

export default {
  FORM,
  UI_VERSION_FETCH,
  UI_VERSION_UPDATE,
  USER_ACCEPTED_ACCOUNT_TRANSFER,
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
  ABORT_ALL_SAGAS,
  CLEAR_STORE,
  CLEAR_COMMS,
  CLEAR_COMM_BY_KEY,
  PATCH_FILTER,
  CLEAR_FILTER,
  EDITOR,
  PROFILE,
  RESOURCE,
  AGENT,
  STACK,
  API_REQUEST,
  API_COMPLETE,
  API_RETRY,
  API_FAILURE,
  AUTH_WARNING,
  AUTH_USER_ALREADY_LOGGED_IN,
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
  ERROR_MANAGER,
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
  FLOW_METRICS,
  MAPPING,
  SEARCH_CRITERIA,
  ANALYTICS,
  TRANSFER,
  SHARED_NOTIFICATION_ACCEPT,
  SHARED_NOTIFICATION_ACCEPTED,
  SHARED_NOTIFICATION_REJECT,
  LICENSE_NUM_ENABLED_FLOWS_REQUEST,
  LICENSE_NUM_ENABLED_FLOWS_RECEIVED,
  LICENSE_ENTITLEMENT_USAGE_REQUEST,
  LICENSE_ENTITLEMENT_USAGE_RECEIVED,
  RESPONSE_MAPPING,
  SUITESCRIPT,
  CUSTOM_SETTINGS,
  EXPORTDATA,
  EDITOR_SAMPLE_DATA,
  UPDATE_CHILD_INTEGRATION,
  CLEAR_CHILD_INTEGRATION,
  ACCOUNT_ADD_SUITESCRIPT_LINKED_CONNECTION,
  ACCOUNT_DELETE_SUITESCRIPT_LINKED_CONNECTION,
};
