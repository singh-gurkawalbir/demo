import actionTypes from '../../actions/types';

export default (state = {}, action) => {
  // console.log('comms action: ', action);

  switch (action.type) {
    case actionTypes.PROFILE_REQUEST:
      return { ...state, profile: { loading: true } };

    case actionTypes.PROFILE_RECEIVED:
      return { ...state, profile: { loading: false } };

    default:
      return state;
  }
};
