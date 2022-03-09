
import produce from 'immer';
import actionTypes from '../../../../actions/types';
import { REVISION_TYPES, REVISION_CREATION_STATUS } from '../../../../utils/constants';

export default (state = {}, action) => {
  const { integrationId, type, revisionInfo, newRevisionId } = action;

  if (!integrationId) return state;

  return produce(state, draft => {
    switch (type) {
      case actionTypes.INTEGRATION_LCM.REVISION.OPEN_PULL:
        if (!draft[integrationId]) {
          draft[integrationId] = {};
        }
        draft[integrationId][newRevisionId] = {
          type: REVISION_TYPES.PULL,
          revisionInfo,
        };
        break;
      case actionTypes.INTEGRATION_LCM.REVISION.CREATE:
        if (!draft[integrationId]) {
          draft[integrationId] = {};
        }
        draft[integrationId][newRevisionId].status = REVISION_CREATION_STATUS;
        break;

      default:
    }
  });
};

export const selectors = {};

selectors.tempRevisionInfo = (state, integrationId, revisionId) => {
  if (!state || !integrationId || !revisionId) {
    return;
  }

  return state[integrationId]?.[revisionId];
};

selectors.isRevisionCreationInProgress = (state, integrationId, revisionId) => {
  if (!state || !integrationId || !revisionId || !state[integrationId]?.[revisionId]) {
    return false;
  }

  return state[integrationId][revisionId].status === REVISION_CREATION_STATUS;
};
