/*
 * This state holds the entire stages of Resource(Export/Import )'s Data flow
 * Involves the data in each and every stage
 */
import actionTypes from '../../../actions/types';

const DEFAULT_VALUE = undefined;

function extractStages(sampleData) {
  const stagesInSampleData = sampleData.stages || [];
  const stageMap = {};

  stagesInSampleData.forEach(stage => {
    switch (stage.name) {
      case 'parse':
        stageMap[stage.name] = stage.data && stage.data[0];
        break;
      case 'transform':
        stageMap[stage.name] =
          stage.data && stage.data[0] && stage.data[0].data;
        break;
      default:
        stageMap[stage.name] = stage.data;
    }
  });

  return stageMap;
}

export default function(state = {}, action) {
  const { type, resourceId, previewData, processedData, stage } = action;

  if (!type || !resourceId) return state;

  switch (type) {
    case actionTypes.SAMPLEDATA.REQUEST: {
      return {
        ...state,
        [resourceId]: {
          ...state[resourceId],
          status: 'requested',
        },
      };
    }

    case actionTypes.SAMPLEDATA.RECEIVED: {
      const newState = { ...state };

      newState[resourceId] = { ...state[resourceId] };
      newState[resourceId].status = 'received';
      newState[resourceId].data = extractStages(previewData);

      return {
        ...state,
        [resourceId]: newState[resourceId],
      };
    }

    case actionTypes.SAMPLEDATA.UPDATE: {
      const newState = { ...state };

      newState[resourceId] = { ...state[resourceId] };
      newState[resourceId].status = 'updated';
      newState[resourceId].data = {
        ...state[resourceId].data,
      };
      newState[resourceId].data = {
        ...newState[resourceId].data,
        [stage]:
          (processedData.data && processedData.data[0]) ||
          (processedData.records && processedData.records[0]),
      };

      return {
        ...state,
        [resourceId]: newState[resourceId],
      };
    }

    case actionTypes.SAMPLEDATA.RECEIVED_ERROR: {
      return { ...state };
    }

    default:
      return state;
  }
}

function getRawData(resourceData) {
  if (resourceData.raw) return resourceData.raw && resourceData.raw.body;

  if (resourceData.parse) return resourceData.parse;

  return DEFAULT_VALUE;
}

function getSampleData(resourceData) {
  return (
    resourceData.transform ||
    resourceData.parse ||
    (resourceData.raw && resourceData.raw.body) ||
    DEFAULT_VALUE
  );
}

function getTransformData(resourceData) {
  return (
    resourceData.parse ||
    (resourceData.raw && resourceData.raw.body) ||
    DEFAULT_VALUE
  );
}

export function getResourceSampleData(state, resourceId, stage) {
  if (!resourceId) return DEFAULT_VALUE;

  if (!state[resourceId]) return DEFAULT_VALUE;

  const resourceData = state[resourceId].data;

  if (!resourceData) return DEFAULT_VALUE;

  switch (stage) {
    case 'raw':
      return getRawData(resourceData);
    case 'sample':
      return getSampleData(resourceData);
    case 'transform':
      return getTransformData(resourceData);
    default:
      return DEFAULT_VALUE;
  }
}

function getResourceSampleDataStatus(state, resourceId) {
  return state[resourceId] && state[resourceId].status;
}

export function getResourceSampleDataWithStatus(state, resourceId, stage) {
  return {
    data: getResourceSampleData(state, resourceId, stage),
    status: getResourceSampleDataStatus(state, resourceId),
  };
}
