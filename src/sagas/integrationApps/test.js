/* global describe, test */

import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import { throwError } from 'redux-saga-test-plan/providers';
import actions from '../../actions';
import { apiCallWithRetry } from '../index';
import { initFormStep } from './installer';

describe('initFormStep saga', () => {
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

  test('should dispatch update step action with step form meta and not make API call, if no init form function', () =>
    expectSaga(initFormStep, { id, form })
      .not.call.fn(apiCallWithRetry)
      .put(
        actions.integrationApp.installer.updateStep(id, '', 'inProgress', form)
      )
      .run());

  test('should make API call when init function present and dispatch action with updated form meta', () => {
    const initFormFunction = 'somefunc';
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

    return expectSaga(initFormStep, { id, form, initFormFunction })
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
    const error = { code: 422, message: 'unprocessable entity' };
    const initFormFunction = 'somefunc';

    return expectSaga(initFormStep, { id, form, initFormFunction })
      .provide([[matchers.call.fn(apiCallWithRetry), throwError(error)]])
      .call.fn(apiCallWithRetry)
      .put(actions.integrationApp.installer.updateStep(id, '', 'failed'))
      .run();
  });
});
