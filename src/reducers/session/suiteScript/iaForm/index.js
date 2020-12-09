import produce from 'immer';
import actionTypes from '../../../../actions/types';
import {COMM_STATES} from '../../../comms/networkComms';

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
        draft[key].status = COMM_STATES.LOADING;

        return;
      case actionTypes.SUITESCRIPT.IA_FORM.SUBMIT_COMPLETE:
        draft[key].status = COMM_STATES.SUCCESS;

        return;
      case actionTypes.SUITESCRIPT.IA_FORM.SUBMIT_FAILED:
        draft[key].status = COMM_STATES.ERROR;
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
  const key = iaFormKey(ssLinkedConnectionId, integrationId);

  return state?.[key] || emptyObj;
};

selectors.suiteScriptIAFormSaving = (
  state,
  { ssLinkedConnectionId, integrationId }
) => {
  if (!state) return false;
  const key = iaFormKey(ssLinkedConnectionId, integrationId);

  return !!(state?.[key]?.status === COMM_STATES.LOADING);
};
// #endregion
