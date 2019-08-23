import actionTypes from '../../../actions/types';

export default (state = {}, action) => {
  const { type, data, resourceId } = action;
  const newState = { ...state };

  switch (type) {
    case actionTypes.SAMPLEDATA.RECEIVED:
      return { ...newState, [resourceId]: data };

    default:
      return state;
  }
};

export function fetchData(state, resourceId) {
  return state[resourceId];
}
