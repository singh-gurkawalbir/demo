/*
import actionTypes from '../../actions/types';

export default (state = {}, action) => {
  const { type, path } = action;
  let newStatus;

  switch (type) {
    case actionTypes.AUTH_REQ:
      newStatus = Object.assign({}, state[path]) || {};
      newStatus.loading = true;
      newStatus.authenticated = false;

      return newStatus;
    case actionTypes.AUTH_SUCCESSFUL:
      newStatus = Object.assign({}, state[path]) || {};
      newStatus.loading = false;
      newStatus.authenticated = true;

      return newStatus;
    case actionTypes.AUTH_FAILURE:
      newStatus = Object.assign({}, state[path]) || {};
      newStatus.loading = false;
      newStatus.authenticated = false;
      newStatus.doneTrying = true;

      return newStatus;
    default:
      return state;
  }
};
*/
