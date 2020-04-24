import produce from 'immer';
import actionTypes from '../../../../actions/types';

export default (
  state = {
    errorDetails: {},
  },
  action
) => {
  const { type } = action;

  return produce(state, draft => {
    switch (type) {
      case actionTypes.ERROR_MANAGER.FLOW_ERROR_DETAILS.REQUEST: {
        draft.test = 5;
        break;
      }

      default:
    }
  });
};
