import actionTypes from '../../actions/types';

const initialState = {};

export default (state = initialState, action) => {
  const { type, path } = action;
  let newStatus;
  const timestamp = Date.now();

  switch (type) {
    case actionTypes.API_REQUEST:
      newStatus = Object.assign({}, state[path]);
      newStatus.timestamp = timestamp;
      newStatus.loading = true;
      delete newStatus.retry;
      delete newStatus.error;

      return { ...state, [path]: newStatus };

    case actionTypes.API_COMPLETE:
      newStatus = Object.assign({}, state[path]);
      newStatus.loading = false;
      delete newStatus.retry;
      delete newStatus.error;
      delete newStatus.timestamp;

      return { ...state, [path]: newStatus };

    case actionTypes.API_RETRY:
      newStatus = Object.assign({}, state[path]);
      newStatus.retry = newStatus.retry || 0;
      newStatus.retry += 1;
      delete newStatus.timestamp;

      return { ...state, [path]: newStatus };

    case actionTypes.API_FAILURE:
      newStatus = Object.assign({}, state[path]);
      newStatus.timestamp = timestamp;
      newStatus.error = action.message || 'unknown error';
      delete newStatus.retry;
      newStatus.loading = false;
      delete newStatus.timestamp;

      return { ...state, [path]: newStatus };

    default:
      return state;
  }
};

// #region PUBLIC SELECTORS
export function isLoading(state, resourceName) {
  return !!(state && state[resourceName] && state[resourceName].loading);
}

export function timestampComms(state, resourceName) {
  return (state && state[resourceName] && state[resourceName].timestamp) || 0;
}

export function retryCount(state, resourceName) {
  return (state && state[resourceName] && state[resourceName].retry) || 0;
}

export function error(state, resourceName) {
  return state && state[resourceName] && state[resourceName].error;
}

export function allLoadingOrErrored(state) {
  if (!state || typeof state !== 'object') {
    return null;
  }

  const resources = [];

  Object.keys(state).forEach(key => {
    const status = {
      name: key,
      isLoading: isLoading(state, key),
      retryCount: retryCount(state, key),
      timestamp: timestampComms(state, key),
      error: error(state, key),
    };

    if (status.isLoading || status.error) {
      resources.push(status);
    }
  });

  return resources.length ? resources : null;
}

export function isLoadingAnyResource(state) {
  if (!state || typeof state !== 'object') {
    return null;
  }

  return (
    Object.keys(state).filter(resource => isLoading(state, resource)).length !==
    0
  );
}
// #endregion
