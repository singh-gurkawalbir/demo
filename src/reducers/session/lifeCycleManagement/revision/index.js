
import produce from 'immer';
import actionTypes from '../../../../actions/types';
import { REVISION_TYPES, REVISION_CREATION_STATUS } from '../../../../utils/constants';

export default (state = {}, action) => {
  const { integrationId, type, revisionInfo, newRevisionId, revisionId, errors } = action;

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
      case actionTypes.INTEGRATION_LCM.REVISION.OPEN_REVERT:
        if (!draft[integrationId]) {
          draft[integrationId] = {};
        }
        draft[integrationId][newRevisionId] = {
          type: REVISION_TYPES.REVERT,
          revisionInfo,
        };
        break;
      case actionTypes.INTEGRATION_LCM.REVISION.CREATE_SNAPSHOT:
        if (!draft[integrationId]) {
          draft[integrationId] = {};
        }
        draft[integrationId][newRevisionId] = {
          type: REVISION_TYPES.SNAPSHOT,
          revisionInfo,
          status: REVISION_CREATION_STATUS.CREATION_IN_PROGRESS,
        };
        break;
      case actionTypes.INTEGRATION_LCM.REVISION.CREATE:
        if (!draft[integrationId]) {
          draft[integrationId] = {};
        }
        if (!draft[integrationId][newRevisionId]) {
          draft[integrationId][newRevisionId] = {};
        }
        draft[integrationId][newRevisionId].status = REVISION_CREATION_STATUS.CREATION_IN_PROGRESS;
        break;
      case actionTypes.INTEGRATION_LCM.REVISION.CREATED:
        if (!draft[integrationId]) {
          draft[integrationId] = {};
        }
        if (!draft[integrationId][newRevisionId]) {
          draft[integrationId][newRevisionId] = {};
        }
        draft[integrationId][newRevisionId].status = REVISION_CREATION_STATUS.CREATED;
        break;
      case actionTypes.INTEGRATION_LCM.REVISION.FETCH_ERRORS:
        if (!draft[integrationId]) {
          draft[integrationId] = {};
        }
        if (!draft[integrationId][revisionId]) {
          draft[integrationId][revisionId] = {};
        }
        draft[integrationId][revisionId].errors = {
          status: 'requested',
        };
        break;
      case actionTypes.INTEGRATION_LCM.REVISION.RECEIVED_ERRORS:
        if (!draft[integrationId]) {
          draft[integrationId] = {};
        }
        if (!draft[integrationId][revisionId]) {
          draft[integrationId][revisionId] = {};
        }
        if (!draft[integrationId][revisionId].errors) {
          draft[integrationId][revisionId].errors = {};
        }
        draft[integrationId][revisionId].errors.status = 'received';
        draft[integrationId][revisionId].errors.data = errors || [];
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

  return state[integrationId][revisionId].status === REVISION_CREATION_STATUS.CREATION_IN_PROGRESS;
};

selectors.isRevisionErrorsFetchInProgress = (state, integrationId, revisionId) => {
  if (!state || !integrationId || !revisionId || !state[integrationId]?.[revisionId]?.errors) {
    return false;
  }

  return state[integrationId][revisionId].errors.status === 'requested';
};
selectors.isRevisionErrorsRequested = (state, integrationId, revisionId) => {
  if (!state || !integrationId || !revisionId || !state[integrationId]?.[revisionId]?.errors) {
    return false;
  }

  return !!state[integrationId][revisionId].errors.status;
};

selectors.revisionErrors = (state, integrationId, revisionId) => state?.[integrationId]?.[revisionId]?.errors?.data;
selectors.revisionError = (state, integrationId, revisionId, errorId) => {
  if (!state || !integrationId || !revisionId || !errorId) {
    return;
  }
  const errors = state?.[integrationId]?.[revisionId]?.errors?.data || [];

  return errors.find(error => error._id === errorId);
};

