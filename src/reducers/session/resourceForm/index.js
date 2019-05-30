import actionTypes from '../../../actions/types';

export default function reducer(state = {}, action) {
  const {
    type,
    resourceType,
    resourceId,
    fieldMeta,
    optionsHandler,
    formValues,
    preSubmit,
  } = action;
  const key = `${resourceType}-${resourceId}`;

  switch (type) {
    case actionTypes.RESOURCE_FORM.INIT:
      return {
        ...state,
        [key]: { initComplete: false },
      };

    case actionTypes.RESOURCE_FORM.INIT_COMPLETE:
      return {
        ...state,
        // Are there any issues with storing fn pointers here?
        // if the state is not serializable, will we recover properly from
        // refreshing session? Doing this makes the submit resource saga
        // easier as we dont need to lookup the preSubmit handler...
        [key]: {
          ...state[key],
          initComplete: true,
          fieldMeta,
          optionsHandler,
          preSubmit,
        },
      };

    case actionTypes.RESOURCE_FORM.SUBMIT:
      return {
        ...state,
        [key]: {
          ...state[key],
          submitComplete: false,
          formValues: undefined,
        },
      };

    case actionTypes.RESOURCE_FORM.SUBMIT_COMPLETE:
      return {
        ...state,
        [key]: { ...state[key], submitComplete: true, formValues },
      };

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
// #endregion
