/* global describe, test */

import { call, select } from 'redux-saga/effects';
import { expectSaga } from 'redux-saga-test-plan';
import { throwError } from 'redux-saga-test-plan/providers';
import actions from '../../../actions';
import { selectors } from '../../../reducers';
import { apiCallWithRetry } from '../../index';
import {
  cancelRetry,
  getRetryJobCollection,
} from '.';

const jobId = 'job-1234';
const flowId = 'flow-1234';
const resourceId = 'res-1234';
const integrationId = 'integration-1234';
const standaloneIntegrationId = 'none';

describe('retries info related sagas', () => {
  describe('getRetryJobCollection saga', () => {
    test('should not do any thing incase of api failure for export resource and flow with integrationId', () => {
      const flow = {
        _integrationId: integrationId,
      };
      const path = `/jobs?_integrationId=${integrationId}&_flowId=${flowId}&type=retry&_exportId=${resourceId}`;
      const args = {
        path,
        opts: {
          method: 'GET',
        },
        hidden: true,
      };
      const error = { code: 422, message: 'unprocessable entity' };

      return expectSaga(getRetryJobCollection, { flowId, resourceId })
        .provide([
          [select(selectors.resource, 'imports', resourceId), undefined],
          [select(selectors.resource, 'flows', flowId), flow],
          [call(apiCallWithRetry, args), throwError(error)],
        ])
        .call(apiCallWithRetry, args)
        .not.put(
          actions.errorManager.retries.received({
            flowId,
            resourceId,
            retries: [],
          })
        )
        .run();
    });
    test('should not do any thing incase of api failure for import resource and a standalone flow', () => {
      const flow = {};
      const importResource = {
        _id: resourceId,
      };
      const path = `/jobs?_integrationId=${standaloneIntegrationId}&_flowId=${flowId}&type=retry&_importId=${resourceId}`;
      const args = {
        path,
        opts: {
          method: 'GET',
        },
        hidden: true,
      };
      const error = { code: 422, message: 'unprocessable entity' };

      return expectSaga(getRetryJobCollection, { flowId, resourceId })
        .provide([
          [select(selectors.resource, 'imports', resourceId), importResource],
          [select(selectors.resource, 'flows', flowId), flow],
          [call(apiCallWithRetry, args), throwError(error)],
        ])
        .call(apiCallWithRetry, args)
        .not.put(
          actions.errorManager.retries.received({
            flowId,
            resourceId,
            retries: [],
          })
        )
        .run();
    });
    test('should dispatch retries received action incase of api successful for export resource and a standalone flow', () => {
      const flow = {};
      const path = `/jobs?_integrationId=${standaloneIntegrationId}&_flowId=${flowId}&type=retry&_exportId=${resourceId}`;
      const args = {
        path,
        opts: {
          method: 'GET',
        },
        hidden: true,
      };
      const retriesList = [{
        _id: 'jobId',
      }];

      return expectSaga(getRetryJobCollection, { flowId, resourceId })
        .provide([
          [select(selectors.resource, 'imports', resourceId), undefined],
          [select(selectors.resource, 'flows', flowId), flow],
          [call(apiCallWithRetry, args), retriesList],
        ])
        .call(apiCallWithRetry, args)
        .put(
          actions.errorManager.retries.received({
            flowId,
            resourceId,
            retries: retriesList,
          })
        )
        .run();
    });
    test('should dispatch retries received action incase of api successful for import resource and a flow with integrationId', () => {
      const flow = {
        _integrationId: integrationId,
      };
      const importResource = {
        _id: resourceId,
      };
      const path = `/jobs?_integrationId=${integrationId}&_flowId=${flowId}&type=retry&_importId=${resourceId}`;
      const args = {
        path,
        opts: {
          method: 'GET',
        },
        hidden: true,
      };
      const retriesList = [];

      return expectSaga(getRetryJobCollection, { flowId, resourceId })
        .provide([
          [select(selectors.resource, 'imports', resourceId), importResource],
          [select(selectors.resource, 'flows', flowId), flow],
          [call(apiCallWithRetry, args), retriesList],
        ])
        .call(apiCallWithRetry, args)
        .put(
          actions.errorManager.retries.received({
            flowId,
            resourceId,
            retries: retriesList,
          })
        )
        .run();
    });
  });
  describe('cancelRetry saga', () => {
    test('should not do any thing incase of api failure', () => {
      const path = `/jobs/${jobId}/cancel`;
      const args = {
        path,
        opts: {
          method: 'PUT',
        },
      };
      const error = { code: 422, message: 'unprocessable entity' };

      return expectSaga(cancelRetry, { flowId, resourceId, jobId })
        .provide([
          [call(apiCallWithRetry, args), throwError(error)],
        ])
        .call(apiCallWithRetry, args)
        .not.call.fn(getRetryJobCollection)
        .run();
    });
    test('should call getRetryJobCollection if the api call is successful', () => {
      const path = `/jobs/${jobId}/cancel`;
      const args = {
        path,
        opts: {
          method: 'PUT',
        },
      };

      return expectSaga(cancelRetry, { flowId, resourceId, jobId })
        .provide([
          [call(apiCallWithRetry, args)],
        ])
        .call(apiCallWithRetry, args)
        .call(getRetryJobCollection, {flowId, resourceId})
        .run();
    });
  });
});
