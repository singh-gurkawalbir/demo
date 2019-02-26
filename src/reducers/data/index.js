import actionTypes from '../../actions/types';

export const intializationResources = ['profile', 'preferences'];
const accountResources = ['ashares', 'shared/ashares', 'licenses'];
const resourceTypesToIgnore = [...intializationResources, ...accountResources];

function replaceOrInsertResource(state, type, resource) {
  // handle case of no collection
  if (!state[type]) {
    return { ...state, [type]: [resource] };
  }

  // if we have a collection, look for a match
  const collection = state[type];
  const index = collection.findIndex(r => r._id === resource._id);

  // insert if not found, replace if found...
  if (index === -1) {
    return { ...state, [type]: [...collection, resource] };
  }

  const newColletion = [
    ...collection.slice(0, index),
    resource,
    ...collection.slice(index + 1),
  ];

  return { ...state, [type]: newColletion };
}

export default (state = {}, action) => {
  const { type, resource, collection, resourceType } = action;

  // Some resources are managed by custom reducers.
  // Lets skip those for this generic implementation
  if (resourceTypesToIgnore.find(t => t === resourceType)) {
    return state;
  }

  switch (type) {
    case actionTypes.RESOURCE.RECEIVED_COLLECTION:
      return { ...state, [resourceType]: collection };

    case actionTypes.RESOURCE.RECEIVED:
      return replaceOrInsertResource(state, resourceType, resource);

    default:
      return state;
  }
};

// #region PUBLIC SELECTORS
export function resource(state, resourceType, id) {
  // console.log('fetch', resourceType, id);

  if (!state || !id || !resourceType) {
    return null;
  }

  const resources = state[resourceType];

  if (!resources) return null;

  const match = resources.find(r => r._id === id);

  if (!match) return null;

  return match;
}

export function resourceList(state, { type, take, keyword }) {
  const result = {
    resources: [],
    type,
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

  const matchTest = r => {
    if (!keyword) return true;

    const searchableText = `${r._id}|${r.name}|${r.description}`;

    return searchableText.toUpperCase().indexOf(keyword.toUpperCase()) >= 0;
  };

  const filtered = resources.filter(matchTest);

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

const processorBlacklist = ['exportDataConverter'];

export function processors(state) {
  const processorMap = state.processors;

  if (!processorMap) return [];

  const list = Object.entries(processorMap).map(i => i[1]);

  return list.filter(p => !processorBlacklist.includes(p.name));
}
// #endregion
