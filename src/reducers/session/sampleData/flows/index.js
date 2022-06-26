import produce from 'immer';
import { createSelector } from 'reselect';
import actionTypes from '../../../../actions/types';
import { getSampleDataStage } from '../../../../utils/flowData';
import { isPageGeneratorResource } from '../../../../utils/flows';
import { clearInvalidPgOrPpStates, clearInvalidStagesForPgOrPp, getFirstOutOfOrderIndex } from './utils';
import { buildExtractsTree } from '../../../../utils/mapping';

const getResource = (flow, resourceId, previewType) => {
  let resource = 'pageProcessorsMap';

  if (isPageGeneratorResource(flow, resourceId)) {
    resource = 'pageGeneratorsMap';
  } else if (previewType === 'router') {
    resource = 'routersMap';
  }

  return resource;
};

export default function (state = {}, action) {
  const {
    type,
    flowId,
    resourceId,
    resourceIndex,
    flow = {},
    updatedFlow = {},
    responseMapping,
    previewData,
    previewType,
    processor,
    processedData,
    stage,
    stages,
    error,
    statusToUpdate,
  } = action;

  return produce(state, draft => {
    switch (type) {
      case actionTypes.FLOW_DATA.INIT: {
        const { pageGenerators = [], pageProcessors = [], _id, refresh, formKey } = flow;

        if (!_id) {
          break;
        }
        if (!draft[_id]) {
          draft[_id] = { pageGeneratorsMap: {}, pageProcessorsMap: {}, routersMap: {} };
        }

        draft[_id] = { ...draft[_id], pageGenerators, pageProcessors, refresh, formKey };

        break;
      }

      case actionTypes.FLOW_DATA.STAGE_REQUEST: {
        if (!resourceId || !flowId || !stage) return;
        const resourceMap = draft[flowId]?.[getResource(draft[flowId], resourceId, stage)] || {};

        resourceMap[resourceId] = {
          ...resourceMap[resourceId],
        };
        resourceMap[resourceId][stage] = {
          ...resourceMap[resourceId][stage],
          status: 'requested',
        };
        break;
      }
      case actionTypes.FLOW_DATA.SET_STATUS_RECEIVED: {
        if (!flowId || !resourceId || !previewType) return;
        const resourceMap = draft[flowId]?.[getResource(draft[flowId], resourceId, previewType)] || {};
        const stage = previewType;

        if (resourceMap?.[resourceId]?.[stage]) {
          resourceMap[resourceId][stage].status = 'received';
        }
        break;
      }
      case actionTypes.FLOW_DATA.PREVIEW_DATA_RECEIVED: {
        if (!flowId || !resourceId || !previewType) return;
        const resourceMap = draft[flowId]?.[getResource(draft[flowId], resourceId, previewType)] || {};
        const stage = previewType;

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

      case actionTypes.FLOW_DATA.PROCESSOR_DATA_RECEIVED: {
        if (!flowId || !resourceId || !processor) break;
        const { data: receivedData } = processedData || {};
        const resourceMap =
          (draft[flowId] &&
            draft[flowId][
              isPageGeneratorResource(draft[flowId], resourceId)
                ? 'pageGeneratorsMap'
                : 'pageProcessorsMap'
            ]) ||
          {};

        resourceMap[resourceId] = {
          ...resourceMap[resourceId],
        };
        resourceMap[resourceId][processor] = {
          ...resourceMap[resourceId][processor],
        };
        resourceMap[resourceId][processor].status = 'received';

        // Incase of hooks data is nested inside 'data'
        if (receivedData) {
          resourceMap[resourceId][processor].data = Array.isArray(receivedData)
            ? receivedData[0]
            : receivedData.data && receivedData.data[0];
        } else {
          resourceMap[resourceId][processor].data = undefined;
        }

        break;
      }

      case actionTypes.FLOW_DATA.RECEIVED_ERROR: {
        if (!flowId || !resourceId || !stage) break;
        const resourceMap = draft[flowId]?.[getResource(draft[flowId], resourceId, stage)] || {};

        if (!resourceMap[resourceId]) {
          resourceMap[resourceId] = {};
        }
        if (!resourceMap[resourceId][stage]) {
          resourceMap[resourceId][stage] = {};
        }
        resourceMap[resourceId][stage].status = 'error';
        resourceMap[resourceId][stage].error = error;
        break;
      }

      case actionTypes.FLOW_DATA.FLOW_RESPONSE_MAPPING_UPDATE: {
        const flow = draft[flowId];
        const resource = flow && flow.pageProcessors[resourceIndex];

        if (resource) {
          resource.responseMapping = responseMapping;
        }

        break;
      }

      case actionTypes.FLOW_DATA.RESET_STAGES: {
        const flow = draft[flowId];

        if (!flow) break;
        // Fetch first occurence of resourceId usage in flow
        const pageGeneratorIndexToReset = flow.pageGenerators.findIndex(
          pg => pg._exportId === resourceId
        );

        // given a resourceId -- resets itself and  all linked pps or pgs after that
        if (pageGeneratorIndexToReset > -1) {
          if (!stages.length) {
            clearInvalidPgOrPpStates(flow, pageGeneratorIndexToReset, true);
          } else {
            // at this index, reset resource for all the passed stages
            clearInvalidStagesForPgOrPp(flow, pageGeneratorIndexToReset, stages, statusToUpdate, true);
            // then pass index+1 to reset everything
            clearInvalidPgOrPpStates(flow, pageGeneratorIndexToReset + 1, true);
          }

          break;
        }

        let pageProcessorIndexToReset;
        let routerIndex;
        let branchIndex;

        if (flow?.routers?.length) {
          flow.routers.forEach((router, rIndex) => {
            (router.branches || []).forEach((branch, bIndex) => {
              const ppIndex = branch.pageProcessors.findIndex(
                pp => pp._exportId === resourceId || pp._importId === resourceId
              );

              if (ppIndex > -1) {
                pageProcessorIndexToReset = ppIndex;
                routerIndex = rIndex;
                branchIndex = bIndex;
              }
            });
          });
        } else {
          pageProcessorIndexToReset = flow.pageProcessors.findIndex(
            pp => pp._exportId === resourceId || pp._importId === resourceId
          );
        }

        if (pageProcessorIndexToReset > -1) {
          if (!stages.length) {
            clearInvalidPgOrPpStates(flow, pageProcessorIndexToReset, false, {routerIndex, branchIndex});
          } else {
            // at this index, reset resource for all the passed stages
            clearInvalidStagesForPgOrPp(flow, pageProcessorIndexToReset, stages, statusToUpdate, false, {routerIndex, branchIndex});
            // then pass index+1 to reset everything for other resources
            clearInvalidPgOrPpStates(flow, pageProcessorIndexToReset + 1, false, {routerIndex, branchIndex});
          }
        }

        if (flow.routers?.length && flow.routers.find(r => r.id === resourceId)) {
          clearInvalidPgOrPpStates(flow, 0, false, {routerIndex: flow.routers.findIndex(r => r.id === resourceId), branchIndex: 0});
        }

        break;
      }

      case actionTypes.FLOW_DATA.FLOW_SEQUENCE_RESET: {
        const currentFlow = draft[flowId];

        if (!currentFlow) break;

        const { pageGenerators, pageProcessors } = currentFlow;
        const {
          pageGenerators: updatedPageGenerators = [],
          pageProcessors: updatedPageProcessors = [],
        } = updatedFlow;
        // get first change in sequence of pgs
        const updatedPgIndex = getFirstOutOfOrderIndex(pageGenerators, updatedPageGenerators);
        // get first change in sequence of pgs
        const updatedPpIndex = getFirstOutOfOrderIndex(pageProcessors, updatedPageProcessors);

        // update sequence
        currentFlow.pageGenerators = updatedPageGenerators;
        currentFlow.pageProcessors = updatedPageProcessors;

        // reset all pg data stages starting from index
        if (updatedPgIndex > -1) {
          clearInvalidPgOrPpStates(currentFlow, updatedPgIndex, true);
          break;
        }

        // reset all pp data stages starting from index
        if (updatedPpIndex > -1) {
          clearInvalidPgOrPpStates(currentFlow, updatedPpIndex);
        }

        break;
      }

      default:
    }
  });
}

const DEFAULT_VALUE = {};

export const selectors = {};

selectors.getFlowDataState = (state, flowId, resourceId, stage) => {
  if (!state || !flowId) return;
  const flow = state[flowId];

  // Returns flow state
  if (!resourceId) return flow;
  // Returns PP/PG's state

  const resourceMap = flow[getResource(flow, resourceId, stage)] || {};

  return resourceMap[resourceId] || DEFAULT_VALUE;
};

selectors.getSampleDataContext = createSelector(
  (state, {flowId}) => state?.[flowId],
  (state, {resourceId}) => resourceId,
  (state, {resourceType }) => resourceType,
  (state, { stage }) => stage,
  (flow, resourceId, resourceType, stage) => {
    // returns input data for that stage to populate
    const sampleDataStage = getSampleDataStage(stage, resourceType);

    if (!flow || !sampleDataStage || !resourceId) return DEFAULT_VALUE;
    const resourceMap = flow[getResource(flow, resourceId, stage)] || {};
    const flowStageContext = resourceMap?.[resourceId]?.[sampleDataStage];

    return flowStageContext || DEFAULT_VALUE;
  });

// get mapper2 tree structure for extracts
// from flow sample data
selectors.mkBuildExtractsTree = () => createSelector(
  (state, {flowId, resourceId}) => {
    const flowData = selectors.getSampleDataContext(state, {
      flowId,
      resourceId,
      stage: 'importMappingExtract',
      resourceType: 'imports',
    }).data;

    return flowData;
  },
  (state, {selectedValues}) => selectedValues,
  (flowData, selectedValues) => buildExtractsTree(flowData, selectedValues)
);
