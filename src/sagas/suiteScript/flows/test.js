/* global describe, test */

import { expectSaga } from 'redux-saga-test-plan';
import { throwError } from 'redux-saga-test-plan/providers';
import { call } from 'redux-saga/effects';
import actions from '../../../actions';
import { apiCallWithRetry } from '../../index';
import { deleteFlow, disableFlow, enableFlow, runFlow} from '.';
import { getFlowIdAndTypeFromUniqueId } from '../../../utils/suiteScript';

const ssLinkedConnectionId = 'c1';
const integrationId = 'i1';
const _id = 'e1';
const { flowId} = getFlowIdAndTypeFromUniqueId(_id);
const error = new Error('error');
const job = {
  type: 'export',
  _jobId: 'j1',
  status: 'queued',
  _integrationId: integrationId,
  _flowId: flowId,
};

const flow = {
  type: 'REALTIME_IMPORT',
  _id: '58011',
  _integrationId: '102',
  _flowId: '209',
  flowGUID: '',
  name: 'SF RT Account JS',
  disabled: true,
  licensed: false,
  configFileId: '',
  import: {
    type: 'netsuite',
    netsuite: {
      recordType: 'customer',
      mappingId: 'ku5VbKItOhds8XPq',
      lookups: [

      ],
      operation: 'add',
      subRecordImports: [

      ],
      type: 'realtime',
    },
    _connectionId: 'NETSUITE_CONNECTION',
    mapping: {

    },
  },
  hasConfiguration: true,
  editable: true,
  export: {
    _connectionId: 'SALESFORCE_CONNECTION',
    type: 'salesforce',
    salesforce: {
      type: 'sobject',
      sObjectType: 'Account',
      errorMessageField: {

      },
    },
  },
};

describe('runFlow saga', () => {
  const requestOptions = {
    path: '/suitescript/connections/c1/integrations/i1/flows/1/run',
    opts: {
      method: 'POST',
    },
  };

  test('should dispatch job received action and job status request action when run flow call is successful', () => expectSaga(runFlow, { ssLinkedConnectionId, integrationId, flowId, _id })
    .provide([[call(apiCallWithRetry, requestOptions), job]])
    .put(
      actions.suiteScript.job.received({
        job: {
          type: job.type,
          _id: job._jobId,
          status: 'queued',
          _integrationId: integrationId,
          _flowId: flowId,
        },
      })
    )
    .put(
      actions.suiteScript.job.requestInProgressJobStatus({
        ssLinkedConnectionId,
        integrationId,
      })
    )
    .run());

  test('should not dispatch job received action and job status request action when run flow call fails', () => expectSaga(runFlow, { ssLinkedConnectionId, integrationId, flowId, _id })
    .provide([[call(apiCallWithRetry, requestOptions), throwError(error)]])
    .not.put(
      actions.suiteScript.job.received({
        job: {
          type: job.type,
          _id: job._jobId,
          status: 'queued',
          _integrationId: integrationId,
          _flowId: flowId,
        },
      })
    )
    .not.put(
      actions.suiteScript.job.requestInProgressJobStatus({
        ssLinkedConnectionId,
        integrationId,
      })
    )
    .run());
});

describe('enableFlow saga', () => {
  const requestOptions = {
    path: '/suitescript/connections/c1/integrations/i1/flows/1/enable',
    opts: {
      method: 'PUT',
      body: {type: 'EXPORT'},
    },
  };

  test('should dispatch resource received action and flow onOffProgress action when enable flow call is successful', () => expectSaga(enableFlow, { ssLinkedConnectionId, integrationId, _id })
    .provide([[call(apiCallWithRetry, requestOptions), flow]])
    .put(
      actions.suiteScript.resource.received(ssLinkedConnectionId, integrationId, 'flows', flow)
    )
    .put(
      actions.suiteScript.flow.isOnOffActionInprogress({onOffInProgress: false, ssLinkedConnectionId, _id})
    )
    .run());

  test('should not dispatch resource received action but dispatch flow onOffProgress action when enable flow call fails', () => expectSaga(enableFlow, { ssLinkedConnectionId, integrationId, _id })
    .provide([[call(apiCallWithRetry, requestOptions), throwError(error)]])
    .not.put(
      actions.suiteScript.resource.received(ssLinkedConnectionId, integrationId, 'flows', flow))
    .put(
      actions.suiteScript.flow.isOnOffActionInprogress({onOffInProgress: false, ssLinkedConnectionId, _id})
    )
    .run());
});

describe('disableFlow saga', () => {
  const requestOptions = {
    path: '/suitescript/connections/c1/integrations/i1/flows/1/disable',
    opts: {
      method: 'PUT',
      body: {type: 'EXPORT'},
    },
  };

  test('should dispatch resource received action and flow onOffProgress action when disable flow call is successful', () => expectSaga(disableFlow, { ssLinkedConnectionId, integrationId, _id })
    .provide([[call(apiCallWithRetry, requestOptions), flow]])
    .put(
      actions.suiteScript.resource.received(ssLinkedConnectionId, integrationId, 'flows', flow)
    )
    .put(
      actions.suiteScript.flow.isOnOffActionInprogress({onOffInProgress: false, ssLinkedConnectionId, _id})
    )
    .run());

  test('should not dispatch resource received action but dispatch flow onOffProgress action when disable flow call fails', () => expectSaga(disableFlow, { ssLinkedConnectionId, integrationId, _id })
    .provide([[call(apiCallWithRetry, requestOptions), throwError(error)]])
    .not.put(
      actions.suiteScript.resource.received(ssLinkedConnectionId, integrationId, 'flows', flow))
    .put(
      actions.suiteScript.flow.isOnOffActionInprogress({onOffInProgress: false, ssLinkedConnectionId, _id})
    )
    .run());
});

describe('deleteFlow saga', () => {
  const requestOptions = {
    path: '/suitescript/connections/c1/integrations/i1/flows/1?type=EXPORT',
    opts: {
      method: 'DELETE',
    },
  };

  test('should dispatch resource deleted action when delete flow call is successful', () => expectSaga(deleteFlow, { ssLinkedConnectionId, integrationId, _id })
    .provide([[call(apiCallWithRetry, requestOptions), {}]])
    .put(
      actions.suiteScript.resource.deleted('flows', _id, ssLinkedConnectionId)
    )
    .run());

  test('should not dispatch resource deleted action when delete flow call fails', () => expectSaga(deleteFlow, { ssLinkedConnectionId, integrationId, _id })
    .provide([[call(apiCallWithRetry, requestOptions), throwError(error)]])
    .not.put(
      actions.suiteScript.resource.deleted('flows', _id, ssLinkedConnectionId)
    )
    .run());
});
