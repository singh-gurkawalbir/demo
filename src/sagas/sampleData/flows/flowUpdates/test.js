/* global describe, test */

import { select } from 'redux-saga/effects';
import { expectSaga } from 'redux-saga-test-plan';
import actions from '../../../../actions';
import { selectors } from '../../../../reducers';
import { updateFlowDoc, SCOPES } from '../../../resourceForm';
import { updateFlowOnResourceUpdate, updateFlowData, updateFlowsDataForResource, _updateResponseMapping } from '.';
import { getSubsequentStages } from '../../../../utils/flowData';

describe('flow updates sagas', () => {
  describe('updateFlowOnResourceUpdate saga', () => {
    test('should not trigger updateFlowDoc when no flowId context for export', () => expectSaga(updateFlowOnResourceUpdate, {
      resourceType: 'exports',
      resourceId: 123,
    })
      .put(actions.flowData.updateFlowsForResource(123, 'exports'))
      .not.call.fn(updateFlowDoc)
      .run());
    test('should not trigger updateFlowDoc when no flowId context for import', () => expectSaga(updateFlowOnResourceUpdate, {
      resourceType: 'imports',
      resourceId: 123,
      context: null,
    })
      .put(actions.flowData.updateFlowsForResource(123, 'imports'))
      .not.call.fn(updateFlowDoc)
      .run());
    test('should not trigger updateFlowDoc when no flowId context for script', () => expectSaga(updateFlowOnResourceUpdate, {
      resourceType: 'scripts',
      resourceId: 123,
      context: {
        somethingElse: {},
      },
    })
      .put(actions.flowData.updateFlowsForResource(123, 'scripts'))
      .not.call.fn(updateFlowDoc)
      .run());
    test('should trigger updateFlowDoc when there is flowId context for export', () => {
      const resourceType = 'exports';
      const resourceId = '123';
      const flowId = '456';

      return expectSaga(updateFlowOnResourceUpdate, {
        resourceType,
        resourceId,
        context: {
          flowId,
        },
      })
        .call(updateFlowDoc, {
          flowId,
          resourceType,
          resourceId,
        })
        .run();
    });
    test('should trigger updateFlowDoc when there is flowId context for import', () => {
      const resourceType = 'imports';
      const resourceId = '123';
      const flowId = '456';

      return expectSaga(updateFlowOnResourceUpdate, {
        resourceType,
        resourceId,
        context: {
          flowId,
        },
      })
        .call(updateFlowDoc, {
          flowId,
          resourceType,
          resourceId,
        })
        .run();
    });
    test('should trigger updateFlowDoc when there is flowId context for scripts', () => {
      const resourceType = 'scripts';
      const resourceId = '123';
      const flowId = '456';

      return expectSaga(updateFlowOnResourceUpdate, {
        resourceType,
        resourceId,
        context: {
          flowId,
        },
      })
        .call(updateFlowDoc, {
          flowId,
          resourceType,
          resourceId,
        })
        .run();
    });
    test('should do nothing when patchSet is empty for any resourceType', () => {
      const test1 = expectSaga(updateFlowOnResourceUpdate, {
        resourceType: 'exports',
      })
        .not.put(actions.flowData.updateFlow(undefined))
        .not.call.fn(_updateResponseMapping)
        .not.put(actions.flowData.updateFlowsForResource(undefined, 'flows', []))
        .run();
      const test2 = expectSaga(updateFlowOnResourceUpdate, {
        resourceType: 'flows',
      })
        .not.put(actions.flowData.updateFlow(undefined))
        .not.call.fn(_updateResponseMapping)
        .not.put(actions.flowData.updateFlowsForResource(undefined, 'flows', []))
        .run();

      return test1 && test2;
    });
    test('should do nothing incase of flows when patchSet does not have change of sequence of pp/pg or responseMapping update', () => {
      const patchSet = [{
        op: 'replace',
        path: '/name',
        value: 'flow test',
      }];

      return expectSaga(updateFlowOnResourceUpdate, {
        resourceId: 'flow-123',
        resourceType: 'flows',
        patch: patchSet,
      })
        .not.call.fn(_updateResponseMapping)
        .run();
    });
    test('should do nothing incase of export/imports when patchSet has rawData patch ', () => {
      const patchSet = [
        {
          path: '/rawData',
          value: 'sdf456dsfgsdfghj',
          op: 'add',
        },
      ];

      return expectSaga(updateFlowOnResourceUpdate, {
        resourceId: 'export-123',
        resourceType: 'exports',
        patch: patchSet,
      })
        .not.put(actions.flowData.updateFlowsForResource(undefined, 'flows', []))
        .run();
    });
    test('should dispatch updateFlow when pp/pg sequence is changed on a flow ', () => {
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

      return expectSaga(updateFlowOnResourceUpdate, {
        resourceId: 'flow-123',
        resourceType: 'flows',
        patch: flowPatchSet,
      })
        .put(actions.flowData.updateFlow('flow-123'))
        .not.call.fn(_updateResponseMapping)
        .run();
    });
    test('should call updateResponseMapping saga when responseMapping is updated on a flow', () => {
      const flowPatchSet = [
        {
          op: 'replace',
          path: '/pageProcessors/0/responseMapping',
          value: {
            fields: [{ extract: 'id', generate: 'userID'}],
            lists: [],
          },
        },
      ];
      const flow = {
        _id: 'flow-123',
        name: 'test-flow',
        pageGenerators: [],
        pageProcessors: [
          {
            responseMapping: {
              fields: [
                {
                  extract: 'data',
                  generate: 'sdfg',
                },
              ],
              lists: [],
            },
            type: 'export',
            _exportId: 'export-123',
          },
        ],
      };

      return expectSaga(updateFlowOnResourceUpdate, {
        resourceId: 'flow-123',
        resourceType: 'flows',
        patch: flowPatchSet,
      })
        .provide([
          [select(
            selectors.resourceData,
            'flows',
            'flow-123',
            SCOPES.VALUE
          ), { merged: flow}],
        ])
        .not.put(actions.flowData.updateFlow('flow-123'))
        .call.fn(_updateResponseMapping)
        .run();
    });
    test('should dispatch updateFlowsForResource action when there is a patchSet for exports/imports/scripts', () => {
      const hooksPatchSet = [{
        path: '/hooks',
        op: 'replace',
        value: {
          preSavePage: { _scriptId: '5df366d52af2f07355f590ea', function: 'preSavePageFunction' },
        },
      }];
      const stagesToReset = ['preSavePage', ...getSubsequentStages('preSavePage', 'exports')];

      return expectSaga(updateFlowOnResourceUpdate, {
        resourceId: 'export-123',
        resourceType: 'exports',
        patch: hooksPatchSet,
      })
        .put(actions.flowData.updateFlowsForResource('export-123', 'exports', stagesToReset))
        .run();
    });
  });
  describe('_updateResponseMapping saga', () => {
    test('should not dispatch updateResponseMapping, resetStages action incase of invalid flowId/resourceIndex', () => expectSaga(_updateResponseMapping, { flowId: 'INVALID_FLOW_ID' })
      .not.put(
        actions.flowData.updateResponseMapping(
          'INVALID_FLOW_ID',
          undefined,
          undefined
        )
      )
      .not.put(
        actions.flowData.resetStages(
          'INVALID_FLOW_ID',
          undefined,
          []
        )
      )
      .returns(undefined)
      .run());
    test('should dispatch (incase of lookup) updateResponseMapping with new response mapping object at resourceIndex', () => {
      const updatedResponseMapping = {
        fields: [
          {
            extract: 'data',
            generate: 'sdfg',
          },
        ],
        lists: [],
      };
      const flow = {
        _id: 'flow-123',
        name: 'test-flow',
        pageGenerators: [{ _exportId: 'export-111'}],
        pageProcessors: [
          {
            responseMapping: updatedResponseMapping,
            type: 'export',
            _exportId: 'export-123',
          },
        ],
      };
      const stagesToReset = ['responseMapping', ...getSubsequentStages('responseMapping', 'exports')];

      return expectSaga(_updateResponseMapping, { flowId: 'flow-123', resourceIndex: 0 })
        .provide([
          [select(
            selectors.resourceData,
            'flows',
            'flow-123',
            SCOPES.VALUE
          ), {merged: flow}],
        ])
        .put(actions.flowData.updateResponseMapping('flow-123', 0, updatedResponseMapping))
        .put(actions.flowData.resetStages('flow-123', 'export-123', stagesToReset))
        .run();
    });
    test('should dispatch (incase of import) resetStages with the dependent stages to reset when response mapping is updated', () => {
      const updatedResponseMapping = {
        fields: [
          {
            extract: 'data',
            generate: 'sdfg',
          },
        ],
        lists: [],
      };
      const flow = {
        _id: 'flow-123',
        name: 'test-flow',
        pageGenerators: [{ _exportId: 'export-111'}],
        pageProcessors: [
          {
            responseMapping: {},
            type: 'export',
            _exportId: 'export-123',
          },
          {
            responseMapping: updatedResponseMapping,
            type: 'import',
            _importId: 'import-123',
          },
          {
            type: 'import',
            _importId: 'import-456',
          },
        ],
      };
      const stagesToReset = ['responseMapping', ...getSubsequentStages('responseMapping', 'imports')];

      return expectSaga(_updateResponseMapping, { flowId: 'flow-123', resourceIndex: 1 })
        .provide([
          [select(
            selectors.resourceData,
            'flows',
            'flow-123',
            SCOPES.VALUE
          ), {merged: flow}],
        ])
        .put(actions.flowData.updateResponseMapping('flow-123', 1, updatedResponseMapping))
        .put(actions.flowData.resetStages('flow-123', 'import-123', stagesToReset))
        .run();
    });
  });
  describe('updateFlowsDataForResource saga', () => {
    test('should do nothing when passed resourceId/resourceTypes are invalid', () => expectSaga(updateFlowsDataForResource, {})
      .not.put(actions.flowData.resetStages(undefined, undefined, undefined))
      .run());
    test('should do nothing if there are no flows that has passed resourceId as PG/PP/script', () => {
      const resourceId = 'export-123';
      const resourceType = 'exports';

      return expectSaga(updateFlowsDataForResource, { resourceId, resourceType })
        .provide([
          [select(
            selectors.flowReferencesForResource,
            resourceType,
            resourceId
          ), []],
        ])
        .not.put(actions.flowData.resetStages(undefined, undefined, undefined))
        .run();
    });
    test('should dispatch resetStages action for all the flows that include passed exportId', () => {
      const exportId = 'export-123';
      const resourceType = 'exports';
      const flowReferencesThatUseExportId = [{
        flowId: 'flow-123',
        resourceId: exportId,
      }, {
        flowId: 'flow-456',
        resourceId: exportId,
      }];

      return expectSaga(updateFlowsDataForResource, { resourceId: exportId, resourceType })
        .provide([
          [select(
            selectors.flowReferencesForResource,
            resourceType,
            exportId
          ), flowReferencesThatUseExportId],
        ])
        .put(actions.flowData.resetStages(flowReferencesThatUseExportId[0].flowId, exportId, []))
        .put(actions.flowData.resetStages(flowReferencesThatUseExportId[1].flowId, exportId, []))
        .run();
    });
    test('should dispatch resetStages action for all the flows that include passed scriptId', () => {
      const scriptId = 'script-123';
      const resourceType = 'scripts';
      const flowReferencesThatUseScriptId = [{
        flowId: 'flow-123',
        resourceId: 'export-123',
      }, {
        flowId: 'flow-456',
        resourceId: 'export-567',
      }];

      return expectSaga(updateFlowsDataForResource, { resourceId: scriptId, resourceType })
        .provide([
          [select(
            selectors.flowReferencesForResource,
            resourceType,
            scriptId
          ), flowReferencesThatUseScriptId],
        ])
        .put(actions.flowData.resetStages(flowReferencesThatUseScriptId[0].flowId, flowReferencesThatUseScriptId[0].resourceId, []))
        .put(actions.flowData.resetStages(flowReferencesThatUseScriptId[1].flowId, flowReferencesThatUseScriptId[1].resourceId, []))
        .run();
    });
  });
  describe('updateFlowData saga', () => {
    test('should not dispatch resetFlowSequence action if the flowId is invalid', () =>
      expectSaga(updateFlowData, {})
        .not.put(actions.flowData.resetFlowSequence(undefined, undefined))
        .run()
    );
    test('should dispatch resetFlowSequence action for a valid flowId', () => {
      const updatedFlow = {
        _id: 'flow-123',
        name: 'test-flow',
        pageGenerators: [],
        pageProcessors: [
          {
            responseMapping: {
              fields: [
                {
                  extract: 'data',
                  generate: 'sdfg',
                },
              ],
              lists: [],
            },
            type: 'export',
            _exportId: 'export-123',
          },
        ],
      };

      return expectSaga(updateFlowData, { flowId: 'flow-123'})
        .provide([
          [select(
            selectors.resourceData,
            'flows',
            'flow-123',
            SCOPES.VALUE
          ), {merged: updatedFlow}],
        ])
        .put(actions.flowData.resetFlowSequence('flow-123', updatedFlow))
        .run();
    });
  });
});
