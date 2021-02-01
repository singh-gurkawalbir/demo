/*
 * This state holds sampleData/metadata for an Import
 */
import produce from 'immer';
import actionTypes from '../../../../actions/types';

const DEFAULT_VALUE = {};

export default function (state = {}, action) {
  const { type, _importId, metadata } = action;

  return produce(state, draft => {
    if (!type || !_importId) return draft;

    switch (type) {
      case actionTypes.IMPORT_SAMPLEDATA.IA_METADATA_REQUEST:
        if (!draft[_importId]) { draft[_importId] = {}; }
        draft[_importId].status = 'requested';
        break;
      case actionTypes.IMPORT_SAMPLEDATA.IA_METADATA_RECEIVED:
        if (!draft[_importId]) { draft[_importId] = {}; }
        draft[_importId].status = 'received';
        draft[_importId].data = metadata;
        break;
      case actionTypes.IMPORT_SAMPLEDATA.IA_METADATA_FAILED:
        if (!draft[_importId]) { draft[_importId] = {}; }
        draft[_importId].status = 'received';
        break;
      default:
    }
  });
}

export const selectors = {};

selectors.integrationAppImportMetadata = (state, _importId) => {
  if (!state || !state[_importId]) { return DEFAULT_VALUE; }

  return state[_importId];
};
