import actionTypes from '../../../actions/types';

export default (state = null, action) => {
  const { type, resourceType, resource, profile } = action;
  const newState = { ...state };

  switch (type) {
    case actionTypes.RESOURCE.RECEIVED:
      if (resourceType === 'profile') return resource;

      return newState;

    case actionTypes.UPDATE_PROFILE:
      return { ...newState, ...profile };

    case actionTypes.DELETE_PROFILE:
      if (state && state.email) return { email: state.email };

      return {};

    default:
      return state;
  }
};

// #region PUBLIC SELECTORS
export function avatarUrl(state) {
  if (!state || !state.emailHash) return undefined;

  return `https://secure.gravatar.com/avatar/${state.emailHash}?d=mm&s=55`;
}
// #endregion PUBLIC SELECTORS
