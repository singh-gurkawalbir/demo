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
  } = action;

  return produce(state, draft => {
    if (!flowId || !resourceId) return;
    const errorType = isResolved ? 'resolved' : 'open';

    switch (type) {
      case actionTypes.ERROR_MANAGER.FLOW_ERROR_DETAILS.REQUEST:
        if (!draft[flowId]) draft[flowId] = {};

        if (!draft[flowId][resourceId])
          draft[flowId][resourceId] = { open: {}, resolved: {} };
        draft[flowId][resourceId][errorType].status = 'requested';

        if (!loadMore) delete draft[flowId][resourceId][errorType].outdated;
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
        if (!draft[flowId][resourceId][errorType].actions) {
          draft[flowId][resourceId][errorType].actions = {};
        }

        if (!draft[flowId][resourceId][errorType].actions.retry) {
          draft[flowId][resourceId][errorType].actions.retry = {
            status: 'requested',
          };
        }

        draft[flowId][resourceId][errorType].actions.retry.status = 'requested';

        break;

      case actionTypes.ERROR_MANAGER.FLOW_ERROR_DETAILS.ACTIONS.RESOLVE.REQUEST:
        if (!draft[flowId][resourceId][errorType].actions) {
          draft[flowId][resourceId][errorType].actions = {};
        }

        if (!draft[flowId][resourceId][errorType].actions.resolve) {
          draft[flowId][resourceId][errorType].actions.resolve = {
            status: 'requested',
          };
        }

        draft[flowId][resourceId][errorType].actions.resolve.status =
          'requested';

        break;

      case actionTypes.ERROR_MANAGER.FLOW_ERROR_DETAILS.ACTIONS.RESOLVE
        .RECEIVED:
        draft[flowId][resourceId][errorType].actions.resolve.status =
          'received';
        break;
      case actionTypes.ERROR_MANAGER.FLOW_ERROR_DETAILS.ACTIONS.RETRY
        .RECEIVED: {
        draft[flowId][resourceId][errorType].actions.retry.status = 'received';
        const count =
          draft[flowId][resourceId][errorType].actions.retry.count || 0;

        draft[flowId][resourceId][errorType].actions.retry.count =
          count + retryCount;
        break;
      }

      case actionTypes.ERROR_MANAGER.FLOW_ERROR_DETAILS.OUTDATED:
        draft[flowId][resourceId].open.outdated = true;
        draft[flowId][resourceId].resolved.outdated = true;
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
  { flowId, resourceId, actionType = 'retry', errorType = 'open' }
) {
  return (
    (state &&
      state[flowId] &&
      state[flowId][resourceId] &&
      state[flowId][resourceId][errorType] &&
      state[flowId][resourceId][errorType].actions &&
      state[flowId][resourceId][errorType].actions[actionType]) ||
    defaultObject
  );
}
