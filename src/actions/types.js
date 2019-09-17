const PATCH_FILTER = 'PATCH_FILTER';
const CLEAR_FILTER = 'CLEAR_FILTER';
const EDITOR_INIT = 'EDITOR_INIT';
const EDITOR_PATCH = 'EDITOR_PATCH';
const EDITOR_RESET = 'EDITOR_RESET';
const EDITOR_EVALUATE_REQUEST = 'EDITOR_EVALUATE_REQUEST';
const EDITOR_EVALUATE_RESPONSE = 'EDITOR_EVALUATE_RESPONSE';
const EDITOR_EVALUATE_FAILURE = 'EDITOR_EVALUATE_FAILURE';
const EDITOR_VALIDATE_FAILURE = 'EDITOR_VALIDATE_FAILURE';

export const CREATED = 'CREATED';
export const REQUEST = 'REQUEST';
export const REQUEST_COLLECTION = 'REQUEST_COLLECTION';
export const RECEIVED = 'RECEIVED';
export const RECEIVED_COLLECTION = 'RECEIVED_COLLECTION';
const DELETE = 'DELETE';
const PATCH = 'PATCH';
const DELETED = 'DELETED';
const REFERENCES_REQUEST = 'REFERENCES_REQUEST';
const REFERENCES_CLEAR = 'REFERENCES_CLEAR';
const REFERENCES_RECEIVED = 'REFERENCES_RECEIVED';
const METADATA = {
  NETSUITE_REQUEST: 'REQUEST_NETSUITE_METADATA',
  SALESFORCE_REQUEST: 'REQUEST_SALESFORCE_METADATA',
  REFRESH: 'REFRESH_METADATA',
  RECEIVED_NETSUITE: 'RECEIVED_NETSUITE_METADATA',
  RECEIVED_SALESFORCE: 'RECEIVED_SALESFORCE_METADATA',
  RECEIVED_NETSUITE_ERROR: 'RECEIVED_NETSUITE_ERROR',
  RECEIVED_SALESFORCE_ERROR: 'RECEIVED_SALESFORCE_ERROR',
  ASSISTANT_REQUEST: 'REQUEST_ASSISTANT',
  ASSISTANT_RECEIVED: 'RECEIVED_ASSISTANT',
};
const CONNECTORS = {
  METADATA_REQUEST: 'CONNECTORS_REFRESH_METADATA',
  METADATA_RECEIVED: 'CONNECTORS_RECEIVED_METADATA',
  METADATA_FAILURE: 'CONNECTORS_RECEIVED_ERROR_REFRESH_METADATA',
  METADATA_CLEAR: 'CONNECTORS_METADATA_CLEAR',
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
const CANCEL_TASK = 'CANCEL_TASK';
const TEST_CONNECTION = 'TEST_CONNECTION';
const STAGE_PATCH = 'STAGE_PATCH';
const STAGE_CLEAR = 'STAGE_CLEAR';
const STAGE_UNDO = 'STAGE_UNDO';
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
const AUTH_REQUEST_REDUCER = 'AUTH_REQUEST_REDUCER';
const AUTH_REQUEST = 'AUTH_REQUEST';
const AUTH_SUCCESSFUL = 'AUTH_SUCCESSFUL';
const AUTH_FAILURE = 'AUTH_FAILURE';
const USER_LOGOUT = 'USER_LOGOUT';
const USER_CHANGE_PASSWORD = 'USER_CHANGE_PASSWORD';
const USER_CHANGE_EMAIL = 'USER_CHANGE_EMAIL';
const CLEAR_STORE = 'CLEAR_STORE';
const DELETE_PROFILE = 'DELETE_PROFILE';
const UPDATE_PROFILE = 'UPDATE_PROFILE';
const UPDATE_PREFERENCES = 'UPDATE_PREFERENCES';
const INIT_SESSION = 'INIT_SESSION';
const APP_RELOAD = 'APP_RELOAD';
const APP_ERRORED = 'APP_ERRORED';
const APP_CLEAR_ERROR = 'APP_CLEAR_ERROR';
const APP_TOGGLE_DRAWER = 'APP_TOGGLE_DRAWER';
const CLEAR_COMMS = 'CLEAR_COMMS';
const CLEAR_COMM_BY_KEY = 'CLEAR_COMM_BY_KEY';
const EDITOR_UPDATE_HELPER_FUNCTIONS = 'EDITOR_UPDATE_HELPER_FUNCTIONS';
const EDITOR_REFRESH_HELPER_FUNCTIONS = 'EDITOR_REFRESH_HELPER_FUNCTIONS';
const baseResourceActions = [
  CREATED,
  REQUEST,
  REQUEST_COLLECTION,
  RECEIVED,
  RECEIVED_COLLECTION,
];
const stageResourceActions = [
  STAGE_PATCH,
  STAGE_CLEAR,
  STAGE_UNDO,
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
  SUBMIT: 'RESOURCE_FORM_SUBMIT',
  SUBMIT_COMPLETE: 'RESOURCE_FORM_SUBMIT_COMPLETE',
  CLEAR: 'RESOURCE_FORM_CLEAR',
  SAVE_AND_AUTHORIZE: 'SAVE_AND_AUTHORIZE',
  COMMIT_AND_AUTHORIZE: 'COMMIT_AND_AUTHORIZE',
};
const INTEGRATION_APPS = {
  INSTALLER: {
    INSTALL_STEP: {
      REQUEST: 'INTEGRATION_APPS_INSTALL_STEP_REQUEST',
      UPDATE: 'INTEGRATION_APPS_INSTALL_STEP_UPDATE',
      DONE: 'INTEGRATION_APPS_INSTALL_STEP_COMPLETE',
    },
  },
  UNINSTALLER: {
    PRE_UNINSTALL: 'INTEGRATION_APPS_UNINSTALLER_PRE_UNINSTALL',
    RECEIVED_UNINSTALL_STEPS:
      'INTEGRATION_APPS_UNINSTALLER_RECEIVED_UNINSTALL_STEPS',
    DELETE_INTEGRATION: 'INTEGRATION_APPS_UNINSTALLER_DELETE_INTEGRATION',
    UNINSTALL_STEP: {
      UPDATE: 'INTEGRATION_APPS_UNINSTALL_UPDATE',
      REQUEST: 'INTEGRATION_APPS_UNINSTALLER_STEP_UNINSTALL',
      CLEAR: 'INTEGRATION_APPS_UNINSTALLER_STEP_CLEAR',
    },
  },
  STORE: {
    ADD: 'INTEGRATION_APPS_STORE_ADD',
    RECEIVED: 'INTEGRATION_APPS_STORE_STEPS_RECEIVED',
  },
  SETTINGS: {},
};
const AGENT = {
  TOKEN_DISPLAY: 'AGENT_TOKEN_DISPLAY',
  TOKEN_CHANGE: 'AGENT_TOKEN_CHANGE',
  TOKEN_MASK: 'AGENT_TOKEN_MASK',
  TOKEN_RECEIVED: 'AGENT_TOKEN_RECEIVED',
  DOWNLOAD_INSTALLER: 'AGENT_DOWNLOAD_INSTALLER',
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
};
const CONNECTION = {
  REGISTER_REQUEST: 'REGISTER_REQUEST',
  REGISTER_COMPLETE: 'REGISTER_COMPLETE',
};
const LICENSE_TRIAL_REQUEST = 'LICENSE_TRIAL_REQUEST';
const LICENSE_TRIAL_ISSUED = 'LICENSE_TRIAL_ISSUED';
const LICENSE_UPGRADE_REQUEST = 'LICENSE_UPGRADE_REQUEST';
const LICENSE_UPGRADE_REQUEST_SUBMITTED = 'LICENSE_UPGRADE_REQUEST_SUBMITTED';
const ACCOUNT_INVITE_ACCEPT = 'ACCOUNT_INVITE_ACCEPT';
const ACCOUNT_INVITE_ACCEPTED = 'ACCOUNT_INVITE_ACCEPTED';
const ACCOUNT_INVITE_REJECT = 'ACCOUNT_INVITE_REJECT';
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
const JOB = {
  REQUEST_COLLECTION: 'JOB_REQUEST_COLLECTION',
  RECEIVED_COLLECTION: 'JOB_RECEIVED_COLLECTION',
  REQUEST_FAMILY: 'JOB_REQUEST_FAMILY',
  RECEIVED_FAMILY: 'JOB_RECEIVED_FAMILY',
  CLEAR: 'JOB_CLEAR',
  REQUEST_IN_PROGRESS_JOBS_STATUS: 'JOB_REQUEST_IN_PROGRESS_JOBS_STATUS',
  NO_IN_PROGRESS_JOBS: 'JOB_NO_IN_PROGRESS_JOBS',
  DOWNLOAD_DIAGNOSTICS_FILE: 'JOB_DOWNLOAD_DIAGNOSTICS_FILE',
  REQUEST_DIAGNOSTICS_FILE_URL: 'JOB_REQUEST_DIAGNOSTICS_FILE_URL',
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
  DOWNLOAD_ERROR_FILE: 'JOB_DOWNLOAD_ERROR_FILE',
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
  },
  PAGING: {
    SET_ROWS_PER_PAGE: 'JOB_PAGING_SET_ROWS_PER_PAGE',
    SET_CURRENT_PAGE: 'JOB_PAGING_SET_CURRENT_PAGE',
  },
};
const FLOW = {
  RUN: 'FLOW_RUN',
};

