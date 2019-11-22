import { select, call } from 'redux-saga/effects';
import { resource, getResourceSampleDataWithStatus } from '../../../reducers';
import { saveRawDataOnResource, saveSampleDataOnResource } from './utils';
import { isJsonString } from '../../../utils/string';

function* fetchRawDataForFileAdaptors({ resourceId, tempResourceId, type }) {
  // Incase of FTP, raw data to be saved in the data in Parse Stage ( JSON )
  // tempResourceId if passed used incase of newly created export
  // to fetch Sample data saved against temp id in state
  const resourceObj = yield select(
    resource,
    type === 'imports' ? 'imports' : 'exports',
    resourceId
  );
  let stage = 'raw';

  /*
   * For Imports, raw data is saved as 'sampleData' field.
   * For csv, xlsx sampleData to store is csv content
   */
  if (type === 'imports' && resourceObj.file.type === 'xlsx') {
    // For xlsx file type csv content is stored in 'csv' stage of sample data
    stage = 'csv';
  }

  const { data: rawData } = yield select(
    getResourceSampleDataWithStatus,
    tempResourceId || resourceId,
    stage
  );

  if (type === 'imports' && resourceObj.file.type === 'filedefinition') {
    // For Imports File definitions, sample data is the json format of structured file parser data
    return (
      rawData &&
      rawData.body &&
      isJsonString(rawData.body) &&
      JSON.parse(rawData.body)
    );
  }

  return rawData && rawData.body;
}

export default function* saveRawDataForFileAdaptors({
  resourceId,
  tempResourceId,
  type,
}) {
  const rawData = yield call(fetchRawDataForFileAdaptors, {
    resourceId,
    tempResourceId,
    type,
  });

  if (rawData) {
    if (type === 'imports') {
      // Raw data is saved as 'sampleData' field in resourceDoc for imports
      return yield call(saveSampleDataOnResource, { resourceId, rawData });
    }

    // Raw data is uploaded to S3 and key is saved in resourceDoc for Exports/ Lookups
    return yield call(saveRawDataOnResource, { resourceId, rawData });
  }
}
