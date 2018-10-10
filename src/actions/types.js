const SET_THEME = 'SET_THEME';
const PATCH_FILTER = 'PATCH_FILTER';
const CLEAR_FILTER = 'CLEAR_FILTER';

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
const EXPORTS = createRequestTypes('EXPORTS');
const IMPORTS = createRequestTypes('IMPORTS');
const CONNECTIONS = createRequestTypes('CONNECTIONS');

export default {
  SET_THEME,
  PATCH_FILTER,
  CLEAR_FILTER,
  PROFILE,
  EXPORTS,
  IMPORTS,
  CONNECTIONS,
};
