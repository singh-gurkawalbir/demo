import produce from 'immer';

import actionTypes from '../../../actions/types';
import { fieldsTouchedForMeta } from '../../../forms/formFactory/utils';
import {FORM_SAVE_STATUS} from '../../../constants';

const emptyObj = {};

export default function reducer(state = {}, action) {
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
    bundleUrl,
    suiteAppUrl,
  } = action;
  const key = `${resourceType}-${resourceId}`;

  if (!resourceType || !resourceId) return state;

  return produce(state, draft => {
    switch (type) {
      case actionTypes.RESOURCE_FORM.INIT:

        draft[key] = { initComplete: false, initData };
        break;

      case actionTypes.RESOURCE_FORM.INIT_COMPLETE:

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
          showValidationBeforeTouched: false,
        };
        break;

      case actionTypes.RESOURCE_FORM.INIT_FAILED:
        if (!draft[key]) {
          draft[key] = {};
        }
        draft[key].initFailed = true;
        break;
      case actionTypes.RESOURCE_FORM.CLEAR_INIT_DATA:
        draft[key] && delete draft[key].initData;
        break;
      case actionTypes.RESOURCE_FORM.SUBMIT:
        if (!draft[key]) {
          draft[key] = {};
        }
        draft[key].formSaveStatus = FORM_SAVE_STATUS.LOADING;
        draft[key].formValues = undefined;
        draft[key].skipClose = skipClose;

        break;

      case actionTypes.RESOURCE_FORM.SHOW_BUNDLE_INSTALL_NOTIFICATION:
        if (!draft[key]) {
          draft[key] = {};
        }

        draft[key].bundleUrl = bundleUrl;
        draft[key].showBundleInstallNotification = true;
        break;
      case actionTypes.RESOURCE_FORM.SHOW_SUITEAPP_INSTALL_NOTIFICATION:
        if (!draft[key]) {
          draft[key] = {};
        }

        draft[key].suiteAppUrl = suiteAppUrl;
        draft[key].showSuiteAppInstallNotification = true;
        break;
      case actionTypes.RESOURCE_FORM.HIDE_BUNDLE_INSTALL_NOTIFICATION:
        if (!draft[key]) {
          draft[key] = {};
        }
        draft[key].showBundleInstallNotification = false;
        break;
      case actionTypes.RESOURCE_FORM.HIDE_SUITEAPP_INSTALL_NOTIFICATION:
        if (!draft[key]) {
          draft[key] = {};
        }
        draft[key].showSuiteAppInstallNotification = false;
        break;

      case actionTypes.RESOURCE_FORM.SUBMIT_COMPLETE:
        if (!draft[key]) {
          draft[key] = {};
        }

        draft[key].formSaveStatus = FORM_SAVE_STATUS.COMPLETE;
        draft[key].formValues = formValues;
        break;
      case actionTypes.RESOURCE_FORM.SUBMIT_FAILED:
        if (!draft[key]) {
          draft[key] = {};
        }

        draft[key].formSaveStatus = FORM_SAVE_STATUS.FAILED;
        draft[key].formValues = formValues;
        break;

      case actionTypes.RESOURCE_FORM.SUBMIT_ABORTED:
        if (!draft[key]) {
          draft[key] = {};
        }
        draft[key].formSaveStatus = FORM_SAVE_STATUS.ABORTED;
        break;
      case actionTypes.RESOURCE_FORM.CLEAR:
        draft[key] = {};
        break;
      default:
        break;
    }
  });
}

// #region PUBLIC SELECTORS
export const selectors = {};

selectors.resourceFormState = (state, resourceType, resourceId) => {
  if (!state) {
    return emptyObj;
  }

  const key = `${resourceType}-${resourceId}`;

  return state[key] || emptyObj;
};

selectors.resourceFormSaveProcessTerminated = (
  state,
  resourceType,
  resourceId
) => {
  const key = `${resourceType}-${resourceId}`;

  return [FORM_SAVE_STATUS.COMPLETE, FORM_SAVE_STATUS.FAILED, FORM_SAVE_STATUS.ABORTED].includes(state?.[key]?.formSaveStatus);
};
// #endregion
