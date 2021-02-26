import produce from 'immer';
import { union } from 'lodash';
import actionTypes from '../../../../actions/types';

const defaultObject = {};

export default (state = {}, action) => {
  const {
    type,
    flowId,
    resourceId,
    errorDetails = {},
    loadMore,
    isResolved,
    checked,
    errorIds = [],
    retryCount,
    resolveCount,
    diff: errorCountDiff,
    traceKeys = [],
  } = action;

  return produce(state, draft => {
    if (!flowId || !resourceId) return;
    const errorType = isResolved ? 'resolved' : 'open';

    switch (type) {
      case actionTypes.ERROR_MANAGER.FLOW_ERROR_DETAILS.REQUEST:
        if (!draft[flowId]) {
          draft[flowId] = {};
        }
        if (!draft[flowId][resourceId]) {
          draft[flowId][resourceId] = { open: {}, resolved: {}, actions: {} };
        }
        // TODO @Raghu: remove this outdated prop - used to load next set of errors automatically
        // when user selects all and retries. Not a good way to handle. Refer - @components/OpenErrors
        delete draft[flowId][resourceId][errorType].outdated;
        if (!loadMore) {
          delete draft[flowId][resourceId][errorType].nextPageURL;
          delete draft[flowId][resourceId][errorType].updated;
        }

        draft[flowId][resourceId][errorType].status = 'requested';
        break;
      case actionTypes.ERROR_MANAGER.FLOW_ERROR_DETAILS.RECEIVED: {
        const errors =
          (isResolved ? errorDetails.resolved : errorDetails.errors) || [];

        if (!draft[flowId] || !draft[flowId][resourceId]) {
          break;
        }
        draft[flowId][resourceId][errorType] = {
          ...draft[flowId][resourceId][errorType],
          status: 'received',
          errors: loadMore
            ? [...draft[flowId][resourceId][errorType].errors, ...errors]
            : errors,
          nextPageURL: errorDetails.nextPageURL,
        };
        break;
      }

      case actionTypes.ERROR_MANAGER.FLOW_ERROR_DETAILS.SELECT_ERRORS:
        if (!draft[flowId] || !draft[flowId][resourceId]) {
          break;
        }
        draft[flowId][resourceId][errorType].errors.forEach(error => {
          if (errorIds.includes(error.errorId)) {
            // eslint-disable-next-line no-param-reassign
            error.selected = checked;
          }
        });
        break;
      case actionTypes.ERROR_MANAGER.FLOW_ERROR_DETAILS.REMOVE: {
        if (!draft[flowId] || !draft[flowId][resourceId]) {
          break;
        }
        const { errors: prevErrors = [] } = draft[flowId][resourceId][errorType];

        if (!errorIds.length || !prevErrors.length) {
          break;
        }

        draft[flowId][resourceId][errorType].errors = prevErrors.filter(
          error => !errorIds.includes(error.errorId)
        );
        const updatedErrors = draft[flowId][resourceId][errorType].errors;

        if (prevErrors.length !== updatedErrors.length) {
          draft[flowId][resourceId][errorType].outdated = true;
        }
        break;
      }

      case actionTypes.ERROR_MANAGER.FLOW_ERROR_DETAILS.ACTIONS.RETRY.REQUEST:
        if (!draft[flowId] || !draft[flowId][resourceId]) {
          break;
        }
        if (!draft[flowId][resourceId].actions) {
          draft[flowId][resourceId].actions = {};
        }

        if (!draft[flowId][resourceId].actions.retry) {
          draft[flowId][resourceId].actions.retry = {
            status: 'requested',
          };
        }

        draft[flowId][resourceId].actions.retry.status = 'requested';
        break;

      case actionTypes.ERROR_MANAGER.FLOW_ERROR_DETAILS.ACTIONS.RESOLVE.REQUEST:
        if (!draft[flowId] || !draft[flowId][resourceId]) {
          break;
        }
        if (!draft[flowId][resourceId].actions) {
          draft[flowId][resourceId].actions = {};
        }

        if (!draft[flowId][resourceId].actions.resolve) {
          draft[flowId][resourceId].actions.resolve = {
            status: 'requested',
          };
        }

        draft[flowId][resourceId].actions.resolve.status = 'requested';
        break;

      case actionTypes.ERROR_MANAGER.FLOW_ERROR_DETAILS.ACTIONS.RESOLVE.RECEIVED: {
        if (!draft[flowId] || !draft[flowId][resourceId]) {
          break;
        }
        draft[flowId][resourceId].actions.resolve.status = 'received';
        const count = draft[flowId][resourceId].actions.resolve.count || 0;

        if (typeof resolveCount === 'number') {
          draft[flowId][resourceId].actions.resolve.count = count + resolveCount;
        }
        break;
      }

      case actionTypes.ERROR_MANAGER.FLOW_ERROR_DETAILS.ACTIONS.RETRY.RECEIVED: {
        if (!draft[flowId] || !draft[flowId][resourceId]) {
          break;
        }
        draft[flowId][resourceId].actions.retry.status = 'received';
        const count = draft[flowId][resourceId].actions.retry.count || 0;

        if (typeof retryCount === 'number') {
          draft[flowId][resourceId].actions.retry.count = count + retryCount;
        }
        break;
      }

      case actionTypes.ERROR_MANAGER.FLOW_ERROR_DETAILS.ACTIONS.RETRY.TRACK_RETRIED_TRACE_KEYS: {
        if (!draft?.[flowId]?.[resourceId]?.actions?.retry || !traceKeys.length) {
          break;
        }
        const prevTraceKeys = draft[flowId][resourceId].actions.retry.traceKeys || [];
        const updatedTraceKeys = union(prevTraceKeys, traceKeys);

        draft[flowId][resourceId].actions.retry.traceKeys = updatedTraceKeys;
        break;
      }

      case actionTypes.ERROR_MANAGER.FLOW_ERROR_DETAILS.NOTIFY_UPDATE: {
        if (!draft[flowId] || !draft[flowId][resourceId]) {
          break;
        }
        // If the errors are reduced, it implies resolved errors increase
        if (errorCountDiff < 0 && draft[flowId][resourceId].resolved?.status === 'received') {
          draft[flowId][resourceId].resolved.updated = true;
        }
        // If the errors are increased, it implies open errors increase
        if (errorCountDiff > 0 && draft[flowId][resourceId].open?.status === 'received') {
          draft[flowId][resourceId].open.updated = true;
        }
        break;
      }

      case actionTypes.ERROR_MANAGER.FLOW_ERROR_DETAILS.CLEAR:
        if (!draft[flowId] || !draft[flowId][resourceId]) {
          break;
        }
        draft[flowId][resourceId].open = {};
        draft[flowId][resourceId].resolved = {};
        break;
      default:
    }
  });
};

