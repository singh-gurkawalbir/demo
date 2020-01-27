import produce from 'immer';
import actionTypes from '../../../../actions/types';
import { getSampleDataStage, reset, compare } from '../../../../utils/flowData';
import { isPageGeneratorResource } from '../../../../utils/flows';

export default function(state = {}, action) {
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
    error,
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

      case actionTypes.FLOW_DATA.STAGE_REQUEST: {
        if (!resourceId || !flowId || !stage) return;
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
        resourceMap[resourceId][stage] = {
          ...resourceMap[resourceId][stage],
          status: 'requested',
        };
        break;
      }

      // TODO: @Raghu Below request actions for preview and processor can be removed
      // as we are now handling request stage using generic stageRequest action above
      case actionTypes.FLOW_DATA.PREVIEW_DATA_REQUEST: {
        if (!resourceId) return;
        const resourceMap =
          (draft[flowId] &&
            draft[flowId][
              isPageGeneratorResource(draft[flowId], resourceId)
                ? 'pageGeneratorsMap'
                : 'pageProcessorsMap'
            ]) ||
          {};
        const stage = previewType;

        resourceMap[resourceId] = {
          ...resourceMap[resourceId],
        };
        resourceMap[resourceId][stage] = {
          ...resourceMap[resourceId][stage],
          status: 'requested',
        };

        break;
      }

      case actionTypes.FLOW_DATA.PREVIEW_DATA_RECEIVED: {
        if (!resourceId) return;
        const resourceMap =
          (draft[flowId] &&
            draft[flowId][
              isPageGeneratorResource(draft[flowId], resourceId)
                ? 'pageGeneratorsMap'
                : 'pageProcessorsMap'
            ]) ||
          {};
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

      case actionTypes.FLOW_DATA.PROCESSOR_DATA_REQUEST: {
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
        resourceMap[resourceId][processor].status = 'requested';
        break;
      }

      case actionTypes.FLOW_DATA.PROCESSOR_DATA_RECEIVED: {
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
        }

        break;
      }

      case actionTypes.FLOW_DATA.RECEIVED_ERROR: {
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
        resourceMap[resourceId][stage] = {
          ...resourceMap[resourceId][stage],
        };
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

      case actionTypes.FLOW_DATA.RESET: {
        const flow = draft[flowId];

        if (!flow) break;
        // Fetch first occurence of resourceId usage in flow
        const pageGeneratorIndexToReset = flow.pageGenerators.findIndex(
          pg => pg._exportId === resourceId
        );

        // given a resourceId -- resets itself and  all linked pps or pgs after that
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

        break;
      }

      case actionTypes.FLOW_DATA.FLOW_SEQUENCE_RESET: {
        const currentFlow = draft[flowId];

        if (!currentFlow) break;

        const { pageGenerators, pageProcessors } = currentFlow;
        const {
          pageGenerators: updatedPageGenerators,
          pageProcessors: updatedPageProcessors,
        } = updatedFlow;
        // get first change in sequence of pgs
        const updatedPgIndex = compare(pageGenerators, updatedPageGenerators);
        // get first change in sequence of pgs
        const updatedPpIndex = compare(pageProcessors, updatedPageProcessors);

        // update sequence
        currentFlow.pageGenerators = updatedPageGenerators;
        currentFlow.pageProcessors = updatedPageProcessors;

        // reset all pg data stages starting from index
        if (updatedPgIndex > -1) {
          reset(currentFlow, updatedPgIndex, true);
          break;
        }

        // reset all pp data stages starting from index
        if (updatedPpIndex > -1) {
          reset(currentFlow, updatedPpIndex);
        }

        break;
      }

      default:
    }
  });
}

const DEFAULT_VALUE = {};

export function getFlowDataState(state, flowId, resourceId) {
  if (!state || !flowId) return;
  const flow = state[flowId];

  // Returns flow state
  if (!resourceId) return flow;
  // Returns PP/PG's state
  const resourceMap = isPageGeneratorResource(flow, resourceId)
    ? flow.pageGeneratorsMap
    : flow.pageProcessorsMap;

  return (resourceMap[resourceId] && resourceMap[resourceId].data) || {};
}

export function getSampleData(
  state,
  { flowId, resourceId, resourceType, stage }
) {
  // returns input data for that stage to populate
  const flow = state[flowId];
  const sampleDataStage = getSampleDataStage(stage, resourceType);

  if (!flow || !sampleDataStage || !resourceId) return;
  const resourceMap = isPageGeneratorResource(flow, resourceId)
    ? flow.pageGeneratorsMap
    : flow.pageProcessorsMap;

  return (
    resourceMap &&
    resourceMap[resourceId] &&
    resourceMap[resourceId][sampleDataStage] &&
    resourceMap[resourceId][sampleDataStage].data
  );
}

export function getSampleDataContext(
  state,
  { flowId, resourceId, resourceType, stage }
) {
  // returns input data for that stage to populate
  const flow = state[flowId];
  const sampleDataStage = getSampleDataStage(stage, resourceType);

  if (!flow || !sampleDataStage || !resourceId) return DEFAULT_VALUE;
  const resourceMap = isPageGeneratorResource(flow, resourceId)
    ? flow.pageGeneratorsMap
    : flow.pageProcessorsMap;
  const flowStageContext =
    resourceMap &&
    resourceMap[resourceId] &&
    resourceMap[resourceId][sampleDataStage];

  return flowStageContext || DEFAULT_VALUE;
}
