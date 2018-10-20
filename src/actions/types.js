const SET_THEME = 'SET_THEME';
const PATCH_FILTER = 'PATCH_FILTER';
const CLEAR_FILTER = 'CLEAR_FILTER';
const PATCH_STAGED_RESOURCE = 'PATCH_STAGED_RESOURCE';
const CLEAR_STAGED_RESOURCE = 'CLEAR_STAGED_RESOURCE';
const COMMIT_STAGED_RESOURCE = 'COMMIT_STAGED_RESOURCE';

export const REQUEST = 'REQUEST';
export const RECEIVED = 'RECEIVED';
export const FAILURE = 'FAILURE';
export const RETRY = 'RETRY';

function createRequestTypes(base) {
  return [REQUEST, RECEIVED, FAILURE, RETRY].reduce((acc, type) => {
    acc[type] = `${base}_${type}`;

    return acc;
  }, {});
}

const PROFILE = createRequestTypes('PROFILE');
const RESOURCE = createRequestTypes('RESOURCE');

export default {
  SET_THEME,
  PATCH_FILTER,
  CLEAR_FILTER,
  PATCH_STAGED_RESOURCE,
  CLEAR_STAGED_RESOURCE,
  COMMIT_STAGED_RESOURCE,
  PROFILE,
  RESOURCE,
};
