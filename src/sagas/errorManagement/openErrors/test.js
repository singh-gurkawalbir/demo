/* global expect,describe, test */

import { call, select, put, delay, take, cancel, fork } from 'redux-saga/effects';
import { expectSaga } from 'redux-saga-test-plan';
import { createMockTask } from '@redux-saga/testing-utils';
import * as matchers from 'redux-saga-test-plan/matchers';
import { throwError } from 'redux-saga-test-plan/providers';
import actions from '../../../actions';
import actionTypes from '../../../actions/types';
import { selectors } from '../../../reducers';
import { apiCallWithRetry } from '../../index';
import {
  _requestFlowOpenErrors,
  _requestIntegrationErrors,
  _notifyErrorListOnUpdate,
  _pollForOpenErrors,
  _pollForIntegrationErrors,
  startPollingForOpenErrors,
  startPollingForIntegrationErrors,
} from '.';

const flowId = 'flow-1234';
const integrationId = 'integration-1234';

describe('openErrors info related sagas', () => {
  describe('_requestFlowOpenErrors saga', () => {
    test('should not do any thing incase of api failure ', () => {
      const error = { code: 422, message: 'unprocessable entity' };

      return expectSaga(_requestFlowOpenErrors, { flowId })
        .provide([
          [matchers.call.fn(apiCallWithRetry), throwError(error)],
        ])
        .not.call.fn(_notifyErrorListOnUpdate)
        .not.put(actions.errorManager.openFlowErrors.received({
          flowId,
          openErrors: undefined,
        }))
        .run();
    });
    test('should call _notifyErrorListOnUpdate with the returned open errors and dispatch received action', () => {
      const path = `/flows/${flowId}/errors`;
      const expectedFlowOpenErrors = {
        flowErrors: [
          { _expOrImpId: 'id1', numError: 0},
          { _expOrImpId: 'id2', numError: 1},
          { _expOrImpId: 'id3', numError: 2},
        ],
      };

      return expectSaga(_requestFlowOpenErrors, { flowId })
        .provide([
          [call(apiCallWithRetry, {
            path,
            opts: {
              method: 'GET',
            },
            hidden: true,
          }), expectedFlowOpenErrors],
        ])
        .call.fn(_notifyErrorListOnUpdate)
        .put(actions.errorManager.openFlowErrors.received({
          flowId,
          openErrors: expectedFlowOpenErrors,
        }))
        .run();
    });
  });
  describe('_requestIntegrationErrors saga', () => {
    test('should call invoke api call to fetch integration level errors based on environment the user is in and also dispatch received action with received integration errors', () => {
      const sandBoxEnvironment = { environment: 'sandbox' };
      const productionEnvironment = { environment: 'production' };

      const integrationErrors = [
        {flowId: 'flow-123', numError: 0},
        {flowId: 'flow-456', numError: 10},
        {flowId: 'flow-789', numError: 20},
      ];

      const test1 = expectSaga(_requestIntegrationErrors, { integrationId })
        .provide([
          [select(selectors.userPreferences), sandBoxEnvironment],
          [matchers.call.fn(apiCallWithRetry), integrationErrors],
        ])
        .put(actions.errorManager.integrationErrors.received({
          integrationId,
          integrationErrors,
        }))
        .run();
      const test2 = expectSaga(_requestIntegrationErrors, { integrationId })
        .provide([
          [select(selectors.userPreferences), productionEnvironment],
          [matchers.call.fn(apiCallWithRetry), integrationErrors],
        ])
        .put(actions.errorManager.integrationErrors.received({
          integrationId,
          integrationErrors,
        }))
        .run();

      return test1 && test2;
    });
    test('should do nothing incase of integration errors api failure', () => {
      const error = { code: 422, message: 'unprocessable entity' };

      return expectSaga(_requestIntegrationErrors, { integrationId })
        .provide([
          [matchers.call.fn(apiCallWithRetry), throwError(error)],
        ])
        .not.call.fn(_notifyErrorListOnUpdate)
        .not.put(actions.errorManager.integrationErrors.received({
          integrationId,
          integrationErrors: undefined,
        }))
        .run();
    });
  });
  describe('_notifyErrorListOnUpdate saga', () => {
    const flowErrors = [
      { _expOrImpId: 'id1', numError: 10 },
      { _expOrImpId: 'id2', numError: 20 },
      { _expOrImpId: 'id3', numError: 30 },
    ];

    test('should not dispatch notify action incase of no difference in previous and current error map', () => {
      const previousFlowErrorsMap = { id1: 10, id2: 20, id3: 30 };
      const prevFlowOpenErrorDetails = {
        id1: {
          _expOrImpId: 'id1',
          numError: 10,
        },
        id2: {
          _expOrImpId: 'id2',
          numError: 20,
        },
        id3: {
          _expOrImpId: 'id3',
          numError: 30,
        },
      };

      return expectSaga(_notifyErrorListOnUpdate, { flowId, newFlowErrors: { flowErrors }})
        .provide([
          [select(selectors.openErrorsDetails, flowId), prevFlowOpenErrorDetails],
          [select(selectors.openErrorsMap, flowId), previousFlowErrorsMap],
        ])
        .not.put(actions.errorManager.flowErrorDetails.notifyUpdate({
          flowId,
          resourceId: undefined,
          diff: undefined,
        }))
        .run();
    });
    test('should not dispatch notify action if errors are loaded for the first time', () => expectSaga(_notifyErrorListOnUpdate, { flowId, newFlowErrors: { flowErrors }})
      .provide([
        [select(selectors.openErrorsDetails, flowId), undefined],
      ])
      .not.put(actions.errorManager.flowErrorDetails.notifyUpdate({
        flowId,
        resourceId: undefined,
        diff: undefined,
      }))
      .returns(undefined)
      .run());
    test('should dispatch notify action for all the resourceIds that differ in their respective error counts', () => {
      const previousFlowErrorsMap = { id1: 0, id2: 30, id3: 30 };
      const prevFlowOpenErrorDetails = {
        id1: {
          _expOrImpId: 'id1',
          numError: 0,
        },
        id2: {
          _expOrImpId: 'id2',
          numError: 30,
        },
        id3: {
          _expOrImpId: 'id3',
          numError: 30,
        },
      };

      return expectSaga(_notifyErrorListOnUpdate, { flowId, newFlowErrors: { flowErrors }})
        .provide([
          [select(selectors.openErrorsDetails, flowId), prevFlowOpenErrorDetails],
          [select(selectors.openErrorsMap, flowId), previousFlowErrorsMap],
        ])
        .put(actions.errorManager.flowErrorDetails.notifyUpdate({
          flowId,
          resourceId: 'id1',
          diff: 10,
        }))
        .put(actions.errorManager.flowErrorDetails.notifyUpdate({
          flowId,
          resourceId: 'id2',
          diff: -10,
        }))
        .run();
    });
  });
  describe('_pollForOpenErrors saga', () => {
    test('should dispatch request action and call _requestFlowOpenErrors after 5 seconds delay continuously', () => {
      const saga = _pollForOpenErrors({ flowId });

      expect(saga.next().value).toEqual(put(actions.errorManager.openFlowErrors.request({ flowId })));
      expect(saga.next().value).toEqual(call(_requestFlowOpenErrors, { flowId }));
      expect(saga.next().value).toEqual(delay(5000));

      expect(saga.next().done).toEqual(false);
    });
  });
  describe('_pollForIntegrationErrors saga', () => {
    test('should dispatch request action and call _requestIntegrationErrors after 5 seconds delay continuously', () => {
      const saga = _pollForIntegrationErrors({ integrationId });

      expect(saga.next().value).toEqual(put(actions.errorManager.integrationErrors.request({ integrationId })));
      expect(saga.next().value).toEqual(call(_requestIntegrationErrors, { integrationId }));
      expect(saga.next().value).toEqual(delay(5000));

      expect(saga.next().done).toEqual(false);
    });
  });
  describe('startPollingForOpenErrors saga', () => {
    test('should fork _pollForOpenErrors, waits for STOP_POLL action and then cancels _pollForOpenErrors', () => {
      const mockTask = createMockTask();

      const saga = startPollingForOpenErrors({flowId});

      expect(saga.next().value).toEqual(fork(_pollForOpenErrors, {flowId}));

      expect(saga.next(mockTask).value).toEqual(take(actionTypes.ERROR_MANAGER.FLOW_OPEN_ERRORS.CANCEL_POLL));
      expect(saga.next({type: actionTypes.ERROR_MANAGER.FLOW_OPEN_ERRORS.CANCEL_POLL}).value).toEqual(cancel(mockTask));
      expect(saga.next().done).toEqual(true);
    });
  });
  describe('startPollingForIntegrationErrors saga', () => {
    test('should fork _pollForIntegrationErrors, waits for STOP_POLL action and then cancels _pollForIntegrationErrors', () => {
      const mockTask = createMockTask();

      const saga = startPollingForIntegrationErrors({ integrationId });

      expect(saga.next().value).toEqual(fork(_pollForIntegrationErrors, { integrationId }));

      expect(saga.next(mockTask).value).toEqual(take(actionTypes.ERROR_MANAGER.INTEGRATION_ERRORS.CANCEL_POLL));
      expect(saga.next({type: actionTypes.ERROR_MANAGER.INTEGRATION_ERRORS.CANCEL_POLL}).value).toEqual(cancel(mockTask));
      expect(saga.next().done).toEqual(true);
    });
  });
});
