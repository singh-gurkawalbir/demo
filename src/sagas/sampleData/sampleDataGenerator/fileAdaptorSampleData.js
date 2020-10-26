import { call } from 'redux-saga/effects';
import { parseFileData, parseFileDefinition } from '../utils/fileParserUtils';
import { processJsonSampleData, processJsonPreviewData } from '../../../utils/sampleData';
import { getUnionObject } from '../../../utils/jsonPaths';

export default function* requestFileAdaptorSampleData({ resource }) {
  const { file, sampleData } = resource;
  const { type } = file;

  if (['csv', 'xlsx', 'xml'].includes(type)) {
    const { data: fileSampleData = {} } = yield call(parseFileData, {
      sampleData,
      resource,
    });

    return Array.isArray(fileSampleData) ? fileSampleData[0] : fileSampleData;
  }

  if (type === 'json') {
    return processJsonSampleData(sampleData, file[type]);
  }
  // Below are possible file types incase of file definition
  if (['filedefinition', 'fixed', 'delimited/edifact'].includes(type)) {
    const { data: fileDefinitionSampleData } = yield call(parseFileDefinition, {
      sampleData,
      resource,
    });

    return fileDefinitionSampleData;
  }
}

export function* requestFileAdaptorPreview({ resource }) {
  const { file, sampleData } = resource;
  const { type } = file;

  if (['csv', 'xlsx', 'xml'].includes(type)) {
    const { data: fileSampleData = {} } = yield call(parseFileData, {
      sampleData,
      resource,
    });

    return fileSampleData;
  }

  if (type === 'json') {
    return processJsonPreviewData(sampleData, file[type]);
  }
  // Below are possible file types incase of file definition
  if (['filedefinition', 'fixed', 'delimited/edifact'].includes(type)) {
    const { data: fileDefinitionSampleData } = yield call(parseFileDefinition, {
      sampleData,
      resource,
      mode: 'preview',
    });

    return fileDefinitionSampleData;
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
