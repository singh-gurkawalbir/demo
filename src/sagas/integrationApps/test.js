/* global describe, test */

import { expectSaga, testSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import { throwError } from 'redux-saga-test-plan/providers';
import actions from '../../actions';
import { apiCallWithRetry } from '../index';
import { getCurrentStep } from './installer';

describe('getCurrentStep saga', () => {
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
