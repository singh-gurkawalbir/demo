import produce from 'immer';
import actionTypes from '../../../actions/types';

const emptyObj = {};

export default (state = {}, action) => {
  const { type, integrationId, flowId, metadata } = action;
  let categoryMappingData;
  let generatesMetadata;

  return produce(state, draft => {
    // eslint-disable-next-line default-case
    switch (type) {
      case actionTypes.INTEGRATION_APPS.SETTINGS
        .RECEIVED_CATEGORY_MAPPING_METADATA:
        ({ response: categoryMappingData } = metadata);
        generatesMetadata = categoryMappingData.find(
          data => data.operation === 'generatesMetaData'
        );
        draft[`${flowId}-${integrationId}`] = {
          uiAssistant: metadata.uiAssistant,
          response: categoryMappingData,
          filters: {
            attributes: {
              required: true,
              optional: true,
              conditional: true,
              preferred: true,
            },
            mappingFilter: 'mapped',
          },
          generatesMetadata: [generatesMetadata.data.generatesMetaData],
        };
        break;
    }
  });
};

// #region PUBLIC SELECTORS

export function categoryRelationshipData(state, integrationId, flowId) {
  if (!state) return null;
  const { response = [] } = state[`${flowId}-${integrationId}`] || emptyObj;
  const generatesMetaData = response.find(
    sec => sec.operation === 'generatesMetaData'
  );

  return (
    generatesMetaData &&
    generatesMetaData.data &&
    generatesMetaData.data.categoryRelationshipData
  );
}

// #endregion
