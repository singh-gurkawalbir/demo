import { call } from 'redux-saga/effects';
import { parseFileData, parseFileDefinition } from '../utils/fileParserUtils';

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
    return sampleData;
  }

  if (type === 'filedefinition') {
    const { data: fileDefinitionSampleData } = yield call(parseFileDefinition, {
      sampleData,
      resource,
    });

    return fileDefinitionSampleData;
  }
}
