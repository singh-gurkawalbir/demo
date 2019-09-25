/* global describe, test, expect */
import { call } from 'redux-saga/effects';
import { apiCallWithRetry } from '../index';
import { downloadZip, generateZip } from './';

describe('downloadZip sagas', () => {
  const id = '123';
  const path = `/templates/${id}/download/signedURL`;
  const response = { signedURL: 'something' };

  test('should succeed on successful api call', () => {
    const saga = downloadZip({ id });
    const callEffect = saga.next().value;

    expect(callEffect).toEqual(
      call(apiCallWithRetry, {
        path,
        message: 'Downloading zip',
      })
    );
    expect(saga.next(response).done).toBe(true);
  });
  test('should return undefined if api call fails', () => {
    const saga = downloadZip({ id });
    const callEffect = saga.next().value;

    expect(callEffect).toEqual(
      call(apiCallWithRetry, {
        path,
        message: 'Downloading zip',
      })
    );
    expect(saga.throw(new Error()).value).toEqual(undefined);
    expect(saga.next().done).toEqual(true);
  });
});

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