export const selectors = {};

selectors.getErrors = (state, { flowId, resourceId, errorType }) =>
  state?.[flowId]?.[resourceId]?.[errorType] || defaultObject;

selectors.hasResourceErrors = (state, options) => {
  const errorsObj = selectors.getErrors(state, options);

  return !!errorsObj.errors?.length;
};

selectors.errorActionsContext = (
  state,
  { flowId, resourceId, actionType = 'retry' }
) => state?.[flowId]?.[resourceId]?.actions?.[actionType] || defaultObject;

selectors.isAnyActionInProgress = (state, { flowId, resourceId, actionType }) => {
  if (!state?.[flowId]?.[resourceId]?.actions) return false;

  const actionObj = state[flowId][resourceId].actions;

  if (actionType) {
    return actionObj[actionType]?.status === 'requested';
  }

  return actionObj.retry?.status === 'requested' || actionObj.resolve?.status === 'requested';
};

selectors.isAllErrorsSelected = (state, { flowId, resourceId, isResolved, errorIds = [] }) => {
  const { errors = [] } = selectors.getErrors(state, {
    flowId,
    resourceId,
    errorType: isResolved ? 'resolved' : 'open',
  });

  if (!errorIds.length) return false;

  return !errors.some(
    error => errorIds.includes(error.errorId) && !error.selected
  );
};

selectors.isTraceKeyRetried = (state, { flowId, resourceId, traceKey }) => {
  if (!traceKey || !state?.[flowId]?.[resourceId]?.actions?.retry?.traceKeys) {
    return false;
  }

  return state[flowId][resourceId].actions.retry.traceKeys.includes(traceKey);
};
