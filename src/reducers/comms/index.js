import actionTypes from '../../actions/types';

const initialState = {};

export default (state = initialState, action) => {
  const { type, path, message } = action;
  let newState;
  const timestamp = Date.now();

  switch (type) {
    case actionTypes.API_REQUEST:
      newState = Object.assign({}, state[path]);
      newState.timestamp = timestamp;
      newState.loading = true;
      newState.message = message;
      delete newState.retry;
      delete newState.error;

      return { ...state, [path]: newState };

    case actionTypes.API_COMPLETE:
      newState = Object.assign({}, state[path]);
      newState.loading = false;
      delete newState.retry;
      delete newState.error;
      delete newState.timestamp;

      return { ...state, [path]: newState };

    case actionTypes.API_RETRY:
      newState = Object.assign({}, state[path]);
      newState.retry = newState.retry || 0;
      newState.retry += 1;
      newState.timestamp = timestamp;

      return { ...state, [path]: newState };

    case actionTypes.API_FAILURE:
      newState = Object.assign({}, state[path]);
      newState.error = action.message || 'unknown error';
      delete newState.retry;
      newState.loading = false;
      delete newState.timestamp;

      return { ...state, [path]: newState };
    case actionTypes.CLEAR_COMMS:
      newState = Object.assign({}, state);
      Object.keys(newState).forEach(i => {
        if (newState[i].error) delete newState[i];
      });

      return newState;
    default:
      return state;
  }
};

// #region PUBLIC SELECTORS
export function isLoading(state, resourceName) {
  return !!(state && state[resourceName] && state[resourceName].loading);
}

export function requestMessage(state, resourceName) {
  return (state && state[resourceName] && state[resourceName].message) || '';
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
      message: requestMessage(state, key),
      error: error(state, key),
    };

    if (status.isLoading || status.error) {
      resources.push(status);
    }
  });

  return resources.length ? resources : null;
}

// function verifyThreshold( )
export function isCommsBelowNetworkThreshold(state) {
  if (!state || typeof state !== 'object') {
    return false;
  }

  return (
    Object.keys(state).filter(
      resource =>
        Date.now() - timestampComms(state, resource) <=
        Number(process.env.NETWORK_THRESHOLD)
    ).length > 0
  );
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
