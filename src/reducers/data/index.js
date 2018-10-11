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

export function resourceList(state, { type, take, keyword }) {
  const result = {
    resources: [],
    total: 0,
    filtered: 0,
    count: 0,
  };
  // console.log('selector args', state, name, take, keyword);

  if (!state || !type || typeof type !== 'string') {
    return result;
  }

  const resources = state[type];

  if (!resources) return result;

  result.total = resources.length;
  result.count = resources.length;

  const cMap = getConnectionMap(state.connections);
  const filled = resources.map(r => {
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

  const filtered = filled.filter(matchTest);

  result.filtered = filtered.length;
  result.resources = filtered;

  if (typeof take !== 'number' || take < 1) {
    return result;
  }

  const slice = filtered.slice(0, take);

  return {
    ...result,
    resources: slice,
    count: slice.length,
  };
}

export function hasData(state, resourceType) {
  return !!(state && state[resourceType]);
}
