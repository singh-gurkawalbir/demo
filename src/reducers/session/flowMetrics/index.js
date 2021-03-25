import produce from 'immer';
import sortBy from 'lodash/sortBy';
import { createSelector } from 'reselect';
import {COMM_STATES } from '../../comms/networkComms';
import actionTypes from '../../../actions/types';
import { emptyList, emptyObject, LINE_GRAPH_TYPES, LINE_GRAPH_TYPE_SHORTID, RESOLVED_GRAPH_DATAPOINTS } from '../../../utils/constants';

function updateStatus(draft, flowId, status) {
  if (!draft[flowId]) {
    draft[flowId] = {};
  }

  draft[flowId].status = status;
}

export default (state = {}, action) => {
  const { type, resourceId, response } = action;

  if (!resourceId) { return state; }

  return produce(state, draft => {
    switch (type) {
      case actionTypes.FLOW_METRICS.REQUEST:
        updateStatus(draft, resourceId, COMM_STATES.LOADING);
        break;
      case actionTypes.FLOW_METRICS.RECEIVED:
        updateStatus(draft, resourceId, COMM_STATES.SUCCESS);
        draft[resourceId].data = response;
        break;
      case actionTypes.FLOW_METRICS.FAILED:
        updateStatus(draft, resourceId, COMM_STATES.ERROR);
        break;

      case actionTypes.FLOW_METRICS.CLEAR:
        delete draft[resourceId];
        break;
      default:
    }
  });
};

// #region PUBLIC SELECTORS
export const selectors = {};
const AUTO_PILOT = 'autopilot';

selectors.flowMetricsData = createSelector(
  state => state,
  (_, resourceId) => resourceId,
  (state, resourceId) => {
    if (!state || !resourceId || !state[resourceId]) {
      return null;
    }

    return state[resourceId];
  });

selectors.mkLineGraphData = () => createSelector(
  (state, _, resourceId) => state?.[resourceId]?.data,
  (_, resourceType) => resourceType,
  (_1, _2, resourceId) => resourceId,
  (_1, _2, _3, id) => id,
  (_1, _2, _3, _4, resources) => resources,
  (data, resourceType, resourceId, id, resources = emptyList) => {
    const flowData = {};
    const RESOURCE_ID_VAR = resourceType === 'integrations' ? '_integrationId' : '_flowId';
    const RESOURCE_NAME_VAR = resourceType === 'integrations' ? 'flowId' : 'resourceId';

    if (Array.isArray(data)) {
      if (id === LINE_GRAPH_TYPES.RESOLVED) {
        RESOLVED_GRAPH_DATAPOINTS.forEach(user => {
          flowData[user] = data.filter(d => ((user === AUTO_PILOT ? d.by === AUTO_PILOT : d.by !== AUTO_PILOT) && d.attribute === LINE_GRAPH_TYPE_SHORTID[LINE_GRAPH_TYPES.RESOLVED]));
          flowData[user] = sortBy(flowData[user], ['timeInMills']);
        });
      } else {
        resources.forEach(r => {
          flowData[r] = data.filter(d => (r === resourceId ? d[RESOURCE_NAME_VAR] === RESOURCE_ID_VAR : d[RESOURCE_NAME_VAR] === r) && d.attribute === LINE_GRAPH_TYPE_SHORTID[id]);
          flowData[r] = sortBy(flowData[r], ['timeInMills']);
        });
      }
    }

    return flowData || emptyObject;
  }
);

// #endregion
