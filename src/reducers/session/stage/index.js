import actionTypes from '../../../actions/types';

export default (state = {}, action) => {
  const { type, id, patch, conflict } = action;
  let newState;
  let newPatch;

  switch (type) {
    case actionTypes.RESOURCE.STAGE_CLEAR:
      // we can't clear if there is no staged data
      if (!state[id] || !state[id].patch || !state[id].patch.length) {
        return state;
      }

      newState = Object.assign({}, state);

      // drop all staged patches.
      delete newState[id].patch;
      delete newState[id].lastChange;

      return newState;

    case actionTypes.RESOURCE.STAGE_UNDO:
      // we can't undo if there is no staged data
      if (!state[id] || !state[id].patch) {
        return state;
      }

      newState = Object.assign({}, state);

      // drop last patch.
      if (newState[id].patch.length > 1) {
        newState[id].patch.pop();
      } else {
        delete newState[id].patch;
      }

      return newState;

    case actionTypes.RESOURCE.STAGE_PATCH:
      newState = Object.assign({}, state);
      newState[id] = newState[id] || {};
      newPatch = newState[id].patch || [];

      // if the previous patch is modifying the same path as the prior patch,
      // remove the prior patch so we dont accumulate single character patches.
      if (
        patch.length === 1 &&
        newPatch.length > 0 &&
        newPatch[newPatch.length - 1].path === patch[0].path
      ) {
        newPatch.pop(); // throw away partial patch.
      }

      newState[id] = {
        ...newState[id],
        lastChange: Date.now(),
        patch: [...newPatch, ...patch],
      };

      return newState;

    case actionTypes.RESOURCE.STAGE_CONFLICT:
      newState = Object.assign({}, state);
      newState[id] = newState[id] || {};
      newState[id].conflict = conflict;

      return newState;

    case actionTypes.RESOURCE.CLEAR_CONFLICT:
      if (!state[id] || !state[id].conflict) {
        return state;
      }

      newState = Object.assign({}, state);

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
