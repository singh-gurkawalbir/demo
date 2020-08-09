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
  let errorMsg;
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
        try {
          const errorsJSON = JSON.parse(message);

          errorMsg = (errorsJSON && errorsJSON[0].message) || message;
        } catch (e) {
          errorMsg = message;
        }
        if (!draft[commKey]) draft[commKey] = {};
        draft[commKey].status = COMM_STATES.ERROR;
        draft[commKey].message = errorMsg || 'unknown error';

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
          ) delete draft[i];
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

export const selectors = {};

selectors.networkCommState = state => state;

// #region PUBLIC SELECTORS
selectors.commReqType = (state, resourceName) => (state && state[resourceName] && state[resourceName].method) || 'GET';

selectors.isLoading = (state, resourceName) => !!(
  state &&
    state[resourceName] &&
    state[resourceName].status === COMM_STATES.LOADING
);

selectors.commStatus = (state, resourceName) => state && state[resourceName] && state[resourceName].status;

selectors.requestMessage = (state, resourceName) => (state && state[resourceName] && state[resourceName].message) || '';

selectors.timestampComms = (state, resourceName) => (state && state[resourceName] && state[resourceName].timestamp) || 0;

selectors.retryCount = (state, resourceName) => (state && state[resourceName] && state[resourceName].retry) || 0;
// #endregion
