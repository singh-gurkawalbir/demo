
/*
 * This state holds the entire stages of Export's Data flow
 * Involves the data in each and every stage
 */
import produce from 'immer';
import { createSelector } from 'reselect';
import actionTypes from '../../../actions/types';

const DEFAULT_VALUE = undefined;

function extractStages(sampleData) {
  const stagesInSampleData = sampleData && sampleData.stages;
  const stageMap = {};

  if (!stagesInSampleData) {
    stageMap.parse = sampleData;
  } else {
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
  }

  return stageMap;
}

export default function (state = {}, action) {
  const { type, resourceId, previewData, processedData, stage, error } = action;

  return produce(state, draft => {
    if (!type || !resourceId) return draft;

    switch (type) {
      case actionTypes.SAMPLEDATA.REQUEST:
      case actionTypes.SAMPLEDATA.LOOKUP_REQUEST:
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
        draft[resourceId].status = 'received';
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

export const selectors = {};

const getResourceSampleData = (resourceIdSampleData, stage) => {
  const resourceData = resourceIdSampleData?.data;

  if (!resourceData) return DEFAULT_VALUE;

  return resourceData[stage] || DEFAULT_VALUE;
};

const getResourceSampleDataWithStatus = (resourceIdSampleData, stage) => ({
  data: getResourceSampleData(resourceIdSampleData, stage),
  status: resourceIdSampleData?.status,
  error: resourceIdSampleData?.error,
});

selectors.getResourceSampleDataWithStatus = (state, resourceId, stage) => getResourceSampleDataWithStatus(state?.[resourceId], stage);

selectors.mkPreviewStageDataList = () => createSelector(
  (state, resourceId) => state?.session?.sampleData?.[resourceId],
  (_1, _2, stages) => stages,
  (resourceIdSampleData, stages) =>
    stages.reduce((acc, stage) => {
      acc[stage] = getResourceSampleDataWithStatus(resourceIdSampleData, stage);

      return acc;
    }, {})
);

