import produce from 'immer';
import _ from 'lodash';
import actionTypes from '../../../../actions/types';

const dependencies = {
  inputFilter: 'input',
  outputFilter: 'input',
  transform: 'raw',
  hooks: 'transform',
};

function reset(flow, index, isPageGenerator) {
  if (isPageGenerator) {
    const pgsToReset = flow.pageGenerators.slice(index).map(pg => pg._exportId);
    const pgIds = _.keys(flow.pageGeneratorsMap);

    pgIds.forEach(pgId => {
      // eslint-disable-next-line no-param-reassign
      if (pgsToReset.includes(pgId)) flow.pageGeneratorsMap[pgId] = {};
    });

    // eslint-disable-next-line no-param-reassign
    flow.pageProcessorsMap = {};
  } else {
    const ppsToReset = flow.pageProcessors
      .slice(index)
      .map(pp => pp._exportId || pp._importId);
    const ppIds = _.keys(flow.pageProcessorsMap);

    ppIds.forEach(ppId => {
      // eslint-disable-next-line no-param-reassign
      if (ppsToReset.includes(ppId)) flow.pageProcessorsMap[ppId] = {};
    });
  }
}

export default function(state = {}, action) {
  const {
    type,
    flowId,
    resourceId,
    flow = {},
    previewData,
    previewType,
    processor,
    processedData,
    isPageGenerator,
  } = action;

  return produce(state, draft => {
    switch (type) {
      case actionTypes.FLOW_DATA.INIT: {
        const { pageGenerators = [], pageProcessors = [], _id } = flow;

        if (!draft[_id]) {
          draft[_id] = { pageGeneratorsMap: {}, pageProcessorsMap: {} };
        }

        draft[_id] = { ...draft[_id], pageGenerators, pageProcessors };

        break;
      }

      case actionTypes.FLOW_DATA.REQUEST_PREVIEW: {
        if (!resourceId) return;
        const resourceMap =
          draft[flowId][
            isPageGenerator ? 'pageGeneratorsMap' : 'pageProcessorsMap'
          ] || {};
        const stage = previewType || 'raw';

        resourceMap[resourceId] = {
          ...resourceMap[resourceId],
        };
        resourceMap[resourceId][stage] = {
          ...resourceMap[resourceId][stage],
          status: 'requested',
        };

        break;
      }

      case actionTypes.FLOW_DATA.RECEIVED_PREVIEW: {
        if (!resourceId) return;
        const resourceMap =
          draft[flowId][
            isPageGenerator ? 'pageGeneratorsMap' : 'pageProcessorsMap'
          ] || {};
        const stage = previewType || 'raw';

        resourceMap[resourceId] = {
          ...resourceMap[resourceId],
        };
        resourceMap[resourceId][stage] = {
          ...resourceMap[resourceId][stage],
        };
        resourceMap[resourceId][stage].status = 'received';
        resourceMap[resourceId][stage].data = previewData;

        break;
      }

      case actionTypes.FLOW_DATA.REQUEST_PROCESSOR: {
        const resourceMap =
          draft[flowId][
            isPageGenerator ? 'pageGeneratorsMap' : 'pageProcessorsMap'
          ] || {};

        resourceMap[resourceId] = {
          ...resourceMap[resourceId],
        };
        resourceMap[resourceId][processor] = {
          ...resourceMap[resourceId][processor],
        };
        resourceMap[resourceId][processor].status = 'requested';
        break;
      }

      case actionTypes.FLOW_DATA.RECEIVED_PROCESSOR: {
        const resourceMap =
          draft[flowId][
            isPageGenerator ? 'pageGeneratorsMap' : 'pageProcessorsMap'
          ] || {};

        resourceMap[resourceId] = {
          ...resourceMap[resourceId],
        };
        resourceMap[resourceId][processor] = {
          ...resourceMap[resourceId][processor],
        };
        resourceMap[resourceId][processor].status = 'received';
        resourceMap[resourceId][processor].data =
          processedData && processedData.data && processedData.data[0];
        break;
      }

      case actionTypes.FLOW_DATA.RESET: {
        const flow = draft[flowId];
        // Fetch first occurence of resourceId usage in flow
        const pageGeneratorIndexToReset = flow.pageGenerators.findIndex(
          pg => pg._exportId === resourceId
        );

        if (pageGeneratorIndexToReset > -1) {
          reset(flow, pageGeneratorIndexToReset, true);
          break;
        }

        const pageProcessorIndexToReset = flow.pageProcessors.findIndex(
          pp => pp._exportId === resourceId || pp._importId === resourceId
        );

        if (pageProcessorIndexToReset > -1) {
          reset(flow, pageProcessorIndexToReset);
        }

        // given a resourceId -- resets itself and  all linked pps or pgs after that
        break;
      }

      default:
    }
  });
}

export function getSampleData(
  state,
  flowId,
  resourceId,
  stage,
  isPageGenerator
) {
  // returns input data for that stage to populate
  const flow = state[flowId];

  if (!flow || !dependencies[stage]) return;
  const resourceMap = isPageGenerator
    ? flow.pageGeneratorsMap
    : flow.pageProcessorsMap;

  return (
    resourceMap &&
    resourceMap[resourceId] &&
    resourceMap[resourceId][dependencies[stage]] &&
    resourceMap[resourceId][dependencies[stage]].data
  );
}

export function getFlowReferencesForResource(state, resourceId) {
  // resourceId may be export or an import
  const existingFlows = _.keys(state);
  const dependentFlows = existingFlows.filter(flowId => {
    const { pageGenerators = [], pageProcessors = [] } = state[flowId];

    return (
      pageGenerators.find(pg => pg._exportId === resourceId) ||
      pageProcessors.find(
        pp => pp._exportId === resourceId || pp._importId === resourceId
      )
    );
  });

  return dependentFlows;
}

export function getFlowDataState(state, flowId) {
  if (!state || !flowId) return {};

  return state[flowId];
}
