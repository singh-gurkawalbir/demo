const initialState = {};

export default (state = initialState, action) => {
  if (action.request) {
    // console.log('comms request action: ', action);

    return { ...state, [action.request]: { loading: true } };
  }

  if (action.received) {
    // console.log('comms received action: ', action);

    return { ...state, [action.received]: { loading: false } };
  }

  return state;
};
