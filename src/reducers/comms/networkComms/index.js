import produce from 'immer';
import actionTypes from '../../../actions/types';
import commKeyGenerator from '../../../utils/commKeyGenerator';

const initialState = {};

export const COMM_STATES = {
  LOADING: 'loading',
  ERROR: 'error',
  SUCCESS: 'success',
};
Object.freeze(COMM_STATES);

export default (state = initialState, action) => {
  const { type, path, message, hidden, method = 'GET', key } = action;
  const timestamp = Date.now();
  const commKey = commKeyGenerator(path, method);

  return produce(state, draft => {
    switch (type) {
      case actionTypes.API_REQUEST:
        if (!draft[commKey]) draft[commKey] = {};
        draft[commKey].timestamp = timestamp;
        draft[commKey].status = COMM_STATES.LOADING;
        draft[commKey].message = message;
        draft[commKey].hidden = hidden;
        draft[commKey].method = method;
        delete draft[commKey].retry;

        break;
      case actionTypes.API_COMPLETE:
        if (!draft[commKey]) draft[commKey] = {};
        draft[commKey].status = COMM_STATES.SUCCESS;
        draft[commKey].message = message;
        delete draft[commKey].retry;
        delete draft[commKey].timestamp;

        break;
      case actionTypes.API_RETRY:
        if (!draft[commKey]) draft[commKey] = {};
        draft[commKey].retry = draft[commKey].retry || 0;
        draft[commKey].retry += 1;
        draft[commKey].timestamp = timestamp;

        break;

      case actionTypes.API_FAILURE:
        if (!draft[commKey]) draft[commKey] = {};
        draft[commKey].status = COMM_STATES.ERROR;
        draft[commKey].message = message || 'unknown error';

        // if not defined it should be false
        draft[commKey].hidden = !!hidden;
        delete draft[commKey].retry;
        delete draft[commKey].timestamp;

        break;
      case actionTypes.CLEAR_COMMS:
        Object.keys(draft).forEach(i => {
          if (
            draft[i].status === COMM_STATES.ERROR ||
            draft[i].status === COMM_STATES.SUCCESS
          )
            delete draft[i];
        });

        break;
      case actionTypes.CLEAR_COMM_BY_KEY: {
        delete draft[key];
        break;
      }

      default:
    }
  });
};

// #region PUBLIC SELECTORS
export function commReqType(state, resourceName) {
  return (state && state[resourceName] && state[resourceName].method) || 'GET';
}

export function isLoading(state, resourceName) {
  return !!(
    state &&
    state[resourceName] &&
    state[resourceName].status === COMM_STATES.LOADING
  );
}

export function commStatus(state, resourceName) {
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
