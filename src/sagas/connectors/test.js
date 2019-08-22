/* global describe, test, expect */

import { call, put } from 'redux-saga/effects';
import actions from '../../actions';
import { apiCallWithRetry } from '../index';
import { fetchMetadata } from './';

describe('evaluateProcessor saga', () => {
  test('should return the correct selector and handle the repsone correctly', () => {
    const _integrationId = 1;
    const metadata = { a: 1 };
    const path = `/integrations/${_integrationId}/settings/refreshMetadata`;
    const fieldName = 'extract';
    const fieldType = 'fieldId';
    const saga = fetchMetadata({ fieldType, fieldName, _integrationId });
    const apiCallEffect = saga.next().value;

    expect(apiCallEffect).toEqual(
      call(apiCallWithRetry, {
        path,
        opts: { body: { fieldName, type: fieldType }, method: 'PUT' },
        message: `Fetching metadata`,
      })
    );

    expect(saga.next(metadata).value).toEqual(
      put(
        actions.connectors.receivedMetadata(
          metadata,
          fieldType,
          fieldName,
          _integrationId
        )
      )
    );
    expect(saga.next().done).toEqual(true);
  });

  test('should call failedMetadata action when received error', () => {
    const _integrationId = 1;
    const path = `/integrations/${_integrationId}/settings/refreshMetadata`;
    const fieldName = 'extract';
    const fieldType = 'fieldId';
    const saga = fetchMetadata({ fieldType, fieldName, _integrationId });
    const apiCallEffect = saga.next().value;

    expect(apiCallEffect).toEqual(
      call(apiCallWithRetry, {
        path,
        opts: { body: { type: fieldType, fieldName }, method: 'PUT' },
        message: `Fetching metadata`,
      })
    );

    expect(saga.throw(new Error()).value).toEqual(
      put(actions.connectors.failedMetadata(fieldName, _integrationId))
    );
    expect(saga.next().done).toEqual(true);
  });
});
