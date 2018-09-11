import actionTypes from './types';

// These are redux action "creators". actions are reusable by any
// component and as such we want creators to ensure all actions of
// a type are symetrical in shape.

// This file is for common actions at the application level, we should
// keep feature actions (limited scope) as siblings of the respective
// feature.
const profileLoaded = profile => ({
  type: actionTypes.PROFILE_LOADED,
  profile,
});
const setTheme = themeName => ({
  type: actionTypes.SET_THEME,
  themeName,
});

export default {
  profileLoaded,
  setTheme,
};
