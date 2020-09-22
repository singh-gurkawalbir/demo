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
    diff,
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
          draft[flowId][resourceId].actions = {};
        }

        draft[flowId][resourceId][errorType].status = 'requested';
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
        draft[flowId][resourceId][errorType].outdated = true;
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
        break;

      case actionTypes.ERROR_MANAGER.FLOW_ERROR_DETAILS.ACTIONS.RESOLVE
        .RECEIVED: {
        draft[flowId][resourceId].actions.resolve.status = 'received';
        const count = draft[flowId][resourceId].actions.resolve.count || 0;

        draft[flowId][resourceId].actions.resolve.count = count + resolveCount;
        break;
      }

      case actionTypes.ERROR_MANAGER.FLOW_ERROR_DETAILS.ACTIONS.RETRY
        .RECEIVED: {
        draft[flowId][resourceId].actions.retry.status = 'received';
        const count = draft[flowId][resourceId].actions.retry.count || 0;

        draft[flowId][resourceId].actions.retry.count = count + retryCount;
        break;
      }

      case actionTypes.ERROR_MANAGER.FLOW_ERROR_DETAILS.NOTIFY_UPDATE: {
        if (!draft[flowId] || !draft[flowId][resourceId]) {
          break;
        }
        draft[flowId][resourceId].resolved.updated = true;
        // If whatever count diff occured is because of errors resolved by this user
        // in this case, don't notify open errors
        const userActions = draft[flowId][resourceId].actions;
        const errorsUpdatedByUser = (userActions.retry?.count || 0) + (userActions.resolve?.count || 0);

        if (errorsUpdatedByUser !== Math.abs(diff)) {
          draft[flowId][resourceId].open.updated = true;
        }
        break;
      }
      case actionTypes.ERROR_MANAGER.FLOW_ERROR_DETAILS.CLEAR:
        draft[flowId][resourceId][errorType] = {};
        draft[flowId][resourceId].actions = {};
        break;
      default:
    }
  });
};

export const selectors = {};

selectors.getErrors = (state, { flowId, resourceId, errorType }) => (
  (state &&
      state[flowId] &&
      state[flowId][resourceId] &&
      state[flowId][resourceId][errorType]) ||
    defaultObject
);

selectors.errorActionsContext = (
  state,
  { flowId, resourceId, actionType = 'retry' }
) => (
  (state &&
      state[flowId] &&
      state[flowId][resourceId] &&
      state[flowId][resourceId].actions &&
      state[flowId][resourceId].actions[actionType]) ||
    defaultObject
);

selectors.isAllErrorsSelected = (state, { flowId, resourceId, isResolved, errorIds }) => {
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
