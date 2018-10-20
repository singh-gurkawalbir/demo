const SET_THEME = 'SET_THEME';
const PATCH_FILTER = 'PATCH_FILTER';
const CLEAR_FILTER = 'CLEAR_FILTER';

export const REQUEST = 'REQUEST';
export const RECEIVED = 'RECEIVED';
export const FAILURE = 'FAILURE';
export const RETRY = 'RETRY';
export const STAGE_PATCH = 'STAGE_PATCH';
export const STAGE_CLEAR = 'STAGE_CLEAR';
export const STAGE_COMMIT = 'STAGE_COMMIT';

const baseActions = [REQUEST, RECEIVED, FAILURE, RETRY];
const stageActions = [STAGE_PATCH, STAGE_CLEAR, STAGE_COMMIT];

function createResourceActionTypes(base, includeStagedActions) {
  const supportedActions = includeStagedActions
    ? [...baseActions, ...stageActions]
    : [...baseActions];

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
};
