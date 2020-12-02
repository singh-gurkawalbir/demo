/* global describe expect test */
// import {
//   getAllDependentSampleDataStages,
//   _compareSampleDataStage,
//   getCurrentSampleDataStageStatus,
//   getPreviewStageData,
//   getSampleDataStage,
//   getLastExportDateTime,
//   getAddedLookupInFlow,
//   getFlowUpdatesFromPatch,
//   isRawDataPatchSet,
//   isUIDataExpectedForResource,
//   getBlobResourceSampleData,
//   isOneToManyResource,
//   isPostDataNeededInResource,
//   generateDefaultExtractsObject,
//   generatePostResponseMapData,
//   getFormattedResourceForPreview,
//   getResourceStageUpdatedFromPatch,
//   getSubsequentStages,
//   shouldUpdateResourceSampleData,
// } from '.';

describe('getAllDependentSampleDataStages util', () => {
  test('should return true', () => {
    expect(true).toBe(true);
  });
});
describe('_compareSampleDataStage util', () => {

});
describe('getCurrentSampleDataStageStatus util', () => {

});
describe('getPreviewStageData util', () => {

});
describe('getSampleDataStage util', () => {

});
describe('getAddedLookupInFlow util', () => {
  test('should return undefined when the patchSet is empty ', () => {

  });
  test('should return undefined when the patchSet does not contain /pageProcessors which means no lookup has been added', () => {

  });
  test('should return undefined when the patchSet has /pageProcessors but an import has been added to the flow', () => {

  });
  test('should return exportId when the patchSet has /pageProcessors and a lookup has been added to the flow', () => {

  });
});
describe('getFlowUpdatesFromPatch util used to determine if the flow sequence / flow response mapping has been changed', () => {
  test('should return empty object when the patchSet is empty', () => {

  });
  test('should return empty object when the patchSet has lastModified patch', () => {

  });
  test('should return sequence as true if the patchSet has /pageGenerators or /pageProcessors as the path', () => {

  });
  test('should return responseMapping as true if the patchSet has pageProcessors/resourceIndex/responseMapping as the path', () => {

  });
});
describe('isRawDataPatchSet util', () => {
  test('should return false when the patchSet is empty', () => {

  });
  test('should return false when the patchSet does not have rawData or sampleData as the first patch', () => {

  });
  test('should return false when patchSet has rawData but not the first patch', () => {

  });
  test('should return true if first patch is rawData', () => {

  });
  test('should return true if first patch is sampleData', () => {

  });
});
describe('isUIDataExpectedForResource util', () => {
  test('should return false when null/undefined resource is passed', () => {

  });
  test('should return true for a real time resource', () => {

  });
  test('should return true for file adaptor resource', () => {

  });
  test('should return true for csv rest export resource', () => {

  });
  test('should return true for blob resource', () => {

  });
  test('should return true if the resource is an Integration app resource', () => {

  });
  test('should return false for http/rest resource', () => {

  });
});
describe('isOneToManyResource util', () => {
  test('should return false when null/undefined resource is passed', () => {

  });
  test('should return true if the resource has oneToMany and also pathToMany properties', () => {

  });
  test('should return false for any resource without oneToMany/pathToMany', () => {

  });
});
describe('isPostDataNeededInResource util', () => {
  test('should return false when null resource is passed', () => {

  });

  test('should return true if the resource is of delta type', () => {

  });
  test('should return true for salesforce scheduled export', () => {

  });
  test('should return false for resources other than salesforce ', () => {

  });
});
describe('generateDefaultExtractsObject util', () => {
  test('should return default extracts sample data as expected for exports', () => {

  });
  test('should return default extracts sample data as expected for lookups', () => {

  });
  test('should return  by default exports related default extracts when there is no resource type ', () => {

  });
});
describe('generatePostResponseMapData util', () => {
  test('should return single empty record when both flowData and rawData are empty', () => {

  });
  test('should return wrapped rawData when flowData is empty', () => {

  });
  test('should return single record of flowData merged with rawData when flowData is an object', () => {

  });
  test('should return list of records of flowData merged with rawData when flowData is an array', () => {

  });
});
describe('getFormattedResourceForPreview util', () => {
  test('should return undefined if the resourceObj is invalid', () => {

  });
  test('should remove once field from the resource incase of once type for preview', () => {

  });
  test('should add postData on the resource incase of delta export', () => {

  });
  test('should update stringified sampleResponse to JSON sampleResponse on Page processor flow type resource for preview', () => {

  });
  test('should add default extracts object as sampleResponse on PP flow type resource to fetch pageProcessorPreview data', () => {

  });
});
describe('getResourceStageUpdatedFromPatch util', () => {
  test('should return undefined when the patchSet is empty', () => {

  });

  test('should return undefined when the patchSet is a rawData patchSet', () => {

  });
  test('should return corresponding stage if the patchSet matches one of the actions on FB bubbles', () => {

  });
});
describe('getSubsequentStages util', () => {

});
describe('shouldUpdateResourceSampleData util', () => {
  test('should return false when patchSet is empty', () => {

  });
  test('should return false when patchSet has rawData patchSet', () => {

  });
  test('should return false when patchSet has one of the processor actions triggered outside resourceform', () => {

  });
  test('should return true if there are patches that could effect sample data', () => {

  });
});
