import { produce } from 'immer';
import actionTypes from '../../../../actions/types';
import { DEFAULT_RECORD_SIZE } from '../../../../utils/exportPanel';

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
  const { type, resourceId, previewData, previewError, parseData, recordSize } = action;

  return produce(state, draft => {
    switch (type) {
      case actionTypes.RESOURCE_FORM_SAMPLE_DATA.REQUESTED:
        draft[resourceId] = draft[resourceId] || {};
        draft[resourceId].status = 'requested';
        break;
      case actionTypes.RESOURCE_FORM_SAMPLE_DATA.RECEIVED_PREVIEW_STAGES:
        draft[resourceId] = draft[resourceId] || {};
        draft[resourceId].status = 'received';
        draft[resourceId].data = extractStages(previewData);
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
        draft[resourceId].data.parse = parseData;
        break;
      case actionTypes.RESOURCE_FORM_SAMPLE_DATA.UPDATE_RECORD_SIZE:
        draft[resourceId] = draft[resourceId] || {};
        draft[resourceId].recordSize = recordSize;
        break;
      default:
    }

    return draft;
  });
}

export const selectors = {};

selectors.getSampleDataRecordSize = (state, resourceId) => state?.[resourceId]?.recordSize || DEFAULT_RECORD_SIZE;