export default {
  NETSUITE_USER_ROLES,
  METADATA,
  CONNECTORS,
  CANCEL_TASK,
  TOKEN,
  TEST_CONNECTION,
  APP_ERRORED,
  APP_CLEAR_ERROR,
  APP_RELOAD,
  APP_TOGGLE_DRAWER,
  INTEGRATION_APPS,
  UPDATE_PROFILE,
  UPDATE_PREFERENCES,
  USER_CHANGE_PASSWORD,
  USER_CHANGE_EMAIL,
  USER_LOGOUT,
  CLEAR_STORE,
  CLEAR_COMMS,
  CLEAR_COMM_BY_KEY,
  PATCH_FILTER,
  CLEAR_FILTER,
  EDITOR_INIT,
  EDITOR_PATCH,
  EDITOR_RESET,
  EDITOR_EVALUATE_REQUEST,
  EDITOR_EVALUATE_RESPONSE,
  EDITOR_EVALUATE_FAILURE,
  EDITOR_VALIDATE_FAILURE,
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
  AUTH_REQUEST_REDUCER,
  AUTH_REQUEST,
  AUTH_SUCCESSFUL,
  AUTH_FAILURE,
  DELETE_PROFILE,
  INIT_SESSION,
  LICENSE_TRIAL_REQUEST,
  LICENSE_TRIAL_ISSUED,
  LICENSE_UPGRADE_REQUEST,
  LICENSE_UPGRADE_REQUEST_SUBMITTED,
  ACCOUNT_INVITE_ACCEPT,
  ACCOUNT_INVITE_ACCEPTED,
  ACCOUNT_INVITE_REJECT,
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
  JOB,
  FLOW,
  CONNECTION,
};
