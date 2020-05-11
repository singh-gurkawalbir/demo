import produce from 'immer';
import actionTypes from '../../../../actions/types';

const defaultObject = {};

export default (state = {}, action) => {
  const {
    type,
    flowId,
    resourceId,
    errorDetails,
    loadMore,
    isResolved,
    checked,
    errorIds,
    retryCount,
    resolveCount,
  } = action;

  return produce(state, draft => {
    if (!flowId || !resourceId) return;
    const errorType = isResolved ? 'resolved' : 'open';

    switch (type) {
      case actionTypes.ERROR_MANAGER.FLOW_ERROR_DETAILS.REQUEST:
        if (!draft[flowId]) draft[flowId] = {};

        if (!draft[flowId][resourceId])
          draft[flowId][resourceId] = { open: {}, resolved: {}, actions: {} };
        draft[flowId][resourceId][errorType].status = 'requested';

        if (!loadMore) {
          delete draft[flowId][resourceId][errorType].outdated;
          delete draft[flowId][resourceId][errorType].nextPageURL;
        }

        break;
      case actionTypes.ERROR_MANAGER.FLOW_ERROR_DETAILS.RECEIVED: {
        const errors =
          (isResolved ? errorDetails.resolved : errorDetails.errors) || [];

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
        draft[flowId][resourceId][errorType].errors.forEach(error => {
          if (errorIds.includes(error.errorId)) {
            // eslint-disable-next-line no-param-reassign
            error.selected = checked;
          }
        });
        break;
      case actionTypes.ERROR_MANAGER.FLOW_ERROR_DETAILS.RESET_SELECTION:
        draft[flowId][resourceId][errorType].errors.forEach(error => {
          // eslint-disable-next-line no-param-reassign
          delete error.selected;
        });
        break;
      case actionTypes.ERROR_MANAGER.FLOW_ERROR_DETAILS.REMOVE: {
        const { errors = [] } = draft[flowId][resourceId][errorType];

        draft[flowId][resourceId][errorType].errors = errors.filter(
          error => !errorIds.includes(error.errorId)
        );
        break;
      }

      case actionTypes.ERROR_MANAGER.FLOW_ERROR_DETAILS.ACTIONS.RETRY.REQUEST:
        if (!draft[flowId][resourceId].actions) {
          draft[flowId][resourceId].actions = {};
        }

        if (!draft[flowId][resourceId].actions.retry) {
          draft[flowId][resourceId].actions.retry = {
            status: 'requested',
          };
        }

        draft[flowId][resourceId].actions.retry.status = 'requested';
        draft[flowId][resourceId][errorType].actionInProgress = true;

        break;

      case actionTypes.ERROR_MANAGER.FLOW_ERROR_DETAILS.ACTIONS.RESOLVE.REQUEST:
        if (!draft[flowId][resourceId].actions) {
          draft[flowId][resourceId].actions = {};
        }

        if (!draft[flowId][resourceId].actions.resolve) {
          draft[flowId][resourceId].actions.resolve = {
            status: 'requested',
          };
        }

        draft[flowId][resourceId].actions.resolve.status = 'requested';
        draft[flowId][resourceId][errorType].actionInProgress = true;
        break;

      case actionTypes.ERROR_MANAGER.FLOW_ERROR_DETAILS.ACTIONS.RESOLVE
        .RECEIVED: {
        draft[flowId][resourceId].actions.resolve.status = 'received';
        const count = draft[flowId][resourceId].actions.resolve.count || 0;

        draft[flowId][resourceId].actions.resolve.count = count + resolveCount;
        draft[flowId][resourceId][errorType].actionInProgress = false;
        break;
      }

      case actionTypes.ERROR_MANAGER.FLOW_ERROR_DETAILS.ACTIONS.RETRY
        .RECEIVED: {
        draft[flowId][resourceId].actions.retry.status = 'received';
        const count = draft[flowId][resourceId].actions.retry.count || 0;

        draft[flowId][resourceId].actions.retry.count = count + retryCount;
        draft[flowId][resourceId][errorType].actionInProgress = false;
        break;
      }

      case actionTypes.ERROR_MANAGER.FLOW_ERROR_DETAILS.OUTDATED:
        draft[flowId][resourceId].open.outdated = true;
        draft[flowId][resourceId].resolved.outdated = true;
        break;

      case actionTypes.ERROR_MANAGER.FLOW_ERROR_DETAILS.CLEAR:
        draft[flowId][resourceId][errorType] = {};
        break;
      default:
    }
  });
};

export function getErrors(state, { flowId, resourceId, errorType }) {
  return (
    (state &&
      state[flowId] &&
      state[flowId][resourceId] &&
      state[flowId][resourceId][errorType]) ||
    defaultObject
  );
}

export function errorActionsContext(
  state,
  { flowId, resourceId, actionType = 'retry' }
) {
  return (
    (state &&
      state[flowId] &&
      state[flowId][resourceId] &&
      state[flowId][resourceId].actions &&
      state[flowId][resourceId].actions[actionType]) ||
    defaultObject
  );
}
