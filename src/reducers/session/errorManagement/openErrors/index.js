import produce from 'immer';
import { isEqual } from 'lodash';
import { createSelector } from 'reselect';
import actionTypes from '../../../../actions/types';
import { getOpenErrorDetailsMap } from '../../../../utils/errorManagement';

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
        const errorDetailsMap = getOpenErrorDetailsMap(flowErrors, '_expOrImpId');

        draft[flowId].status = 'received';
        if (!draft[flowId].data || !isEqual(draft[flowId].data, errorDetailsMap)) {
          draft[flowId].data = errorDetailsMap;
        }
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

        draft[integrationId].status = 'received';
        const errorDetailsMap = getOpenErrorDetailsMap(integrationErrors, '_flowId');

        if (!draft[integrationId].data || !isEqual(draft[integrationId].data, errorDetailsMap)) {
          draft[integrationId].data = errorDetailsMap;
        }
        break;
      }

      default:
    }
  });
};

export const selectors = {};

selectors.openErrorsStatus = (state, resourceId) => state?.[resourceId]?.status;

selectors.totalOpenErrors = (state, resourceId) => {
  if (!state?.[resourceId]?.data) return 0;

  return Object.values(state[resourceId].data)
    .reduce((total, info) => total + (info.numError || 0), 0);
};

selectors.openErrorsDetails = (state, resourceId) => state?.[resourceId]?.data;

selectors.openErrorsMap = createSelector(
  selectors.openErrorsDetails,
  openErrorsDetails => {
    const resourceIds = Object.keys(openErrorsDetails || {});

    return resourceIds.reduce((infoMap, resourceId) => ({...infoMap, [resourceId]: openErrorsDetails[resourceId]?.numError }), {});
  }
);
