const initialState = {};

export default (state = initialState, action) => {
  if (action.request) {
    const status = Object.assign({}, state[action.request]) || {};

    status.loading = true;
    delete status.retry;
    delete status.error;

    return { ...state, [action.request]: status };
  }

  if (action.received) {
    const status = Object.assign({}, state[action.received]) || {};

    status.loading = false;
    delete status.retry;
    delete status.error;

    return { ...state, [action.received]: status };
  }

  if (action.retry) {
    const status = Object.assign({}, state[action.retry]) || {};

    status.retry = status.retry || 0;
    status.retry += 1;

    return { ...state, [action.retry]: status };
  }

  if (action.error) {
    const status = Object.assign({}, state[action.error]) || {};

    status.error = action.message || 'unknown error';
    delete status.retry;
    status.loading = false;

    return { ...state, [action.error]: status };
  }

  return state;
};

// PUBLIC SELECTORS
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
