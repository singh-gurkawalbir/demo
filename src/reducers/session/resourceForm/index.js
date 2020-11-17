import actionTypes from '../../../actions/types';
import { fieldsTouchedForMeta } from '../../../forms/utils';

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
    bundleVersion,
  } = action;
  const key = `${resourceType}-${resourceId}`;
  const stateCopy = { ...state, [key]: { ...state[key] } };

  switch (type) {
    case actionTypes.RESOURCE_FORM.INIT:
      return {
        ...state,
        [key]: { initComplete: false, initData },
      };

    case actionTypes.RESOURCE_FORM.INIT_COMPLETE:
      return {
        ...state,
        // Are there any issues with storing fn pointers here?
        // if the state is not serializable, will we recover properly from
        // refreshing session? Doing this makes the submit resource saga
        // easier as we dont need to lookup the preSave handler...
        [key]: {
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
        },
      };
    case actionTypes.RESOURCE_FORM.INIT_FAILED:
      return {
        ...state,
        [key]: {
          ...state[key],
          initFailed: true,
        },
      };

    case actionTypes.RESOURCE_FORM.CLEAR_INIT_DATA:
      stateCopy[key] && delete stateCopy[key].initData;

      return stateCopy;
    case actionTypes.RESOURCE_FORM.SUBMIT:
      return {
        ...state,
        [key]: {
          ...state[key],
          submitAborted: false,
          submitComplete: false,
          submitFailed: false,
          formValues: undefined,
          skipClose,
        },
      };

    case actionTypes.RESOURCE_FORM.SHOW_BUNDLE_INSTALL_NOTIFICATION:
      return {
        ...state,
        [key]: {
          ...state[key],
          bundleVersion,
          bundleUrl,
          showBundleInstallNotification: true,
        },
      };

    case actionTypes.RESOURCE_FORM.HIDE_BUNDLE_INSTALL_NOTIFICATION:
      return {
        ...state,
        [key]: {
          ...state[key],
          showBundleInstallNotification: false,
        },
      };

    case actionTypes.RESOURCE_FORM.SUBMIT_COMPLETE:
      return {
        ...state,
        [key]: {
          ...state[key],
          submitComplete: true,
          formValues,
        },
      };
    case actionTypes.RESOURCE_FORM.SUBMIT_FAILED:
      return {
        ...state,
        [key]: { ...state[key], submitFailed: true, formValues },
      };

    case actionTypes.RESOURCE_FORM.SUBMIT_ABORTED:
      return { ...state, [key]: { submitAborted: true } };
    case actionTypes.RESOURCE_FORM.CLEAR:
      return { ...state, [key]: {} };
    default:
      return state;
  }
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
  if (!state) return false;
  const key = `${resourceType}-${resourceId}`;

  if (!state[key]) return false;
  const { submitFailed, submitComplete, submitAborted } = state[key];

  return !!(submitFailed || submitComplete || submitAborted);
};
// #endregion
