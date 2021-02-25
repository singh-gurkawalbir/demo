import { call } from 'redux-saga/effects';
import { parseFileData, parseFileDefinition } from '../utils/fileParserUtils';
import { processJsonSampleData, processJsonPreviewData } from '../../../utils/sampleData';
import { getUnionObject } from '../../../utils/jsonPaths';

export default function* requestFileAdaptorSampleData({ resource }) {
  if (!resource?.file?.type) return;
  const { file, sampleData } = resource;
  const { type } = file;

  if (['csv', 'xlsx', 'xml'].includes(type)) {
    const parsedData = yield call(parseFileData, {
      sampleData,
      resource,
    });
    const fileSampleData = parsedData?.data;

    return Array.isArray(fileSampleData) ? fileSampleData[0] : fileSampleData;
  }

  if (type === 'json') {
    return processJsonSampleData(sampleData, file[type]);
  }
  // Below are possible file types incase of file definition
  if (['filedefinition', 'fixed', 'delimited/edifact'].includes(type)) {
    const fileDefinitionSampleData = yield call(parseFileDefinition, {
      sampleData,
      resource,
    });

    return fileDefinitionSampleData?.data;
  }
}

export function* requestFileAdaptorPreview({ resource }) {
  if (!resource?.file?.type) return;
  const { file, sampleData } = resource;
  const { type } = file;

  if (['csv', 'xlsx', 'xml'].includes(type)) {
    const parsedData = yield call(parseFileData, {
      sampleData,
      resource,
    });

    return parsedData?.data;
  }

  if (type === 'json') {
    return processJsonPreviewData(sampleData, file[type]);
  }
  // Below are possible file types incase of file definition
  if (['filedefinition', 'fixed', 'delimited/edifact'].includes(type)) {
    const fileDefinitionSampleData = yield call(parseFileDefinition, {
      sampleData,
      resource,
      mode: 'preview',
    });

    return fileDefinitionSampleData?.data;
  }
}

export function parseFilePreviewData({ resource, previewData}) {
  const fileType = resource?.file?.type;

  if (!fileType) return previewData;

  if (Array.isArray(previewData)) {
    return getUnionObject(previewData);
  }

  return previewData;
}
