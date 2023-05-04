
import { select, delay, call } from 'redux-saga/effects';
import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import { throwError } from 'redux-saga-test-plan/providers';
import { selectors } from '../../reducers';
import actions from '../../actions';
import { commitStagedChanges } from '../resources';
import { uploadRawData } from '../uploadFile';
import {
  createFormValuesPatchSet,
  saveDataLoaderRawData,
  deleteUISpecificValues,
  deleteFormViewAssistantValue,
  newIAFrameWorkPayload,
  submitFormValues,
  getFlowUpdatePatchesForNewPGorPP,
  skipRetriesPatches,
  touchFlow,
  updateFlowDoc,
  submitResourceForm,
  saveAndContinueResourceForm,
  saveResourceWithDefinitionID,
  initFormValues,
} from '.';
import { createPayload, pingConnectionWithId } from './connections';
import { requestAssistantMetadata } from '../resources/meta';
import { FORM_SAVE_STATUS } from '../../constants';
import actionTypes from '../../actions/types';
import { apiCallWithRetry } from '..';
import getResourceFormAssets from '../../forms/formFactory/getResourceFromAssets';
import getFieldsWithDefaults from '../../forms/formFactory/getFieldsWithDefaults';
import { APIException } from '../api/requestInterceptors/utils';
import { constructResourceFromFormValues } from '../utils';

jest.mock('../../forms/formFactory/getResourceFromAssets');
jest.mock('../../forms/formFactory/getFieldsWithDefaults');

const apiError = throwError(new APIException({
  status: 422,
  message: '{"message":"invalid data", "code":"invalid_or_missing_field"}',
}));

