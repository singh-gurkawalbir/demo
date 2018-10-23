/* global describe, test, expect */
// see: https://medium.com/@alanraison/testing-redux-sagas-e6eaa08d0ee7
// for good article on testing sagas..

import { call, put } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import actions, { availableResources } from '../actions';
import rootSaga, { apiCallWithRetry, getResourceCollection } from './';
import api from '../utils/api';

describe(`root saga`, () => {
  // NOTE, this test has little value... I added it to
  // increase code coverage. I'm not really sure what business rules
  // to test for the root saga... If something is not configured correctly
  // with the root saga then a simply sanity check of the UI would show
  // that something serious was broken... Possilby as out application
  // gets more complex, testable business rules will become more obvious...
  test('should return a set of effects that match available resources.', () => {
    const sagaIterator = rootSaga();
    const effects = sagaIterator.next();

    expect(effects.value.ALL.length).toBeGreaterThan(1);
  });
});

describe(`apiCallWithRetry saga`, () => {
  const path = '/test/me';
  const opts = { method: 'patch' };

  test('should succeed on successfull api call', () => {
    const saga = apiCallWithRetry(path, opts);
    // next() of generator functions always return:
    // { done: [true|false], value: {[right side of yield]} }
    const requestEffect = saga.next().value;

    expect(requestEffect).toEqual(put(actions.api.request(path)));

    const callEffect = saga.next().value;

    expect(callEffect).toEqual(call(api, path, opts));

    const mockData = { id: 1 };
    const putEffect = saga.next(mockData).value;

    expect(putEffect).toEqual(put(actions.api.complete(path)));

    const final = saga.next();

    // there should be no more inerations...
    // the generator should return done and return the response from the api.
    expect(final.done).toBe(true);
    expect(final.value).toEqual(mockData);
  });

  test('should finally succeed after initial failed api call', () => {
    const saga = apiCallWithRetry(path, opts);
    // next() of generator functions always return:
    // { done: [true|false], value: {[right side of yield]} }
    const requestEffect = saga.next().value;

    expect(requestEffect).toEqual(put(actions.api.request(path)));

    const callEffect = saga.next().value;
    const callApiEffect = call(api, path, opts);

    expect(callEffect).toEqual(callApiEffect);

    // lets throw an exception to simulate a failed API call
    // this should result in a delay, then retry action, then api call
    expect(saga.throw().value).toEqual(call(delay, 2000));
    expect(saga.next().value).toEqual(put(actions.api.retry(path)));
    expect(saga.next().value).toEqual(callApiEffect);

    const mockData = { id: 1 };
    const putEffect = saga.next(mockData).value;

    // finally the resource received action should be dispatched
    expect(putEffect).toEqual(put(actions.api.complete(path)));

    const final = saga.next();

    // there should be no more inerations...
    // the generator should return done and the response from the api.
    expect(final.done).toBe(true);
    expect(final.value).toEqual(mockData);
  });

  test('should finally fail with error effect after retries run out', () => {
    const saga = apiCallWithRetry(path, opts);
    const mockError = new Error('mock');
    const requestEffect = saga.next().value;

    expect(requestEffect).toEqual(put(actions.api.request(path)));
    const callApiEffect = call(api, path, opts);

    for (let i = 0; i < 3; i += 1) {
      // first iteration should be the api call
      expect(saga.next().value).toEqual(callApiEffect);

      if (i < 2) {
        expect(saga.throw(mockError).value).toEqual(call(delay, 2000));
        expect(saga.next().value).toEqual(put(actions.api.retry(path)));
      }
    }

    // the last failed api call should result in a dispatch
    // of the failure action.
    expect(saga.throw(mockError).value).toEqual(
      put(actions.api.failure(path, mockError.message))
    );

    // there should be no more iterations...
    // the generator should throw an Error.
    expect(() => saga.next()).toThrowError();
  });
});

availableResources.forEach(type => {
  describe(`getResourceCollection("${type}") saga`, () => {
    test('should succeed on successfull api call', () => {
      const saga = getResourceCollection(actions.resource.request(type));
      const path = `/${type}`;
      const mockCollection = [{ id: 1 }, { id: 2 }];
      // next() of generator functions always return:
      // { done: [true|false], value: {[right side of yield]} }
      const callEffect = saga.next().value;

      expect(callEffect).toEqual(call(apiCallWithRetry, path));

      const effect = saga.next(mockCollection).value;

      expect(effect).toEqual(
        put(actions.resource.received(type, mockCollection))
      );
    });
  });
});
