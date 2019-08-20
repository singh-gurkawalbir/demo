import actionTypes from '../../../actions/types';

export default (state = {}, action) => {
  const { type, metadata, id, _integrationId } = action;
  const newState = { ...state };

  if (!newState[_integrationId]) {
    newState[_integrationId] = {};
  }

  switch (type) {
    case actionTypes.CONNECTORS.REFRESH_METADATA:
      newState[_integrationId][id] = { isLoading: true };

      return newState;
    case actionTypes.CONNECTORS.RECEIVED_METADATA:
      if (!newState[_integrationId]) newState[_integrationId] = {};
      newState[_integrationId][id] = { isLoading: false, data: metadata };

      return newState;
    case actionTypes.CONNECTORS.RECEIVED_ERROR_REFRESH_METADATA:
      newState[_integrationId][id] = { isLoading: false };

      return newState;
    default:
      return state;
  }
};

// #region PUBLIC SELECTORS
export function connectorsMetadataOptions(
  state,
  fieldName,
  id,
  _integrationId
) {
  if (!state || !state[_integrationId]) {
    return {};
  }

  return {
    data: state[_integrationId][fieldName].data,
    isLoading: state[_integrationId][fieldName].isLoading,
  };
}
// #endregion
