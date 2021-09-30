import actionTypes from '../../../actions/types';
import { COMM_STATES as PUBLISH_STATES } from '../../comms/networkComms';

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
    case actionTypes.CONNECTORS.STATUS_CLEAR:
      if (newState[_integrationId][fieldName]) {
        newState[_integrationId][fieldName].isLoading = false;
      }

      return newState;
    case actionTypes.CONNECTORS.PUBLISH.REQUEST:
      newState[_integrationId].publishStatus = PUBLISH_STATES.LOADING;

      return newState;
    case actionTypes.CONNECTORS.PUBLISH.SUCCESS:
      newState[_integrationId].publishStatus = PUBLISH_STATES.SUCCESS;

      return newState;
    case actionTypes.CONNECTORS.PUBLISH.ERROR:
      newState[_integrationId].publishStatus = PUBLISH_STATES.ERROR;

      return newState;
    default:
      return state;
  }
};

// #region PUBLIC SELECTORS
export const selectors = {};

selectors.connectorMetadata = (state, fieldName, id, _integrationId) => {
  if (!state || !state[_integrationId]) {
    return { isLoading: false };
  }

  const metadata = state[_integrationId][fieldName];

  if (typeof metadata === 'object') {
    return metadata;
  }

  return { isLoading: false };
};

selectors.connectorFieldOptions = (
  state,
  fieldName,
  id,
  _integrationId,
  defaultFieldOptions
) => {
  const { data, isLoading } = selectors.connectorMetadata(
    state,
    fieldName,
    id,
    _integrationId
  );

  // should select options from either defaultOptions or the refreshed metadata options
  return {
    isLoading,
    value: data && data.value,
    options:
      (data &&
        data.options &&
        data.options.map(option => ({
          value: option[0],
          label: option[1],
        }))) ||
      (defaultFieldOptions && defaultFieldOptions[0].items),
  };
};

selectors.connectorPublishStatus = (state, _integrationId) => state?.[_integrationId]?.publishStatus || 'failed';
// #endregion
