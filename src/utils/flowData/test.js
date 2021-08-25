/* global describe expect test */
import each from 'jest-each';
import {
  sampleDataStage,
  getAllDependentSampleDataStages,
  _compareSampleDataStage,
  getCurrentSampleDataStageStatus,
  getSubsequentStages,
  getPreviewStageData,
  getAddedLookupIdInFlow,
  getFlowUpdatesFromPatch,
  isRawDataPatchSet,
  isUIDataExpectedForResource,
  isOneToManyResource,
  isPostDataNeededInResource,
  generateDefaultExtractsObject,
  generatePostResponseMapData,
  getFormattedResourceForPreview,
  getResourceStageUpdatedFromPatch,
  shouldUpdateResourceSampleData,
  getSampleFileMeta,
  isFileMetaExpectedForResource,
} from '.';

const possibleExportSampleDataStagePaths = [
  ['flowInput', 'inputFilter'],
  ['raw', 'transform', 'preSavePage', 'responseMappingExtract', 'responseMapping', 'postResponseMap', 'postResponseMapHook'],
  ['raw', 'transform', 'outputFilter'],
];
const possibleImportSampleDataStagePaths = [
  ['flowInput', 'inputFilter'],
  ['flowInput', 'preMap', 'importMappingExtract', 'importMapping', 'postMap'],
  ['sampleResponse', 'responseTransform', 'postSubmit'],
  ['sampleResponse', 'responseTransform', 'responseMappingExtract', 'responseMapping', 'postResponseMap', 'postResponseMapHook'],
];

