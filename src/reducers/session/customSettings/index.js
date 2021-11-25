import produce from 'immer';
import shortid from 'shortid';
import actionTypes from '../../../actions/types';

export default function reducer(state = {}, action) {
  const { type, resourceId, formMeta, scriptId, error } = action;

  // state = {status, scriptId, meta, error, key}
  return produce(state, draft => {
    switch (type) {
      case actionTypes.CUSTOM_SETTINGS.FORM_REQUEST:
        draft[resourceId] = { status: 'request' };
        break;

      case actionTypes.CUSTOM_SETTINGS.FORM_RECEIVED:
        if (!draft[resourceId]) {
          draft[resourceId] = {};
        }

        draft[resourceId].status = 'received';
        draft[resourceId].meta = formMeta;
        draft[resourceId].scriptId = scriptId;
        draft[resourceId].key = shortid.generate();
        break;

      case actionTypes.CUSTOM_SETTINGS.FORM_ERROR:
        draft[resourceId] = { status: 'error', error };
        break;

      case actionTypes.CUSTOM_SETTINGS.FORM_CLEAR:
        delete draft[resourceId];
        break;

      default:
        return state;
    }
  });
}

// #region PUBLIC SELECTORS
export const selectors = {};

selectors.customSettingsForm = (state, resourceId) => {
  if (!state) {
    return undefined;
  }

  return state[resourceId];
};
// #endregion
