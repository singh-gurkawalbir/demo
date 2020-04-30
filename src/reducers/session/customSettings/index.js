import produce from 'immer';
import actionTypes from '../../../actions/types';

export default function reducer(state = {}, action) {
  const { type, resourceId, status, key, formMeta, patch } = action;

  return produce(state, draft => {
    let formPatches;

    switch (type) {
      case actionTypes.CUSTOM_SETTINGS.UPDATE:
        draft[resourceId] = { status, key, meta: formMeta };
        break;

      case actionTypes.RESOURCE.UPDATED:
        formPatches = patch.filter(
          patch =>
            patch.path === '/settingsForm' ||
            patch.path === '/settings' ||
            patch.path === '/content'
        );

        if (formPatches) {
          delete draft[resourceId];
        }

        break;

      default:
        return state;
    }
  });
}

// #region PUBLIC SELECTORS
export function customSettingsStatus(state, resourceId) {
  if (!state) {
    return undefined;
  }

  return state.customSettings[resourceId] || undefined;
}
// #endregion
