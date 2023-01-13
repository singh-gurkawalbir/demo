import { produce } from 'immer';
import actionTypes from '../../../../actions/types';
import { emptyObject, MOCK_INPUT_STATUS } from '../../../../constants';

const DEFAULT_VALUE = undefined;

export default function (state = {}, action) {
  const {
    type,
    resourceId,
    data,
    error,
  } = action;

  return produce(state, draft => {
    if (!resourceId) return;

    if (!draft[resourceId]) {
      draft[resourceId] = {};
    }
    switch (type) {
      case actionTypes.MOCK_INPUT.REQUEST:
        draft[resourceId].status = MOCK_INPUT_STATUS.REQUESTED;
        delete draft[resourceId].data;
        delete draft[resourceId].error;
        break;
      case actionTypes.MOCK_INPUT.RECEIVED:
        draft[resourceId].status = MOCK_INPUT_STATUS.RECEIVED;
        draft[resourceId].data = data;
        delete draft[resourceId].error;
        break;
      case actionTypes.MOCK_INPUT.RECEIVED_ERROR:
        draft[resourceId].status = MOCK_INPUT_STATUS.ERROR;
        draft[resourceId].error = error;
        delete draft[resourceId].data;
        break;
      case actionTypes.MOCK_INPUT.UPDATE_USER_MOCK_INPUT:
        draft[resourceId].userData = data;
        break;
      case actionTypes.MOCK_INPUT.CLEAR:
        // we cannot delete userData when clearing mock input
        delete draft[resourceId].data;
        delete draft[resourceId].error;
        delete draft[resourceId].status;
        break;
      default:
    }
  });
}

export const selectors = {};

selectors.mockInput = (state, resourceId) => {
  if (!state || !resourceId || !state[resourceId]) return emptyObject;

  return state[resourceId];
};

selectors.userMockInput = (state, resourceId) => {
  if (!state || !resourceId || !state[resourceId]) return DEFAULT_VALUE;

  return state[resourceId].userData;
};
