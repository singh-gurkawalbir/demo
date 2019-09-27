/* global describe, test, expect */
import { call } from 'redux-saga/effects';
import { apiCallWithRetry } from '../index';
import { generateZip } from './';

describe('generateZip sagas', () => {
  const integrationId = '123';
  const path = `/integrations/${integrationId}/template`;
  const response = { signedURL: 'something' };

  test('should succeed on successful api call', () => {
    const saga = generateZip({ integrationId });
    const callEffect = saga.next().value;

    expect(callEffect).toEqual(
      call(apiCallWithRetry, {
        path,
        message: 'Generating zip',
      })
    );
    expect(saga.next(response).done).toBe(true);
  });
  test('should return undefined if api call fails', () => {
    const saga = generateZip({ integrationId });
    const callEffect = saga.next().value;

    expect(callEffect).toEqual(
      call(apiCallWithRetry, {
        path,
        message: 'Generating zip',
      })
    );
    expect(saga.throw(new Error()).value).toEqual(undefined);
    expect(saga.next().done).toEqual(true);
  });
});
