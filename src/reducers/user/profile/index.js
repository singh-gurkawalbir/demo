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

    case actionTypes.UNLINKED_WITH_GOOGLE:
      return { ...newState, auth_type_google: {} };

    case actionTypes.DELETE_PROFILE:
      if (state && state.email) {
        return {
          email: state.email,
          auth_type_google: state.auth_type_google,
          authTypeSSO: state.authTypeSSO || null,
        };
      }

      return {};

    default:
      return state;
  }
};

// #region PUBLIC SELECTORS
export const selectors = {};

selectors.avatarUrl = state => {
  if (!state || !state.emailHash) return undefined;

  return `https://secure.gravatar.com/avatar/${state.emailHash}?d=${process.env.CDN_BASE_URI}images/icons/icon-user-default.png&s=55`;
};
// #endregion PUBLIC SELECTORS

selectors.isUserInErrMgtTwoDotZero = state => !!(state && state.useErrMgtTwoDotZero);
