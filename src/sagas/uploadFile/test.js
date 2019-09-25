/* global describe, test, expect */
import { call } from 'redux-saga/effects';
import { apiCallWithRetry } from '../index';
import { uploadFile } from './';

describe('uploadFile sagas', () => {
  const resourceId = '123';
  const resourceType = 'templates';
  const fileType = 'application/zip';
  const file = { _id: '456', name: 'someFile' };
  const path = `/${resourceType}/${resourceId}/upload/signedURL?file_type=${fileType}`;
  const response = { signedURL: 'someURL' };

  test('should succeed on successful api call', () => {
    const saga = uploadFile({ resourceType, resourceId, fileType, file });
    const callEffect = saga.next().value;

    expect(callEffect).toEqual(
      call(apiCallWithRetry, {
        path,
        message: 'Getting signedURL for file upload',
      })
    );
    expect(saga.next(response).done).toBe(true);
  });
  test('should return undefined if api call fails', () => {
    const saga = uploadFile({ resourceType, resourceId, fileType, file });
    const callEffect = saga.next().value;

    expect(callEffect).toEqual(
      call(apiCallWithRetry, {
        path,
        message: 'Getting signedURL for file upload',
      })
    );
    expect(saga.throw(new Error()).value).toEqual(true);
    expect(saga.next().done).toEqual(true);
  });
});
