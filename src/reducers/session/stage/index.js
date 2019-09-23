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
      }

      return newState;

    case actionTypes.RESOURCE.STAGE_UNDO:
      // we can't undo if there is no staged data
      if (!newState[id] || !newState[id].patch) {
        return newState;
      }

      newState[id] = { ...newState[id], patch: [...newState[id].patch] };

      if (scope) {
        let timestampOfPatch;

        for (let i = newState[id].patch.length - 1; i >= 0; i -= 1) {
          if (!timestampOfPatch && newState[id].patch[i].scope === scope) {
            timestampOfPatch = newState[id].patch.timestamp;
            newState[id].patch.splice(i, 1);
          }
          // removing older ones matching the same timestamp

          if (
            timestampOfPatch &&
            newState[id].patch[i].timestamp === timestampOfPatch
          ) {
            newState[id].patch.splice(i, 1);
          }
        }

        return newState;
      }

      // drop last patch.
      if (newState[id].patch.length > 1) {
        newState[id].patch.pop();
      } else {
        delete newState[id].patch;
      }

      return newState;

    // eslint-disable-next-line no-case-declarations
    case actionTypes.RESOURCE.STAGE_PATCH:
      newState[id] = {
        ...newState[id],
        patch: [...((newState[id] && newState[id].patch) || [])],
      };
      // inserting the same field twice causes the previous patch to be ignored
      // TODO: a better way to deal with partial patches is required...
      // perhaps apply partial patches to only editor changes

      // scope shouldn't matter when removing partial patches
      // is it operation check that
      if (newPatch.length === 1 && newPatch[0].op === 'replace') {
        if (
          newState[id].patch.length > 0 &&
          newPatch[0].path ===
            newState[id].patch[newState[id].patch.length - 1].path &&
          newPatch[0].op ===
            newState[id].patch[newState[id].patch.length - 1].op
        )
          newState[id].patch.pop();
      }

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

// #region PUBLIC SELECTORS
export function stagedResource(state, id, scope) {
  if (!state || !id || !state[id]) {
    return {};
  }

  let updatedPatches;

  if (scope)
    updatedPatches =
      state[id].patch && state[id].patch.filter(patch => patch.scope === scope);
  else updatedPatches = state[id].patch;

  return { ...state[id], patch: updatedPatches };
}
// #endregion
