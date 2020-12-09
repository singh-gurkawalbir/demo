import produce from 'immer';
import actionTypes from '../../../../actions/types';
import { getErrorMapWithTotal } from '../../../../utils/errorManagement';

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
        if (!flowId) {
          break;
        }
        if (!draft[flowId]) {
          draft[flowId] = {};
        }
        draft[flowId].status = 'requested';
        break;
      case actionTypes.ERROR_MANAGER.FLOW_OPEN_ERRORS.RECEIVED: {
        if (!flowId || !draft[flowId]) {
          break;
        }
        const flowErrors = (openErrors && openErrors.flowErrors) || [];
        const { data, total} = getErrorMapWithTotal(flowErrors, '_expOrImpId');

        draft[flowId].status = 'received';
        draft[flowId].data = data;
        draft[flowId].total = total;
        break;
      }

      case actionTypes.ERROR_MANAGER.INTEGRATION_ERRORS.REQUEST:
        if (!integrationId) {
          break;
        }
        if (!draft[integrationId]) {
          draft[integrationId] = {};
        }
        draft[integrationId].status = 'requested';
        break;
      case actionTypes.ERROR_MANAGER.INTEGRATION_ERRORS.RECEIVED: {
        if (!integrationId || !draft[integrationId]) {
          break;
        }
        const { data, total} = getErrorMapWithTotal(integrationErrors, '_flowId');

        draft[integrationId].status = 'received';
        draft[integrationId].data = data;
        draft[integrationId].total = total;
        break;
      }

      default:
    }
  });
};

export const selectors = {};

selectors.errorMap = (state, resourceId) => {
  if (!state || !resourceId || !state[resourceId]) return defaultObject;

  return state[resourceId];
};
