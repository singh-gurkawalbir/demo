import produce from 'immer';
import shortid from 'shortid';
import actionTypes from '../../../actions/types';

export default function reducer(state = {}, action) {
  const { type, resourceId, formMeta, scriptId, patch, error } = action;

  // state = {status, scriptId, meta, error, key}
  return produce(state, draft => {
    let formPatches;
    let scriptPatches;

    switch (type) {
      case actionTypes.CUSTOM_SETTINGS.FORM_REQUEST:
        draft[resourceId] = { status: 'request' };
        break;

      case actionTypes.CUSTOM_SETTINGS.FORM_RECEIVED:
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

      case actionTypes.RESOURCE.UPDATED:
        // console.log(patch);
        formPatches = patch.filter(
          patch =>
            // removed /settings path from filter as this condition will be taken care by formClear action
            patch.path === '/settingsForm' /* || patch.path === '/settings' */
        );

        scriptPatches = patch.filter(patch => patch.path === '/content');

        if (formPatches && formPatches.length) {
          delete draft[resourceId];
        } else if (scriptPatches && scriptPatches.length) {
          // We need to iterate over all cached items in the state object
          // and check if any resource with a cached form result uses a 'scriptId'
          // matching the resourceId in the action payload.
          Object.keys(draft).forEach(key => {
            if (draft[key].scriptId === resourceId) {
              delete draft[key];
              // no need to break the loop here as there can be multiple resources using same scriptId (rare though)
            }
          });
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

  return state[resourceId];
}
// #endregion
