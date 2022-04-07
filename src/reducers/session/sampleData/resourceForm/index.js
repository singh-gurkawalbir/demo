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
      let stageData = stage.data;

      if (stage.name === 'transform') {
        stageData = stage.data?.[0].data;
      }
      if (stage.name === 'preSavePageHook') {
        stageData = stage.data?.[0].data?.[0];
      }
      stageMap[stage.name] = stageData;
    });
  }

  return stageMap;
}

export default function (state = {}, action) {
  const {
    type,
    sampleDataType,
    resourceId,
    status = 'requested',
    previewData,
    previewStagesData,
    previewError,
    parseData,
    rawData,
    csvData,
    recordSize,
    processor,
    processorData,
    processorError,
    mockData,
  } = action;

  return produce(state, draft => {
    const activeSendOrPreviewTab = draft[resourceId]?.typeOfSampleData || 'preview';

    if (!resourceId) return;

    if (!draft[resourceId] || !draft[resourceId][activeSendOrPreviewTab]) {
      if (!draft[resourceId]) {
        draft[resourceId] = {};
      }
      if (!draft[resourceId][activeSendOrPreviewTab]) {
        draft[resourceId][activeSendOrPreviewTab] = {};
      }
    }

    switch (type) {
      case actionTypes.RESOURCE_FORM_SAMPLE_DATA.UPDATE_DATA_TYPE:
        draft[resourceId].typeOfSampleData = sampleDataType;
        break;
      case actionTypes.RESOURCE_FORM_SAMPLE_DATA.SET_STATUS:
        draft[resourceId][activeSendOrPreviewTab].status = status;
        break;
      case actionTypes.RESOURCE_FORM_SAMPLE_DATA.RECEIVED_PREVIEW_STAGES:
        draft[resourceId][activeSendOrPreviewTab].status = 'received';
        draft[resourceId][activeSendOrPreviewTab].data = extractStages(previewStagesData);
        if (!draft[resourceId].data) draft[resourceId].data = {};
        if (previewStagesData && previewStagesData.data) draft[resourceId].data.defaultMockData = previewStagesData.data;
        break;
      case actionTypes.RESOURCE_FORM_SAMPLE_DATA.RECEIVED_PREVIEW_ERROR:
        draft[resourceId][activeSendOrPreviewTab].status = 'error';
        draft[resourceId][activeSendOrPreviewTab].error = previewError?.errors;
        draft[resourceId][activeSendOrPreviewTab].data = extractStages(previewError);
        break;
      case actionTypes.RESOURCE_FORM_SAMPLE_DATA.RECEIVED_PROCESSOR_ERROR: {
        draft[resourceId][activeSendOrPreviewTab].status = 'error';
        const errors = Array.isArray(processorError) ? processorError : [processorError];

        draft[resourceId][activeSendOrPreviewTab].error = errors;
        draft[resourceId][activeSendOrPreviewTab].data = {
          ...draft[resourceId][activeSendOrPreviewTab].data,
          // processor dependent stages need to be reset if processor throws error
          parse: { errors },
          preview: undefined,
        };
        break;
      }
      case actionTypes.RESOURCE_FORM_SAMPLE_DATA.SET_PARSE_DATA:
        if (!draft[resourceId][activeSendOrPreviewTab].data) {
          draft[resourceId][activeSendOrPreviewTab].data = {};
        }
        draft[resourceId][activeSendOrPreviewTab].data.parse = parseData ? [parseData] : DEFAULT_VALUE;
        break;
      case actionTypes.RESOURCE_FORM_SAMPLE_DATA.SET_RAW_FILE_DATA:
        if (!draft[resourceId][activeSendOrPreviewTab].data) {
          draft[resourceId][activeSendOrPreviewTab].data = {};
        }
        draft[resourceId][activeSendOrPreviewTab].data.raw = rawData;
        break;
      case actionTypes.RESOURCE_FORM_SAMPLE_DATA.SET_PREVIEW_DATA:
        if (!draft[resourceId][activeSendOrPreviewTab].data) {
          draft[resourceId][activeSendOrPreviewTab].data = {};
        }
        draft[resourceId][activeSendOrPreviewTab].data.preview = previewData;
        break;
      case actionTypes.RESOURCE_FORM_SAMPLE_DATA.SET_CSV_FILE_DATA:
        if (!draft[resourceId][activeSendOrPreviewTab].data) {
          draft[resourceId][activeSendOrPreviewTab].data = {};
        }
        draft[resourceId][activeSendOrPreviewTab].data.csv = csvData;
        break;
      case actionTypes.RESOURCE_FORM_SAMPLE_DATA.SET_PROCESSOR_DATA:
        if (!processor) break;
        draft[resourceId][activeSendOrPreviewTab] = draft[resourceId][activeSendOrPreviewTab] || {};
        if (!draft[resourceId][activeSendOrPreviewTab].data) {
          draft[resourceId][activeSendOrPreviewTab].data = {};
        }
        draft[resourceId][activeSendOrPreviewTab].data[processor] = processorData;
        break;
      case actionTypes.RESOURCE_FORM_SAMPLE_DATA.SET_MOCK_DATA:
        if (!draft[resourceId].data) {
          draft[resourceId].data = {};
        }
        draft[resourceId].data.mockData = mockData || DEFAULT_VALUE;
        break;
      case actionTypes.RESOURCE_FORM_SAMPLE_DATA.UPDATE_RECORD_SIZE:
        draft[resourceId][activeSendOrPreviewTab].recordSize = recordSize;
        break;
      case actionTypes.RESOURCE_FORM_SAMPLE_DATA.CLEAR_STAGES:
        if (draft[resourceId][activeSendOrPreviewTab]) {
          draft[resourceId][activeSendOrPreviewTab].status = 'received';
          draft[resourceId][activeSendOrPreviewTab].data = {};
        }
        break;
      case actionTypes.RESOURCE_FORM_SAMPLE_DATA.CLEAR:
        delete draft[resourceId];
        break;
      default:
    }
  });
}

