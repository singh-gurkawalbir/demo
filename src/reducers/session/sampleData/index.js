/*
 * This state holds the entire stages of Export's Data flow
 * Involves the data in each and every stage
 */
import produce from 'immer';
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
  const { type, resourceId, previewData, processedData, stage, error } = action;

  return produce(state, draft => {
    if (!type || !resourceId) return draft;

    switch (type) {
      case actionTypes.SAMPLEDATA.REQUEST:
        draft[resourceId] = draft[resourceId] || {};
        draft[resourceId].status = 'requested';
        break;
      case actionTypes.SAMPLEDATA.RECEIVED:
        draft[resourceId] = draft[resourceId] || {};
        draft[resourceId].status = 'received';
        draft[resourceId].data = extractStages(previewData);
        break;
      case actionTypes.SAMPLEDATA.UPDATE:
        draft[resourceId] = draft[resourceId] || {};
        draft[resourceId].status = 'updated';
        draft[resourceId].data = draft[resourceId].data || {};
        // For all the parsers , data is an array
        // Only incase of structuredFileParser it is an object
        draft[resourceId].data[stage] =
          processedData.data &&
          (Array.isArray(processedData.data)
            ? processedData.data[0]
            : processedData.data);
        break;
      case actionTypes.SAMPLEDATA.RECEIVED_ERROR:
        draft[resourceId] = draft[resourceId] || {};
        draft[resourceId].status = 'error';
        draft[resourceId].error = error;
        // Resets the Erred Stage
        delete draft[resourceId][stage];
        break;
      case actionTypes.SAMPLEDATA.RESET:
        draft[resourceId] = {};
        break;
      default:
    }
  });
}

function getRawData(resourceData) {
  if (resourceData.raw) return resourceData.raw;

  if (resourceData.parse) return resourceData.parse;

  return DEFAULT_VALUE;
}

function getParsedData(resourceData) {
  return resourceData.parse || resourceData.raw || DEFAULT_VALUE;
}

function getSampleData(resourceData) {
  return resourceData.transform || resourceData.parse || DEFAULT_VALUE;
}

function getTransformData(resourceData) {
  return (
    resourceData.parse ||
    (resourceData.raw && resourceData.raw.body) ||
    DEFAULT_VALUE
  );
}

export function getResourceSampleData(state, resourceId, stage) {
  if (!resourceId || !state[resourceId]) return DEFAULT_VALUE;

  const resourceData = state[resourceId].data;

  if (!resourceData) return DEFAULT_VALUE;

  switch (stage) {
    case 'raw':
      return getRawData(resourceData);
    case 'parse':
      return getParsedData(resourceData);
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
