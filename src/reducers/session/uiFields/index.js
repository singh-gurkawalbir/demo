import produce from 'immer';
import actionTypes from '../../../actions/types';
import { UI_FIELDS, fetchUIFields, isNewId, RESOURCES_WITH_UI_FIELDS } from '../../../utils/resource';

export const MAX_FLOW_RESOURCES = 3;

const extractUIFields = (resources = {}) => {
  const flowResources = [...(resources.exports || []), ...(resources.imports || [])];

  return flowResources.reduce((resourceMap, resource) => {
    const { _id } = resource;
    // accumulates all the UI fields from the resource
    const uiFields = UI_FIELDS.reduce((uiFields, field) => ({ ...uiFields, [field]: resource[field] }), {});

    return { ...resourceMap, [_id]: uiFields };
  }, {});
};

export const DEFAULT_STATE = {
  resourceMap: {}, // map of all exports and imports UI fields
  flows: [], // list of flows for which resources are present
};

const reArrangeFlowResources = (draft, flowId) => {
  const { flows = [] } = draft;
  const index = flows.findIndex(flow => flow.id === flowId);

  if (index === -1) {
    if (flows.length === MAX_FLOW_RESOURCES) {
      // removes the first flow from the list
      const { resources = [] } = flows[0];

      resources.forEach(resourceId => {
        // remove the flow resources from the resourceMap
        delete draft.resourceMap[resourceId];
      });
      flows.shift();
    }
  }
};

const updateFlowResources = (draft, flowId, flowResourceMap) => {
  const { flows = [], resourceMap = {} } = draft;
  const flowResourceIds = Object.keys(flowResourceMap);
  const resourceIds = Object.keys(resourceMap);

  const sharedIds = [];
  const newResourceIds = [];

  flowResourceIds.forEach(resourceId => {
    if (resourceIds.includes(resourceId)) {
      // if the resource is already present in the resourceMap
      sharedIds.push(resourceId);
    } else {
      newResourceIds.push(resourceId);
    }
  });
  // sharedIds must be removed from the flow
  sharedIds.forEach(resourceId => {
    // remove from the flow resources
    const index = flows.findIndex(flow => flow.resources?.includes(resourceId));

    if (index !== -1) {
      flows[index].resources = flows[index].resources.filter(id => id !== resourceId);
    }
  });
  // add flowResourceMap to the resourceMap
  draft.resourceMap = { ...resourceMap, ...flowResourceMap };
  // newResourceIds must be added to the passed flowId
  const index = flows.findIndex(flow => flow.id === flowId);
  const obj = { id: flowId, status: 'received', resources: newResourceIds };

  if (index === -1) {
    flows.push(obj);
  } else {
    flows[index] = obj;
  }
};

const pushFlowResources = (draft, flowId, resourceIds) => {
  const { flows = [] } = draft;
  const otherFlows = flows.filter(flow => flow.id !== flowId);
  const flowResourceIds = [];

  resourceIds.forEach(resourceId => {
    const index = otherFlows.findIndex(flow => flow.resources?.includes(resourceId));

    if (index !== -1) {
      // remove the resourceId from other flows as now it is a shared resource
      otherFlows[index].resources = otherFlows[index].resources.filter(id => id !== resourceId);
    } else {
      flowResourceIds.push(resourceId);
    }
  });

  const index = flows.findIndex(flow => flow.id === flowId);

  if (index !== -1) {
  // add the resourceIds to the flow
    flows[index].resources = flowResourceIds;
  }
};

export default function flowResources(state = DEFAULT_STATE, action) {
  const { type, resources, flowId, resourceIds, resource, resourceType } = action;

  return produce(state, draft => {
    switch (type) {
      case actionTypes.UI_FIELDS.FLOW_LEVEL.REQUEST: {
        reArrangeFlowResources(draft, flowId);
        const index = draft.flows.findIndex(flow => flow.id === flowId);
        const newObj = { id: flowId, status: 'requested' };

        if (index === -1) {
          draft.flows.push(newObj);
        } else {
          draft.flows[index] = newObj;
        }
        break;
      }
      case actionTypes.UI_FIELDS.FLOW_LEVEL.RECEIVED: {
        reArrangeFlowResources(draft, flowId);
        const resourceMap = extractUIFields(resources);

        updateFlowResources(draft, flowId, resourceMap);
        break;
      }
      case actionTypes.RESOURCE.RECEIVED: {
        const resourceId = resource?._id;

        // If resourceType is exports or imports with a valid resourceId
        if (resourceId && RESOURCES_WITH_UI_FIELDS.includes(resourceType) && !isNewId(resourceId)) {
          // extract the UI fields from the resource and update the resourceMap
          draft.resourceMap[resourceId] = fetchUIFields(resource);
        }
        break;
      }
      case actionTypes.UI_FIELDS.FLOW_LEVEL.UPDATE_RESOURCES:
        if (flowId && resourceIds) {
          pushFlowResources(draft, flowId, resourceIds);
        }
        break;

      default:
    }
  });
}

export const selectors = {};

selectors.flowResourcesStatus = (state, flowId) => {
  if (!flowId || !state || !state.flows.length) {
    return;
  }
  const index = state.flows.findIndex(flow => flow.id === flowId);

  if (index === -1) return;

  return state.flows[index].status;
};

selectors.resourceUIFields = (state, resourceId) => {
  if (!resourceId || !state || !state.resourceMap) {
    return;
  }

  return state.resourceMap[resourceId];
};

selectors.hasLoadedAllResourceUIFields = (state, resourceIds) => {
  if (!resourceIds || !state || !state.resourceMap) {
    return false;
  }

  return resourceIds.every(resourceId => !!state.resourceMap[resourceId]);
};
