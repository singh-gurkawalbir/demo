// Updates an entity cache in response to any action with response.data.
export default (state = {}, action) => {
  if (action.data) {
    // console.log('data action: ', action, state);

    return { ...state, ...action.data };
  }

  return state;
};

// PUBLIC SELECTORS
const getConnectionMap = connections => {
  if (!connections) return {};

  const cMap = {};

  // convert conn array to hash keyed from conn id.
  // lets join exports and connection into hybrid obj.
  connections.map(c => (cMap[c._id] = c));

  return cMap;
};

export function resourceList(state, { name, take, keyword }) {
  // console.log('selector args', state, name, take, keyword);

  if (!name || typeof name !== 'string') {
    return [];
  }

  const resources = state[name];

  if (!resources) return [];

  const cMap = getConnectionMap(state.connections);
  const filledResources = resources.map(r => {
    const copy = Object.assign({}, r);

    if (r._connectionId) {
      copy.connection = Object.assign({}, cMap[r._connectionId]);
    }

    return copy;
  });
  const matchTest = r => {
    if (!keyword) return true;

    let searchableText = `${r._id}|${r.name}|${r.description}`;

    if (r.connection) {
      searchableText += `|${r.conection.name}|${r.connection.type}`;
    }

    return searchableText.toUpperCase().indexOf(keyword.toUpperCase()) >= 0;
  };

  const filteredData = filledResources.filter(matchTest);
  const pageData = filteredData.slice(0, take || 1);

  if (!pageData) return [];

  return pageData;
}

export function haveData(state, resourceName) {
  return !!(state && state[resourceName]);
}
