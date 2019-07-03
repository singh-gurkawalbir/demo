import actionTypes from '../../../actions/types';

export default (state = {}, action) => {
  const { type, id, patch: newPatch, conflict } = action;
  const newState = { ...state };

  switch (type) {
    case actionTypes.RESOURCE.STAGE_CLEAR:
      // we can't clear if there is no staged data
      if (!newState[id] || !newState[id].patch || !newState[id].patch.length) {
        return newState;
      }

      newState[id] = { ...newState[id] };

      // drop all staged patches.
      delete newState[id].patch;
      delete newState[id].lastChange;

      return newState;

    case actionTypes.RESOURCE.STAGE_UNDO:
      // we can't undo if there is no staged data
      if (!newState[id] || !newState[id].patch) {
        return newState;
      }

      newState[id] = { ...newState[id], patch: [...newState[id].patch] };

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
        lastChange: Date.now(),
        patch: [...((newState[id] && newState[id].patch) || [])],
      };

      // TODO: Should I could make the code support several patches
      // if the previous patch is modifying the same path as the prior patch,
      // remove the prior patch so we dont accumulate single character patches.
      if (
        newPatch.length === 1 &&
        newState[id].patch.length > 0 &&
        newState[id].patch[newState[id].patch.length - 1].path ===
          newPatch[0].path
      ) {
        newState[id].patch.pop(); // throw away partial patch.
      }

      newState[id].patch = [...newState[id].patch, ...newPatch];

      return newState;

    case actionTypes.RESOURCE.STAGE_CONFLICT:
      newState[id] = newState[id] || {};
      newState[id] = { ...newState[id], conflict };

      return newState;

    case actionTypes.RESOURCE.CLEAR_CONFLICT:
      if (!newState[id] || !newState[id].conflict) {
        return newState;
      }

      newState[id] = { ...newState[id] };

      delete newState[id].conflict;

      return newState;

    default:
      return state;
  }
};

// #region PUBLIC SELECTORS
export function stagedResource(state, id) {
  if (!state || !id) {
    return {};
  }

  return state[id] || {};
}
// #endregion
