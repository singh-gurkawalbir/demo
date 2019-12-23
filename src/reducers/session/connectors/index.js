import actionTypes from '../../../actions/types';

export default (state = {}, action) => {
  const { type, metadata, fieldName, fieldType, _integrationId } = action;
  const newState = { ...state };

  if (!newState[_integrationId]) {
    newState[_integrationId] = {};
  }

  switch (type) {
    case actionTypes.CONNECTORS.METADATA_REQUEST:
      newState[_integrationId][fieldName] = { isLoading: true, fieldType };

      return newState;
    case actionTypes.CONNECTORS.METADATA_RECEIVED:
      newState[_integrationId][fieldName] = {
        isLoading: false,
        fieldType,
        data: metadata,
        shouldReset: true,
      };

      return newState;
    case actionTypes.CONNECTORS.METADATA_FAILURE:
      newState[_integrationId][fieldName] = { isLoading: false, fieldType };

      return newState;
    case actionTypes.CONNECTORS.METADATA_CLEAR:
      newState[_integrationId][fieldName] = {};

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

  const metadata = state[_integrationId][fieldName];

  if (typeof metadata === 'object') {
    return metadata;
  } else if (
    Array.isArray(metadata) &&
    metadata.length &&
    typeof metadata[0] === 'object'
  ) {
    return metadata[0];
  }

  return { isLoading: false };
}
// #endregion
