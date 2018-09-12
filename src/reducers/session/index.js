import actionTypes from '../../actions/types';

export default (state = { themeName: 'dark' }, action) => {
  switch (action.type) {
    case actionTypes.PROFILE_LOADED:
      return { ...state, ...action.profile };

    case actionTypes.SET_THEME:
      return { ...state, themeName: action.themeName };

    default:
      return state;
  }
};
