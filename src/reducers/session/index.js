import actionTypes from '../../actions/types';

const enhancedProfile = profile => {
  if (!profile) return null;

  const avatarUrl = `https://secure.gravatar.com/avatar/${
    profile.emailHash
  }?d=mm&s=55`;

  return { ...profile, avatarUrl };
};

export default (state = { themeName: 'dark' }, action) => {
  // console.log('session action: ', action);

  switch (action.type) {
    case actionTypes.PROFILE_RECEIVED:
      return { ...state, ...enhancedProfile(action.profile) };

    case actionTypes.SET_THEME:
      return { ...state, themeName: action.themeName };

    default:
      return state;
  }
};
