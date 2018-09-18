/* global describe, test, expect */
// see: https://medium.com/@alanraison/testing-redux-sagas-e6eaa08d0ee7
// for good article on testing sagas..

import { call, put } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import actions from '../actions';
import { fetchResource } from './';
import api from '../utils/api';

const resources = ['exports', 'imports', 'connections', 'profile'];

resources.forEach(resource => {
  describe(`fetchResource("${resource}") saga`, () => {
    test('should succeed on successfull api call', () => {
      const fetchSaga = fetchResource(actions[resource], resource);
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
