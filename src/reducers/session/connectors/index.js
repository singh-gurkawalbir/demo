import actionTypes from '../../../actions/types';

export default (state = {}, action) => {
  const { type, metadata, id, _integrationId } = action;
  const newState = { ...state };

  if (!newState[_integrationId]) {
    newState[_integrationId] = {};
  }

  switch (type) {
    case actionTypes.CONNECTORS.METADATA_REQUEST:
      newState[_integrationId][id] = { isLoading: true };

      return newState;
    case actionTypes.CONNECTORS.METADATA_RECEIVED:
      newState[_integrationId][id] = { isLoading: false, data: metadata };

      return newState;
    case actionTypes.CONNECTORS.METADATA_FAILURE:
      newState[_integrationId][id] = { isLoading: false };

      return newState;
    case actionTypes.CONNECTORS.METADATA_CLEAR:
      newState[_integrationId][id] = {};

      return newState;
    default:
      return state;
  }
};

// #region PUBLIC SELECTORS
export function connectorMetadata(state, fieldName, id, _integrationId) {
  if (!state || !state[_integrationId]) {
    return { isLoading: false };
  }

  const toReturn = state[_integrationId][fieldName];

  if (typeof toReturn === 'object') {
    return toReturn;
  } else if (
    Array.isArray(toReturn) &&
    toReturn.length &&
    typeof toReturn[0] === 'object'
  ) {
    return toReturn[0];
  }

  return { isLoading: false };
}
// #endregion
