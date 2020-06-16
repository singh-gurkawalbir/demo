import produce from 'immer';
import actionTypes from '../../../../actions/types';

export const PING_STATES = {
  LOADING: 'loading',
  ERROR: 'error',
  SUCCESS: 'success',
  ABORTED: 'aborted',
};

Object.freeze(PING_STATES);

export default (state = {}, action) => {
  const {
    type,
    resourceId,
    message,
    retainStatus = false,
    ssLinkedConnectionId,
  } = action;

  return produce(state, draft => {
    if (!draft[ssLinkedConnectionId]) {
      draft[ssLinkedConnectionId] = {};
    }

    switch (type) {
      case actionTypes.SUITESCRIPT.CONNECTION.TEST: {
        draft[ssLinkedConnectionId][resourceId] = {
          status: PING_STATES.LOADING,
        };
        break;
      }

      case actionTypes.SUITESCRIPT.CONNECTION.TEST_ERRORED: {
        draft[ssLinkedConnectionId][resourceId] = {
          status: PING_STATES.ERROR,
          message,
        };

        break;
      }

      case actionTypes.SUITESCRIPT.CONNECTION.TEST_SUCCESSFUL: {
        draft[ssLinkedConnectionId][resourceId] = {
          status: PING_STATES.SUCCESS,
        };

        break;
      }

      case actionTypes.SUITESCRIPT.CONNECTION.TEST_CANCELLED: {
        draft[ssLinkedConnectionId][resourceId] = {
          status: PING_STATES.ABORTED,
        };
        break;
      }

      case actionTypes.SUITESCRIPT.CONNECTION.TEST_CLEAR: {
        if (retainStatus) {
          delete draft[ssLinkedConnectionId][resourceId].message;
        } else draft[ssLinkedConnectionId][resourceId] = {};

        break;
      }

      default:
    }
  });
};

export const testConnectionStatus = (
  state,
  resourceId,
  ssLinkedConnectionId
) => {
  if (
    !state ||
    !state[ssLinkedConnectionId] ||
    !state[ssLinkedConnectionId][resourceId]
  ) {
    return null;
  }
  const { status } = state[ssLinkedConnectionId][resourceId];

  return status;
};

export const testConnectionMessage = (
  state,
  resourceId,
  ssLinkedConnectionId
) => {
  if (
    !state ||
    !state[ssLinkedConnectionId] ||
    !state[ssLinkedConnectionId][resourceId]
  ) {
    return null;
  }
  const { message } = state[ssLinkedConnectionId][resourceId];

  return message;
};
