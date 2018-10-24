import actionTypes from '../../actions/types';

const initialState = {};

export default (state = initialState, action) => {
  const { type, path } = action;
  let newStatus;

  switch (type) {
    case actionTypes.API_REQUEST:
      newStatus = Object.assign({}, state[path]) || {};

      newStatus.loading = true;
      delete newStatus.retry;
      delete newStatus.error;

      return { ...state, [path]: newStatus };

    case actionTypes.API_COMPLETE:
      newStatus = Object.assign({}, state[path]) || {};

      newStatus.loading = false;
      delete newStatus.retry;
      delete newStatus.error;

      return { ...state, [path]: newStatus };

    case actionTypes.API_RETRY:
      newStatus = Object.assign({}, state[path]) || {};

      newStatus.retry = newStatus.retry || 0;
      newStatus.retry += 1;

      return { ...state, [path]: newStatus };

    case actionTypes.API_FAILURE:
      newStatus = Object.assign({}, state[path]) || {};

      newStatus.error = action.message || 'unknown error';
      delete newStatus.retry;
      newStatus.loading = false;

      return { ...state, [path]: newStatus };

    default:
      return state;
  }
};

// #region PUBLIC SELECTORS
export function isLoading(state, resourceName) {
  return !!(state && state[resourceName] && state[resourceName].loading);
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
      error: error(state, key),
    };

    if (status.isLoading || status.error) {
      resources.push(status);
    }
  });

  return resources.length ? resources : null;
}
// #endregion
