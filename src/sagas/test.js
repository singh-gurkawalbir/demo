/* global describe, test, expect */
// see: https://medium.com/@alanraison/testing-redux-sagas-e6eaa08d0ee7
// for good article on testing sagas..

import { call, put } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import actions, { availableResources } from '../actions';
import rootSaga, { fetchResource } from './';
import api from '../utils/api';

const resources = [...availableResources, 'profile'];

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

    expect(effects.value.ALL.length).toBe(resources.length);
  });
});

resources.forEach(resource => {
  describe(`fetchResource("${resource}") saga`, () => {
    test('should succeed on successfull api call', () => {
      const fetchSaga = fetchResource(actions[resource], resource);
      // next() of generator functions always return:
      // { done: [true|false], value: {[right side of yield]} }
      const callEffect = fetchSaga.next().value;

      // console.log('callEffect', callEffect);
      // first iteration should be the api call
      expect(callEffect).toEqual(call(api, `/${resource}`));

      const mockData = { id: 1 };
      const putEffect = fetchSaga.next(mockData).value;

      // second iteration should be to raise the received action
      expect(putEffect).toEqual(put(actions[resource].received(mockData)));

      const complete = fetchSaga.next();

      // there should be no more inerations... the generator shoudl return done.
      expect(complete.done).toBe(true);
      expect(complete.value).toBeUndefined();
    });

    test('should finally succeed after initial failed api call', () => {
      const fetchSaga = fetchResource(actions[resource], resource);
      const callEffect = fetchSaga.next().value;

      // console.log('callEffect', callEffect);
      // first iteration should be the api call
      expect(callEffect).toEqual(call(api, `/${resource}`));

      // lets throw an exception to simulate a failed API call
      // this should result in a delay, then retry action, then api call
      expect(fetchSaga.throw().value).toEqual(call(delay, 2000));
      expect(fetchSaga.next().value).toEqual(put(actions[resource].retry()));
      expect(fetchSaga.next().value).toEqual(call(api, `/${resource}`));

      const mockData = { id: 1 };

      // finally the resource received action should be dispatched
      expect(fetchSaga.next(mockData).value).toEqual(
        put(actions[resource].received(mockData))
      );

      const complete = fetchSaga.next();

      // there should be no more inerations... the generator shoudl return done.
      expect(complete.done).toBe(true);
      expect(complete.value).toBeUndefined();
    });

    test('should finally fail with error effect after retries run out', () => {
      const fetchSaga = fetchResource(actions[resource], resource);
      const mockError = new Error('mock');

      for (let i = 0; i < 3; i += 1) {
        // first iteration should be the api call
        expect(fetchSaga.next().value).toEqual(call(api, `/${resource}`));

        if (i < 2) {
          expect(fetchSaga.throw(mockError).value).toEqual(call(delay, 2000));
          expect(fetchSaga.next().value).toEqual(
            put(actions[resource].retry())
          );
        }
      }

      // the last failed api call should result in a dispatch
      // of the failure action.
      expect(fetchSaga.throw(mockError).value).toEqual(
        put(actions[resource].failure(mockError.message))
      );

      const complete = fetchSaga.next();

      // there should be no more inerations... the generator shoudl return done.
      expect(complete.done).toBe(true);
      expect(complete.value).toBeUndefined();
    });
  });
});
