import produce from 'immer';
import actionTypes from '../../../../actions/types';

const defaultObject = {};

export default (state = {}, action) => {
  const {
    type,
    flowId,
    openErrors,
    integrationErrors = [],
    integrationId,
  } = action;

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
        let totalCount = 0;

        flowErrors.forEach(({ _expOrImpId, numError }) => {
          errorMap[_expOrImpId] = numError;
          totalCount += numError;
        });
        draft[flowId].data = errorMap;
        draft[flowId].total = totalCount;
        break;
      }

      case actionTypes.ERROR_MANAGER.INTEGRATION_ERRORS.REQUEST:
        draft[integrationId] = {
          status: 'requested',
        };
        break;
      case actionTypes.ERROR_MANAGER.INTEGRATION_ERRORS.RECEIVED: {
        draft[integrationId].status = 'received';
        const errorMap = {};
        let totalCount = 0;

        integrationErrors.forEach(({ _flowId, numError }) => {
          errorMap[_flowId] = numError;
          totalCount += numError;
        });
        draft[integrationId].data = errorMap;
        draft[integrationId].total = totalCount;
        break;
      }

      default:
    }
  });
};

export const errorMap = (state, resourceId) => {
  if (!state || !resourceId || !state[resourceId]) return defaultObject;

  return state[resourceId];
};
