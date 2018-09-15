const SET_THEME = 'SET_THEME';

export const REQUEST = 'REQUEST';
export const RECEIVED = 'RECEIVED';
export const FAILURE = 'FAILURE';

function createRequestTypes(base) {
  return [REQUEST, RECEIVED, FAILURE].reduce((acc, type) => {
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
  PROFILE,
  EXPORTS,
  IMPORTS,
  CONNECTIONS,
};