describe('resourceForm sagas', () => {
  describe('patchFormField saga', () => {});

  describe('createFormValuesPatchSet saga', () => {
    const resourceType = 'imports';
    const resourceId = '123';
    const values = {
      '/name': 'ftp test',
      '/description': 'desc',
    };

    test('should return empty patchSet array if resource does not exist', () => expectSaga(createFormValuesPatchSet, {resourceType, resourceId, values})
      .provide([
        [select(
          selectors.resourceData,
          resourceType,
          resourceId,
        ), {}],
      ])
      .returns({ patchSet: [], finalValues: null })
      .run()
    );
    test('should call getResourceFormAssets and then preSave if exists, if resource custom form does not have preSave', async () => {
      const preSave = jest.fn().mockImplementationOnce(() => ({'/id': 123, '/name': 'Bob'}));

      getResourceFormAssets.mockReturnValue({fieldMap: {field1: {fieldId: 'a'}}, preSave});

      await expectSaga(createFormValuesPatchSet, {resourceType, resourceId, values})
        .provide([
          [select(
            selectors.resourceData,
            resourceType,
            resourceId,
          ), {merged: {_connectionId: 'conn1'}}],
          [select(
            selectors.resource,
            'connections',
            'conn1'
          ), {_id: 'conn1'}],
        ])
        .returns({ patchSet:
        [{ path: '/id', op: 'add', value: {} },
          { op: 'replace', path: '/id', value: 123 },
          { path: '/name', op: 'add', value: {} },
          { op: 'replace', path: '/name', value: 'Bob' }],
        finalValues: { '/id': 123, '/name': 'Bob' } })
        .run();

      expect(getResourceFormAssets.mock.calls).toHaveLength(1);
      expect(getResourceFormAssets).toHaveBeenCalledWith(
        {
          resourceType,
          resource: {_connectionId: 'conn1'},
          connection: {_id: 'conn1'},
          isNew: undefined,
          isHttpConnectorParentFormView: false,
        }
      );
    });
  });

  describe('saveDataLoaderRawData saga', () => {
    const resourceType = 'exports';
    const resourceId = 'res-123';
    const values = {
      '/file/type': 'json',
      '/name': 'Data loader',
      '/outputMode': 'records',
    };

    test('should return passed values if resource is undefined or is not of type simple', async () => {
      const emptyRes = await expectSaga(saveDataLoaderRawData, { resourceId, resourceType, values })
        .provide([
          [select(
            selectors.resourceData,
            resourceType,
            resourceId
          ), {}],
        ])
        .returns(values)
        .run();
      const nonSimpleRes = await expectSaga(saveDataLoaderRawData, { resourceId, resourceType, values })
        .provide([
          [select(
            selectors.resourceData,
            resourceType,
            resourceId
          ), {merged: {_id: 'res-123'}}],
        ])
        .returns(values)
        .run();

      expect(emptyRes).toBeTruthy();
      expect(nonSimpleRes).toBeTruthy();
    });
    test('should return passed values if resource raw data is empty', () => expectSaga(saveDataLoaderRawData, { resourceId, resourceType, values })
      .provide([
        [select(
          selectors.resourceData,
          resourceType,
          resourceId
        ), {merged: {_id: 'res-123', type: 'simple'}}],
        [select(
          selectors.getResourceSampleDataWithStatus,
          resourceId,
          'raw'
        ), {}],
      ])
      .returns(values)
      .run());
    test('should add raw data key and return with values', () => expectSaga(saveDataLoaderRawData, { resourceId, resourceType, values })
      .provide([
        [select(
          selectors.resourceData,
          resourceType,
          resourceId
        ), {merged: {_id: 'res-123', type: 'simple', '/file/type': 'json'}}],
        [select(
          selectors.getResourceSampleDataWithStatus,
          resourceId,
          'raw'
        ), {data: {}}],
        [matchers.call.fn(uploadRawData), 's3key'],
      ])
      .call(uploadRawData, {
        file: '{}',
        fileName: 'file.json',
        fileType: 'application/json',
      })
      .returns({...values, '/rawData': 's3key'})
      .run());
  });

  describe('deleteUISpecificValues saga', () => {
    test('should dispatch removeStage and return values after deleting ui specific values', () => {
      const values = {
        '/name': 'test',
        '/description': 'desc',
        '/formView': 'rest',
      };

      expectSaga(deleteUISpecificValues, { values, resourceId: '123' })
        .put.actionType('RESOURCE_STAGE_REMOVE')
        .returns({
          '/name': 'test',
          '/description': 'desc',
        })
        .run();
    });
    test('should remove keyColums if groupByFields are defined', () => {
      const values = {
        '/file/csv': {keyColumns: ['name']},
        '/description': 'desc',
        '/formView': 'rest',
        '/file/groupByFields': 'name',
      };

      expectSaga(deleteUISpecificValues, { values, resourceId: '123' })
        .put.actionType('RESOURCE_STAGE_REMOVE')
        .returns({
          '/file/csv': {keyColumns: undefined},
          '/description': 'desc',
          '/file/groupByFields': 'name',
        })
        .run();
    });
    test('should not remove keyColums if groupByFields is not defined', () => {
      const values = {
        '/file/csv': {keyColumns: ['name']},
        '/name': 'test',
        '/description': 'desc',
        '/formView': 'rest',
      };

      expectSaga(deleteUISpecificValues, { values, resourceId: '123' })
        .put.actionType('RESOURCE_STAGE_REMOVE')
        .returns({
          '/file/csv': {keyColumns: ['name']},
          '/name': 'test',
          '/description': 'desc',
        })
        .run();
    });
  });

  describe('deleteFormViewAssistantValue saga', () => {
    const resourceId = 'res-123';
    const resourceType = 'imports';

    test('should dispatch patchStaged action with /assistant if resource has useParentForm set', () => expectSaga(deleteFormViewAssistantValue, { resourceType, resourceId })
      .provide([
        [select(
          selectors.resourceData,
          resourceType,
          resourceId,
        ), {merged: {useParentForm: true}}],
      ])
      .put(
        actions.resource.patchStaged(
          resourceId,
          [{ op: 'remove', path: '/assistant' }],
        )
      )
      .put(
        actions.resource.patchStaged(
          resourceId,
          [{ op: 'remove', path: '/useParentForm' }],
        )
      )
      .run()
    );
    test('should not dispatch patchStaged action with /assistant if resource does not have useParentForm set', () => expectSaga(deleteFormViewAssistantValue, { resourceType, resourceId })
      .provide([
        [select(
          selectors.resourceData,
          resourceType,
          resourceId,
        ), {merged: {}}],
      ])
      .not.put(
        actions.resource.patchStaged(
          resourceId,
          [{ op: 'remove', path: '/assistant' }],
        )
      )
      .put(
        actions.resource.patchStaged(
          resourceId,
          [{ op: 'remove', path: '/useParentForm' }],
        )
      )
      .run());
  });

  describe('newIAFrameWorkPayload saga', () => {
    const resourceId = 'res-123';

    test('should return null if staged resource has empty patches or does not contain /newIA patch', async () => {
      const emptyPatch = await expectSaga(newIAFrameWorkPayload, {resourceId})
        .provide([
          [select(
            selectors.stagedResource,
            resourceId
          ), {patch: []}],
        ])
        .returns(null)
        .run();

      const missingPatch = await expectSaga(newIAFrameWorkPayload, {resourceId})
        .provide([
          [select(
            selectors.stagedResource,
            resourceId
          ), {patch: [{path: '/somepath'}]}],
        ])
        .returns(null)
        .run();

      expect(emptyPatch).toBeTruthy();
      expect(missingPatch).toBeTruthy();
    });
    test('should return correct value with assistant and connection type if /newIA patch path', () => {
      const patch = [{
        path: '/newIA',
        value: true,
      },
      {
        path: '/_integrationId',
        value: 'int-123',
      },
      {
        path: '/type',
        op: 'replace',
        value: 'rest',
      },
      {
        path: '/installStepConnection',
        value: {id: 'conn'},
      },
      {
        path: '/assistant',
        op: 'replace',
        value: 'shopify',
      },
      ];

      const output = {
        id: 'int-123',
        connectionType: 'rest',
        assistant: 'shopify',
        installStepConnection: {id: 'conn'},
      };

      expectSaga(newIAFrameWorkPayload, {resourceId})
        .provide([
          [select(
            selectors.stagedResource,
            resourceId
          ), {patch}],
        ])
        .returns(output)
        .run();
    });
  });

  describe('submitFormValues saga', () => {
    const resourceType = 'imports';
    const resourceId = 'imp-123';

    test('should dispatch form submitComplete action and return if its a new IA with installStepConnection', () => expectSaga(submitFormValues, { resourceType, resourceId})
      .provide([
        [call(newIAFrameWorkPayload, {
          resourceId,
        }), {installStepConnection: {id: 'conn123'}}],
        [matchers.call.fn(createPayload), {}],
      ])
      .call(createPayload, {
        values: undefined,
        resourceType: 'connections',
        resourceId,
      })
      .put(
        actions.resourceForm.submitComplete(
          resourceType,
          resourceId,
          {}
        )
      )
      .run());
    test('should call saveDataLoaderRawData if resource type is exports', () => expectSaga(submitFormValues, { resourceType: 'exports', resourceId})
      .provide([
        [call(newIAFrameWorkPayload, {
          resourceId,
        }), null],
        [
          select(selectors.resourceData, 'exports', resourceId),
          { merged: {type: 'simple', rawData: 'someValue', somepath: '123'} },
        ],
        [
          call(constructResourceFromFormValues, { resourceId, resourceType: 'exports', formValues: {'/type': 'simple', '/rawData': 'someValue', '/somepath': '123' } }),
          {type: 'simple', rawData: 'someValue', somepath: '123'},
        ],
        [matchers.call.fn(deleteUISpecificValues), {'/type': 'simple', '/rawData': 'someValue', '/somepath': '123' }],
      ])
      .call(deleteFormViewAssistantValue, {
        resourceType: 'exports',
        resourceId,
      })
      .call(deleteUISpecificValues, {
        values: {},
        resourceId,
      })
      .call(saveDataLoaderRawData, {
        resourceType: 'exports',
        resourceId,
        values: {'/type': 'simple', '/rawData': 'someValue', '/somepath': '123' },
      })
      .run());
    test('should dispatch submitFailed action and return if createFormValuesPatchSet failed with exception', () => expectSaga(submitFormValues, { resourceType, resourceId})
      .provide([
        [call(newIAFrameWorkPayload, {
          resourceId,
        }), null],
        [call(constructResourceFromFormValues, { resourceId, resourceType, formValues: {} }), {}],
        [matchers.call.fn(createFormValuesPatchSet), apiError],
      ])
      .call(createFormValuesPatchSet, {
        resourceType,
        resourceId,
        values: {},
      })
      .put(actions.resourceForm.submitFailed(resourceType, resourceId))
      .run());
    test('should dispatch patchStaged action if patchSet exists', () => {
      const response = { patchSet: [{ path: '/id', op: 'add', value: {} },
        { op: 'replace', path: '/id', value: 123 },
      ] };

      expectSaga(submitFormValues, { resourceType, resourceId})
        .provide([
          [call(newIAFrameWorkPayload, {
            resourceId,
          }), null],
          [matchers.call.fn(createFormValuesPatchSet), response],
        ])
        .call(createFormValuesPatchSet, {
          resourceType,
          resourceId,
          values: {},
        })
        .put(actions.resource.patchStaged(resourceId, response.patchSet))
        .run();
    });
    test('should dispatch submitComplete action and return if skipCommit is true', () => {
      const response = { patchSet: [], finalValues: {'/name': 'some name'} };

      expectSaga(submitFormValues, { resourceType, resourceId})
        .provide([
          [call(newIAFrameWorkPayload, {
            resourceId,
          }), null],
          [matchers.call.fn(createFormValuesPatchSet), response],
          [select(
            selectors.resourceFormState,
            resourceType,
            resourceId
          ), {skipCommit: true}],
        ])
        .call(createFormValuesPatchSet, {
          resourceType,
          resourceId,
          values: {},
        })
        .put(actions.resourceForm.submitComplete(resourceType, resourceId, response.finalValues))
        .run();
    });
    test('should call commitStagedChanges with correct resource type if given type is connectorLicenses', () => {
      const response = { patchSet: [], finalValues: {'/name': 'some name'} };

      expectSaga(submitFormValues, { resourceType: 'connectorLicenses', resourceId, match: {url: '/connectors/edit/connectors/999/'}})
        .provide([
          [call(newIAFrameWorkPayload, {
            resourceId,
          }), null],
          [matchers.call.fn(createFormValuesPatchSet), response],
          [select(
            selectors.stagedResource,
            resourceId,
          ), {patch: [{
            path: '/newIA',
            value: true,
          }]}],
        ])
        .call(createFormValuesPatchSet, {
          resourceType: 'connectorLicenses',
          resourceId,
          values: {},
        })
        .call(commitStagedChanges, {
          resourceType: 'connectors/999/licenses',
          id: resourceId,
          parentContext: undefined,
        })
        .put(actions.resourceForm.submitComplete('connectorLicenses', resourceId, response.finalValues))
        .run();
    });
    test('should call commitStagedChanges with correct resource type if given type is accesstokens', () => {
      const response = { patchSet: [], finalValues: {'/name': 'some name'} };

      expectSaga(submitFormValues, { resourceType: 'accesstokens', resourceId})
        .provide([
          [call(newIAFrameWorkPayload, {
            resourceId,
          }), null],
          [matchers.call.fn(createFormValuesPatchSet), response],
          [select(
            selectors.stagedResource,
            resourceId,
          ), {patch: [{
            path: '/_integrationId',
            op: 'add',
            value: 'new-int-id',
          }]}],
        ])
        .call(createFormValuesPatchSet, {
          resourceType: 'accesstokens',
          resourceId,
          values: {},
        })
        .call(commitStagedChanges, {
          resourceType: 'integrations/new-int-id/accesstokens',
          id: resourceId,
          parentContext: undefined,
        })
        .put(actions.resourceForm.submitComplete('accesstokens', resourceId, response.finalValues))
        .run();
    });
    test('should dispatch submitFailed and not submitComplete if there is a stage conflict', () => {
      const response = { patchSet: [], finalValues: {'/name': 'some name'} };

      expectSaga(submitFormValues, { resourceType, resourceId})
        .provide([
          [call(newIAFrameWorkPayload, {
            resourceId,
          }), null],
          [matchers.call.fn(createFormValuesPatchSet), response],
          [select(
            selectors.stagedResource,
            resourceId,
          ), {patch: [{
            path: '/_integrationId',
            op: 'add',
            value: 'new-int-id',
          }]}],
          [matchers.call.fn(commitStagedChanges), {conflict: {}}],
        ])
        .call(commitStagedChanges, {
          resourceType,
          id: resourceId,
          parentContext: undefined,
        })
        .not.put.actionType('RESOURCE_FORM_SUBMIT_COMPLETE')
        .put(actions.resourceForm.submitFailed(resourceType, resourceId))
        .run();
    });
  });

  describe('getFlowUpdatePatchesForNewPGorPP saga', () => {
    test('should return empty array if resource type is not exports or imports or flow Id is empty', async () => {
      const invalidType = await expectSaga(getFlowUpdatePatchesForNewPGorPP, 'pageGenerators', '1', '2')
        .returns([])
        .run();
      const invalidFlow = await expectSaga(getFlowUpdatePatchesForNewPGorPP, 'exports', '1')
        .returns([])
        .run();

      expect(invalidType).toBeTruthy();
      expect(invalidFlow).toBeTruthy();
    });
    test('should return empty array if its an existing resource and flow is already updated with its reference', () => {
      const data = {
        merged: {},
        master: {
          pageGenerators: [{_exportId: 'res-123'}],
        },
      };

      expectSaga(getFlowUpdatePatchesForNewPGorPP, 'exports', 'res-123', 'flow-123')
        .provide([
          [select(
            selectors.resourceData,
            'flows',
            'flow-123'
          ), data],
        ])
        .returns([])
        .run();
    });
    test('should return correct patches when incoming resource is being replaced at a pending PG/PP', () => {
      const data = {
        merged: {},
        master: {},
      };
      const patches = [{ op: 'add',
        path: '/pageGenerators',
        value: [{ _exportId: 'res-123' }] }];

      expectSaga(getFlowUpdatePatchesForNewPGorPP, 'exports', 'new-123.0', 'flow-123')
        .provide([
          [select(
            selectors.resourceData,
            'flows',
            'flow-123'
          ), data],
          [select(selectors.createdResourceId, 'new-123.0'), 'res-123'],
        ])
        .returns(patches)
        .run();
    });
    test('should return correct patches when resourceType is exports and of lookup type', () => {
      const data = {
        merged: {pageProcessors: [{_exportId: 'someId'}]},
      };
      const patches = [{ op: 'add',
        path: '/pageProcessors/1',
        value: { type: 'export', _exportId: 'res-123' } }];

      expectSaga(getFlowUpdatePatchesForNewPGorPP, 'exports', 'res-123', 'flow-123')
        .provide([
          [select(
            selectors.resourceData,
            'flows',
            'flow-123'
          ), data],
          [select(
            selectors.resource,
            'exports',
            'res-123'
          ), {isLookup: true}],
        ])
        .returns(patches)
        .run();
    });
    test('should return correct patches when resourceType is exports and existing flow has a dataloader type', () => {
      const data = {
        merged: {pageGenerators: [{application: 'dataLoader'}]},
      };
      const patches = [{ op: 'remove', path: '/pageGenerators/0/application' },
        { op: 'add',
          path: '/pageGenerators/0/_exportId',
          value: 'res-123' }];

      expectSaga(getFlowUpdatePatchesForNewPGorPP, 'exports', 'res-123', 'flow-123')
        .provide([
          [select(
            selectors.resourceData,
            'flows',
            'flow-123'
          ), data],
          [select(
            selectors.resource,
            'exports',
            'res-123'
          ), {}],
        ])
        .returns(patches)
        .run();
    });
    test('should return correct patches when resourceType is imports and flow does not contain any pageProcessors', () => {
      const data = {
        merged: {},
      };
      const patches = [{ op: 'add',
        path: '/pageProcessors',
        value:
       [{ type: 'import', _importId: 'res-123' }] }];

      expectSaga(getFlowUpdatePatchesForNewPGorPP, 'imports', 'res-123', 'flow-123')
        .provide([
          [select(
            selectors.resourceData,
            'flows',
            'flow-123'
          ), data],
          [select(
            selectors.resource,
            'imports',
            'res-123'
          ), {}],
        ])
        .returns(patches)
        .run();
    });
  });

  describe('skipRetriesPatches saga', () => {
    const resourceType = 'exports';
    const flowId = 'flow-123';
    const resourceId = 'exp-123';
    const skipRetries = true;

    test('should return null if resource type is not exports', () => expectSaga(skipRetriesPatches, 'imports')
      .returns(null)
      .run());
    test('should return empty array if export is of lookup type', () => expectSaga(skipRetriesPatches, resourceType, flowId, resourceId, skipRetries)
      .provide([
        [select(selectors.createdResourceId, resourceId), null],
        [select(selectors.resource, resourceType, resourceId), {isLookup: true}],
      ])
      .returns([])
      .run());
    test('should return empty array if export is not part of the flow', () => expectSaga(skipRetriesPatches, resourceType, flowId, resourceId, skipRetries)
      .provide([
        [select(selectors.createdResourceId, resourceId), null],
        [select(selectors.resource, resourceType, resourceId), {}],
        [select(selectors.resourceData, 'flows', flowId), {merged: {pageGenerators: [{_exportId: 'exp-456'}]}}],
      ])
      .returns([])
      .run());
    test('should return empty array if skipRetries matches the existing export config', () => expectSaga(skipRetriesPatches, resourceType, flowId, resourceId, skipRetries)
      .provide([
        [select(selectors.createdResourceId, resourceId), null],
        [select(selectors.resource, resourceType, resourceId), {}],
        [select(selectors.resourceData, 'flows', flowId), {merged: {pageGenerators: [{_exportId: 'exp-123', skipRetries: true}]}}],
      ])
      .returns([])
      .run());
    test('should return correct patch for skipRetries', () => expectSaga(skipRetriesPatches, resourceType, flowId, resourceId, skipRetries)
      .provide([
        [select(selectors.createdResourceId, resourceId), null],
        [select(selectors.resource, resourceType, resourceId), {}],
        [select(selectors.resourceData, 'flows', flowId), {merged: {pageGenerators: [{_exportId: 'exp-123'}]}}],
      ])
      .returns([
        {
          op: 'add',
          path: '/pageGenerators/0/skipRetries',
          value: true,
        },
      ])
      .run());
  });

  describe('touchFlow saga', () => {
    test('should return empty array if no flow', () => {
      const exp = { _id: 2, name: 'exp', lastModified: new Date().toISOString() };

      expectSaga(touchFlow, 1, 'exports', 2)
        .provide([
          [select(selectors.resource, 'flows', 1), undefined],
          [select(selectors.resource, 'exports', 2), exp],
        ])
        .returns([])
        .run();
    });
    test('should return empty array if no changed resource', () => {
      const flow = { _id: 1, name: 'flow', lastModified: new Date().toISOString() };

      expectSaga(touchFlow, 1, 'exports', 2)
        .provide([
          [select(selectors.resource, 'flows', 1), flow],
          [select(selectors.resource, 'exports', 2), undefined],
        ])
        .returns([])
        .run();
    });
    test('should return empty array if flow has no lastModified', () => {
      const d2 = new Date().toISOString();
      const flow = { _id: 1, name: 'flow' };
      const exp = { _id: 2, name: 'exp', lastModified: d2 };

      expectSaga(touchFlow, 1, 'exports', 2)
        .provide([
          [select(selectors.resource, 'flows', 1), flow],
          [select(selectors.resource, 'exports', 2), exp],
        ])
        .returns([])
        .run();
    });
    test('should return empty array if change resource has no lastModified', () => {
      const d1 = new Date().toISOString();
      const flow = { _id: 1, name: 'flow', lastModified: d1 };
      const exp = { _id: 2, name: 'exp' };

      expectSaga(touchFlow, 1, 'exports', 2)
        .provide([
          [select(selectors.resource, 'flows', 1), flow],
          [select(selectors.resource, 'exports', 2), exp],
        ])
        .returns([])
        .run();
    });
    test('should not patch flow lastModified if flow has later lastModified', () => {
      const t = new Date().getTime();
      const d1 = new Date(t).toISOString();
      const d2 = new Date(t + 1).toISOString();
      const flow = { _id: 1, name: 'flow', lastModified: d2 };
      const exp = { _id: 2, name: 'exp', lastModified: d1 };

      expectSaga(touchFlow, 1, 'exports', 2)
        .provide([
          [select(selectors.resource, 'flows', 1), flow],
          [select(selectors.resource, 'exports', 2), exp],
        ])
        .returns([])
        .run();
    });
    test('should patch flow lastModified', () => {
      const t = new Date().getTime();
      const d1 = new Date(t).toISOString();
      const d2 = new Date(t + 1).toISOString();
      const flow = { _id: 1, name: 'flow', lastModified: d1 };
      const exp = { _id: 2, name: 'exp', lastModified: d2 };

      expectSaga(touchFlow, 1, 'exports', 2)
        .provide([
          [select(selectors.resource, 'flows', 1), flow],
          [select(selectors.resource, 'exports', 2), exp],
        ])
        .returns([{
          op: 'replace',
          path: '/lastModified',
          value: d2,
        }])
        .run();
    });
    test('should not hack empty pageProcessor responseMapping if no change in lastModified', () => {
      const t = new Date().getTime();
      const d1 = new Date(t).toISOString();
      const d2 = new Date(t).toISOString();
      const flow = {
        _id: 1,
        name: 'flow',
        lastModified: d1,
        pageProcessors: [{
          type: 'import',
          _importId: 11,
        }, {
          type: 'export',
          _exportId: 12,
          responseMapping: {},
        }, {
          type: 'import',
          responseMapping: {
            somethingElse: {},
            fields: [],
            lists: [],
          },
        }, {
          type: 'import',
          responseMapping: {
            nothing: null,
            fields: [{}],
            lists: [],
          },
        }, {
          type: 'import',
          responseMapping: {
            nothing: null,
            fields: [],
            lists: [],
          },
        }],
      };
      const exp = { _id: 2, name: 'exp', lastModified: d2 };

      expectSaga(touchFlow, 1, 'exports', 2)
        .provide([
          [select(selectors.resource, 'flows', 1), flow],
          [select(selectors.resource, 'exports', 2), exp],
        ])
        .returns([])
        .run();
    });
    test('should hack empty pageProcessor empty responseMapping', () => {
      const t = new Date().getTime();
      const d1 = new Date(t).toISOString();
      const d2 = new Date(t + 1).toISOString();
      const flow = {
        _id: 1,
        name: 'flow',
        lastModified: d1,
        pageProcessors: [{
          type: 'import',
          _importId: 11,
        }, {
          type: 'export',
          _exportId: 12,
          responseMapping: {},
        }, {
          type: 'import',
          responseMapping: {
            somethingElse: {},
            fields: [],
            lists: [],
          },
        }, {
          type: 'import',
          responseMapping: {
            nothing: null,
            fields: [{}],
            lists: [],
          },
        }, {
          type: 'import',
          responseMapping: {
            nothing: null,
            fields: [],
            lists: [],
          },
        }],
      };
      const exp = { _id: 2, name: 'exp', lastModified: d2 };

      expectSaga(touchFlow, 1, 'exports', 2)
        .provide([
          [select(selectors.resource, 'flows', 1), flow],
          [select(selectors.resource, 'exports', 2), exp],
        ])
        .returns([{
          op: 'replace',
          path: '/lastModified',
          value: d2,
        }, {
          op: 'remove',
          path: '/pageProcessors/1/responseMapping',
        }, {
          op: 'remove',
          path: '/pageProcessors/4/responseMapping',
        }])
        .run();
    });
  });

  describe('updateFlowDoc saga', () => {
    const flowId = 'flow-123';
    const resourceId = 'res-123';
    const resourceType = 'exports';

    test('should call touchFlow if no flow patches exist', () => expectSaga(updateFlowDoc, { flowId, resourceType, resourceId})
      .provide([
        [matchers.call.fn(getFlowUpdatePatchesForNewPGorPP), []],
      ])
      .call(touchFlow, flowId, resourceType, resourceId)
      .run());
    test('should dispatch patchStaged with skipRetries patches if its not undefined', () => {
      const flowPatches = [
        {
          op: 'add',
          path: '/somepath',
          value: 1,
        },
      ];

      expectSaga(updateFlowDoc, { flowId, resourceType, resourceId, resourceValues: {'/skipRetries': true}})
        .provide([
          [matchers.call.fn(getFlowUpdatePatchesForNewPGorPP), flowPatches],
          [matchers.call.fn(skipRetriesPatches), []],
        ])
        .put(actions.resource.patchStaged(flowId, flowPatches))
        .call(
          skipRetriesPatches,
          resourceType,
          flowId,
          resourceId,
          true
        )
        .put(actions.resource.patchStaged(flowId, []))
        .call(commitStagedChanges, {
          resourceType: 'flows',
          id: flowId,
        })
        .put(actions.flowData.updateFlow(flowId))
        .run();
    });
  });

  describe('submitResourceForm saga', () => {
    const resourceType = 'imports';
    const resourceId = 'res-123';
    const flowId = 'flow-123';

    test('should dispatch clearStaged and not call updateFlowDoc if resource SUBMIT_ABORTED action is triggered', () => expectSaga(submitResourceForm, {resourceId, resourceType})
      .provide([
        [matchers.call.fn(submitFormValues), delay(5)],
      ])
      .dispatch({ type: actionTypes.RESOURCE_FORM.SUBMIT_ABORTED, resourceType, resourceId})
      .put(actions.resource.clearStaged(resourceId))
      .not.call.fn(updateFlowDoc)
      .run()
    );
    test('should not call updateFlowDoc if form submit failed to save', () => expectSaga(submitResourceForm, {resourceId, resourceType})
      .provide([
        [select(
          selectors.resourceFormState,
          resourceType,
          resourceId
        ), {formSaveStatus: FORM_SAVE_STATUS.FAILED}],
        [matchers.call.fn(submitFormValues), {}],
      ])
      .not.call.fn(updateFlowDoc)
      .returns(undefined)
      .run()
    );
    test('should not call updateFlowDoc if skipCommit is true and resource type is not pageGenerator and pageProcessor', () => expectSaga(submitResourceForm, {resourceId, resourceType, flowId})
      .provide([
        [select(
          selectors.resourceFormState,
          resourceType,
          resourceId
        ), {skipCommit: true}],
        [select(
          selectors.resourceData,
          'flows',
          flowId
        ), {merged: {_id: 'flow-123'}}],
        [matchers.call.fn(submitFormValues), {}],
      ])
      .not.call.fn(updateFlowDoc)
      .returns(undefined)
      .run());
    test('should not call updateFlowDoc if skipCommit is true and resource type is either pageGenerator or pageProcessor but no export/import ids are present', () => expectSaga(submitResourceForm, {resourceId, resourceType: 'pageProcessor', flowId})
      .provide([
        [select(
          selectors.resourceFormState,
          'pageProcessor',
          resourceId
        ), {skipCommit: true}],
        [select(
          selectors.resourceData,
          'flows',
          flowId
        ), {merged: {_id: 'flow-123'}}],
        [matchers.call.fn(submitFormValues), {}],
      ])
      .not.call.fn(updateFlowDoc)
      .returns(undefined)
      .run());
    test('should call updateFlowDoc if skipCommit is false', () => expectSaga(submitResourceForm, {resourceId, resourceType, flowId})
      .provide([
        [select(
          selectors.resourceFormState,
          resourceType,
          resourceId
        ), {skipCommit: false}],
        [select(
          selectors.resourceData,
          'flows',
          flowId
        ), {merged: {_id: 'flow-123'}}],
        [matchers.call.fn(submitFormValues), {}],
      ])
      .call(updateFlowDoc, {
        resourceType,
        resourceId,
        flowId,
        resourceValues: undefined,
      })
      .run());
  });

  describe('saveAndContinueResourceForm saga', () => {
    const resourceId = 'res-123';

    test('should call submitResourceForm and not make api call if form submit is not complete', () => expectSaga(saveAndContinueResourceForm, { resourceId })
      .provide([
        [select(
          selectors.resourceFormState,
          'connections',
          resourceId
        ), {submitComplete: false}],
      ])
      .call(submitResourceForm, { resourceId })
      .not.call.fn(apiCallWithRetry)
      .run());
    test('should make /generateoauth2token api call if form submit is complete', () => expectSaga(saveAndContinueResourceForm, { resourceId })
      .provide([
        [select(
          selectors.resourceFormState,
          'connections',
          resourceId
        ), {submitComplete: true}],
        [call(apiCallWithRetry, {
          path: `/connection/${resourceId}/generateoauth2token`,
          opts: {
            method: 'GET',
          },
        }), {}],
      ])
      .call(submitResourceForm, { resourceId })
      .call(apiCallWithRetry, {
        path: `/connection/${resourceId}/generateoauth2token`,
        opts: {
          method: 'GET',
        },
      })
      .run());
    test('should dispatch api failure action if api response contains error', () => expectSaga(saveAndContinueResourceForm, { resourceId })
      .provide([
        [select(
          selectors.resourceFormState,
          'connections',
          resourceId
        ), {submitComplete: true}],
        [call(apiCallWithRetry, {
          path: `/connection/${resourceId}/generateoauth2token`,
          opts: {
            method: 'GET',
          },
        }), {errors: {code: 422}}],
      ])
      .call(submitResourceForm, { resourceId })
      .call(apiCallWithRetry, {
        path: `/connection/${resourceId}/generateoauth2token`,
        opts: {
          method: 'GET',
        },
      })
      .put(
        actions.api.failure(
          `/connection/${resourceId}/generateoauth2token`,
          'GET',
          JSON.stringify({code: 422}),
          false
        )
      )
      .not.call(apiCallWithRetry, {
        path: `/connections/${resourceId}/ping`,
        hidden: true,
      })
      .run());
    test('should callpingConnectionWithId if response is a success', () => expectSaga(saveAndContinueResourceForm, { resourceId })
      .provide([
        [select(
          selectors.resourceFormState,
          'connections',
          resourceId
        ), {submitComplete: true}],
        [call(apiCallWithRetry, {
          path: `/connection/${resourceId}/generateoauth2token`,
          opts: {
            method: 'GET',
          },
        }), {success: true}],
      ])
      .call(submitResourceForm, { resourceId })
      .call(apiCallWithRetry, {
        path: `/connection/${resourceId}/generateoauth2token`,
        opts: {
          method: 'GET',
        },
      })
      .call(pingConnectionWithId, { connectionId: resourceId, parentContext: undefined })
      .run());
    test('should return error and not make /ping call if API throws error', () => expectSaga(saveAndContinueResourceForm, { resourceId })
      .provide([
        [select(
          selectors.resourceFormState,
          'connections',
          resourceId
        ), {submitComplete: true}],
        [call(apiCallWithRetry, {
          path: `/connection/${resourceId}/generateoauth2token`,
          opts: {
            method: 'GET',
          },
        }), apiError],
      ])
      .call(submitResourceForm, { resourceId })
      .call(apiCallWithRetry, {
        path: `/connection/${resourceId}/generateoauth2token`,
        opts: {
          method: 'GET',
        },
      })
      .not.call(apiCallWithRetry, {
        path: `/connections/${resourceId}/ping`,
        hidden: true,
      })
      .returns({error: new APIException({
        status: 422,
        message: '{"message":"invalid data", "code":"invalid_or_missing_field"}',
      })})
      .run());
  });

  describe('saveResourceWithDefinitionID saga', () => {
    const exportFormValues = {resourceId: 'res-123',
      resourceType: 'exports',
      values: {'/file/filedefinition/rules': 'some rules'},
    };
    const importFormValues = {resourceId: 'res-123',
      resourceType: 'imports',
      values: {'/file/filedefinition/rules': 'some rules'},
    };

    const fileDefinitionDetails = { definitionId: 'def-id', resourcePath: '/path' };
    const flowId = 'flow-123';

    test('should dispatch resource form submit action with values containing resource path if resource type is exports', () => {
      const newValues = {
        '/file/type': 'filedefinition',
        '/file/fileDefinition/_fileDefinitionId': fileDefinitionDetails.definitionId,
        '/file/fileDefinition/resourcePath': fileDefinitionDetails.resourcePath,
      };

      expectSaga(saveResourceWithDefinitionID, {
        formValues: exportFormValues,
        fileDefinitionDetails,
        flowId})
        .put(
          actions.resourceForm.submit(
            exportFormValues.resourceType,
            exportFormValues.resourceId,
            newValues,
            null,
            false,
            false,
            flowId
          )
        )
        .run();
    });
    test('should dispatch resource form submit action with values not containing resource path if resource type is not exports', () => {
      const newValues = {
        '/file/type': 'filedefinition',
        '/file/fileDefinition/_fileDefinitionId': fileDefinitionDetails.definitionId,
      };

      expectSaga(saveResourceWithDefinitionID, {
        formValues: importFormValues,
        fileDefinitionDetails,
        flowId,
        skipClose: true})
        .put(
          actions.resourceForm.submit(
            importFormValues.resourceType,
            importFormValues.resourceId,
            newValues,
            null,
            true,
            false,
            flowId
          )
        )
        .run();
    });
  });

  describe('initFormValues saga', () => {
    const resourceType = 'exports';
    const resourceId = 'res-123';
    const flowId = 'flow-123';
    const integrationId = 'int-123';

    test('should dispatch initFailed action if resource is empty', () => expectSaga(initFormValues, {
      resourceType,
      resourceId,
      flowId,
      integrationId,
    })
      .provide([
        [select(
          selectors.resourceData,
          resourceType,
          resourceId,
        ), {merged: {}}],
      ])
      .put(actions.resourceForm.initFailed(resourceType, resourceId))
      .returns(undefined)
      .run()
    );
    test('should dispatch patchStaged action if resource is assistant type but assistant metadata does not exist', () => expectSaga(initFormValues, {
      resourceType,
      resourceId,
      flowId,
      integrationId,
    })
      .provide([
        [select(
          selectors.resourceData,
          resourceType,
          resourceId,
        ), {merged: {adaptorType: 'RESTExport', assistant: 'shopify'}}],
      ])
      .put(
        actions.resource.patchStaged(
          resourceId,
          [{ op: 'add', path: '/assistantMetadata', value: {} }],
        )
      )
      .run());
    test('should call requestAssistantMetadata if assistantData is not available in the state', () => expectSaga(initFormValues, {
      resourceType,
      resourceId,
      flowId,
      integrationId,
    })
      .provide([
        [select(
          selectors.resourceData,
          resourceType,
          resourceId,
        ), {merged: {adaptorType: 'RESTExport', assistant: 'shopify', assistantMetadata: 'some data'}}],
        [select(selectors.assistantData, {
          adaptorType: 'rest',
          assistant: 'shopify',
        }), undefined],
      ])
      .call(requestAssistantMetadata, {
        adaptorType: 'rest',
        assistant: 'shopify',
      })
      .run());
    test('should dispatch initComplete action if field meta is correctly generated', () => {
      const defaultFormAssets = {
        fieldMeta: {
          fieldMap: {
            'file.csv': {fieldId: 'file.csv'},
          },
        },
      };
      const fieldMeta = {
        name: {
          defaultValue: 'nnnn',
          fieldId: 'name',
          id: 'name',
          label: 'Name',
          name: '/name',
        },
      };

      getResourceFormAssets.mockReturnValue(defaultFormAssets);
      getFieldsWithDefaults.mockReturnValue(fieldMeta);

      expectSaga(initFormValues, {
        resourceType,
        resourceId,
        flowId,
        integrationId,
        isNew: true,
      })
        .provide([
          [select(
            selectors.resourceData,
            resourceType,
            resourceId,
          ), {merged: {adaptorType: 'RESTExport'}}],
        ])
        .put(
          actions.resourceForm.initComplete(
            resourceType,
            resourceId,
            fieldMeta,
            true,
            undefined,
            flowId
          )
        )
        .run();
    });
    test('should dispatch initFailed action if field meta failed to generate with exception', () => {
      const defaultFormAssets = {
        fieldMeta: {
          fieldMap: {
            'file.csv': {fieldId: 'file.csv'},
          },
        },
      };

      getResourceFormAssets.mockReturnValue(defaultFormAssets);
      getFieldsWithDefaults.mockImplementation(() => {
        throw new Error('some error');
      });

      expectSaga(initFormValues, {
        resourceType,
        resourceId,
        flowId,
        integrationId,
        isNew: true,
      })
        .provide([
          [select(
            selectors.resourceData,
            resourceType,
            resourceId,
          ), {merged: {adaptorType: 'RESTExport'}}],
        ])
        .not.put.actionType('RESOURCE_FORM_INIT_COMPLETE')
        .put(actions.resourceForm.initFailed(resourceType, resourceId))
        .run();
    });
  });
});
