import produce from 'immer';
import actionTypes from '../../../actions/types';
import getImageUrl from '../../../utils/image';

export default (state = {}, action) => {
  const { type, resourceType, resource, profile } = action;

  return produce(state, draft => {
    switch (type) {
      case actionTypes.RESOURCE.RECEIVED:
        if (resourceType === 'profile') return resource;

        break;

      case actionTypes.USER.PROFILE.UPDATE:
        return { ...draft, ...profile };

      case actionTypes.USER.PROFILE.UNLINKED_WITH_GOOGLE:
        draft.auth_type_google = {};
        break;

      case actionTypes.USER.PROFILE.DELETE:
        if (draft.email) {
          return {
            email: draft.email,
            auth_type_google: draft.auth_type_google,
            authTypeSSO: draft.authTypeSSO,
          };
        }

        return {};

      default:
    }
  });
};

// #region PUBLIC SELECTORS
export const selectors = {};

selectors.avatarUrl = state => {
  if (!state || !state.emailHash) return undefined;

  return `https://secure.gravatar.com/avatar/${state.emailHash}?d=${getImageUrl('images/icons/icon-user-default.png&s=55')}`;
};

selectors.isUserInErrMgtTwoDotZero = state => !!(state && state.useErrMgtTwoDotZero);
selectors.isFlowBranchingEnabled = state => !state?.disableFlowBranching;
selectors.userAgreedTOSAndPP = state => state?.agreeTOSAndPP === true;

// #endregion PUBLIC SELECTORS
