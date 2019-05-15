import actionTypes from '../../../actions/types';

export default (state = {}, action) => {
  const { type, resource, resourceType } = action;

  if (
    type === actionTypes.RESOURCE.RECEIVED &&
    resourceType === 'scriptsContent'
  ) {
    return { ...state, [resource._id]: resource.content };
  }

  return state;
};

// #region PUBLIC SELECTORS
export function scriptContent(state, id) {
  if (!state || !id) {
    return;
  }

  return state[id];
}
// #endregion