describe('getAllDependentSampleDataStages util', () => {
  const exportStages = Object.keys(sampleDataStage.exports);
  const importStages = Object.keys(sampleDataStage.imports);

  const getExpectedDependentStagesList = (stage, resourceType) => {
    const paths = resourceType === 'exports' ? possibleExportSampleDataStagePaths : possibleImportSampleDataStagePaths;
    const stagePath = paths.find(path => path.includes(stage));
    const stageIndex = stagePath.indexOf(stage);

    return stagePath.slice(0, stageIndex).reverse();
  };

  each(exportStages).test('should return valid dependent sample data stages of exports/lookups for stage - %s ', stage => {
    const expectedDependentStages = getExpectedDependentStagesList(stage, 'exports');

    expect(getAllDependentSampleDataStages(stage, 'exports')).toEqual(expectedDependentStages);
  });
  each(importStages).test('should return valid dependent sample data stages of imports for stage - %s ', stage => {
    const expectedDependentStages = getExpectedDependentStagesList(stage, 'imports');

    expect(getAllDependentSampleDataStages(stage, 'imports')).toEqual(expectedDependentStages);
  });
});
describe('_compareSampleDataStage util', () => {
  test('should return 0 if both stages are equal', () => {
    expect(_compareSampleDataStage('inputFilter', 'inputFilter', 'exports')).toBe(0);
  });
  test('should return 1 for exports if current stage has previous stage as part of its path', () => {
    const previousStage = 'transform';
    const currentStage = 'responseMapping';

    expect(_compareSampleDataStage(previousStage, currentStage, 'exports')).toBe(1);
  });
  test('should return -1 for exports if previous stage has current stage as part of its path', () => {
    const previousStage = 'responseMapping';
    const currentStage = 'transform';

    expect(_compareSampleDataStage(previousStage, currentStage, 'exports')).toBe(-1);
  });
  test('should return 2 for exports  if both stages have mutually exclusive paths and both needs to be run ', () => {
    const previousStage = 'inputFilter';
    const currentStage = 'outputFilter';

    expect(_compareSampleDataStage(previousStage, currentStage, 'exports')).toBe(2);
  });
  test('should return -1 for imports if current stage has previous stage as part of its path', () => {
    const previousStage = 'postMap';
    const currentStage = 'preMap';

    expect(_compareSampleDataStage(previousStage, currentStage, 'imports')).toBe(-1);
  });
  test('should return 1 for imports if previous stage has current stage as part of its path', () => {
    const previousStage = 'preMap';
    const currentStage = 'postMap';

    expect(_compareSampleDataStage(previousStage, currentStage, 'imports')).toBe(1);
  });
  test('should return 2 for imports  if both stages have mutually exclusive paths and both needs to be run ', () => {
    const previousStage = 'postMap';
    const currentStage = 'postSubmit';

    expect(_compareSampleDataStage(previousStage, currentStage, 'imports')).toBe(2);
  });
});
describe('getCurrentSampleDataStageStatus util', () => {
  test('should return status as 2 when there are no previous stages running indicating a new saga to be forked with this stage', () => {
    const prevStagesRunning = [];
    const expectedCurrentStageStatus = {
      prevStage: undefined,
      currentStageStatus: 2,
    };

    expect(getCurrentSampleDataStageStatus(prevStagesRunning, 'transform', 'exports')).toEqual(expectedCurrentStageStatus);
  });
  test('should return -1 if the current stage is a subset of previously running stages', () => {
    const prevStagesRunning = ['responseMapping', 'outputFilter'];
    const expectedCurrentStageStatus = {
      currentStageStatus: -1,
      prevStage: 'responseMapping',
    };

    expect(getCurrentSampleDataStageStatus(prevStagesRunning, 'transform', 'exports')).toEqual(expectedCurrentStageStatus);
  });
  test('should return 1 if the previous stage is a subset of current stage  ', () => {
    const prevStagesRunning = ['inputFilter', 'transform'];
    const expectedCurrentStageStatus = {
      currentStageStatus: 1,
      prevStage: 'transform',
    };

    expect(getCurrentSampleDataStageStatus(prevStagesRunning, 'responseMapping', 'exports')).toEqual(expectedCurrentStageStatus);
  });
  test('should return 0 if the current stage already exists in the list of running previous stage sagas  ', () => {
    const prevStagesRunning = ['transform', 'inputFilter'];
    const expectedCurrentStageStatus = {
      currentStageStatus: 0,
      prevStage: 'transform',
    };

    expect(getCurrentSampleDataStageStatus(prevStagesRunning, 'transform', 'exports')).toEqual(expectedCurrentStageStatus);
  });
});
describe('getSubsequentStages util', () => {
  const exportStages = Object.keys(sampleDataStage.exports);
  const importStages = Object.keys(sampleDataStage.imports);

  const getExpectedSubsequentStagesList = (stage, resourceType) => {
    const paths = resourceType === 'exports' ? possibleExportSampleDataStagePaths : possibleImportSampleDataStagePaths;
    const pathsWithStageIncluded = paths.filter(path => path.includes(stage));

    return pathsWithStageIncluded.reduce((stageList, currentPath) => {
      const stageIndex = currentPath.indexOf(stage);
      const stagesFollowedByCurrentStage = currentPath.slice(stageIndex + 1);

      return [...stageList, ...stagesFollowedByCurrentStage];
    }, []);
  };

  each(exportStages).test('should return expected subsequent stages of exports for stage - %s ', stage => {
    const expectedStagesList = getExpectedSubsequentStagesList(stage, 'exports').sort();
    const subsequentStagesList = getSubsequentStages(stage, 'exports').sort();

    expect(subsequentStagesList).toEqual(expectedStagesList);
  });

  each(importStages).test('should return expected subsequent stages of imports for stage - %s ', stage => {
    const expectedStagesList = getExpectedSubsequentStagesList(stage, 'imports').sort();
    const subsequentStagesList = getSubsequentStages(stage, 'imports').sort();

    expect(subsequentStagesList).toEqual(expectedStagesList);
  });
});
describe('getPreviewStageData util', () => {
  const previewData = {
    data: [{
      users: [
        { _id: 'user1', name: 'user1'},
        { _id: 'user2', name: 'user2'},
        { _id: 'user3', name: 'user3'},
      ],
    }],
    stages: [{
      name: 'request',
      data: [{
        url: 'https://celigohelp.zendesk.com/api/v2/users.json',
        method: 'GET',
      }],
    },
    {
      name: 'raw',
      data: [{
        headers: {
          'content-type': 'application/json',
        },
        statusCode: 200,
        url: 'https://celigohelp.zendesk.com/api/v2/users.json',
        body: '{"users": [{id: "123", name: "user1"}]}',
      }],
    },
    {
      name: 'parse',
      data: {
        users: [{
          id: '123',
          name: 'user1',
        }],
      },
    }],
  };

  test('should return undefined when previewData is undefined', () => {
    expect(getPreviewStageData()).toBeUndefined();
  });
  test('should return undefined when previewData does not have stages', () => {
    const previewDataWithoutStages = {
      data: [{
        users: [
          { _id: 'user1', name: 'user1'},
          { _id: 'user2', name: 'user2'},
          { _id: 'user3', name: 'user3'},
        ],
      }],
    };

    expect(getPreviewStageData(previewDataWithoutStages)).toBeUndefined();
  });
  test('should return expected stage data from previewData when stage is not raw stage', () => {
    expect(getPreviewStageData(previewData, 'request')).toEqual({
      url: 'https://celigohelp.zendesk.com/api/v2/users.json',
      method: 'GET',
    });
  });
  test('should return complete parse stage when previewStage is raw and previewData does not have raw stage when we consider NS/SF or DB adaptors for example', () => {
    const netsuitePreviewData = {
      data: [{
        DocumentNumber: '0',
        Amount: '989.20',
      }],
      stages: [{
        name: 'parse',
        data: [{
          DocumentNumber: '0',
          Amount: '989.20',
        }],
        errors: null,
      }],
    };

    expect(getPreviewStageData(netsuitePreviewData, 'raw')).toEqual([{
      DocumentNumber: '0',
      Amount: '989.20',
    }]);
  });
  test('should return complete raw stage when requested for and also previewData has raw stage', () => {
    expect(getPreviewStageData(previewData, 'raw')).toEqual({
      headers: {
        'content-type': 'application/json',
      },
      statusCode: 200,
      url: 'https://celigohelp.zendesk.com/api/v2/users.json',
      body: '{"users": [{id: "123", name: "user1"}]}',
    });
  });
});

