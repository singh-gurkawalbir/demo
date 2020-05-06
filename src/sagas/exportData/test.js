/* global describe, test */

import { all } from 'redux-saga/effects';
import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import { throwError } from 'redux-saga-test-plan/providers';
import actions from '../../actions';
import { apiCallWithRetry } from '../index';
import { APIException } from '../api';
import exportDataSagas from './index';

describe('exportData saga', () => {
  // this is how we combine all things at the root saga
  // not strictly necessary but doesn't hurt to replicate here
  // the main benefit is that no need to export each generator func
  function* saga() {
    yield all([...exportDataSagas]);
  }

  test('should error non array', () => {
    const kind = 'virtual';
    const identifier = 'foo';
    const resource = {
      myExport: 1,
    };
    const mockData = { answer: 42 };

    return expectSaga(saga, {
      kind,
      identifier,
      resource,
    })
      .provide([[matchers.call.fn(apiCallWithRetry), { data: mockData }]])
      .put(
        actions.exportData.receiveError(
          kind,
          identifier,
          'expecting array. try transform?'
        )
      )
      .dispatch(actions.exportData.request(kind, identifier, resource))
      .silentRun();
  });

  test('should work empty array', () => {
    const kind = 'virtual';
    const identifier = 'foo';
    const resource = {
      myExport: 1,
    };
    const mockData = [];

    return expectSaga(saga, {
      kind,
      identifier,
      resource,
    })
      .provide([[matchers.call.fn(apiCallWithRetry), { data: mockData }]])
      .put(actions.exportData.receive(kind, identifier, mockData))
      .dispatch(actions.exportData.request(kind, identifier, resource))
      .silentRun();
  });

  test('should work primitive array', () => {
    const kind = 'virtual';
    const identifier = 'foo';
    const resource = {
      myExport: 1,
    };
    const mockData = [1, 2, 3];

    return expectSaga(saga, {
      kind,
      identifier,
      resource,
    })
      .provide([[matchers.call.fn(apiCallWithRetry), { data: mockData }]])
      .put(actions.exportData.receive(kind, identifier, mockData))
      .dispatch(actions.exportData.request(kind, identifier, resource))
      .silentRun();
  });

  test('should work label value array', () => {
    const kind = 'virtual';
    const identifier = 'foo';
    const resource = {
      myExport: 1,
    };
    const mockData = [{ label: '1', value: 1 }, { label: '2', value: 2 }];

    return expectSaga(saga, {
      kind,
      identifier,
      resource,
    })
      .provide([[matchers.call.fn(apiCallWithRetry), { data: mockData }]])
      .put(actions.exportData.receive(kind, identifier, mockData))
      .dispatch(actions.exportData.request(kind, identifier, resource))
      .silentRun();
  });

  test('should handle 422', () => {
    const kind = 'virtual';
    const identifier = 'foo';
    const resource = {
      myExport: 1,
    };
    const msg =
      '{"errors":[{"field":"netsuite","code":"missing_required_field","message":"netsuite subschema not defined"}]}';
    const mockError = new APIException({
      status: 422,
      message: msg,
    });

    return expectSaga(saga, {
      kind,
      identifier,
      resource,
    })
      .provide([[matchers.call.fn(apiCallWithRetry), throwError(mockError)]])
      .put(actions.exportData.receiveError(kind, identifier, JSON.parse(msg)))
      .dispatch(actions.exportData.request(kind, identifier, resource))
      .silentRun();
  });
});
