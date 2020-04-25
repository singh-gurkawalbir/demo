import produce from 'immer';
import actionTypes from '../../../../actions/types';

export default (state = {}, action) => {
  const {
    type,
    flowId,
    resourceId,
    openErrors,
    resolvedErrors,
    loadMore,
  } = action;

  return produce(state, draft => {
    if (!flowId || !resourceId) return;

    switch (type) {
      case actionTypes.ERROR_MANAGER.FLOW_ERROR_DETAILS.OPEN.REQUEST:
        if (!draft[flowId]) draft[flowId] = {};

        if (!draft[flowId][resourceId])
          draft[flowId][resourceId] = { open: {}, resolved: {} };
        draft[flowId][resourceId].open.status = 'requested';
        break;
      case actionTypes.ERROR_MANAGER.FLOW_ERROR_DETAILS.OPEN.RECEIVED:
        draft[flowId][resourceId].open = {
          ...draft[flowId][resourceId].open,
          status: 'received',
          errors: loadMore
            ? [...draft[flowId][resourceId].open.errors, ...openErrors.errors]
            : openErrors.errors,
          nextPageURL: openErrors.nextPageURL,
        };
        break;

      case actionTypes.ERROR_MANAGER.FLOW_ERROR_DETAILS.RESOLVED.REQUEST:
        if (!draft[flowId]) draft[flowId] = {};

        if (!draft[flowId][resourceId])
          draft[flowId][resourceId] = { open: {}, resolved: {} };
        draft[flowId][resourceId].resolved.status = 'requested';
        break;
      case actionTypes.ERROR_MANAGER.FLOW_ERROR_DETAILS.RESOLVED.RECEIVED:
        draft[flowId][resourceId].resolved = {
          status: 'received',
          data: resolvedErrors,
        };
        break;

      default:
    }
  });
};
