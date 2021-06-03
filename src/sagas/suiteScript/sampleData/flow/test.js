/* global describe, test */
import { expectSaga } from 'redux-saga-test-plan';
import { call, select } from 'redux-saga/effects';
import { throwError } from 'redux-saga-test-plan/providers';
// eslint-disable-next-line no-unused-vars
import { apiCallWithRetry } from '../../..';
import { requestFlowSampleData, onResourceUpdate } from '.';
import { selectors } from '../../../../reducers';
import actions from '../../../../actions';
import requestFileAdaptorSampleData from '../../../sampleData/sampleDataGenerator/fileAdaptorSampleData';

describe('requestFlowSampleData saga', () => {
  const ssLinkedConnectionId = 'ss1';
  const integrationId = 'i1';
  const flowId = 'f1';

  test('should not do anything in case flow is not found', () => expectSaga(requestFlowSampleData, { ssLinkedConnectionId, integrationId, flowId })
    .provide([
      [select(selectors.suiteScriptFlowDetail, {
        integrationId,
        ssLinkedConnectionId,
        flowId,
      }), undefined],
    ])
    .run());

  test('should trigger request metadata action for netsuite correctly', () => {
    const flow = {
      export: {
        type: 'netsuite',
        _connectionId: 'c1',
        netsuite: {type: 'realtime', realtime: {recordType: 'recordType1'}},
      },
    };

    expectSaga(requestFlowSampleData, { ssLinkedConnectionId, integrationId, flowId })
      .provide([
        [select(selectors.suiteScriptFlowDetail, {
          integrationId,
          ssLinkedConnectionId,
          flowId,
        }), flow],
      ])
      .put(actions.metadata.request(ssLinkedConnectionId, `netsuite/metadata/suitescript/connections/${ssLinkedConnectionId}/recordTypes/recordType1`, { refreshCache: undefined }))
      .run();
  });

  test('should trigger request metadata action for netsuite correctly [refreshCache = true]', () => {
    const flow = {
      export: {
        type: 'netsuite',
        _connectionId: 'c1',
        netsuite: {type: 'realtime', realtime: {recordType: 'recordType1'}},
      },
    };

    expectSaga(requestFlowSampleData, { ssLinkedConnectionId, integrationId, flowId, options: {refreshCache: true} })
      .provide([
        [select(selectors.suiteScriptFlowDetail, {
          integrationId,
          ssLinkedConnectionId,
          flowId,
        }), flow],
      ])
      .put(actions.metadata.request(ssLinkedConnectionId, `netsuite/metadata/suitescript/connections/${ssLinkedConnectionId}/recordTypes/recordType1`, { refreshCache: true }))
      .run();
  });

  test('should trigger request metadata action for salesforce correctly', () => {
    const flow = {
      export: {
        type: 'salesforce',
        _connectionId: 'c1',
        salesforce: {sObjectType: 'sObjectType1'},
      },
    };

    expectSaga(requestFlowSampleData, { ssLinkedConnectionId, integrationId, flowId })
      .provide([
        [select(selectors.suiteScriptFlowDetail, {
          integrationId,
          ssLinkedConnectionId,
          flowId,
        }), flow],
      ])
      .put(actions.metadata.request(ssLinkedConnectionId, `suitescript/connections/${ssLinkedConnectionId}/connections/c1/sObjectTypes/sObjectType1`, { ignoreCache: true, refreshCache: undefined }))
      .run();
  });

  test('should trigger suiteScript sampleData received action for fileCabinet/ftp ', () => {
    const flow = {
      export: {
        type: 'fileCabinet',
        _connectionId: 'c1',
        file: {},
      },
    };

    expectSaga(requestFlowSampleData, { ssLinkedConnectionId, integrationId, flowId })
      .provide([
        [select(selectors.suiteScriptFlowDetail, {
          integrationId,
          ssLinkedConnectionId,
          flowId,
        }), flow],
        [call(requestFileAdaptorSampleData, {resource: {
          type: 'fileCabinet',
          _connectionId: 'c1',
          file: {type: 'csv'},
        }}), [{name: 'test', desc: 'abc'}]],
      ])
      .put(actions.suiteScript.sampleData.received({ ssLinkedConnectionId, integrationId, flowId, previewData: [{ id: 'desc', type: 'string' }, { id: 'name', type: 'string' }]}))
      .run();
  });

  test('should trigger suitescript sampleData received action correctly for rakuten', () => {
    const flow = {
      export: {
        type: 'rakuten',
        _connectionId: 'c1',
        file: {method: 'method1'},
      },
    };

    expectSaga(requestFlowSampleData, { ssLinkedConnectionId, integrationId, flowId, options: {sObjects: ['sObject1', 'sObject2']} })
      .provide([
        [select(selectors.suiteScriptFlowDetail, {
          integrationId,
          ssLinkedConnectionId,
          flowId,
        }), flow],
        [select(selectors.suiteScriptResourceList, {
          ssLinkedConnectionId,
          resourceType: 'connections',
        }), [{id: 'c1', apiMethods: [{id: 'method1', fields: [{id: 'id1', label: 'l1'}, {id: 'id2', label: 'l2'}]}]}]],
      ])
      .put(actions.suiteScript.sampleData.received({
        ssLinkedConnectionId,
        integrationId,
        flowId,
        previewData: [{id: 'id1', name: 'l1'}, {id: 'id2', name: 'l2'}],
      }))
      .run();
  });

  test('should trigger suitescript sampleData received action correctly for sears', () => {
    const flow = {
      export: {
        type: 'sears',
        _connectionId: 'c1',
        sears: {method: 'method1'},
      },
    };

    expectSaga(requestFlowSampleData, { ssLinkedConnectionId, integrationId, flowId })
      .provide([
        [select(selectors.suiteScriptFlowDetail, {
          integrationId,
          ssLinkedConnectionId,
          flowId,
        }), flow],
        [select(selectors.suiteScriptResourceList, {
          ssLinkedConnectionId,
          resourceType: 'connections',
        }), [{id: 'c1', apiMethods: [{id: 'method1', fields: [{id: 'id1', label: 'l1'}, {id: 'id2', label: 'l2'}]}]}]],
      ])
      .put(actions.suiteScript.sampleData.received({
        ssLinkedConnectionId,
        integrationId,
        flowId,
        previewData: [{id: 'id1', name: 'l1'}, {id: 'id2', name: 'l2'}],
      }))
      .run();
  });

  test('should trigger suitescript sampleData received action correctly for newegg', () => {
    const flow = {
      export: {
        type: 'newegg',
        _connectionId: 'c1',
        newegg: {method: 'method1'},
      },
    };

    expectSaga(requestFlowSampleData, { ssLinkedConnectionId, integrationId, flowId })
      .provide([
        [select(selectors.suiteScriptFlowDetail, {
          integrationId,
          ssLinkedConnectionId,
          flowId,
        }), flow],
        [select(selectors.suiteScriptResourceList, {
          ssLinkedConnectionId,
          resourceType: 'connections',
        }), [{id: 'c1', apiMethods: [{id: 'method1', fields: [{id: 'id1', label: 'l1'}, {id: 'id2', label: 'l2'}]}]}]],
      ])
      .put(actions.suiteScript.sampleData.received({
        ssLinkedConnectionId,
        integrationId,
        flowId,
        previewData: [{id: 'id1', name: 'l1'}, {id: 'id2', name: 'l2'}],
      }))
      .run();
  });

  test('should trigger suitescript sampleData received action correctly for other export type', () => {
    const flow = {
      export: {
        type: 'something_else',
        _connectionId: 'c1',
        abc: {xyz: 'test'},
      },
    };

    expectSaga(requestFlowSampleData, { ssLinkedConnectionId, integrationId, flowId })
      .provide([
        [select(selectors.suiteScriptFlowDetail, {
          integrationId,
          ssLinkedConnectionId,
          flowId,
        }), flow],
        [call(apiCallWithRetry, {
          path: `/suitescript/connections/${ssLinkedConnectionId}/export/preview`,
          opts: { method: 'POST', body: flow.export },
          hidden: true,
        }), [{id: 'id1', name: 'l1'}, {id: 'id2', name: 'l2'}]],
      ])
      .put(actions.suiteScript.sampleData.received({
        ssLinkedConnectionId,
        integrationId,
        flowId,
        previewData: [{id: 'id1', name: 'l1'}, {id: 'id2', name: 'l2'}],
      }))
      .run();
  });
  test('should trigger suitescript sampleData receivedError action in case of preview failure', () => {
    const flow = {
      export: {
        type: 'something_else',
        _connectionId: 'c1',
        abc: {xyz: 'test'},
      },
    };

    expectSaga(requestFlowSampleData, { ssLinkedConnectionId, integrationId, flowId })
      .provide([
        [select(selectors.suiteScriptFlowDetail, {
          integrationId,
          ssLinkedConnectionId,
          flowId,
        }), flow],
        [call(apiCallWithRetry, {
          path: `/suitescript/connections/${ssLinkedConnectionId}/export/preview`,
          opts: { method: 'POST', body: flow.export },
          hidden: true,
        }), throwError({status: 400, message: '{"test":"test_msg"}'})],
      ])
      .put(actions.suiteScript.sampleData.receivedError({
        ssLinkedConnectionId,
        integrationId,
        flowId,
        error: {test: 'test_msg'},
      }))
      .run();
  });
});

describe('onResourceUpdate saga', () => {
  test('should not do anything if resourceType is not exports', () => {
    const flowId = 'f1';

    const master = {_id: flowId};
    const ssLinkedConnectionId = 's1';
    const integrationId = 'i1';
    const resourceType = 'imports';

    expectSaga(onResourceUpdate, { master, ssLinkedConnectionId, integrationId, resourceType })
      .not.put(actions.suiteScript.sampleData.reset({ ssLinkedConnectionId, integrationId, flowId}))
      .run();
  });

  test('should trigger suitescript sample data reset action if resourceType = export', () => {
    const flowId = 'f1';

    const master = {_id: flowId};
    const ssLinkedConnectionId = 's1';
    const integrationId = 'i1';
    const resourceType = 'exports';

    expectSaga(onResourceUpdate, { master, ssLinkedConnectionId, integrationId, resourceType })
      .put(actions.suiteScript.sampleData.reset({ ssLinkedConnectionId, integrationId, flowId}))
      .run();
  });
});
