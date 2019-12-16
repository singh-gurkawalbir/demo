import { select, call } from 'redux-saga/effects';
import { resource, getResourceSampleDataWithStatus } from '../../../reducers';
import { saveSampleDataOnResource } from './utils';
import { isJsonString } from '../../../utils/string';

function* fetchRawDataForFileAdaptors({ resourceId, tempResourceId, type }) {
  // Incase of FTP, raw data to be saved in the data in Raw Stage ( file content )
  // tempResourceId if passed used incase of newly created export
  // to fetch Sample data saved against temp id in state
  const resourceObj = yield select(
    resource,
    type === 'imports' ? 'imports' : 'exports',
    resourceId
  );
  // For file types csv, xml -  file content is fetched from raw stage
  let stage = 'raw';

  /*
   * For Imports, raw data is saved as 'sampleData' field.
   * For csv, xlsx sampleData to store is csv content
   * This applies only for imports and exports is expected to fetch data from rawDataKey
   * But for now exports follow same route of saving rawData in sampleData field as Imports do
   */
  if (resourceObj.file.type === 'xlsx') {
    // For xlsx file type csv content is stored in 'csv' stage of sample data
    stage = 'csv';
  }

  if (resourceObj.file.type === 'json') {
    // For JSON file type parsed json content in stored in 'parse' stage of sample data
    stage = 'parse';
  }

  const { data: rawData } = yield select(
    getResourceSampleDataWithStatus,
    tempResourceId || resourceId,
    stage
  );

  if (resourceObj.file.type === 'filedefinition') {
    // For Imports File definitions, sample data is the json format of structured file parser data
    const fileDefinitionData = rawData && rawData.body;

    return type === 'imports'
      ? isJsonString(fileDefinitionData) && JSON.parse(fileDefinitionData)
      : fileDefinitionData;
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
    // Raw data is saved as 'sampleData' field in resourceDoc for imports and exports
    return yield call(saveSampleDataOnResource, {
      resourceId,
      rawData,
      resourceType: type,
    });

    // TODO @Raghu Deferred for now :  Raw data is uploaded to S3 and key is saved in resourceDoc for Exports/ Lookups
    // return yield call(saveRawDataOnResource, { resourceId, rawData });
  }
}
