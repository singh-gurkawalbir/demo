/* global describe, test */

import { select, call } from 'redux-saga/effects';
import { expectSaga } from 'redux-saga-test-plan';
import actions from '../../../actions';
import { selectors } from '../../../reducers';
import { onResourceCreate, onResourceUpdate, _fetchAndSaveRawDataForResource } from '.';
import saveTransformationRulesForNewXMLExport from '../utils/xmlTransformationRulesGenerator';
import saveRawDataForFileAdaptors from './fileAdaptorUpdates';
import { exportPreview } from '../utils/previewCalls';
import { saveRawDataOnResource, removeRawDataOnResource } from './utils';

describe('rawDataUpdates sagas', () => {
  const flowId = 'f1';

  describe('onResourceCreate saga', () => {
    test('should do nothing if the resourceType is not imports/exports', () => expectSaga(onResourceCreate, { id: 'script-123', resourceType: 'scripts'})
      .not.call.fn(saveTransformationRulesForNewXMLExport)
      .run()
    );
    test('should call saveTransformationRulesForNewXMLExport and then _fetchAndSaveRawDataForResource incase of exports', () => {
      const resourceId = 'export-123';
      const tempId = 'new-123';
      const resource = {
        _id: resourceId,
        name: 'rest export',
        rawData: 'rawData1234',
        adaptorType: 'RESTExport',
      };

      return expectSaga(onResourceCreate, { id: resourceId, resourceType: 'exports', tempId})
        .provide([
          [select(selectors.resource, 'exports', resourceId), resource],
          [select(selectors.resourceFormState, 'exports', tempId), {flowId}],
        ])
        .call(saveTransformationRulesForNewXMLExport, {
          resourceId,
          tempResourceId: tempId,
        })
        .call(_fetchAndSaveRawDataForResource, {
          type: 'exports',
          resourceId,
          tempResourceId: tempId,
          flowId,
        })
        .run();
    }
    );
    test('should not call _fetchAndSaveRawDataForResource if the resource is a lookup', () => {
      const resourceId = 'lookup-123';
      const tempId = 'new-123';
      const resource = {
        _id: resourceId,
        name: 'rest lookup',
        rawData: 'rawData1234',
        adaptorType: 'RESTExport',
        isLookup: true,
      };

      return expectSaga(onResourceCreate, { id: resourceId, resourceType: 'exports', tempId})
        .provide([
          [select(selectors.resource, 'exports', resourceId), resource],
          [select(selectors.resourceFormState, 'exports', tempId), {flowId}],
        ])
        .call(saveTransformationRulesForNewXMLExport, {
          resourceId,
          tempResourceId: tempId,
        })
        .not.call(_fetchAndSaveRawDataForResource, {
          type: 'exports',
          resourceId,
          tempResourceId: tempId,
          flowId,
        })
        .run();
    });

    test('should call _fetchAndSaveRawDataForResource if the resource is a lookup and resource is of file adaptor type', () => {
      const resourceId = 'lookup-123';
      const tempId = 'new-123';
      const resource = {
        _id: resourceId,
        name: 'rest lookup',
        rawData: 'rawData1234',
        adaptorType: 'FTPExport',
        isLookup: true,
      };

      return expectSaga(onResourceCreate, { id: resourceId, resourceType: 'exports', tempId})
        .provide([
          [select(selectors.resource, 'exports', resourceId), resource],
          [select(selectors.resourceFormState, 'exports', tempId), {flowId}],
        ])
        .call(saveTransformationRulesForNewXMLExport, {
          resourceId,
          tempResourceId: tempId,
        })
        .call(_fetchAndSaveRawDataForResource, {
          type: 'exports',
          resourceId,
          tempResourceId: tempId,
          flowId,
        })
        .run();
    });
    test('should call _fetchAndSaveRawDataForResource incase of imports', () => {
      const resourceId = 'import-123';
      const tempId = 'new-123';
      const resource = {
        _id: resourceId,
        name: 'rest import',
        adaptorType: 'RESTImport',
      };

      return expectSaga(onResourceCreate, { id: resourceId, resourceType: 'imports', tempId})
        .provide([
          [select(selectors.resource, 'imports', resourceId), resource],
        ])
        .not.call(saveTransformationRulesForNewXMLExport, {
          resourceId,
          tempResourceId: tempId,
        })
        .call(_fetchAndSaveRawDataForResource, {
          type: 'imports',
          resourceId,
          tempResourceId: tempId,
        })
        .run();
    });
  });
  describe('onResourceUpdate saga', () => {
    test('should do nothing if the resourceType is not a valid one', () => expectSaga(onResourceUpdate, {resourceId: 'script-123', resourceType: 'scripts'})
      .not.call.fn(_fetchAndSaveRawDataForResource)
      .run());
    test('should do nothing if the patchSet is empty', () => {
      const patch = [];

      return expectSaga(onResourceUpdate, { resourceId: 'export-123', resourceType: 'exports', patch})
        .not.call.fn(_fetchAndSaveRawDataForResource)
        .run();
    });
    test('should not call _fetchAndSaveRawDataForResource for flows if the patchSet does not have a newly added lookup', () => {
      const flowPatchSet = [{
        op: 'replace',
        path: '/lastModified',
        value: '2020-12-03T11:49:53.921Z',
      },
      {
        op: 'remove',
        path: '/pageProcessors/0/responseMapping',
      }];
      const resourceId = 'flow-123';
      const resourceType = 'flows';

      return expectSaga(onResourceUpdate, { resourceId, resourceType, patch: flowPatchSet })
        .not.call.fn(_fetchAndSaveRawDataForResource)
        .run();
    });
    test('should call _fetchAndSaveRawDataForResource for flows with the newly added lookup id from the patchSet ', () => {
      const flowPatchSet = [{
        op: 'add',
        path: '/pageProcessors/1',
        value: {
          type: 'export',
          _exportId: '1234',
        },
      }];
      const flowId = 'flow-123';
      const resourceType = 'flows';

      return expectSaga(onResourceUpdate, { resourceId: flowId, resourceType, patch: flowPatchSet })
        .call(_fetchAndSaveRawDataForResource, {
          type: 'pageprocessors',
          flowId,
          resourceId: '1234',
        })
        .run();
    });
    test('should not call _fetchAndSaveRawDataForResource if the patchSet does not have fields that could effect sample data incase of both exports/imports resources', () => {
      const rawDataPatchSet = [
        {
          path: '/rawData',
          value: 'sdf456dsfgsdfghj',
          op: 'add',
        },
      ];
      const resourceId = 'export-123';
      const resourceType = 'exports';

      return expectSaga(onResourceUpdate, { resourceId, resourceType, patch: rawDataPatchSet })
        .not.call(_fetchAndSaveRawDataForResource)
        .run();
    });

    test('should call _fetchAndSaveRawDataForResource with exports type incase of lookups and resource is of file adaptor type', () => {
      const relativeUriPatchSet = [{
        path: '/rest/relativeURI',
        op: 'replace',
        value: '/api/v2/users.json',
      }];
      const resourceId = 'lookup-123';
      const resourceType = 'exports';
      const flowId = 'flow-1234';
      const master = {
        _id: resourceId,
        name: 'rest lookup',
        rawData: 'rawData1234',
        adaptorType: 'RESTExport',
        isLookup: true,
      };

      const flow = {
        _id: flowId,
        name: 'sample flow',
        pageGenerators: [{_exportId: 'export-444' }],
        pageProcessors: [{ type: 'export', _exportId: resourceId }, { type: 'import', _exportId: 'import-123' }],
      };

      return expectSaga(onResourceUpdate, { resourceType, resourceId, patch: relativeUriPatchSet, master})
        .provide([
          [select(
            selectors.resourceFormState,
            resourceType,
            resourceId
          ), { flowId }],
          [select(selectors.resource, 'flows', flowId), flow],
          [select(selectors.resource, resourceType, resourceId), {
            adaptorType: 'HTTPExport',
            http: {
              type: 'file',
            },
          }],
        ])
        .call(_fetchAndSaveRawDataForResource, {
          type: 'exports',
          resourceId,
          flowId,
        })
        .run();
    });
    test('should call _fetchAndSaveRawDataForResource with pageProcessors type incase of lookups or exports incase of exports', () => {
      const relativeUriPatchSet = [{
        path: '/rest/relativeURI',
        op: 'replace',
        value: '/api/v2/users.json',
      }];
      const resourceId = 'lookup-123';
      const resourceType = 'exports';
      const flowId = 'flow-1234';
      const master = {
        _id: resourceId,
        name: 'rest lookup',
        rawData: 'rawData1234',
        adaptorType: 'RESTExport',
        isLookup: true,
      };

      const test1 = expectSaga(onResourceUpdate, {resourceType, resourceId, patch: relativeUriPatchSet, master})
        .provide([
          [select(
            selectors.resourceFormState,
            resourceType,
            resourceId
          ), { flowId }],
        ])
        .call(_fetchAndSaveRawDataForResource, {
          type: 'pageprocessors',
          flowId,
          resourceId,
        })
        .run();
      const master2 = {
        _id: resourceId,
        name: 'rest lookup',
        adaptorType: 'RESTExport',
      };
      const test2 = expectSaga(onResourceUpdate, { resourceType, resourceId, patch: relativeUriPatchSet, master: master2})
        .provide([
          [select(
            selectors.resourceFormState,
            resourceType,
            resourceId
          ), { flowId }],
        ])
        .call(_fetchAndSaveRawDataForResource, {
          type: 'exports',
          resourceId,
          flowId,
        })
        .run();
      const flow = {
        _id: flowId,
        name: 'sample flow',
        pageGenerators: [{_exportId: 'export-444' }],
        pageProcessors: [{ type: 'export', _exportId: resourceId }, { type: 'import', _exportId: 'import-123' }],
      };
      const test3 = expectSaga(onResourceUpdate, { resourceType, resourceId, patch: relativeUriPatchSet, master})
        .provide([
          [select(
            selectors.resourceFormState,
            resourceType,
            resourceId
          ), { flowId }],
          [select(selectors.resource, 'flows', flowId), flow],
        ])
        .call(_fetchAndSaveRawDataForResource, {
          type: 'pageprocessors',
          flowId,
          resourceId,
        })
        .run();

      return test1 && test2 && test3;
    });
    test('should call _fetchAndSaveRawDataForResource with imports type incase of imports resourceType ', () => {
      const patchSet = [{
        path: '/name',
        op: 'replace',
        value: 'new name',
      }];
      const resourceId = 'import-123';
      const resourceType = 'imports';
      const importResource = {
        _id: resourceId,
        name: 'rest import',
        adaptorType: 'RESTImport',
      };

      return expectSaga(onResourceUpdate, { resourceId, resourceType, patch: patchSet})
        .provide([
          [select(
            selectors.resourceData,
            'imports',
            resourceId
          ), { merged: importResource}],
        ])
        .call(_fetchAndSaveRawDataForResource, {
          type: 'imports',
          resourceId,
        })
        .run();
    });
    test('should dispatch resetAssistantImportPreview action if the import is an assistant', () => {
      const patchSet = [{
        path: '/name',
        op: 'replace',
        value: 'new name',
      }];
      const resourceId = 'import-123';
      const resourceType = 'imports';
      const importResource = {
        _id: resourceId,
        name: 'rest import',
        adaptorType: 'RESTImport',
        assistant: 'bigcommerce',
      };

      return expectSaga(onResourceUpdate, { resourceId, resourceType, patch: patchSet})
        .provide([
          [select(
            selectors.resourceData,
            'imports',
            resourceId
          ), { merged: importResource}],
        ])
        .put(
          actions.metadata.resetAssistantImportPreview(resourceId)
        )
        .not.call.fn(_fetchAndSaveRawDataForResource)
        .run();
    });
  });
  describe('_fetchAndSaveRawDataForResource saga', () => {
    test('should return nothing if the resource is blob type or real time ', () => {
      const blobResource = {
        _id: 'blob-234',
        name: 'Blob export',
        type: 'blob',
      };
      const realTimeExport = {
        _id: 'ns-1234',
        name: 'Netsuite Export',
        adaptorType: 'NetSuiteExport',
        type: 'distributed',
      };
      const type = 'exports';

      const test1 = expectSaga(_fetchAndSaveRawDataForResource, { type, resourceId: 'ns-1234'})
        .provide([
          [select(
            selectors.resource,
            type,
            'ns-1234'
          ), realTimeExport],
        ])
        .not.call.fn(saveRawDataForFileAdaptors)
        .not.call.fn(exportPreview)
        .returns(undefined)
        .run();
      const test2 = expectSaga(_fetchAndSaveRawDataForResource, { type, resourceId: 'blob-234'})
        .provide([
          [select(
            selectors.resource,
            type,
            'blob-234'
          ), blobResource],
        ])
        .not.call.fn(saveRawDataForFileAdaptors)
        .not.call.fn(exportPreview)
        .returns(undefined)
        .run();

      return test1 && test2;
    });
    test('should call saveRawDataForFileAdaptors incase of file adaptors and not call exportPreview', () => {
      const ftpExport = {
        _id: 'ftp-123',
        name: 'FTP export',
        adaptorType: 'FTPExport',
        ftp: {
          directoryPath: '/Test',
        },
        file: {
          type: 'json',
        },
      };
      const type = 'exports';

      return expectSaga(_fetchAndSaveRawDataForResource, { type, resourceId: 'ftp-123', tempResourceId: 'temp-123'})
        .provide([
          [select(
            selectors.resource,
            type,
            'ftp-123'
          ), ftpExport],
        ])
        .call(saveRawDataForFileAdaptors, {
          resourceId: 'ftp-123',
          tempResourceId: 'temp-123',
          type,
        })
        .not.call.fn(exportPreview)
        .run();
    });
    test('should call exportPreview and saveRawDataOnResource incase it has preview data for exports', () => {
      const resourceId = 'export-123';
      const tempId = 'new-123';
      const restResource = {
        _id: resourceId,
        name: 'rest export',
        rawData: 'rawData1234',
        adaptorType: 'RESTExport',
      };
      const type = 'exports';
      const rawData = {
        headers: {
          'content-type': 'application/json',
        },
        statusCode: 200,
        url: 'https://celigohelp.zendesk.com/api/v2/users.json',
        body: '{"users": [{id: "123", name: "user1"}]}',
      };
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
          data: [rawData],
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

      return expectSaga(_fetchAndSaveRawDataForResource, { type, resourceId, tempResourceId: tempId, flowId})
        .provide([
          [select(
            selectors.resource,
            type,
            resourceId
          ), restResource],
          [call(exportPreview, {
            resourceId,
            hidden: true,
            flowId,
          }), previewData],
        ])
        .not.call.fn(saveRawDataForFileAdaptors)
        .call(exportPreview, {
          resourceId,
          hidden: true,
          flowId,
        })
        .call(saveRawDataOnResource, {
          resourceId,
          rawData: JSON.stringify(rawData),
        })
        .run();
    });
    test('should call removeRawDataOnResource if there is no preview data for export', () => {
      const resourceId = 'export-123';
      const tempId = 'new-123';
      const restResource = {
        _id: resourceId,
        name: 'rest export',
        rawData: 'rawData1234',
        adaptorType: 'RESTExport',
      };
      const type = 'exports';

      return expectSaga(_fetchAndSaveRawDataForResource, { type, resourceId, tempResourceId: tempId, flowId})
        .provide([
          [select(
            selectors.resource,
            type,
            resourceId
          ), restResource],
          [call(exportPreview, {
            resourceId,
            hidden: true,
            flowId,
          }), undefined],
        ])
        .not.call.fn(saveRawDataForFileAdaptors)
        .call(exportPreview, {
          resourceId,
          hidden: true,
          flowId,
        })
        .not.call.fn(saveRawDataOnResource)
        .call(removeRawDataOnResource, { resourceId })
        .run();
    });
    test('should do nothing incase of type other than exports', () => {
      const type = 'imports';

      return expectSaga(_fetchAndSaveRawDataForResource, { resourceId: 'import-123', type })
        .not.call.fn(saveRawDataForFileAdaptors)
        .not.call.fn(exportPreview)
        .not.call.fn(saveRawDataOnResource)
        .not.call.fn(removeRawDataOnResource)
        .run();
    });
  });
});