export const selectors = {};

selectors.typeOfSampleData = (state, resourceId) => state?.[resourceId]?.typeOfSampleData || 'preview';

selectors.sampleDataRecordSize = (state, resourceId) => {
  const activeSendOrPreviewTab = selectors.typeOfSampleData(state, resourceId);

  return state?.[resourceId]?.[activeSendOrPreviewTab]?.recordSize || DEFAULT_RECORD_SIZE;
};

export const getResourceSampleData = (resourceIdSampleData, stage) => {
  const resourceData = resourceIdSampleData?.data;

  if (!resourceData) return DEFAULT_VALUE;

  switch (stage) {
    case 'parse':
      return resourceData.parse?.[0] || DEFAULT_VALUE;
    case 'preview':
      return resourceData.preview || resourceData.parse || DEFAULT_VALUE;
    case 'preSavePageHook':
      return resourceData.preSavePageHook || resourceData.transform || resourceData.parse?.[0] || DEFAULT_VALUE;
    default:
      return resourceData[stage] || DEFAULT_VALUE;
  }
};

const getResourceSampleDataWithStatus = (resourceIdSampleData, stage) => ({
  data: getResourceSampleData(resourceIdSampleData, stage),
  status: resourceIdSampleData?.status,
  error: resourceIdSampleData?.error,
});

selectors.getResourceSampleDataWithStatus = (state, resourceId, stage) => {
  const activeSendOrPreviewTab = selectors.typeOfSampleData(state, resourceId);

  return getResourceSampleDataWithStatus(state?.[resourceId]?.[activeSendOrPreviewTab], stage);
};

selectors.mkPreviewStageDataList = () => createSelector(
  (state, resourceId) => state?.[resourceId]?.[state?.[resourceId]?.typeOfSampleData || 'preview'],
  (_1, _2, stages) => stages,
  (resourceIdSampleData, stages) => {
    if (!stages) return emptyObj;

    return stages.reduce((acc, stage) => {
      acc[stage] = getResourceSampleDataWithStatus(resourceIdSampleData, stage);

      return acc;
    }, {});
  }
);

selectors.getResourceSampleDataStages = (state, resourceId) => {
  const activeSendOrPreviewTab = selectors.typeOfSampleData(state, resourceId);
  const sampleData = state?.[resourceId]?.[activeSendOrPreviewTab]?.data || {};

  return Object.keys(sampleData).map(stage => ({
    name: stage,
    data: sampleData[stage],
  }));
};

selectors.getAllParsableErrors = (state, resourceId) => {
  const data = selectors.getResourceSampleDataStages(state, resourceId);

  const {errors, stages} = data.find(val => val.name === 'parse')?.data || {};

  if (stages) { return null; }

  // if there are no stages return all errors and the complete error list would be visible in the preview editor
  return errors;
};

selectors.getResourceMockData = (state, resourceId) => state?.[resourceId]?.data?.mockData;

selectors.getResourceDefaultMockData = (state, resourceId) => state?.[resourceId]?.data?.defaultMockData;
