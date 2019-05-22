import actionTypes from '../../actions/types';
import commPathGenerator from '../../utils/comPathGenerator';

const initialState = {};

export const COMM_STATES = {
  LOADING: 'loading',
  ERROR: 'error',
  SUCCESS: 'success',
};
Object.freeze(COMM_STATES);

export default (state = initialState, action) => {
  const { type, path, message, hidden, reqMethod = 'GET' } = action;
  let newState;
  const timestamp = Date.now();
  const commPath = commPathGenerator(path, reqMethod);

  switch (type) {
    case actionTypes.API_REQUEST:
      newState = Object.assign({}, state[commPath]);
      newState.timestamp = timestamp;
      newState.status = COMM_STATES.LOADING;
      newState.message = message;
      newState.hidden = hidden;
      newState.reqMethod = reqMethod;
      delete newState.retry;

      return { ...state, [commPath]: newState };

    case actionTypes.API_COMPLETE:
      newState = Object.assign({}, state[commPath]);
      newState.status = COMM_STATES.SUCCESS;
      newState.message = message;
      delete newState.retry;
      delete newState.timestamp;

      return { ...state, [commPath]: newState };

    case actionTypes.API_RETRY:
      newState = Object.assign({}, state[commPath]);
      newState.retry = newState.retry || 0;
      newState.retry += 1;
      newState.timestamp = timestamp;

      return { ...state, [commPath]: newState };

    case actionTypes.API_FAILURE:
      newState = Object.assign({}, state[commPath]);
      newState.status = COMM_STATES.ERROR;
      newState.message = message || 'unknown error';

      // if not defined it should be false
      if (hidden) newState.hidden = hidden;
      delete newState.retry;
      delete newState.timestamp;

      return { ...state, [commPath]: newState };
    case actionTypes.CLEAR_COMMS:
      newState = Object.assign({}, state);
      Object.keys(newState).forEach(i => {
        if (
          newState[i].status === COMM_STATES.ERROR ||
          newState[i].status === COMM_STATES.SUCCESS
        )
          delete newState[i];
      });

      return newState;
    case actionTypes.CLEAR_COMM_BY_PATH:
      newState = Object.assign({}, state);

      if (newState[path]) {
        delete newState[path];
      }

      return newState;
    // case actionTypes.CLEAR_SUCCESS_COMMS:
    //   newState = Object.assign({}, state);
    //   Object.keys(newState).forEach(i => {
    //     if (newState[i].success) delete newState[i];
    //   });

    //   return newState;
    default:
      return state;
  }
};

// #region PUBLIC SELECTORS
export function commReqType(state, resourceName) {
  return (
    (state && state[resourceName] && state[resourceName].reqMethod) || 'GET'
  );
}

export function isLoading(state, resourceName) {
  return !!(
    state &&
    state[resourceName] &&
    state[resourceName].status === COMM_STATES.LOADING
  );
}

function commStatus(state, resourceName) {
  return state && state[resourceName] && state[resourceName].status;
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

function isHidden(state, resourceName) {
  return !!(state && state[resourceName] && state[resourceName].hidden);
}

export function allLoadingOrErrored(state) {
  if (!state || typeof state !== 'object') {
    return null;
  }

  const resources = [];

  Object.keys(state).forEach(key => {
    const comm = {
      name: key,
      status: commStatus(state, key),
      retryCount: retryCount(state, key),
      timestamp: timestampComms(state, key),
      message: requestMessage(state, key),
      isHidden: isHidden(state, key),
    };

    if (
      (comm.status === COMM_STATES.LOADING ||
        comm.status === COMM_STATES.ERROR) &&
      !comm.isHidden
    ) {
      resources.push(comm);
    }
  });

  return resources.length ? resources : null;
}

export function isLoadingAnyResource(state) {
  if (!state || typeof state !== 'object') {
    return null;
  }

  return (
    Object.keys(state).filter(
      resource => isLoading(state, resource) && !isHidden(state, resource)
    ).length !== 0
  );
}
// #endregion
