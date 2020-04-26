import produce from 'immer';
import actionTypes from '../../../../actions/types';

const defaultObject = {};

export default (state = {}, action) => {
  const { type, flowId, openErrors } = action;

  return produce(state, draft => {
    switch (type) {
      case actionTypes.ERROR_MANAGER.FLOW_OPEN_ERRORS.REQUEST:
        draft[flowId] = {
          status: 'requested',
        };
        break;
      case actionTypes.ERROR_MANAGER.FLOW_OPEN_ERRORS.RECEIVED: {
        const flowErrors = (openErrors && openErrors.flowErrors) || [];

        draft[flowId].status = 'received';
        const errorMap = {};

        flowErrors.forEach(
          ({ _expOrImpId, numError }) => (errorMap[_expOrImpId] = numError)
        );
        draft[flowId].data = errorMap;

        break;
      }

      default:
    }
  });
};

export const flowErrorMap = (state, flowId) => {
  if (!state || !flowId || !state[flowId]) return defaultObject;

  return state[flowId];
};
