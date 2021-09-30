import { call } from 'redux-saga/effects';
import { parseFileData, parseFileDefinition } from '../utils/fileParserUtils';

export default function* requestFileAdaptorSampleData({ resource }) {
  if (!resource?.file?.type) return;
  const { file, sampleData } = resource;
  const { type } = file;

  if (['csv', 'xlsx', 'xml', 'json'].includes(type)) {
    const parsedData = yield call(parseFileData, {
      sampleData,
      resource,
    });
    const fileSampleData = parsedData?.data;

    return Array.isArray(fileSampleData) ? fileSampleData[0] : fileSampleData;
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
