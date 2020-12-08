import produce from 'immer';
import actionTypes from '../../../../actions/types';
import { suiteScriptResourceKey } from '../../../../utils/suiteScript';
import {FORM_SAVE_STATUS} from '../../../../utils/constants';
import { fieldsTouchedForMeta } from '../../../../forms/formFactory/utils';

export default (state = {}, action) => {
  const {
    type,
    resourceType,
    resourceId,
    flowId,
    isNew,
    skipCommit,
    fieldMeta,
    formValues,
    skipClose = false,
    initData,
    ssLinkedConnectionId,
  } = action;

  if (!resourceType || !resourceId || !ssLinkedConnectionId) return state;

  const key = suiteScriptResourceKey({
    ssLinkedConnectionId,
    resourceType,
    resourceId,
  });

  return produce(state, draft => {
    switch (type) {
      case actionTypes.SUITESCRIPT.RESOURCE_FORM.INIT:
        draft[key] = { initComplete: false, initData };
        break;
      case actionTypes.SUITESCRIPT.RESOURCE_FORM.INIT_FAILED:

        draft[key] = {initFailed: true,
          initComplete: false};
        break;

      case actionTypes.SUITESCRIPT.RESOURCE_FORM.INIT_COMPLETE:

        // Are there any issues with storing fn pointers here?
        // if the state is not serializable, will we recover properly from
        // refreshing session? Doing this makes the submit resource saga
        // easier as we dont need to lookup the preSave handler...
        draft[key] = {
          initData:
            state[key] && state[key].initData
              ? fieldsTouchedForMeta(
                fieldMeta,
                state[key] && state[key].initData
              )
              : null,
          isNew,
          skipCommit,
          initComplete: true,
          fieldMeta,
          flowId,
        };
        break;

      case actionTypes.SUITESCRIPT.RESOURCE_FORM.SUBMIT:

        if (!draft[key]) {
          draft[key] = {};
        }
        draft[key].formSaveStatus = FORM_SAVE_STATUS.LOADING;
        draft[key].formValues = undefined;
        draft[key].skipClose = skipClose;
        break;

      case actionTypes.SUITESCRIPT.RESOURCE_FORM.SUBMIT_COMPLETE:

        if (!draft[key]) {
          draft[key] = {};
        }

        draft[key].formSaveStatus = FORM_SAVE_STATUS.COMPLETE;
        draft[key].formValues = formValues;
        break;
      case actionTypes.SUITESCRIPT.RESOURCE_FORM.SUBMIT_FAILED:
        if (!draft[key]) {
          draft[key] = {};
        }

        draft[key].formSaveStatus = FORM_SAVE_STATUS.FAILED;
        draft[key].formValues = formValues;
        break;

      case actionTypes.SUITESCRIPT.RESOURCE_FORM.SUBMIT_ABORTED:
        if (!draft[key]) {
          draft[key] = {};
        }
        draft[key].formSaveStatus = FORM_SAVE_STATUS.ABORTED;
        break;
      case actionTypes.SUITESCRIPT.RESOURCE_FORM.CLEAR:
        draft[key] = {};
        break;
      default:
        break;
    }
  });
};

// #region PUBLIC SELECTORS
export const selectors = {};

selectors.suiteScriptResourceFormState = (state, { ssLinkedConnectionId, resourceType, resourceId }) => {
  if (!state) {
    return {};
  }

  const key = suiteScriptResourceKey({
    ssLinkedConnectionId,
    resourceType,
    resourceId,
  });

  return state[key] || {};
};

selectors.suiteScriptResourceFormSaveProcessTerminated = (state, { ssLinkedConnectionId, resourceType, resourceId }) => {
  if (!state) return false;
  const key = suiteScriptResourceKey({
    ssLinkedConnectionId,
    resourceType,
    resourceId,
  });

  return [FORM_SAVE_STATUS.COMPLETE, FORM_SAVE_STATUS.FAILED, FORM_SAVE_STATUS.ABORTED].includes(state?.[key]?.formSaveStatus);
};
// #endregion
