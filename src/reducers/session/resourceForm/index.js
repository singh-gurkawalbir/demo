import actionTypes from '../../../actions/types';
import { fieldsTouchedForMeta } from '../../../forms/utils';

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
          showFormValidationsBeforeTouch: false,
        },
      };

    case actionTypes.RESOURCE_FORM.CLEAR_INIT_DATA:
      stateCopy[key] && delete stateCopy[key].initData;

      return stateCopy;

    case actionTypes.RESOURCE_FORM.SHOW_FORM_VALIDATION_ERRORS:
      // only after form successfully intializes does it make sense to show validations
      // if there is no form state it does not make sense to create a state and tie this property
      if (!state[key] || !state[key].initComplete) return state;

      return {
        ...state,
        // Are there any issues with storing fn pointers here?
        // if the state is not serializable, will we recover properly from
        // refreshing session? Doing this makes the submit resource saga
        // easier as we dont need to lookup the preSave handler...
        [key]: {
          ...state[key],
          showFormValidationsBeforeTouch: true,
        },
      };

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

    case actionTypes.RESOURCE_FORM.SUBMIT_COMPLETE:
      return {
        ...state,
        [key]: { ...state[key], submitComplete: true, formValues },
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
export function resourceFormState(state, resourceType, resourceId) {
  if (!state) {
    return {};
  }

  const key = `${resourceType}-${resourceId}`;

  return state[key] || {};
}

export function resourceFormSaveProcessTerminated(
  state,
  resourceType,
  resourceId
) {
  if (!state) return false;
  const key = `${resourceType}-${resourceId}`;

  if (!state[key]) return false;
  const { submitFailed, submitComplete, submitAborted } = state[key];

  return !!(submitFailed || submitComplete || submitAborted);
}
// #endregion
