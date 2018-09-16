import { combineReducers } from 'redux';
import actionTypes from '../../actions/types';

const enhancedProfile = profile => {
  if (!profile) return null;

  const avatarUrl = `https://secure.gravatar.com/avatar/${
    profile.emailHash
  }?d=mm&s=55`;

  return { ...profile, avatarUrl };
};

const profile = (state = null, action) => {
  // console.log('session action: ', action);

  switch (action.type) {
    case actionTypes.PROFILE.RECEIVED:
      return enhancedProfile(action.profile);

    default:
      return state;
  }
};

const themeName = (state = 'dark', action) => {
  // console.log('session action: ', action);

  switch (action.type) {
    case actionTypes.SET_THEME:
      return action.themeName;

    default:
      return state;
  }
};

export default combineReducers({
  profile,
  themeName,
});

// PUBLIC SELECTORS
export function haveProfile(state) {
  return !!(state && state.profile);
}
