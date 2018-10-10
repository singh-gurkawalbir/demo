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
  const result = {
    resources: [],
    total: 0,
    filtered: 0,
    count: 0,
  };
  // console.log('selector args', state, name, take, keyword);

  if (!state || !name || typeof name !== 'string') {
    return result;
  }

  const resources = state[name];

  if (!resources) return result;

  result.total = resources.length;
  result.count = resources.length;

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
      searchableText += `|${r.connection.name}|${r.connection.type}`;
    }

    return searchableText.toUpperCase().indexOf(keyword.toUpperCase()) >= 0;
  };

  const filteredData = filledResources.filter(matchTest);

  result.filtered = filteredData.length;
  result.resources = filteredData;

  if (!take || typeof take !== 'number') {
    return result;
  }

  const finalResources = filteredData.slice(0, take);

  return {
    ...result,
    resources: finalResources,
    count: finalResources.length,
  };
}

export function hasData(state, resourceType) {
  return !!(state && state[resourceType]);
}
