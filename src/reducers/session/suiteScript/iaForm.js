import produce from 'immer';
import actionTypes from '../../../actions/types';

const iaFormKey = (
  ssLinkedConnectionId,
  integrationId,
) => `${ssLinkedConnectionId}-${integrationId}`
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

        }
        return;

      case actionTypes.SUITESCRIPT.IA_FORM.INIT_CLEAR:
        delete draft[key];

        return;

      case actionTypes.SUITESCRIPT.IA_FORM.SHOW_FORM_VALIDATION_ERRORS:
        draft[key].showFormValidationsBeforeTouch = true;
        return;
      case actionTypes.SUITESCRIPT.IA_FORM.SUBMIT:
        delete draft[key].submitFailed;
        delete draft[key].submitComplete;


        return;
      case actionTypes.SUITESCRIPT.IA_FORM.SUBMIT_COMPLETE:
        draft[key].submitComplete = true;

        return;
      case actionTypes.SUITESCRIPT.IA_FORM.SUBMIT_FAILED:
        draft[key].submitFailed = true;
        break;
      default:
    }
  });
}

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

export function suiteScriptIAFormSaveProcessTerminated(
  state,
  { ssLinkedConnectionId, integrationId }
) {
  if (!state) return false;
  const key = iaFormKey(ssLinkedConnectionId, integrationId);

  if (!state[key]) return false;
  const { submitFailed, submitComplete, submitAborted } = state[key];

  return !!(submitFailed || submitComplete || submitAborted);
}
// #endregion
