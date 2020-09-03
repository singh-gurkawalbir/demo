import produce from 'immer';
import actionTypes from '../../../../actions/types';

const defaultArray = [];

export default (state = {}, action) => {
  const {
    type,
    integrationId,
    latestJobs,
  } = action;

  return produce(state, draft => {
    switch (type) {
      case actionTypes.ERROR_MANAGER.INTEGRATION_LATEST_JOBS.RECEIVED: {
        if (!draft[integrationId]) {
          draft[integrationId] = {};
        }
        draft[integrationId].data = latestJobs;
        break;
      }

      default:
    }
  });
};

export const selectors = {};

selectors.latestJobMap = (state, integrationId) => {
  if (!state || !integrationId || !state[integrationId]) return defaultArray;

  return state[integrationId];
};
