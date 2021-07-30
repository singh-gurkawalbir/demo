import { produce } from 'immer';
import { createSelector } from 'reselect';
import actionTypes from '../../../../actions/types';
import { DEFAULT_RECORD_SIZE } from '../../../../utils/exportPanel';

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
  const { type, resourceId, previewData, previewStagesData, previewError, parseData, rawData, csvData, recordSize } = action;

  return produce(state, draft => {
    switch (type) {
      case actionTypes.RESOURCE_FORM_SAMPLE_DATA.REQUESTED:
        draft[resourceId] = draft[resourceId] || {};
        draft[resourceId].status = 'requested';
        break;
      case actionTypes.RESOURCE_FORM_SAMPLE_DATA.RECEIVED_PREVIEW_STAGES:
        draft[resourceId] = draft[resourceId] || {};
        draft[resourceId].status = 'received';
        draft[resourceId].data = extractStages(previewStagesData);
        break;
      case actionTypes.RESOURCE_FORM_SAMPLE_DATA.RECEIVED_PREVIEW_ERROR:
        draft[resourceId] = draft[resourceId] || {};
        draft[resourceId].status = 'received';
        draft[resourceId].error = previewError?.errors;
        draft[resourceId].data = extractStages(previewError);
        break;
      case actionTypes.RESOURCE_FORM_SAMPLE_DATA.RECEIVED_PARSE_DATA:
        draft[resourceId] = draft[resourceId] || {};
        draft[resourceId].status = 'received';
        if (!draft[resourceId].data) {
          draft[resourceId].data = {};
        }
        draft[resourceId].data.parse = Array.isArray(parseData) ? parseData : [parseData];
        break;
      case actionTypes.RESOURCE_FORM_SAMPLE_DATA.RECEIVED_RAW_FILE_DATA:
        draft[resourceId] = draft[resourceId] || {};
        draft[resourceId].status = 'received';
        if (!draft[resourceId].data) {
          draft[resourceId].data = {};
        }
        draft[resourceId].data.raw = rawData;
        break;
      case actionTypes.RESOURCE_FORM_SAMPLE_DATA.RECEIVED_PREVIEW_DATA:
        draft[resourceId] = draft[resourceId] || {};
        draft[resourceId].status = 'received';
        if (!draft[resourceId].data) {
          draft[resourceId].data = {};
        }
        draft[resourceId].data.preview = previewData;
        break;
      case actionTypes.RESOURCE_FORM_SAMPLE_DATA.RECEIVED_CSV_FILE_DATA:
        draft[resourceId] = draft[resourceId] || {};
        draft[resourceId].status = 'received';
        if (!draft[resourceId].data) {
          draft[resourceId].data = {};
        }
        draft[resourceId].data.csv = csvData;
        break;
      case actionTypes.RESOURCE_FORM_SAMPLE_DATA.UPDATE_RECORD_SIZE:
        draft[resourceId] = draft[resourceId] || {};
        draft[resourceId].recordSize = recordSize;
        break;
      case actionTypes.RESOURCE_FORM_SAMPLE_DATA.CLEAR:
        delete draft[resourceId];
        break;
      default:
    }

    return draft;
  });
}

export const selectors = {};

selectors.getSampleDataRecordSize = (state, resourceId) => state?.[resourceId]?.recordSize || DEFAULT_RECORD_SIZE;

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

selectors.getResourceSampleDataWithStatus1 = (state, resourceId, stage) => getResourceSampleDataWithStatus(state?.[resourceId], stage);

selectors.mkPreviewStageDataList1 = () => createSelector(
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
