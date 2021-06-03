/* global describe, test */
import { expectSaga } from 'redux-saga-test-plan';
import { select } from 'redux-saga/effects';
// eslint-disable-next-line no-unused-vars
import { apiCallWithRetry } from '../../..';
import {requestSampleData} from '.';
import { selectors } from '../../../../reducers';
import actions from '../../../../actions';

describe('requestSampleData saga', () => {
  const ssLinkedConnectionId = 'ss1';
  const integrationId = 'i1';
  const flowId = 'f1';

  test('should not do anything in case flow is not found', () => expectSaga(requestSampleData, { ssLinkedConnectionId, integrationId, flowId })
    .provide([
      [select(selectors.suiteScriptFlowDetail, {
        integrationId,
        ssLinkedConnectionId,
        flowId,
      }), undefined],
    ])
    .not.put(actions.suiteScript.importSampleData.received({ ssLinkedConnectionId, integrationId, flowId, data: []}))
    .run());

  test('should trigger request metadata action for netsuite correctly', () => {
    const flow = {
      import: {
        type: 'netsuite',
        _connectionId: 'c1',
        netsuite: {recordType: 'recordType1'},
      },
    };

    expectSaga(requestSampleData, { ssLinkedConnectionId, integrationId, flowId })
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

  test('should trigger request metadata action for netsuite correctly[refreshCache = true]', () => {
    const flow = {
      import: {
        type: 'netsuite',
        _connectionId: 'c1',
        netsuite: {recordType: 'recordType1'},
      },
    };

    expectSaga(requestSampleData, { ssLinkedConnectionId, integrationId, flowId, options: {refreshCache: true} })
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

  test('should trigger request metadata action for netsuite correctly[recordType passed from options]', () => {
    const flow = {
      import: {
        type: 'netsuite',
        _connectionId: 'c1',
        netsuite: {recordType: 'recordType1'},
      },
    };

    expectSaga(requestSampleData, { ssLinkedConnectionId, integrationId, flowId, options: {recordType: 'optionRecordType'} })
      .provide([
        [select(selectors.suiteScriptFlowDetail, {
          integrationId,
          ssLinkedConnectionId,
          flowId,
        }), flow],
      ])
      .put(actions.metadata.request(ssLinkedConnectionId, `netsuite/metadata/suitescript/connections/${ssLinkedConnectionId}/recordTypes/optionRecordType`, { refreshCache: undefined }))
      .run();
  });

  test('should trigger request metadata action for salesforce correctly', () => {
    const flow = {
      import: {
        type: 'salesforce',
        _connectionId: 'c1',
        salesforce: {sObjectType: 'sObjectType1'},
      },
    };

    expectSaga(requestSampleData, { ssLinkedConnectionId, integrationId, flowId })
      .provide([
        [select(selectors.suiteScriptFlowDetail, {
          integrationId,
          ssLinkedConnectionId,
          flowId,
        }), flow],
      ])
      .put(actions.metadata.request(ssLinkedConnectionId, `suitescript/connections/${ssLinkedConnectionId}/connections/c1/sObjectTypes/sObjectType1`, { ignoreCache: true }))
      .run();
  });

  test('should trigger request metadata action for salesforce correctly[sObjects passed as options]', () => {
    const flow = {
      import: {
        type: 'salesforce',
        _connectionId: 'c1',
        salesforce: {sObjectType: 'sObjectType1'},
      },
    };

    expectSaga(requestSampleData, { ssLinkedConnectionId, integrationId, flowId, options: {sObjects: ['sObject1', 'sObject2']} })
      .provide([
        [select(selectors.suiteScriptFlowDetail, {
          integrationId,
          ssLinkedConnectionId,
          flowId,
        }), flow],
      ])
      .put(actions.metadata.request(ssLinkedConnectionId, `suitescript/connections/${ssLinkedConnectionId}/connections/c1/sObjectTypes/sObject1`, { ignoreCache: true }))
      .put(actions.metadata.request(ssLinkedConnectionId, `suitescript/connections/${ssLinkedConnectionId}/connections/c1/sObjectTypes/sObject2`, { ignoreCache: true }))
      .run();
  });

  test('should trigger suitescript importSampleData received action correctly for rakuten', () => {
    const flow = {
      import: {
        type: 'rakuten',
        _connectionId: 'c1',
        rakuten: {method: 'method1'},
      },
    };

    expectSaga(requestSampleData, { ssLinkedConnectionId, integrationId, flowId })
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
      .put(actions.suiteScript.importSampleData.received({
        ssLinkedConnectionId,
        integrationId,
        flowId,
        data: [{id: 'id1', name: 'l1'}, {id: 'id2', name: 'l2'}],
      }))
      .run();
  });

  test('should trigger suitescript importSampleData received action correctly for sears', () => {
    const flow = {
      import: {
        type: 'sears',
        _connectionId: 'c1',
        sears: {method: 'method1'},
      },
    };

    expectSaga(requestSampleData, { ssLinkedConnectionId, integrationId, flowId })
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
      .put(actions.suiteScript.importSampleData.received({
        ssLinkedConnectionId,
        integrationId,
        flowId,
        data: [{id: 'id1', name: 'l1'}, {id: 'id2', name: 'l2'}],
      }))
      .run();
  });

  test('should trigger suitescript importSampleData received action correctly for newegg', () => {
    const flow = {
      import: {
        type: 'newegg',
        _connectionId: 'c1',
        newegg: {method: 'method1'},
      },
    };

    expectSaga(requestSampleData, { ssLinkedConnectionId, integrationId, flowId })
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
      .put(actions.suiteScript.importSampleData.received({
        ssLinkedConnectionId,
        integrationId,
        flowId,
        data: [{id: 'id1', name: 'l1'}, {id: 'id2', name: 'l2'}],
      }))
      .run();
  });

  test('should trigger suitescript importSampleData received error action', () => {
    const flow = {
      import: {
        type: 'newegg',
        _connectionId: 'c1',
        newegg: {method: 'method1'},
      },
    };

    expectSaga(requestSampleData, { ssLinkedConnectionId, integrationId, flowId })
      .provide([
        [select(selectors.suiteScriptFlowDetail, {
          integrationId,
          ssLinkedConnectionId,
          flowId,
        }), flow],
        [select(selectors.suiteScriptResourceList, {
          ssLinkedConnectionId,
          resourceType: 'connections',
        }), [{id: 'c2', apiMethods: [{id: 'method1', fields: [{id: 'id1', label: 'l1'}, {id: 'id2', label: 'l2'}]}]}]],
      ])
      .put(actions.suiteScript.importSampleData.receivedError({
        ssLinkedConnectionId,
        integrationId,
        flowId,
      }))
      .run();
  });
});
