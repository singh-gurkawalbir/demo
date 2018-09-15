import actionTypes from './types';

// These are redux action "creators". Actions are reusable by any
// component and as such we want creators to ensure all actions of
// a type are symetrical in shape.

// This file is for common actions at the application level, we could
// keep feature actions (limited scope) as sibling files of the respective
// feature.
const requestResource = name => ({
  type: `${name.toUpperCase()}_REQUEST`,
});
const receivedResource = (name, resource) => ({
  type: `${name.toUpperCase()}_RECEIVED`,
  resource,
});
const profileRequest = () => ({
  type: actionTypes.PROFILE_REQUEST,
});
const profileReceived = profile => ({
  type: actionTypes.PROFILE_RECEIVED,
  profile,
});
const setTheme = themeName => ({
  type: actionTypes.SET_THEME,
  themeName,
});

export default {
  requestResource,
  receivedResource,
  profileRequest,
  profileReceived,
  setTheme,
};
