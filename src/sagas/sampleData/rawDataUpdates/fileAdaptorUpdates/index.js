import { select, call } from 'redux-saga/effects';
import { selectors } from '../../../../reducers';
import { safeParse } from '../../../../utils/string';
import { constructResourceFromFormValues } from '../../../utils';
import { getUnionObject } from '../../../../utils/jsonPaths';
import { extractCsvSampleData } from '../../../../utils/file';

export function* _fetchRawDataForFileAdaptors({ resourceId, resourceType, values }) {
  if (!resourceId) return;
  // Incase of FTP, raw data to be saved in the data in Raw Stage ( file content )
  // tempResourceId if passed used incase of newly created export
  // to fetch Sample data saved against temp id in state
  const resourceObj = yield call(constructResourceFromFormValues, { resourceId, resourceType, formValues: values });
  // For file types csv, xml, json -  file content is fetched from raw stage
  let stage = 'raw';

  /*
   * For Imports, raw data is saved as 'sampleData' field.
   * For xlsx, sampleData to store is csv content
   */
  if (resourceObj?.file?.type === 'xlsx') {
    // For xlsx file type csv content is stored in 'csv' stage of sample data
    stage = 'csv';
  }
  if (resourceObj?.file?.type === 'json' && resourceType === 'imports') {
    // For json file, in imports we expect data to be parsed before saving - as in Ampersand
    // TODO @Raghu: Revisit this after release, as ampersand app is going to be deprecated
    stage = 'parse';
  }

  const { data: rawData } = yield select(
    selectors.getResourceSampleDataWithStatus,
    resourceId,
    stage
  );

  if (resourceObj?.file?.type === 'filedefinition') {
    // For Imports File definitions, sample data is the json format of structured file parser data
    const fileDefinitionData = rawData;

    return resourceType === 'imports'
      ? safeParse(fileDefinitionData)
      : fileDefinitionData;
  }

  return rawData;
}

export function* simplifyFileSampleData({resourceId, fileType, sampleData }) {
  const uploadedFile = yield select(selectors.getUploadedFile, `${resourceId}-uploadFile`);
  const MAX_SAMPLEDATA_SIZE = 5;

  if (!fileType || !uploadedFile || uploadedFile.size < MAX_SAMPLEDATA_SIZE) {
    // No need of any simplification
    return sampleData;
  }
  if (fileType === 'json') {
    // if the data is an array - push single object
    if (Array.isArray(sampleData)) {
      return [getUnionObject(sampleData)];
    }
  }
  if (fileType === 'csv' || fileType === 'xlsx') {
    // get only 10 records
    return extractCsvSampleData(sampleData);
  }

  return sampleData;
}
