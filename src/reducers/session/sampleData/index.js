
/*
 * This state holds the entire stages of Export's Data flow
 * Involves the data in each and every stage
 */
import produce from 'immer';
import { createSelector } from 'reselect';
import { deepClone } from 'fast-json-patch';
import actionTypes from '../../../actions/types';

const DEFAULT_VALUE = undefined;
const emptyObj = {};

export function extractStages(sampleData) {
  const stagesInSampleData = sampleData?.stages;
  const stageMap = {};

  if (!stagesInSampleData) {
    stageMap.parse = sampleData;
  } else {
    stagesInSampleData.forEach(stage => {
      stageMap[stage.name] = stage.data;
    });
  }

  return stageMap;
}

export default function (state = {}, action) {
  const { type, resourceId, previewData, processedData, stage, error, patch } = action;

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
        draft[resourceId].data[stage] = processedData?.data;
        break;
      case actionTypes.SAMPLEDATA.RECEIVED_ERROR:
        draft[resourceId] = draft[resourceId] || {};
        draft[resourceId].status = 'error';
        draft[resourceId].error = error?.errors;
        draft[resourceId].data = extractStages(error);
        break;
      case actionTypes.SAMPLEDATA.RESET:
        draft[resourceId] = {};
        break;
      case actionTypes.SAMPLEDATA.PATCH:
        if (!draft[resourceId]) {
          draft[resourceId] = {};
        }
        Object.assign(draft[resourceId], deepClone(patch));
        break;
      default:
    }
  });
}

export const selectors = {};

export const getResourceSampleData = (resourceIdSampleData, stage) => {
  const resourceData = resourceIdSampleData?.data;

  if (!resourceData) return DEFAULT_VALUE;

  switch (stage) {
    case 'parse':
      return resourceData.parse?.[0] || DEFAULT_VALUE;
    case 'preview':
      return resourceData.preview || resourceData.parse || DEFAULT_VALUE;
    default:
      return resourceData[stage] || DEFAULT_VALUE;
  }
};

const getResourceSampleDataWithStatus = (resourceIdSampleData, stage) => ({
  data: getResourceSampleData(resourceIdSampleData, stage),
  status: resourceIdSampleData?.status,
  error: resourceIdSampleData?.error,
});

selectors.getResourceSampleDataWithStatus = (state, resourceId, stage) => getResourceSampleDataWithStatus(state?.[resourceId], stage);

selectors.mkPreviewStageDataList = () => createSelector(
  (state, resourceId) => state?.[resourceId],
  (_1, _2, stages) => stages,
  (resourceIdSampleData, stages) => {
    if (!stages) return emptyObj;

    return stages.reduce((acc, stage) => {
      acc[stage] = getResourceSampleDataWithStatus(resourceIdSampleData, stage);

      return acc;
    }, {});
  }
);

selectors.sampleDataRecordSize = (state, resourceId) => state?.[resourceId]?.recordSize;

selectors.getResourceSampleDataStages = (state, resourceId) => {
  const sampleData = state?.[resourceId]?.data || {};

  return Object.keys(sampleData).map(stage => ({
    name: stage,
    data: sampleData[stage],
  }));
};

