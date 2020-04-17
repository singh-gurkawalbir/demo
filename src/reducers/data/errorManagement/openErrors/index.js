import produce from 'immer';
import actionTypes from '../../../../actions/types';

export default (state = {}, action) => {
  const { type, flowId, openErrors } = action;

  return produce(state, draft => {
    switch (type) {
      case actionTypes.ERROR_MANAGER.FLOW_OPEN_ERRORS.REQUEST:
        draft.flowId = {};
        break;
      case actionTypes.ERROR_MANAGER.FLOW_OPEN_ERRORS.RECEIVED:
        draft[flowId] = (openErrors && openErrors.flowErrors) || [];
        break;

      default:
    }
  });
};
