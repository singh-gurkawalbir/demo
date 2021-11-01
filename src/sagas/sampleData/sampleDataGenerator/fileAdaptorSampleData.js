import { call } from 'redux-saga/effects';
import { parseFileData, parseFileDefinition } from '../utils/fileParserUtils';
import { extractFileSampleDataProps, FILE_DEFINITION_TYPES } from '../resourceForm/utils';
import { getCsvFromXlsx } from '../../../utils/file';

export default function* requestFileAdaptorSampleData({ resource, formKey }) {
  if (!resource?.file?.type) return;
  const { file, sampleData } = resource;
  const { type } = file;

  if (['csv', 'xlsx', 'xml', 'json'].includes(type)) {
    let fileContent = sampleData;

    if (formKey) {
      // Incase of form context, fetch file content from form state
      // as the resource has not yet been updated with sampleData
      fileContent = (yield call(extractFileSampleDataProps, { formKey })).sampleData;
      if (type === 'xlsx' && fileContent && typeof fileContent !== 'string') {
        // convert its format to csv and pass further to process sampleData
        fileContent = (yield call(getCsvFromXlsx, fileContent))?.result;
      }
    }
    const parsedData = yield call(parseFileData, {
      sampleData: fileContent,
      resource,
    });
    const fileSampleData = parsedData?.data;

    return Array.isArray(fileSampleData) ? fileSampleData[0] : fileSampleData;
  }

  // Below are possible file types incase of file definition
  if (FILE_DEFINITION_TYPES.includes(type)) {
    const fileDefinitionSampleData = yield call(parseFileDefinition, {
      sampleData,
      resource,
    });

    return fileDefinitionSampleData?.data;
  }
}
