import actionTypes from './types';

// These are redux action "creators". Actions are reusable by any
// component and as such we want creators to ensure all actions of
// a type are symetrical in shape.

function action(type, payload = {}) {
  return { type, ...payload };
}

const profile = {
  request: () => action(actionTypes.PROFILE.REQUEST, { request: 'profile' }),
  retry: () => action(actionTypes.PROFILE.RETRY, { retry: 'profile' }),
  received: profile =>
    action(actionTypes.PROFILE.RECEIVED, { received: 'profile', profile }),
  failure: message =>
    action(actionTypes.PROFILE.FAILURE, { errors: { profile: message } }),
};
const exports = {
  request: () => action(actionTypes.EXPORTS.REQUEST, { request: 'exports' }),
  retry: () => action(actionTypes.EXPORTS.RETRY, { retry: 'exports' }),
  received: exports =>
    action(actionTypes.EXPORTS.RECEIVED, {
      received: 'exports',
      data: { exports },
    }),
  failure: message =>
    action(actionTypes.EXPORTS.FAILURE, { errors: { exports: message } }),
};
const imports = {
  request: () => action(actionTypes.IMPORTS.REQUEST, { request: 'imports' }),
  retry: () => action(actionTypes.IMPORTS.RETRY, { retry: 'imports' }),
  received: imports =>
    action(actionTypes.IMPORTS.RECEIVED, {
      received: 'imports',
      data: { imports },
    }),
  failure: message =>
    action(actionTypes.IMPORTS.FAILURE, { errors: { imports: message } }),
};
const connections = {
  request: () =>
    action(actionTypes.CONNECTIONS.REQUEST, { request: 'connections' }),
  retry: () => action(actionTypes.CONNECTIONS.RETRY, { retry: 'connections' }),
  received: connections =>
    action(actionTypes.CONNECTIONS.RECEIVED, {
      received: 'connections',
      data: { connections },
    }),
  failure: message =>
    action(actionTypes.CONNECTIONS.FAILURE, {
      errors: { connections: message },
    }),
};
const setTheme = themeName => ({
  type: actionTypes.SET_THEME,
  themeName,
});

export default {
  setTheme,
  profile,
  exports,
  imports,
  connections,
};
