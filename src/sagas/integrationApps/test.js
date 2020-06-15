/* global describe, test */

import { expectSaga, testSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import { throwError } from 'redux-saga-test-plan/providers';
import actions from '../../actions';
import { apiCallWithRetry } from '../index';
import { getCurrentStep } from './installer';
import {initUninstall, uninstallStep, requestSteps} from './uninstaller2.0';

describe('installer saga', () => {
  describe('getCurrentStep generator', () => {
    const id = '1234';
    const form = {
      fieldMap: {
        storeName: {
          id: 'storeName',
          name: 'storeName',
        },
        category: {
          id: 'category',
          name: 'category',
        },
      },
    };

    test('should do nothing if step is not form type', () => {
      const step = { type: 'dummy', form };
      const saga = testSaga(getCurrentStep, { id, step });

      saga.next().isDone();
    });

    test('should dispatch update step action with step form meta and not make API call, if no init form function', () => {
      const step = { type: 'form', form };

      return expectSaga(getCurrentStep, { id, step })
        .not.call.fn(apiCallWithRetry)
        .put(
          actions.integrationApp.installer.updateStep(id, '', 'inProgress', form)
        )
        .run();
    });

    test('should make API call when init function present and dispatch action with updated form meta', () => {
      const step = { type: 'form', form, initFormFunction: 'somefunc' };
      const expectedOut = {
        result: {
          fieldMap: {
            dummy: {
              id: 'dummy',
              name: 'dummy',
            },
          },
        },
      };

      return expectSaga(getCurrentStep, { id, step })
        .provide([[matchers.call.fn(apiCallWithRetry), expectedOut]])
        .call.fn(apiCallWithRetry)
        .put(
          actions.integrationApp.installer.updateStep(
            id,
            '',
            'inProgress',
            expectedOut.result
          )
        )
        .run();
    });

    test('should dispatch failed step action if API call fails', () => {
      const step = { type: 'form', form, initFormFunction: 'somefunc' };
      const error = { code: 422, message: 'unprocessable entity' };

      return expectSaga(getCurrentStep, { id, step })
        .provide([[matchers.call.fn(apiCallWithRetry), throwError(error)]])
        .call.fn(apiCallWithRetry)
        .put(actions.integrationApp.installer.updateStep(id, '', 'failed'))
        .run();
    });
  });
});

describe('uninstaller2.0 saga', () => {
  const id = '123';

  describe('initUninstall generator', () => {
    test('should make an API call and dispatch resource request action', () => expectSaga(initUninstall, { id })
      .provide([[matchers.call.fn(apiCallWithRetry)]])
      .call.fn(apiCallWithRetry)
      .put(actions.resource.request('integrations', '123'))
      .run());

    test('should disptach failed action if API call throws error', () => {
      const error = { code: 404, message: 'integration not found' };
      return expectSaga(initUninstall, { id })
        .provide([[matchers.call.fn(apiCallWithRetry), throwError(error)]])
        .call.fn(apiCallWithRetry)
        .not.put(actions.resource.request('integrations', '123'))
        .put(
          actions.integrationApp.uninstaller2.failed(
            id,
            error.message
          )
        )
        .run()
    });
  });

  describe('uninstallStep generator', () => {
    test('should make API call and dispatch received steps action, if there is an API response', () => {
      const uninstallSteps = [{type: 'form', completed: true}, {type: 'url', completed: false}];
      return expectSaga(uninstallStep, { id })
        .provide([[matchers.call.fn(apiCallWithRetry), uninstallSteps]])
        .call.fn(apiCallWithRetry)
        .put(
          actions.integrationApp.uninstaller2.receivedSteps(
            id,
            uninstallSteps,
          )
        )
        .run()
    });
    test('should make API call and dispatch resource request action, if there is no API response', () => expectSaga(uninstallStep, { id })
      .provide([[matchers.call.fn(apiCallWithRetry), undefined]])
      .call.fn(apiCallWithRetry)
      .put(
        actions.integrationApp.uninstaller2.updateStep(
          id,
          'completed'
        )
      )
      .put(actions.resource.requestCollection('integrations'))
      .put(
        actions.integrationApp.uninstaller2.complete(
          id,
        )
      )
      .not.put(
        actions.integrationApp.uninstaller2.receivedSteps(
          id,
          [],
        )
      )
      .run());
    test('should disptach failed action if API call throws error', () => {
      const error = { code: 404, message: 'integration not found' };
      return expectSaga(uninstallStep, { id })
        .provide([[matchers.call.fn(apiCallWithRetry), throwError(error)]])
        .call.fn(apiCallWithRetry)
        .not.put(
          actions.integrationApp.uninstaller2.receivedSteps(
            id,
            [],
          )
        )
        .put(
          actions.integrationApp.uninstaller2.failed(
            id,
            error.message
          )
        )
        .run()
    });
  });

  describe('requestSteps generator', () => {
    test('should make API call and dispatch received steps action', () => {
      const uninstallSteps = [{type: 'form', completed: true}, {type: 'url', completed: false}];
      return expectSaga(requestSteps, { id })
        .provide([[matchers.call.fn(apiCallWithRetry), uninstallSteps]])
        .call.fn(apiCallWithRetry)
        .put(
          actions.integrationApp.uninstaller2.receivedSteps(
            id,
            uninstallSteps,
          )
        )
        .not.call(uninstallStep, { id })
        .run()
    });
    test('should make API call and call uninstallStep function if all steps are completed', () => {
      const uninstallSteps = [{type: 'form', completed: true}, {type: 'url', completed: true}];
      return expectSaga(requestSteps, { id })
        .provide([[matchers.call.fn(apiCallWithRetry), uninstallSteps]])
        .call.fn(apiCallWithRetry)
        .put(
          actions.integrationApp.uninstaller2.receivedSteps(
            id,
            uninstallSteps,
          )
        )
        .call(uninstallStep, { id })
        .run()
    });
    test('should disptach failed action if API call throws error', () => {
      const error = { code: 404, message: 'integration not found' };
      return expectSaga(requestSteps, { id })
        .provide([[matchers.call.fn(apiCallWithRetry), throwError(error)]])
        .call.fn(apiCallWithRetry)
        .not.put(
          actions.integrationApp.uninstaller2.receivedSteps(
            id,
            [],
          )
        )
        .put(
          actions.integrationApp.uninstaller2.failed(
            id,
            error.message
          )
        )
        .run()
    });
  });
});
