export default (state = {}, action) => {
  switch (action.type) {
    case 'exports-loaded':
      return { ...state, exports: action.exports };

    case 'imports-loaded':
      return { ...state, imports: action.imports };

    case 'connections-loaded':
      return { ...state, connections: action.connections };

    default:
      return state;
  }
};
