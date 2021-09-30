import produce from 'immer';
import { isEqual } from 'lodash';
import actionTypes from '../../../../../actions/types';

const defaultObject = {};

export default (state = {}, action) => {
  const {
    type,
    integrationId,
    latestJobs,
  } = action;

  return produce(state, draft => {
    switch (type) {
      case actionTypes.ERROR_MANAGER.INTEGRATION_LATEST_JOBS.REQUEST: {
        if (!draft[integrationId]) {
          draft[integrationId] = {};
        }
        draft[integrationId].status = 'requested';
        break;
      }
      case actionTypes.ERROR_MANAGER.INTEGRATION_LATEST_JOBS.ERROR: {
        if (!draft[integrationId]) {
          draft[integrationId] = {};
        }
        draft[integrationId].status = 'failed';
        break;
      }
      case actionTypes.ERROR_MANAGER.INTEGRATION_LATEST_JOBS.RECEIVED: {
        if (!draft[integrationId]) {
          draft[integrationId] = {};
        }
        draft[integrationId].status = 'received';
        if (!isEqual(draft[integrationId].data, latestJobs)) {
          draft[integrationId].data = latestJobs;
        }
        break;
      }

      default:
    }
  });
};

export const selectors = {};

selectors.latestJobMap = (state, integrationId) => {
  if (!state || !integrationId || !state[integrationId]) return defaultObject;

  return state[integrationId];
};
