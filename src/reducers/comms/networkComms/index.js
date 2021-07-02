import produce from 'immer';
import { createSelector } from 'reselect';
import actionTypes from '../../../actions/types';
import inferErrorMessages from '../../../utils/inferErrorMessages';
import commKeyGenerator from '../../../utils/commKeyGenerator';
import { changeEmailParams, changePasswordParams } from '../../../sagas/api/apiPaths';
import getRequestOptions from '../../../utils/requestOptions';

export const RETRY_COUNT = 3;

const initialState = {};
const emptyObj = {};
export const COMM_STATES = {
  LOADING: 'loading',
  ERROR: 'error',
  SUCCESS: 'success',
};

Object.freeze(COMM_STATES);

export default (state = initialState, action) => {
  const { type, path, message, hidden, refresh = false, method = 'GET', key } = action;
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
        draft[commKey].refresh = refresh;
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
        draft[commKey].message = inferErrorMessages(message)?.[0] || 'unknown error';
        draft[commKey].failedAtTimestamp = timestamp;

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
selectors.isRefreshing = (state, resourceName) => !!(
    state?.[resourceName]?.refresh === true
);

selectors.isValidatingNetsuiteUserRoles = state => {
  const commPath = commKeyGenerator('/netsuite/alluserroles', 'POST');

  return state && state[commPath] && state[commPath].status === COMM_STATES.LOADING;
};

selectors.reqsHasRetriedTillFailure = state => {
  if (!state) return false;

  return Object.keys(state).some(key => state[key].retry === RETRY_COUNT);
};
selectors.commStatus = (state, resourceName) => state && state[resourceName] && state[resourceName].status;

selectors.requestMessage = (state, resourceName) => (state && state[resourceName] && state[resourceName].message) || '';

selectors.timestampComms = (state, resourceName) => (state && state[resourceName] && state[resourceName].timestamp) || 0;

selectors.retryCount = (state, resourceName) => (state && state[resourceName] && state[resourceName].retry) || 0;

selectors.commsErrors = commsState => {
  if (!commsState) return;

  return Object.values(commsState).reduce((acc, curr) => {
    const {failedAtTimestamp, message, status, hidden} = curr;

    if (!hidden && status === COMM_STATES.ERROR) {
      acc[failedAtTimestamp] = message;
    }

    return acc;
  }, {});
};

selectors.commsSummary = commsState => {
  let isLoading = false;
  let isRetrying = false;
  let hasError = false;

  if (commsState) {
    Object.keys(commsState).forEach(key => {
      const c = commsState[key];

      if (!c.hidden) {
        if (c.status === COMM_STATES.ERROR) {
          hasError = true;
        } else if (c.retryCount > 0) {
          isRetrying = true;
        } else if (c.status === COMM_STATES.LOADING && Date.now() - c.timestamp > Number(process.env.NETWORK_THRESHOLD)) {
          isLoading = true;
        }
      }
    });
  }

  return { isLoading, isRetrying, hasError };
};

selectors.commStatusPerPath = (state, path, method) => {
  const key = commKeyGenerator(path, method);

  return state && state[key] && state[key].status;
};

selectors.commStatusByKey = (state, key) => {
  const commStatus = state && state[key];

  return commStatus;
};

selectors.mkActionsToMonitorCommStatus = () => createSelector(
  (state, actionsToMonitor) => {
    if (!actionsToMonitor || Object.keys(actionsToMonitor).length === 0) {
      return emptyObj;
    }

    const toMonitor = {};

    Object.keys(actionsToMonitor).forEach(actionName => {
      const action = actionsToMonitor[actionName];
      const { path, opts } = getRequestOptions(action.action, {
        resourceId: action.resourceId,
        integrationId: action.integrationId,
      });

      toMonitor[actionName] = selectors.commStatusByKey(
        state,
        commKeyGenerator(path, opts.method)
      );
    });

    return toMonitor;
  },
  result => result
);

// #region PASSWORD & EMAIL update selectors for modals
selectors.changePasswordSuccess = state => {
  const commKey = commKeyGenerator(
    changePasswordParams.path,
    changePasswordParams.opts.method
  );
  const status = selectors.commStatus(state, commKey);

  return status === COMM_STATES.SUCCESS;
};

selectors.changePasswordFailure = state => {
  const commKey = commKeyGenerator(
    changePasswordParams.path,
    changePasswordParams.opts.method
  );
  const status = selectors.commStatus(state, commKey);

  return status === COMM_STATES.ERROR;
};

selectors.changePasswordMsg = state => {
  const commKey = commKeyGenerator(
    changePasswordParams.path,
    changePasswordParams.opts.method
  );
  const message = selectors.requestMessage(state, commKey);

  return message || '';
};

selectors.changeEmailFailure = state => {
  const commKey = commKeyGenerator(
    changeEmailParams.path,
    changeEmailParams.opts.method
  );
  const status = selectors.commStatus(state, commKey);

  return status === COMM_STATES.ERROR;
};

selectors.changeEmailSuccess = state => {
  const commKey = commKeyGenerator(
    changeEmailParams.path,
    changeEmailParams.opts.method
  );
  const status = selectors.commStatus(state, commKey);

  return status === COMM_STATES.SUCCESS;
};

selectors.changeEmailMsg = state => {
  const commKey = commKeyGenerator(
    changeEmailParams.path,
    changeEmailParams.opts.method
  );
  const message = selectors.requestMessage(state, commKey);

  return message || '';
};
// #endregion PASSWORD & EMAIL update selectors for modals

// #endregion
