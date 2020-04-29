import produce from 'immer';
import actionTypes from '../../../actions/types';

const emptyObj = {};

export default function reducer(state = {}, action) {
  const { type, resourceId, status, formMeta } = action;

  return produce(state, draft => {
    switch (type) {
      case actionTypes.CUSTOM_SETTINGS.UPDATE:
        draft[resourceId] = { status, initializedForm: formMeta };
        break;

      case actionTypes.CUSTOM_SETTINGS.CLEAR:
        draft[resourceId] = {};
        break;

      case actionTypes.RESOURCE.UPDATED:
        // TODO:
        return;

      default:
        return state;
    }
  });
}

// #region PUBLIC SELECTORS
export function customSettingsStatus(state, resourceId) {
  if (!state) {
    return emptyObj;
  }

  return state[resourceId] || emptyObj;
}
// #endregion
