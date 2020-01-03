import actionTypes from '../../../actions/types';

export default function reducer(state = {}, action) {
  const { type, tempId, id, resourceReferences, response } = action;
  let newState;

  switch (type) {
    case actionTypes.RESOURCE.CREATED:
      newState = { ...state, [tempId]: id };

      return newState;
    case actionTypes.RESOURCE.REFERENCES_RECEIVED:
      newState = { ...state, references: resourceReferences };

      return newState;
    case actionTypes.RESOURCE.REFERENCES_CLEAR:
      newState = { ...state };
      delete newState.references;

      return newState;
    case actionTypes.LICENSE_TRIAL_ISSUED:
      newState = {
        ...state,
        integratorLicenseActionMessage:
          'Activated! Your 30 days of unlimited flows starts now.',
      };

      return newState;
    case actionTypes.LICENSE_UPGRADE_REQUEST_SUBMITTED:
      newState = {
        ...state,
        integratorLicenseActionMessage:
          'Your request has been received. We will contact you soon.',
      };

      return newState;
    case actionTypes.LICENSE_NUM_ENABLED_FLOWS_RECEIVED:
      newState = {
        ...state,
        NumEnabledFlows: response,
      };

      return newState;

    default:
      return state;
  }
}

// #region PUBLIC SELECTORS
export function createdResourceId(state, tempId) {
  if (!state) {
    return;
  }

  return state[tempId];
}

export function resourceReferences(state) {
  if (!state || !state.references) {
    return null;
  }

  const { references } = state;
  const referencesArray = [];

  Object.keys(references).forEach(type =>
    references[type].forEach(refObj => {
      referencesArray.push({
        resourceType: type,
        id: refObj.id,
        name: refObj.name,
      });
    })
  );

  return referencesArray;
}

export function integratorLicenseActionMessage(state) {
  if (!state) {
    return;
  }

  return state.integratorLicenseActionMessage;
}

export function getNumEnabledFlows(state) {
  if (!state || !state.NumEnabledFlows) {
    return { numEnabledPaidFlows: 0, numEnabledSandboxFlows: 0 };
  }

  return {
    numEnabledPaidFlows: state.NumEnabledFlows.numEnabledPaidFlows || 0,
    numEnabledSandboxFlows: state.NumEnabledFlows.numEnabledSandboxFlows || 0,
    numEnabledFreeFlows: state.NumEnabledFlows.numEnabledFreeFlows || 0,
  };
}
// #endregion
