export default (state = {}, action) => {
  // console.log('data action: ', action);

  switch (action.type) {
    case 'EXPORTS_RECEIVED':
      return { ...state, exports: action.resource };

    case 'IMPORTS_RECEIVED':
      return { ...state, imports: action.resource };

    case 'CONNECTIONS_RECEIVED':
      return { ...state, connections: action.resource };

    default:
      return state;
  }
};
