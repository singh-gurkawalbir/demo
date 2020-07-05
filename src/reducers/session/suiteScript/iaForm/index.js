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
          showFormValidationsBeforeTouch: false,
        };
        return;

      case actionTypes.SUITESCRIPT.IA_FORM.INIT_CLEAR:
        delete draft[key];

        return;

      case actionTypes.SUITESCRIPT.IA_FORM.SHOW_FORM_VALIDATION_ERRORS:
        if (!draft[key])draft[key] = {};
        draft[key].showFormValidationsBeforeTouch = true;
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
export function suiteScriptIAFormState(
  state,
  { ssLinkedConnectionId, integrationId }
) {
  if (!state) {
    return {};
  }

  const key = iaFormKey(ssLinkedConnectionId, integrationId);

  return state[key] || {};
}

export function suiteScriptIAFormSaving(
  state,
  { ssLinkedConnectionId, integrationId }
) {
  if (!state) return false;
  const key = iaFormKey(ssLinkedConnectionId, integrationId);

  return !!(state?.[key]?.status === 'success');
}
// #endregion
