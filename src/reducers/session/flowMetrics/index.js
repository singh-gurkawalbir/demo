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
  const { type, resourceId, response, startDate, endDate } = action;

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
      case actionTypes.FLOW_METRICS.UPDATE_LAST_RUN_RANGE:
        if (!draft[resourceId]) {
          draft[resourceId] = {};
        }
        draft[resourceId].lastRun = {
          startDate,
          endDate,
        };
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
const AUTO_PILOT = ['autopilot', 'auto'];

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
  (_1, _2, _3, attribute) => attribute,
  (_1, _2, _3, _4, resources) => resources,
  (data, resourceType, resourceId, attribute, resources = emptyList) => {
    const flowData = {};
    const RESOURCE_ID_VAR = resourceType === 'integrations' ? '_integrationId' : '_flowId';
    const RESOURCE_NAME_VAR = resourceType === 'integrations' ? 'flowId' : 'resourceId';

    if (Array.isArray(data)) {
      if (attribute === LINE_GRAPH_TYPES.RESOLVED) {
        RESOLVED_GRAPH_DATAPOINTS.forEach(user => {
          flowData[user] = data.filter(d => ((AUTO_PILOT.includes(user) ? AUTO_PILOT.includes(d.by) : !AUTO_PILOT.includes(d.by)) && d.attribute === LINE_GRAPH_TYPE_SHORTID[LINE_GRAPH_TYPES.RESOLVED]));
          flowData[user] = sortBy(flowData[user], ['timeInMills']);
        });
      } else {
        resources.forEach(r => {
          flowData[r] = data.filter(d => (r === resourceId ? d[RESOURCE_NAME_VAR] === RESOURCE_ID_VAR : d[RESOURCE_NAME_VAR] === r) && d.attribute === LINE_GRAPH_TYPE_SHORTID[attribute]);
          flowData[r] = sortBy(flowData[r], ['timeInMills']);
        });
      }
    }

    return flowData || emptyObject;
  }
);

// #endregion
