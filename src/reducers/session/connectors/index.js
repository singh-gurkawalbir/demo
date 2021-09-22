import produce from 'immer';
import actionTypes from '../../../actions/types';
import { COMM_STATES as PUBLISH_STATES } from '../../comms/networkComms';

export default (state = {}, action) => {
  const { type, metadata, fieldName, fieldType, _integrationId } = action;

  if (!_integrationId) {
    return state;
  }

  return produce(state, draft => {
    if (!draft[_integrationId]) {
      draft[_integrationId] = {};
    }

    switch (type) {
      case actionTypes.CONNECTORS.METADATA_REQUEST:
        draft[_integrationId][fieldName] = { isLoading: true, fieldType };
        break;
      case actionTypes.CONNECTORS.METADATA_RECEIVED:
        draft[_integrationId][fieldName] = {
          isLoading: false,
          fieldType,
          data: metadata,
          shouldReset: true,
        };
        break;
      case actionTypes.CONNECTORS.METADATA_FAILURE:
        draft[_integrationId][fieldName] = { isLoading: false, fieldType };
        break;
      case actionTypes.CONNECTORS.METADATA_CLEAR:
        draft[_integrationId][fieldName] = {};
        break;
      case actionTypes.CONNECTORS.STATUS_CLEAR:
        if (draft[_integrationId][fieldName]) {
          draft[_integrationId][fieldName].isLoading = false;
        }
        break;
      case actionTypes.CONNECTORS.PUBLISH.REQUEST:
        draft[_integrationId].publishStatus = PUBLISH_STATES.LOADING;
        break;
      case actionTypes.CONNECTORS.PUBLISH.SUCCESS:
        draft[_integrationId].publishStatus = PUBLISH_STATES.SUCCESS;
        break;
      case actionTypes.CONNECTORS.PUBLISH.ERROR:
        draft[_integrationId].publishStatus = PUBLISH_STATES.ERROR;
        break;
      default:
        break;
    }
  });
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
