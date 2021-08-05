import { select, call } from 'redux-saga/effects';
import { selectors } from '../../../../reducers';
import { saveSampleDataOnResource } from '../utils';
import { safeParse } from '../../../../utils/string';

export function* _fetchRawDataForFileAdaptors({ resourceId, tempResourceId, type }) {
  if (!resourceId) return;
  // Incase of FTP, raw data to be saved in the data in Raw Stage ( file content )
  // tempResourceId if passed used incase of newly created export
  // to fetch Sample data saved against temp id in state
  const resourceObj = yield select(
    selectors.resource,
    type === 'imports' ? 'imports' : 'exports',
    resourceId
  );
  // For file types csv, xml, json -  file content is fetched from raw stage
  let stage = 'raw';

  /*
   * For Imports, raw data is saved as 'sampleData' field.
   * For csv, xlsx sampleData to store is csv content
   * This applies only for imports and exports is expected to fetch data from rawDataKey
   * But for now exports follow same route of saving rawData in sampleData field as Imports do
   */
  if (resourceObj?.file?.type === 'xlsx') {
    // For xlsx file type csv content is stored in 'csv' stage of sample data
    stage = 'csv';
  }
  if (resourceObj?.file?.type === 'json' && type === 'imports') {
    // For json file, in imports we expect data to be parsed before saving - as in Ampersand
    // TODO @Raghu: Revisit this after release, as ampersand app is going to be deprecated
    stage = 'parse';
  }

  const { data: rawData } = yield select(
    selectors.getResourceSampleDataWithStatus,
    tempResourceId || resourceId,
    stage
  );

  if (resourceObj?.file?.type === 'filedefinition') {
    // For Imports File definitions, sample data is the json format of structured file parser data
    const fileDefinitionData = rawData;

    return type === 'imports'
      ? safeParse(fileDefinitionData)
      : fileDefinitionData;
  }

  return rawData;
}

export default function* saveRawDataForFileAdaptors({
  resourceId,
  tempResourceId,
  type,
}) {
  const rawData = yield call(_fetchRawDataForFileAdaptors, {
    resourceId,
    tempResourceId,
    type,
  });

  // Updated this to check for undefined... as there is a case where user can upload empty file
  // In which case , we get rawData as '' which is falsy too
  if (rawData !== undefined) {
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
