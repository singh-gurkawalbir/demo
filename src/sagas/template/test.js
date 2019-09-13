/* global describe, test, expect */
import { call, put } from 'redux-saga/effects';
import actions from '../../actions';
import { apiCallWithRetry } from '../index';
import { downloadZip, publish, generateZip } from './';

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

describe('publish sagas', () => {
  const resource = { _id: '123', published: true };
  const resourceType = 'templates';
  const path = `/${resourceType}/${resource._id}`;

  test('should succeed on successful api call', () => {
    const saga = publish({ resource, resourceType });
    const callEffect = saga.next().value;

    expect(callEffect).toEqual(
      call(apiCallWithRetry, {
        path,
        opts: {
          method: 'PUT',
          body: { ...resource, published: !resource.published },
        },
      })
    );
    const effect = saga.next().value;

    expect(effect).toEqual(
      put(
        actions.resource.update(resourceType, resource._id, {
          published: !resource.published,
        })
      )
    );

    expect(saga.next().done).toEqual(true);
  });
  test('should return undefined if api call fails', () => {
    const saga = publish({ resource, resourceType });
    const callEffect = saga.next().value;

    expect(callEffect).toEqual(
      call(apiCallWithRetry, {
        path,
        opts: {
          method: 'PUT',
          body: { ...resource, published: !resource.published },
        },
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
