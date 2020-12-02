/* global describe expect test */
import {
  // sampleDataStage,
  // getAllDependentSampleDataStages,
  // _compareSampleDataStage,
  // getCurrentSampleDataStageStatus,
  // getPreviewStageData,
  // getSampleDataStage,
  // getLastExportDateTime,
  // getAddedLookupInFlow,
  // getFlowUpdatesFromPatch,
  // isRawDataPatchSet,
  // isUIDataExpectedForResource,
  // getBlobResourceSampleData,
  // isOneToManyResource,
  // isPostDataNeededInResource,
  // generateDefaultExtractsObject,
  // generatePostResponseMapData,
  getFormattedResourceForPreview,
  getResourceStageUpdatedFromPatch,
  // getSubsequentStages,
  shouldUpdateResourceSampleData,
} from '.';

describe('getAllDependentSampleDataStages util', () => {
  test('should return true', () => {
    expect(true).toBeTruthy();
  });
});
describe('_compareSampleDataStage util', () => {

});
describe('getCurrentSampleDataStageStatus util', () => {

});
describe('getPreviewStageData util', () => {
  test('should return undefined when previewData is undefined', () => {

  });
  test('should return undefined when previewData does not have stages', () => {

  });
  test('should return expected stage data from previewData when stage is not raw stage', () => {

  });
  test('should return parse stage when previewStage is raw and previewData does not have raw stage', () => {

  });
  test('should return raw stage when requested for and also previewData has raw stage', () => {

  });
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
    expect(getFormattedResourceForPreview()).toEqual({});
  });
  test('should remove once field from the resource incase of once type for preview', () => {
    const resource = {
      name: 'Test export',
      _id: '1234',
      type: 'once',
      rest: {
        once: { relativeURI: '/api/v2/users.json', method: 'PUT', body: { test: 5}},
        relativeURI: '/api/v2/users.json',
      },
      adaptorType: 'RESTExport',
    };
    const formattedResourceWithoutOnceDoc = {
      name: 'Test export',
      _id: '1234',
      rest: {
        relativeURI: '/api/v2/users.json',
      },
      adaptorType: 'RESTExport',
    };

    expect(getFormattedResourceForPreview(resource)).toEqual(formattedResourceWithoutOnceDoc);
  });
  test('should add postData on the resource incase of delta export', () => {
    const deltaResource = {
      name: 'Test export',
      _id: '1234',
      type: 'delta',
      rest: {
        once: { relativeURI: '/api/v2/users.json', method: 'PUT', body: { test: 5}},
        relativeURI: '/api/v2/users.json',
      },
      adaptorType: 'RESTExport',
    };
    const deltaResourceWithPostData = {
      name: 'Test export',
      _id: '1234',
      type: 'delta',
      rest: {
        once: { relativeURI: '/api/v2/users.json', method: 'PUT', body: { test: 5}},
        relativeURI: '/api/v2/users.json',
      },
      adaptorType: 'RESTExport',
      postData: {
        lastExportDateTime: expect.any(String),
      },
    };

    expect(getFormattedResourceForPreview(deltaResource)).toEqual(deltaResourceWithPostData);
  });
  test('should update stringified sampleResponse to JSON sampleResponse on Page processor flow type resource for preview', () => {
    const importResource = {
      adaptorType: 'FTPImport',
      ftp: {
        directoryPath: '/users',
        fileName: 'UserList.json',
      },
      _id: 'asdf2345',
      name: 'FTP Import',
      sampleResponseData: '{ "test": 5 }',
    };
    const formattedImportResource = {
      adaptorType: 'FTPImport',
      ftp: {
        directoryPath: '/users',
        fileName: 'UserList.json',
      },
      _id: 'asdf2345',
      name: 'FTP Import',
      sampleResponseData: {
        test: 5,
      },
    };

    expect(getFormattedResourceForPreview(importResource, 'imports', 'pageProcessors')).toEqual(formattedImportResource);
  });
  test('should add default extracts object as sampleResponse on PP flow type resource to fetch pageProcessorPreview data', () => {
    const importResource = {
      adaptorType: 'FTPImport',
      ftp: {
        directoryPath: '/users',
        fileName: 'UserList.json',
      },
      _id: 'asdf2345',
      name: 'FTP Import',
    };
    const formattedImportResource = {
      adaptorType: 'FTPImport',
      ftp: {
        directoryPath: '/users',
        fileName: 'UserList.json',
      },
      _id: 'asdf2345',
      name: 'FTP Import',
      sampleResponseData: {
        errors: '',
        id: '',
        ignored: '',
        statusCode: '',
      },
    };

    expect(getFormattedResourceForPreview(importResource, 'imports', 'pageProcessors')).toEqual(formattedImportResource);
  });
});
describe('getResourceStageUpdatedFromPatch util', () => {
  test('should return undefined when the patchSet is empty', () => {
    expect(getResourceStageUpdatedFromPatch([])).toBeUndefined();
  });

  test('should return undefined when the patchSet is a rawData patchSet', () => {
    const rawDataPatchSet = [
      {
        path: '/rawData',
        value: 'sdf456dsfgsdfghj',
        op: 'add',
      },
    ];

    expect(getResourceStageUpdatedFromPatch(rawDataPatchSet)).toBeUndefined();
  });
  test('should return corresponding stage if the patchSet matches one of the actions on FB bubbles', () => {
    const hooksPatchSet = [{
      path: '/hooks',
      op: 'replace',
      value: {
        preSavePage: { _scriptId: '5df366d52af2f07355f590ea', function: 'preSavePageFunction' },
      },
    }];
    const transformPatchSet = [{
      path: '/transform',
      op: 'replace',
      value: {
        type: 'expression',
        expression: {
          version: 1,
          rules: [{ extract: '_id', generate: 'userID'}],
        },
      },
    }];

    expect(getResourceStageUpdatedFromPatch(hooksPatchSet)).toBe('preSavePage');
    expect(getResourceStageUpdatedFromPatch(transformPatchSet)).toBe('transform');
  });
});
describe('getSubsequentStages util', () => {

});
describe('shouldUpdateResourceSampleData util', () => {
  test('should return false when patchSet is empty', () => {
    expect(shouldUpdateResourceSampleData([])).toBeFalsy();
  });
  test('should return false when patchSet has rawData patchSet', () => {
    const rawDataPatchSet = [
      {
        path: '/rawData',
        value: 'sdf456dsfgsdfghj',
        op: 'add',
      },
    ];

    expect(shouldUpdateResourceSampleData(rawDataPatchSet)).toBeFalsy();
  });
  test('should return false when patchSet has one of the processor actions triggered outside resource form like update preSavePage hook', () => {
    const hooksPatchSet = [{
      path: '/hooks',
      op: 'replace',
      value: {
        preSavePage: { _scriptId: '5df366d52af2f07355f590ea', function: 'preSavePageFunction' },
      },
    }];

    expect(shouldUpdateResourceSampleData(hooksPatchSet)).toBeFalsy();
  });
  test('should return true if there are patches that could effect sample data', () => {
    const relativeUriPatchSet = [{
      path: '/rest/relativeURI',
      op: 'replace',
      value: '/api/v2/users.json',
    }];

    expect(shouldUpdateResourceSampleData(relativeUriPatchSet)).toBeTruthy();
  });
});