describe('getAddedLookupIdInFlow util', () => {
  test('should return undefined when the patchSet is empty ', () => {
    expect(getAddedLookupIdInFlow()).toBeUndefined();
  });
  test('should return undefined when the patchSet does not contain /pageProcessors/index which means no lookup has been added', () => {
    const flowPatchSet = [{
      op: 'replace',
      path: '/lastModified',
      value: '2020-12-03T11:49:53.921Z',
    },
    {
      op: 'remove',
      path: '/pageProcessors/0/responseMapping',
    }];

    expect(getAddedLookupIdInFlow(flowPatchSet)).toBeUndefined();
  });
  test('should return undefined when the patchSet has /pageProcessors/index but an import has been added to the flow', () => {
    const flowPatchSet = [{
      op: 'add',
      path: '/pageProcessors/1',
      value: {
        type: 'import',
        _importId: '1234',
      },
    }];

    expect(getAddedLookupIdInFlow(flowPatchSet)).toBeUndefined();
  });
  test('should return exportId when the patchSet has /pageProcessors/index and a lookup has been added to the flow', () => {
    const flowPatchSet = [{
      op: 'add',
      path: '/pageProcessors/12',
      value: {
        type: 'export',
        _exportId: '1234',
      },
    }];

    expect(getAddedLookupIdInFlow(flowPatchSet)).toBe('1234');
  });
});
describe('getFlowUpdatesFromPatch util', () => {
  test('should return empty object when the patchSet is empty', () => {
    expect(getFlowUpdatesFromPatch()).toEqual({});
  });
  test('should return empty object when the patchSet has lastModified patch', () => {
    const flowPatchSet = [{
      op: 'replace',
      path: '/lastModified',
      value: '2020-12-03T11:49:53.921Z',
    },
    {
      op: 'remove',
      path: '/pageProcessors/0/responseMapping',
    }];

    expect(getFlowUpdatesFromPatch(flowPatchSet)).toEqual({});
  });
  test('should return sequence as true if the patchSet has /pageGenerators or /pageProcessors as the path', () => {
    const flowPatchSet = [{
      op: 'replace',
      path: '/pageProcessors',
      value: [{
        type: 'import',
        _importId: 'import123',
      },
      {
        type: 'export',
        _exportId: 'export456',
      }],
    }];

    expect(getFlowUpdatesFromPatch(flowPatchSet)).toEqual({
      responseMapping: false,
      sequence: true,
    });
  });
  test('should return responseMapping with resourceIndex if the patchSet has pageProcessors/resourceIndex/responseMapping as the path', () => {
    const flowPatchSet = [
      {
        op: 'replace',
        path: '/pageProcessors/2/responseMapping',
        value: {
          fields: [{ extract: 'id', generate: 'userID'}],
          lists: [],
        },
      },
    ];

    expect(getFlowUpdatesFromPatch(flowPatchSet)).toEqual({
      responseMapping: {
        resourceIndex: 2,
      },
      sequence: false,
    });
  });
});
describe('isRawDataPatchSet util', () => {
  test('should return false when the patchSet is empty', () => {
    expect(isRawDataPatchSet()).toBeFalsy();
  });
  test('should return false when the patchSet does not have rawData or sampleData as the first patch', () => {
    const hooksPatchSet = [{
      path: '/hooks',
      op: 'replace',
      value: {
        preSavePage: { _scriptId: '5df366d52af2f07355f590ea', function: 'preSavePageFunction' },
      },
    }];

    expect(isRawDataPatchSet(hooksPatchSet)).toBeFalsy();
  });
  test('should return false when patchSet has rawData but not the first patch', () => {
    const patchSet = [
      {
        path: '/hooks',
        op: 'replace',
        value: {
          preSavePage: { _scriptId: '5df366d52af2f07355f590ea', function: 'preSavePageFunction' },
        },
      },
      {
        path: '/rawData',
        value: 'sdf456dsfgsdfghj',
        op: 'add',
      },
    ];

    expect(isRawDataPatchSet(patchSet)).toBeFalsy();
  });
  test('should return true if first patch is rawData', () => {
    const patchSet = [
      {
        path: '/rawData',
        value: 'sdf456dsfgsdfghj',
        op: 'add',
      },
    ];

    expect(isRawDataPatchSet(patchSet)).toBeTruthy();
  });
  test('should return true if first patch is sampleData', () => {
    const patchSet = [
      {
        path: '/sampleData',
        value: {
          test: 5,
        },
        op: 'add',
      },
    ];

    expect(isRawDataPatchSet(patchSet)).toBeTruthy();
  });
});
describe('isUIDataExpectedForResource util', () => {
  test('should return false when null/undefined resource is passed', () => {
    expect(isUIDataExpectedForResource()).toBeFalsy();
    expect(isUIDataExpectedForResource(null)).toBeFalsy();
  });
  test('should return true for a real time resource', () => {
    const realTimeExport = {
      _id: '1234',
      name: 'Netsuite Export',
      adaptorType: 'NetSuiteExport',
      type: 'distributed',
    };

    expect(isUIDataExpectedForResource(realTimeExport)).toBeTruthy();
  });
  test('should return true for file adaptor resource', () => {
    const ftpExport = {
      _id: 'asdfb',
      name: 'FTP export',
      adaptorType: 'FTPExport',
      ftp: {
        directoryPath: '/Test',
      },
    };

    expect(isUIDataExpectedForResource(ftpExport)).toBeTruthy();
  });
  test('should return true for csv rest export resource', () => {
    const restCsvExport = {
      _id: '5e1075527420a91f588827d6',
      _connectionId: '5e106c3cf5d4f21dc5b3fe61',
      name: 'rest csv',
      file: {
        type: 'csv',
        csv: {
          columnDelimiter: ',',
          rowDelimiter: ' ',
          hasHeaderRow: false,
          trimSpaces: true,
          rowsToSkip: 0,
        },
      },
      adaptorType: 'RESTExport',
    };
    const restCsvConnection = {
      _id: '5e106c3cf5d4f21dc5b3fe61',
      type: 'rest',
      name: 'rest csv connection',
      rest: {
        mediaType: 'csv',
        authType: 'basic',
        authHeader: 'Authorization',
        authScheme: 'Bearer',
      },
    };

    expect(isUIDataExpectedForResource(restCsvExport, restCsvConnection)).toBeTruthy();
  });
  test('should return true for blob resource', () => {
    const blobResource = {
      _id: '234',
      name: 'Blob export',
      type: 'blob',
    };

    expect(isUIDataExpectedForResource(blobResource)).toBeTruthy();
  });
  test('should return true if the resource is an Integration app resource', () => {
    const restIAExport = {
      name: 'Test export',
      _id: '1234',
      rest: {
        once: { relativeURI: '/api/v2/users.json', method: 'PUT', body: { test: 5 }},
        relativeURI: '/api/v2/users.json',
      },
      adaptorType: 'RESTExport',
      _connectorId: 'sdf345tdfghdfghdfgh',
    };

    expect(isUIDataExpectedForResource(restIAExport)).toBeTruthy();
  });
  test('should return false for http resource', () => {
    const httpExport = {
      name: 'Test export',
      _id: '1234',
      http: {
        relativeURI: '/api/v2/users.json',
        method: 'GET',
      },
      adaptorType: 'HTTPExport',
    };

    expect(isUIDataExpectedForResource(httpExport)).toBeFalsy();
  });
});
describe('isOneToManyResource util', () => {
  test('should return false when null/undefined resource is passed', () => {
    expect(isOneToManyResource(null)).toBeFalsy();
    expect(isOneToManyResource()).toBeFalsy();
  });
  test('should return true if the resource has oneToMany and also pathToMany properties', () => {
    const restExport = {
      name: 'Test export',
      _id: '1234',
      rest: {
        once: { relativeURI: '/api/v2/users.json', method: 'PUT', body: { test: 5 }},
        relativeURI: '/api/v2/users.json',
      },
      adaptorType: 'RESTExport',
      oneToMany: true,
      pathToMany: 'users.addresses',
    };

    expect(isOneToManyResource(restExport)).toBeTruthy();
  });
  test('should return false for any resource without oneToMany/pathToMany', () => {
    const restExport = {
      name: 'Test export',
      _id: '1234',
      rest: {
        once: { relativeURI: '/api/v2/users.json', method: 'PUT', body: { test: 5 }},
        relativeURI: '/api/v2/users.json',
      },
      adaptorType: 'RESTExport',
    };

    expect(isOneToManyResource(restExport)).toBeFalsy();
  });
});
describe('isPostDataNeededInResource util', () => {
  test('should return false when null resource is passed', () => {
    expect(isPostDataNeededInResource(null)).toBeFalsy();
  });

  test('should return true if the resource is of delta type', () => {
    const deltaResource = {
      name: 'Test export',
      _id: '1234',
      type: 'delta',
      rest: {
        once: { relativeURI: '/api/v2/users.json', method: 'PUT', body: { test: 5 }},
        relativeURI: '/api/v2/users.json',
      },
      adaptorType: 'RESTExport',
    };

    expect(isPostDataNeededInResource(deltaResource)).toBeTruthy();
  });
  test('should return true for salesforce scheduled export', () => {
    const salesforceScheduledExport = {
      name: 'Test export',
      _id: '1234',
      salesforce: {
        executionType: 'scheduled',
      },
      adaptorType: 'SalesforceExport',
    };

    expect(isPostDataNeededInResource(salesforceScheduledExport)).toBeTruthy();
  });
  test('should return false for resources other than salesforce ', () => {
    const restExport = {
      name: 'Test export',
      _id: '1234',
      rest: {
        once: { relativeURI: '/api/v2/users.json', method: 'PUT', body: { test: 5 }},
        relativeURI: '/api/v2/users.json',
      },
      adaptorType: 'RESTExport',
    };

    expect(isPostDataNeededInResource(restExport)).toBeFalsy();
  });
});
describe('generateDefaultExtractsObject util', () => {
  test('should return default extracts sample data as expected for lookup exports', () => {
    const lookupDefaultExtracts = {
      errors: '',
      data: '',
      ignored: '',
      statusCode: '',
    };

    expect(generateDefaultExtractsObject('exports')).toEqual(lookupDefaultExtracts);
  });
  test('should return default extracts sample data as expected for imports', () => {
    const importDefaultExtracts = {
      errors: '',
      id: '',
      ignored: '',
      statusCode: '',
    };

    expect(generateDefaultExtractsObject('imports')).toEqual(importDefaultExtracts);
  });
  test('should return  by default exports related default extracts when there is no resource type ', () => {
    const lookupDefaultExtracts = {
      errors: '',
      data: '',
      ignored: '',
      statusCode: '',
    };

    expect(generateDefaultExtractsObject()).toEqual(lookupDefaultExtracts);
  });
  test('should return default extracts containing headers incase of http imports', () => {
    const httpImportDefaultExtracts = {
      errors: '',
      id: '',
      ignored: '',
      statusCode: '',
      headers: '',
    };

    expect(generateDefaultExtractsObject('imports', 'HTTPImport')).toEqual(httpImportDefaultExtracts);
  });
});
describe('generatePostResponseMapData util', () => {
  test('should return single empty record when both flowData and rawData are empty', () => {
    expect(generatePostResponseMapData()).toEqual({});
  });
  test('should return only rawData when flowData is empty', () => {
    const rawData = {
      _id: '123',
      name: 'User1',
    };

    expect(generatePostResponseMapData(undefined, rawData)).toEqual({
      _id: '123',
      name: 'User1',
    });
  });
  test('should return single record object of flowData merged with rawData when flowData is an object', () => {
    const rawData = {
      _id: '123',
      name: 'User1',
    };
    const flowData = {
      users: [{ _id: 'userId1', name: 'userName1'}, { _id: 'userId2', name: 'userName2'}],
      tickets: [{ _id: 'ticketId1', name: 'ticket1'}, { _id: 'ticketId2', name: 'ticket2'}],
    };

    expect(generatePostResponseMapData(flowData, rawData)).toEqual({
      users: [{ _id: 'userId1', name: 'userName1'}, { _id: 'userId2', name: 'userName2'}],
      tickets: [{ _id: 'ticketId1', name: 'ticket1'}, { _id: 'ticketId2', name: 'ticket2'}],
      _id: '123',
      name: 'User1',
    });
  });
  test('should return list of records of flowData merged with rawData on each record when flowData is an array', () => {
    const rawData = {
      _id: '123',
      _name: 'User1',
    };
    const flowData = [{ id: 'userId1', name: 'userName1'}, { id: 'userId2', name: 'userName2'}];

    expect(generatePostResponseMapData(flowData, rawData)).toEqual([
      {
        id: 'userId1',
        name: 'userName1',
        _id: '123',
        _name: 'User1',
      },
      {
        id: 'userId2',
        name: 'userName2',
        _id: '123',
        _name: 'User1',
      },
    ]);
  });
  // test('should return list of records of flowData merged with rawData on each record when flowData is an array and rawData is an array', () => {
  //   // const rawData = [{
  //   //   recordId: '123',
  //   //   recordName: 'User1',
  //   // }];
  //   // const flowData = [{ id: 'userId1', name: 'userName1'}, { id: 'userId2', name: 'userName2'}];

  //   // TODO @Raghu: What should be the expected in this case?
  // });
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
        once: { relativeURI: '/api/v2/users.json', method: 'PUT', body: { test: 5 }},
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
        currentExportDateTime: expect.any(String),
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
describe('getSampleFileMeta util', () => {
  test('should return correct fileMeta', () => {
    expect(getSampleFileMeta()).toEqual([
      {
        fileMeta: {
          fileName: 'sampleFileName',
        },
      },
    ]);
  });
});
describe('isFileMetaExpectedForResource util', () => {
  test('should return false in case of invalid arguments', () => {
    expect(isFileMetaExpectedForResource()).toBeFalsy();
  });
  test('should return true in case of Data loader', () => {
    const resource = {type: 'simple'};

    expect(isFileMetaExpectedForResource(resource)).toBeTruthy();
  });
  test('should return true in case of file adaptor', () => {
    const resource = {adaptorType: 'FTPExport'};

    expect(isFileMetaExpectedForResource(resource)).toBeTruthy();
  });
  test('should return true in case of Rest - Csv Media Type Export', () => {
    const resource = {adaptorType: 'RESTExport'};
    const connection = {
      rest: {
        mediaType: 'csv',
      },
    };

    expect(isFileMetaExpectedForResource(resource, connection)).toBeTruthy();
  });
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
