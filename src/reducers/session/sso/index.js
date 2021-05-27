import produce from 'immer';
import actionTypes from '../../../actions/types';

export default (state = {}, action) => {
  const { type, error } = action;

  return produce(state, draft => {
    switch (type) {
      case actionTypes.SSO.ORG_ID.VALIDATION_REQUEST:
        draft.status = 'requested';
        delete draft.error;
        break;
      case actionTypes.SSO.ORG_ID.VALIDATION_SUCCESS:
        draft.status = 'success';
        delete draft.error;
        break;
      case actionTypes.SSO.ORG_ID.VALIDATION_ERROR:
        draft.status = 'error';
        draft.error = error;
        break;
      case actionTypes.SSO.ORG_ID.VALIDATION_CLEAR:
        delete draft.status;
        delete draft.error;
        break;

      default:
        return state;
    }
  });
};

export const selectors = {};

selectors.orgIdValidationError = state => {
  if (!state || state.status !== 'error') {
    return;
  }

  return state.error;
};
selectors.orgIdValidationInProgress = state => state?.status === 'requested';
selectors.orgIdValidationSuccess = state => state?.status === 'success';
