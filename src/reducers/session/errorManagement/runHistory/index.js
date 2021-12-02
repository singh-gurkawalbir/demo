import produce from 'immer';
import actionTypes from '../../../../actions/types';

const defaultObject = {};

export default (state = {}, action) => {
  const { type, flowId, runHistory, job } = action;

  return produce(state, draft => {
    switch (type) {
      case actionTypes.ERROR_MANAGER.RUN_HISTORY.REQUEST:
        if (!draft[flowId]) {
          draft[flowId] = {};
        }
        draft[flowId].status = 'requested';
        break;
      case actionTypes.ERROR_MANAGER.RUN_HISTORY.RECEIVED:
        if (!draft[flowId]) {
          break;
        }
        draft[flowId].status = 'received';
        draft[flowId].data = runHistory || [];
        break;
      case actionTypes.ERROR_MANAGER.RUN_HISTORY.RECEIVED_FAMILY:
        {
          const index = draft[job?._flowId]?.data?.findIndex(j => j._id === job._id);

          if (index > -1) {
            draft[job._flowId].data[index] = {...job};
          }
        }
        break;
      case actionTypes.ERROR_MANAGER.RUN_HISTORY.CLEAR:
        delete draft[flowId];

        break;
      default:
    }
  });
};

export const selectors = {};

selectors.runHistoryContext = (state, flowId) => {
  if (!state || !flowId || !state[flowId]) {
    return defaultObject;
  }

  return state[flowId];
};

