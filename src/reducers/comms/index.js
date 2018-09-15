import actionTypes from '../../actions/types';

const initialState = {
  profile: {
    loading: false,
  },
  exports: {
    loading: false,
  },
  imports: {
    loading: false,
  },
  connections: {
    loading: false,
  },
};

export default (state = initialState, action) => {
  // console.log('comms action: ', action);

  switch (action.type) {
    case actionTypes.PROFILE_REQUEST:
      return { ...state, profile: { loading: true } };

    case actionTypes.PROFILE_RECEIVED:
      return { ...state, profile: { loading: false } };

    case 'EXPORTS_REQUEST':
      return { ...state, exports: { loading: true } };

    case 'EXPORTS_RECEIVED':
      return { ...state, exports: { loading: false } };

    case 'IMPORTS_REQUEST':
      return { ...state, imports: { loading: true } };

    case 'IMPORTS_RECEIVED':
      return { ...state, imports: { loading: false } };

    case 'CONNECTIONS_REQUEST':
      return { ...state, connections: { loading: true } };

    case 'CONNECTIONS_RECEIVED':
      return { ...state, connections: { loading: false } };

    default:
      return state;
  }
};
