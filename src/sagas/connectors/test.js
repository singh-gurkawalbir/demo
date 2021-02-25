/* global describe, test */

import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import { throwError } from 'redux-saga-test-plan/providers';
import actions from '../../actions';
import { apiCallWithRetry } from '../index';
import { fetchMetadata, updateInstallBase } from '.';

describe('evaluate fetchMetadata saga', () => {
  const fieldType = 'dummy';
  const fieldName = 'dummy';
  const _integrationId = 'dummy';

  test('If api successful, should dispatch receivedMetadata while there is no options.autoPostBack', () => {
    const options = {};
    const metadata = { a: 1 };

    return expectSaga(fetchMetadata, { fieldType, fieldName, _integrationId, options })
      .provide([[matchers.call.fn(apiCallWithRetry), metadata]])
      .call.fn(apiCallWithRetry)
      .put(
        actions.connectors.receivedMetadata(
          metadata,
          fieldType,
          fieldName,
          _integrationId
        )
      )
      .run();
  });
  test('If api successful, should dispatch multiple receivedMetadata while metadata is an array and options.autoPostBack is true', () => {
    const options = { autoPostBack: true };
    const metadata = [{ a: 1 }, { b: 2 }, { c: 3 }];

    const saga = expectSaga(fetchMetadata, { fieldType, fieldName, _integrationId, options })
      .provide([[matchers.call.fn(apiCallWithRetry), metadata]])
      .call.fn(apiCallWithRetry);

    metadata.map(fieldMeta =>
      saga.put(
        actions.connectors.receivedMetadata(
          fieldMeta,
          null,
          fieldMeta.name,
          _integrationId
        )
      )
    );

    return saga.run();
  });
  test('If api successful, should dispatch receivedMetadata while metadata is not an array and options.autoPostBack is true', () => {
    const options = { autoPostBack: true };
    const metadata = { name: 'dummy' };

    return expectSaga(fetchMetadata, { fieldType, fieldName, _integrationId, options })
      .provide([[matchers.call.fn(apiCallWithRetry), metadata]])
      .call.fn(apiCallWithRetry)
      .put(
        actions.connectors.receivedMetadata(
          metadata,
          null,
          metadata.name,
          _integrationId
        )
      )
      .run();
  });
  test('If api failed, should dispatch failedMetadata', () => {
    const options = {};
    const error = new Error('error');

    return expectSaga(fetchMetadata, { fieldType, fieldName, _integrationId, options })
      .provide([[matchers.call.fn(apiCallWithRetry), throwError(error)]])
      .call.fn(apiCallWithRetry)
      .put(actions.connectors.failedMetadata(fieldName, _integrationId))
      .run();
  });
});

describe('evaluate updateInstallBase saga', () => {
  const connectorId = '123';

  test('api call is success', () => expectSaga(updateInstallBase, connectorId)
    .provide([[matchers.call.fn(apiCallWithRetry)]])
    .call.fn(apiCallWithRetry)
    .run());

  test('api call failed', () => expectSaga(updateInstallBase, connectorId)
    .provide([
      [matchers.call.fn(apiCallWithRetry), throwError(new Error('error'))],
    ])
    .call.fn(apiCallWithRetry)
    .run());
});
