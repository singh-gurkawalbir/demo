const initialState = {};

export default (state = initialState, action) => {
  if (action.request) {
    const status = Object.assign({}, state[action.request]) || {};

    status.loading = true;
    delete status.retry;

    return { ...state, [action.request]: status };
  }

  if (action.received) {
    const status = Object.assign({}, state[action.received]) || {};

    status.loading = false;
    delete status.retry;

    return { ...state, [action.received]: status };
  }

  if (action.retry) {
    const status = Object.assign({}, state[action.retry]) || {};

    status.retry = status.retry || 0;
    status.retry += 1;

    return { ...state, [action.retry]: status };
  }

  return state;
};

// PUBLIC SELECTORS
export function isLoading(state, resourceName) {
  return !!(state && state[resourceName] && state[resourceName].loading);
}

export function retryCount(state, resourceName) {
  return !!(state && state[resourceName] && state[resourceName].retry);
}

export function error(state, resourceName) {
  return !!(state && state[resourceName] && state[resourceName].error);
}
