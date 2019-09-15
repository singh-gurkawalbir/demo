import produce from 'immer';
import actionTypes from '../../../actions/types';

export const initializationResources = ['profile', 'preferences'];
const accountResources = ['ashares', 'shared/ashares', 'licenses'];
const resourceTypesToIgnore = [
  ...initializationResources,
  ...accountResources,
  'audit',
  'accesstokens',
];

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

  const newCollection = [
    ...collection.slice(0, index),
    resource,
    ...collection.slice(index + 1),
  ];

  return { ...state, [type]: newCollection };
}

function getIntegrationAppsNextState(state, action) {
  const { stepsToUpdate, id, type } = action;

  return produce(state, draft => {
    const integration = draft.integrations.find(i => i._id === id);

    if (!integration || !integration.install) {
      return;
    }

    // eslint-disable-next-line default-case
    switch (type) {
      case actionTypes.INTEGRATION_APPS.INSTALLER.INSTALL_STEP.DONE:
        integration.install = stepsToUpdate;
        break;
    }
  });
}

export default (state = {}, action) => {
  const { id, type, resource, collection, resourceType } = action;

  // Some resources are managed by custom reducers.
  // Lets skip those for this generic implementation
  if (resourceTypesToIgnore.find(t => t === resourceType)) {
    return state;
  }

  // skip integrations/:_integrationId/ashares
  // skip integrations/:_integrationId/audit
  if (
    resourceType &&
    resourceType.startsWith('integrations/') &&
    (resourceType.endsWith('/ashares') || resourceType.endsWith('/audit'))
  ) {
    return state;
  }

  // skip all SuiteScript unification resources
  if (resourceType && resourceType.startsWith('suitescript/connections/')) {
    return state;
  }

  let resourceIndex;
  let newState;

  switch (type) {
    case actionTypes.RESOURCE.RECEIVED_COLLECTION:
      return { ...state, [resourceType]: collection || [] };

    case actionTypes.RESOURCE.RECEIVED:
      return replaceOrInsertResource(state, resourceType, resource);
    case actionTypes.RESOURCE.DELETED:
      return {
        ...state,
        [resourceType]: state[resourceType].filter(r => r._id !== id),
      };
    case actionTypes.INTEGRATION_APPS.INSTALLER.INSTALL_STEP.DONE:
      return getIntegrationAppsNextState(state, action);
    case actionTypes.STACK.USER_SHARING_TOGGLED:
      resourceIndex = state.sshares.findIndex(user => user._id === id);

      if (resourceIndex > -1) {
        newState = [
          ...state.sshares.slice(0, resourceIndex),
          {
            ...state.sshares[resourceIndex],
            disabled: !state.sshares[resourceIndex].disabled,
          },
          ...state.sshares.slice(resourceIndex + 1),
        ];

        newState = { ...state, sshares: newState };

        return newState;
      }

      return state;
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

export function integrationInstallSteps(state, id) {
  const integration = resource(state, 'integrations', id);

  if (!integration || !integration.install) {
    return [];
  }

  return produce(integration.install, draft => {
    if (draft.find(step => !step.completed)) {
      draft.find(step => !step.completed).isCurrentStep = true;
    }
  });
}

export function integrationAppSettings(state, id) {
  const integration = resource(state, 'integrations', id);

  if (!integration) {
    return {};
  }

  return produce(integration, draft => {
    if (draft.settings.general) {
      draft.hasGeneralSettings = true;
    }

    draft.stores = draft.settings.sections.map(s => ({
      label: s.title,
      value: s.id,
    }));
  });
}

export function defaultStoreId(state, id) {
  const settings = integrationAppSettings(state, id);

  if (settings.stores && settings.stores.length) {
    return settings.stores[0].value;
  }

  return undefined;
}

export function resourceList(state, { type, take, keyword, sort, sandbox }) {
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
  const filterByEnvironment = typeof sandbox === 'boolean';
  const matchTest = r => {
    if (filterByEnvironment && !!r.sandbox !== sandbox) {
      return false;
    }

    if (!keyword) return true;

    const searchableText = `${r._id}|${r.name}|${r.description}`;

    return searchableText.toUpperCase().indexOf(keyword.toUpperCase()) >= 0;
  };

  function desc(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }

    if (b[orderBy] > a[orderBy]) {
      return 1;
    }

    return 0;
  }

  const comparer = ({ order, orderBy }) =>
    order === 'desc'
      ? (a, b) => desc(a, b, orderBy)
      : (a, b) => -desc(a, b, orderBy);
  // console.log('sort:', sort, resources.sort(comparer, sort));
  const sorted = sort ? resources.sort(comparer(sort)) : resources;
  const filtered = sorted.filter(matchTest);

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

export function resourceDetailsMap(state) {
  const allResources = {};

  if (!state) {
    return allResources;
  }

  Object.keys(state).forEach(resourceType => {
    if (!['published', 'tiles'].includes(resourceType)) {
      allResources[resourceType] = {};

      if (state[resourceType] && state[resourceType].length) {
        state[resourceType].forEach(resource => {
          allResources[resourceType][resource._id] = {
            name: resource.name,
          };

          if (resource._integrationId) {
            allResources[resourceType][resource._id]._integrationId =
              resource._integrationId;
          }

          if (resource._connectorId) {
            allResources[resourceType][resource._id]._connectorId =
              resource._connectorId;
          }

          if (resourceType === 'flows') {
            allResources[resourceType][
              resource._id
            ].numImports = resource.pageProcessors
              ? resource.pageProcessors.length
              : 1;
          }
        });
      }
    }
  });

  return allResources;
}

export function isAgentOnline(state, agentId) {
  if (!state) return false;
  const matchingAgent =
    state.agents && state.agents.find(r => r._id === agentId);

  return !!(
    matchingAgent &&
    matchingAgent.lastHeartbeatAt &&
    new Date().getTime() - matchingAgent.lastHeartbeatAt.getTime() <=
      process.env.AGENT_STATUS_INTERVAL
  );
}
// #endregion
