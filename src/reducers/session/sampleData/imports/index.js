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
        draft[_importId] = {
          status: 'requested',
        };
        break;
      case actionTypes.IMPORT_SAMPLEDATA.IA_METADATA_RECEIVED:
        draft[_importId].status = 'received';
        draft[_importId].data = metadata;
        break;
      default:
    }
  });
}

export function integrationAppImportMetadata(state, _importId) {
  return state[_importId] || DEFAULT_VALUE;
}
