import produce from 'immer';
import actionTypes from '../../../../actions/types';

export default (state = {}, action) => {
  const {
    type,
    metadata = [],
  } = action;

  return produce(state, draft => {
    switch (type) {
      case actionTypes.ERROR_MANAGER.FILTER_METADATA.REQUEST:
        draft.status = 'requested';
        break;
      case actionTypes.ERROR_MANAGER.FILTER_METADATA.RECEIVED:
        draft.status = 'received';
        draft.data = metadata.reduce((filterMetadata, filter) => {
          const { name, enums } = filter;

          return { ...filterMetadata, [name]: enums };
        }, {});
        break;
      default:
    }
  });
};

export const selectors = {};

selectors.isErrorFilterMetadataRequested = state => !!state?.status;

selectors.getSourceMetadata = state => {
  if (!state) return;

  return state.data?.source;
};

selectors.getClassificationMetadata = state => {
  if (!state) return;

  return state.data?.classification;
};

