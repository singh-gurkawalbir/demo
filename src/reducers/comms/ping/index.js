import produce from 'immer';
import actionTypes from '../../../actions/types';

export const PING_STATES = {
  LOADING: 'loading',
  ERROR: 'error',
  SUCCESS: 'success',
  ABORTED: 'aborted',
};

Object.freeze(PING_STATES);

export default (state = {}, action) => {
  const { type, resourceId, message, retainStatus = false } = action;

  return produce(state, draft => {
    switch (type) {
      case actionTypes.CONNECTION.TEST: {
        draft[resourceId] = { status: PING_STATES.LOADING };
        break;
      }

      case actionTypes.CONNECTION.TEST_ERRORED: {
        draft[resourceId] = {
          status: PING_STATES.ERROR,
          message,
        };

        break;
      }

      case actionTypes.CONNECTION.TEST_SUCCESSFUL: {
        draft[resourceId] = {
          status: PING_STATES.SUCCESS,
        };

        break;
      }

      case actionTypes.CONNECTION.TEST_CANCELLED: {
        draft[resourceId] = {
          status: PING_STATES.ABORTED,
        };
        break;
      }

      case actionTypes.CONNECTION.TEST_CLEAR: {
        if (retainStatus && draft[resourceId]) {
          delete draft[resourceId].message;
        } else draft[resourceId] = {};

        break;
      }

      default:
    }
  });
};

export const testConnectionStatus = (state, resourceId) => {
  if (!state || !state[resourceId]) return null;
  const { status } = state[resourceId];

  return status;
};

export const testConnectionMessage = (state, resourceId) => {
  if (!state || !state[resourceId]) return null;
  const { message } = state[resourceId];

  return message;
};
