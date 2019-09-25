import actionTypes from '../../../actions/types';

export default (state = {}, action) => {
  const { type, connectionId, authorized } = action;
  const newState = { ...state };

  switch (type) {
    case actionTypes.CONNECTION.AUTHORIZED:
      if (!newState[connectionId]) newState[connectionId] = {};
      newState[connectionId].authorized = authorized;

      break;

    default:
      return state;
  }
};
