import produce from 'immer';
import { isEmpty } from 'lodash';
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
          message,
        };
        break;
      }

      case actionTypes.SUITESCRIPT.CONNECTION.TEST_CLEAR: {
        if (retainStatus && draft[ssLinkedConnectionId][resourceId]) {
          delete draft[ssLinkedConnectionId][resourceId].message;
        } else {
          delete draft[ssLinkedConnectionId][resourceId];
          if (isEmpty(draft[ssLinkedConnectionId])) {
            delete draft[ssLinkedConnectionId];
          }
        }

        break;
      }

      default:
    }
  });
};

export const selectors = {};

selectors.suiteScriptTestConnectionStatus = (
  state,
  resourceId,
  ssLinkedConnectionId
) => state?.[ssLinkedConnectionId]?.[resourceId]?.status || null;

selectors.suiteScriptTestConnectionMessage = (
  state,
  resourceId,
  ssLinkedConnectionId
) => state?.[ssLinkedConnectionId]?.[resourceId]?.message || null;

