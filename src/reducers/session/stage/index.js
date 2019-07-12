import actionTypes from '../../../actions/types';

export default (state = {}, action) => {
  const { type, id, patch: newPatch, conflict, scope } = action;
  const newState = { ...state };
  const timestamp = Date.now();

  switch (type) {
    case actionTypes.RESOURCE.STAGE_CLEAR:
      // we can't clear if there is no staged data
      if (!newState[id] || !newState[id].patch || !newState[id].patch.length) {
        return newState;
      }

      newState[id] = { ...newState[id] };

      if (scope) {
        newState[id].patch = newState[id].patch.filter(
          patch => patch.scope !== scope
        );
      } else {
        // drop all staged patches.
        delete newState[id].patch;
        delete newState[id].lastChange;
      }

      return newState;

    case actionTypes.RESOURCE.STAGE_UNDO:
      // we can't undo if there is no staged data
      if (!newState[id] || !newState[id].patch) {
        return newState;
      }

      newState[id] = { ...newState[id], patch: [...newState[id].patch] };

      if (scope) {
        let elementFound = false;
        let lastChangeUpdated = false;

        for (let i = newState[id].patch.length - 1; i >= 0; i -= 1) {
          if (newState[id].patch[i].scope === scope) {
            if (!elementFound) {
              newState[id].patch.splice(i, 1);
              elementFound = true;
            } else {
              lastChangeUpdated = true;
              newState[id].lastChange = newState[id].patch[i].timestamp;
              break;
            }
          }
        }

        // if there are no more patches matching the scope
        // lets update the timestamp to the last patch
        if (!lastChangeUpdated)
          if (newState[id].patch.length > 0)
            newState[id].lastChange =
              newState[id].patch[newState[id].patch.length - 1].timestamp;
          else {
            delete newState[id].patch;
            delete newState[id].lastChange;
          }

        return newState;
      }

      // drop last patch.
      if (newState[id].patch.length > 1) {
        newState[id].patch.pop();
        newState[id].lastChange =
          newState[id].patch[newState[id].patch.length - 1].timestamp;
      } else {
        delete newState[id].patch;
        delete newState[id].lastChange;
      }

      return newState;

    // eslint-disable-next-line no-case-declarations
    case actionTypes.RESOURCE.STAGE_PATCH:
      newState[id] = {
        ...newState[id],
        lastChange: timestamp,
        patch: [...((newState[id] && newState[id].patch) || [])],
      };
      // inserting the same field twice causes the previous patch to be ignored
      // TODO: a better way to deal with partial patches is required...
      // perhaps apply partial patches to only editor changes

      // removing all partial patches
      newPatch.forEach(newPatch => {
        // ignore the partial patch mechanism for metadata changes
        if (!newPatch.path.startsWith('/customForm'))
          newState[id].patch = newState[id].patch.filter(
            patch => patch.path !== newPatch.path
          );
      });

      const scopedPatchWithTimestamp = scope
        ? newPatch.map(patch => ({
            ...patch,
            timestamp,
            scope,
          }))
        : newPatch.map(patch => ({
            ...patch,
            timestamp,
          }));

      newState[id].patch = [...newState[id].patch, ...scopedPatchWithTimestamp];

      return newState;

    case actionTypes.RESOURCE.STAGE_CONFLICT:
      newState[id] = newState[id] || {};
      newState[id] = { ...newState[id], conflict };

      if (scope) newState[id] = { ...newState[id], scope };

      return newState;

    case actionTypes.RESOURCE.CLEAR_CONFLICT:
      if (!newState[id] || !newState[id].conflict) {
        return newState;
      }

      newState[id] = { ...newState[id] };

      delete newState[id].conflict;
      delete newState[id].scope;

      return newState;

    default:
      return state;
  }
};

function deleteTimeStampScope(patch) {
  const patchCopy = { ...patch };

  delete patchCopy.timestamp;
  delete patchCopy.scope;

  return patchCopy;
}

// #region PUBLIC SELECTORS
export function stagedResource(state, id, scope) {
  if (!state || !id || !state[id]) {
    return {};
  }

  let updatedPatches;

  if (scope)
    updatedPatches =
      state[id].patch &&
      state[id].patch
        .filter(patch => patch.scope === scope)
        .map(deleteTimeStampScope);
  else
    updatedPatches =
      state[id].patch && state[id].patch.map(deleteTimeStampScope);

  return { ...state[id], patch: updatedPatches };
}
// #endregion
