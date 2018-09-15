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

// PUBLIC SELECTORS
// Following this pattern:
// https://hackernoon.com/selector-pattern-painless-redux-store-destructuring-bfc26b72b9ae
const getConnectionMap = connections => {
  if (!connections) return {};

  const cMap = {};

  // convert conn array to hash keyed from conn id.
  // lets join exports and connection into hybrid obj.
  connections.map(c => (cMap[c._id] = c));

  return cMap;
};

export function exportDetails({ exports, connections }) {
  if (!exports || !connections) {
    return [];
  }

  const cMap = getConnectionMap(connections);
  const rowData = exports.map(e => {
    const c = cMap[e._connectionId];

    return {
      id: e._id,
      heading: (e.name || e._id) + (e.type ? ` (${e.type} export)` : ''),
      type: e.type,
      lastModified: e.lastModified,
      searchableText: `${e.id}|${e.name}|${c.name}|${c.assistant}|${c.type}`,
      application: (c.assistant || c.type).toUpperCase(),
      connection: {
        type: c.type,
        id: c._id,
        name: c.name || c._id,
      },
    };
  });

  return rowData;
}

export function importDetails({ imports, connections }) {
  if (!imports || !connections) {
    return [];
  }

  const cMap = getConnectionMap(connections);
  const rowData = imports.map(e => {
    const c = cMap[e._connectionId] || {};

    // TODO: some imports or exports don't have connections.
    return {
      id: e._id,
      heading: e.name || e._id,
      type: e.type,
      lastModified: e.lastModified,
      searchableText: `${e.id}|${e.name}|${c.name}|${c.assistant}|${c.type}`,
      application: (c.assistant || c.type || '').toUpperCase(),
      connection: {
        type: c.type,
        id: c._id,
        name: c.name || c._id || '',
      },
    };
  });

  return rowData;
}
