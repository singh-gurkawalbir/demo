import produce from 'immer';
import actionTypes from '../../../../actions/types';

const iaFormKey = (
  ssLinkedConnectionId,
  integrationId,
) => `${ssLinkedConnectionId}-${integrationId}`;

export default (state = {}, action) => {
  const {
    type,
    integrationId,
    ssLinkedConnectionId,
  } = action;
  const key = iaFormKey(
    ssLinkedConnectionId,
    integrationId,
  );

  return produce(state, draft => {
    switch (type) {
      case actionTypes.SUITESCRIPT.IA_FORM.INIT_COMPLETE:
        if (!draft[key]) draft[key] = {};
        draft[key] = { initComplete: true,
        };

        return;

      case actionTypes.SUITESCRIPT.IA_FORM.INIT_CLEAR:
        delete draft[key];

        return;
      case actionTypes.SUITESCRIPT.IA_FORM.SUBMIT:
        if (!draft[key])draft[key] = {};
        draft[key].status = 'saving';

        return;
      case actionTypes.SUITESCRIPT.IA_FORM.SUBMIT_COMPLETE:
        draft[key].status = 'success';

        return;
      case actionTypes.SUITESCRIPT.IA_FORM.SUBMIT_FAILED:
        draft[key].status = 'failed';
        break;
      default:
    }
  });
};

// #region PUBLIC SELECTORS
const emptyObj = {};
export const selectors = {};

selectors.suiteScriptIAFormState = (
  state,
  { ssLinkedConnectionId, integrationId }
) => {
  if (!state) {
    return emptyObj;
  }

  const key = iaFormKey(ssLinkedConnectionId, integrationId);

  return state[key] || emptyObj;
};

selectors.suiteScriptIAFormSaving = (
  state,
  { ssLinkedConnectionId, integrationId }
) => {
  if (!state) return false;
  const key = iaFormKey(ssLinkedConnectionId, integrationId);

  return !!(state?.[key]?.status === 'saving');
};
// #endregion
