const SET_THEME = 'SET_THEME';
const PATCH_FILTER = 'PATCH_FILTER';
const CLEAR_FILTER = 'CLEAR_FILTER';

export const REQUEST = 'REQUEST';
export const REQUEST_COLLECTION = 'REQUEST_COLLECTION';
export const RECEIVED = 'RECEIVED';
export const RECEIVED_COLLECTION = 'RECEIVED_COLLECTION';

const STAGE_PATCH = 'STAGE_PATCH';
const STAGE_CLEAR = 'STAGE_CLEAR';
const STAGE_COMMIT = 'STAGE_COMMIT';
// The action types below are used for managing network activity.
// Typically this set of actions are only dispatched in Redux Sagas.
const API_REQUEST = 'API_REQUEST';
const API_COMPLETE = 'API_COMPLETE';
const API_RETRY = 'API_RETRY';
const API_FAILURE = 'API_FAILURE';
const baseResourceActions = [REQUEST, REQUEST_COLLECTION, RECEIVED];
const stageResourceActions = [STAGE_PATCH, STAGE_CLEAR, STAGE_COMMIT];

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

export default {
  SET_THEME,
  PATCH_FILTER,
  CLEAR_FILTER,
  PROFILE,
  RESOURCE,
  API_REQUEST,
  API_COMPLETE,
  API_RETRY,
  API_FAILURE,
};
