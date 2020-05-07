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
