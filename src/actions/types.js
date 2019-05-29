const PATCH_FILTER = 'PATCH_FILTER';
const CLEAR_FILTER = 'CLEAR_FILTER';
const EDITOR_INIT = 'EDITOR_INIT';
const EDITOR_PATCH = 'EDITOR_PATCH';
const EDITOR_RESET = 'EDITOR_RESET';
const EDITOR_EVALUATE_REQUEST = 'EDITOR_EVALUATE_REQUEST';
const EDITOR_EVALUATE_RESPONSE = 'EDITOR_EVALUATE_RESPONSE';
const EDITOR_EVALUATE_FAILURE = 'EDITOR_EVALUATE_FAILURE';
const EDITOR_VALIDATE_FAILURE = 'EDITOR_VALIDATE_FAILURE';

export const REQUEST = 'REQUEST';
export const REQUEST_COLLECTION = 'REQUEST_COLLECTION';
export const RECEIVED = 'RECEIVED';
export const RECEIVED_COLLECTION = 'RECEIVED_COLLECTION';

const CANCEL_TASK = 'CANCEL_TASK';
const TEST_CONNECTION = 'TEST_CONNECTION';
const STAGE_PATCH = 'STAGE_PATCH';
const STAGE_CLEAR = 'STAGE_CLEAR';
const STAGE_UNDO = 'STAGE_UNDO';
const STAGE_COMMIT = 'STAGE_COMMIT';
const STAGE_CONFLICT = 'STAGE_CONFLICT';
const CLEAR_CONFLICT = 'CLEAR_CONFLICT';
const PATCH_FORM_FIELD = 'PATCH_FORM_FIELD';
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
const RELOAD_APP = 'RELOAD_APP';
const CLEAR_COMMS = 'CLEAR_COMMS';
const CLEAR_COMM_BY_KEY = 'CLEAR_COMM_BY_KEY';
const EDITOR_UPDATE_HELPER_FUNCTIONS = 'EDITOR_UPDATE_HELPER_FUNCTIONS';
const EDITOR_REFRESH_HELPER_FUNCTIONS = 'EDITOR_REFRESH_HELPER_FUNCTIONS';
const baseResourceActions = [
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
];

function createResourceActionTypes(base, includeStagedActions) {
  const supportedActions = includeStagedActions
    ? [...baseResourceActions, ...stageResourceActions]
    : [...baseResourceActions];

  return supportedActions.reduce((acc, type) => {
    acc[type] = `${base}_${type}`;

    return acc;
  }, {});
}

const PROFILE = createResourceActionTypes('PROFILE');
const RESOURCE = createResourceActionTypes('RESOURCE', true);
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
const CLEAR_AUDIT_LOGS = 'CLEAR_AUDIT_LOGS';

export default {
  CANCEL_TASK,
  TEST_CONNECTION,
  RELOAD_APP,
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
  USER_CREATE,
  USER_CREATED,
  USER_UPDATE,
  USER_UPDATED,
  USER_DELETE,
  USER_DELETED,
  USER_DISABLE,
  USER_DISABLED,
  USER_MAKE_OWNER,
  CLEAR_AUDIT_LOGS,
};
