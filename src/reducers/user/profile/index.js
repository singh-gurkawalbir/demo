import actionTypes from '../../../actions/types';

export default (state = null, action) => {
  if (
    action.type === actionTypes.RESOURCE.RECEIVED &&
    action.resourceType === 'profile'
  ) {
    const newState = { ...state, ...action.resource };

    return newState;
  }

  if (action.type === actionTypes.DELETE_PROFILE) {
    // Except for email delete everything

    if (!state || !state.email) return {};

    return { email: state.email };
  }

  return state;
};

// #region PUBLIC SELECTORS
export function avatarUrl(state) {
  if (!state || !state.emailHash) return undefined;

  return `https://secure.gravatar.com/avatar/${state.emailHash}?d=mm&s=55`;
}
// #endregion PUBLIC SELECTORS
