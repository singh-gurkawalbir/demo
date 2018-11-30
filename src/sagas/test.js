/* global describe, test, expect */
// see: https://medium.com/@alanraison/testing-redux-sagas-e6eaa08d0ee7
// for good article on testing sagas..

import { call, put, select } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import actions, { availableResources } from '../actions';
import * as selectors from '../reducers';
import rootSaga, {
  apiCallWithRetry,
  getResource,
  getResourceCollection,
  auth,
  evaluateProcessor,
  autoEvaluateProcessor,
  commitStagedChanges,
} from './';
import { api, APIException, authParams } from '../utils/api';

const status500 = new APIException({
  status: 500,
  message: 'error',
});
const status422 = new APIException({
  status: 422,
  message: 'authentication failure',
});

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
    // lets throw a 500 status code exception and expect the retry

    expect(saga.throw(status500).value).toEqual(call(delay, 2000));
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
  describe(`getResource("${type}", id) saga`, () => {
    const id = 123;

    test('should succeed on successfull api call', () => {
      // assign
      const saga = getResource(actions.resource.request(type, id));
      const path = `/${type}/${id}`;
      const mockResource = { id: 1, name: 'bob' };
      // act
      const callEffect = saga.next().value;

      expect(callEffect).toEqual(call(apiCallWithRetry, path));

      const effect = saga.next(mockResource).value;

      expect(effect).toEqual(
        put(actions.resource.received(type, mockResource))
      );

      const final = saga.next();

      expect(final.done).toBe(true);
      expect(final.value).toEqual(mockResource);
    });

    test('should return undefined if api call fails', () => {
      // assign
      const saga = getResource(actions.resource.request(type, id));
      const path = `/${type}/${id}`;
      // act
      const callEffect = saga.next().value;

      expect(callEffect).toEqual(call(apiCallWithRetry, path));

      const final = saga.throw(status500);

      expect(final.done).toBe(true);
      expect(final.value).toBeUndefined();
    });
  });

  describe(`getResourceCollection("${type}") saga`, () => {
    test('should succeed on successfull api call', () => {
      const saga = getResourceCollection(
        actions.resource.requestCollection(type)
      );
      const path = `/${type}`;
      const mockCollection = [{ id: 1 }, { id: 2 }];
      // next() of generator functions always return:
      // { done: [true|false], value: {[right side of yield]} }
      const callEffect = saga.next().value;

      expect(callEffect).toEqual(call(apiCallWithRetry, path));

      const effect = saga.next(mockCollection).value;

      expect(effect).toEqual(
        put(actions.resource.receivedCollection(type, mockCollection))
      );

      const final = saga.next();

      expect(final.done).toBe(true);
      expect(final.value).toEqual(mockCollection);
    });

    test('should return undefined if api call fails', () => {
      const saga = getResourceCollection(
        actions.resource.requestCollection(type)
      );
      const path = `/${type}`;
      const callEffect = saga.next().value;

      expect(callEffect).toEqual(call(apiCallWithRetry, path));

      const final = saga.throw(status500);

      expect(final.done).toBe(true);
      expect(final.value).toBeUndefined();
    });
  });
});

describe('auth saga flow', () => {
  test('action to set authentication to true when auth is successful', () => {
    const message = 'someUserCredentials';
    const saga = auth({ message });
    const callEffect = saga.next().value;
    const payload = { ...authParams.opts, body: message };

    expect(callEffect).toEqual(
      call(apiCallWithRetry, authParams.path, payload)
    );
    const effect = saga.next().value;

    expect(effect).toEqual(put(actions.auth.complete()));
  });

  test('should dispatch a delete profile action when authentication fails', () => {
    const message = 'someUserCredentials';
    const saga = auth({ message });
    const callEffect = saga.next().value;
    const payload = { ...authParams.opts, body: message };

    expect(callEffect).toEqual(
      call(apiCallWithRetry, authParams.path, payload)
    );
    expect(saga.throw(status422).value).toEqual(
      put(actions.auth.failure('Authentication Failure'))
    );
    const effect = saga.next().value;

    expect(effect).toEqual(put(actions.profile.delete()));
  });
});

describe('evaluateProcessor saga', () => {
  test('should do nothing if no editor exists with given id', () => {
    const id = 1;
    const saga = evaluateProcessor({ id });
    const selectEffect = saga.next().value;

    expect(selectEffect).toEqual(select(selectors.processorRequestOptions, id));

    const effect = saga.next();

    expect(effect.done).toEqual(true);
  });

  test('should complete with dispatch of failure action when editor has validation errors.', () => {
    const id = 1;
    const errors = ['error'];
    const saga = evaluateProcessor({ id });
    const selectEffect = saga.next().value;

    expect(selectEffect).toEqual(select(selectors.processorRequestOptions, id));

    const putEffect = saga.next({ errors }).value;

    expect(putEffect).toEqual(
      put(actions.editor.evaluateFailure(id, JSON.stringify(errors, null, 2)))
    );

    const finalEffect = saga.next();

    expect(finalEffect).toEqual({ done: true, value: undefined });
  });

  test('should complete with dispatch of evaluate response when editor is valid.', () => {
    const id = 1;
    const saga = evaluateProcessor({ id });
    const selectEffect = saga.next().value;

    expect(selectEffect).toEqual(select(selectors.processorRequestOptions, id));

    const selectResponse = { processor: 'p', body: 'body' };
    const callEffect = saga.next(selectResponse).value;
    const opts = {
      method: 'post',
      body: '"body"',
    };

    expect(callEffect).toEqual(call(apiCallWithRetry, '/processors/p', opts));

    const apiResult = 'result';
    const putEffect = saga.next(apiResult).value;

    expect(putEffect).toEqual(
      put(actions.editor.evaluateResponse(id, apiResult))
    );

    const finalEffect = saga.next();

    expect(finalEffect).toEqual({ done: true, value: undefined });
  });

  test('should complete with dispatch of evaluate failure when api call fails.', () => {
    const id = 1;
    const saga = evaluateProcessor({ id });
    const selectEffect = saga.next().value;

    expect(selectEffect).toEqual(select(selectors.processorRequestOptions, id));

    const selectResponse = { processor: 'p', body: 'body' };
    const callEffect = saga.next(selectResponse).value;
    const opts = {
      method: 'post',
      body: '"body"',
    };

    expect(callEffect).toEqual(call(apiCallWithRetry, '/processors/p', opts));

    const putEffect = saga.throw(new Error('boom')).value;

    expect(putEffect).toEqual(put(actions.editor.evaluateFailure(id, 'boom')));

    const finalEffect = saga.next();

    expect(finalEffect).toEqual({ done: true, value: undefined });
  });
});

describe('autoEvaluateProcessor saga', () => {
  const id = 1;

  test('should do nothing if no editor exists with given id', () => {
    const saga = autoEvaluateProcessor({ id });
    const selectEffect = saga.next().value;

    expect(selectEffect).toEqual(select(selectors.editor, id));

    const effect = saga.next();

    expect(effect.done).toEqual(true);
  });

  test('should do nothing if editor existsbut auto evaluate is off.', () => {
    const saga = autoEvaluateProcessor({ id });
    const selectEffect = saga.next().value;

    expect(selectEffect).toEqual(select(selectors.editor, id));

    const effect = saga.next({ autoEvaluate: false });

    expect(effect.done).toEqual(true);
  });

  test('should not pause if no delay is set.', () => {
    const saga = autoEvaluateProcessor({ id });
    const selectEffect = saga.next().value;

    expect(selectEffect).toEqual(select(selectors.editor, id));

    const callEffect = saga.next({ autoEvaluate: true }).value;

    expect(callEffect).toEqual(call(evaluateProcessor, { id }));

    const finalEffect = saga.next();

    expect(finalEffect).toEqual({ done: true, value: undefined });
  });

  test('should not pause if no delay is set.', () => {
    const saga = autoEvaluateProcessor({ id });
    const selectEffect = saga.next().value;

    expect(selectEffect).toEqual(select(selectors.editor, id));

    const callEffect = saga.next({ autoEvaluate: true }).value;

    expect(callEffect).toEqual(call(evaluateProcessor, { id }));

    const finalEffect = saga.next();

    expect(finalEffect).toEqual({ done: true, value: undefined });
  });

  test('should pause if delay is set.', () => {
    const saga = autoEvaluateProcessor({ id });
    const selectEffect = saga.next().value;
    const autoEvaluateDelay = 200;

    expect(selectEffect).toEqual(select(selectors.editor, id));

    let callEffect = saga.next({ autoEvaluate: true, autoEvaluateDelay }).value;

    expect(callEffect).toEqual(call(delay, autoEvaluateDelay));

    callEffect = saga.next().value;
    expect(callEffect).toEqual(call(evaluateProcessor, { id }));

    const finalEffect = saga.next();

    expect(finalEffect).toEqual({ done: true, value: undefined });
  });
});

describe('commitStagedChanges saga', () => {
  const id = 1;
  const resourceType = 'dogs';

  test('should do nothing if no staged changes exist.', () => {
    const saga = commitStagedChanges({ resourceType, id });
    const selectEffect = saga.next().value;

    expect(selectEffect).toEqual(
      select(selectors.resourceData, resourceType, id)
    );

    const effect = saga.next({});

    expect(effect.done).toEqual(true);
  });

  test('should complete with dispatch of conflict and received actions when origin does not match master.', () => {
    const saga = commitStagedChanges({ resourceType, id });
    const selectEffect = saga.next().value;

    expect(selectEffect).toEqual(
      select(selectors.resourceData, resourceType, id)
    );

    const callEffect = saga.next({ master: { lastModified: 50 }, patch: true })
      .value;

    expect(callEffect).toEqual(
      call(apiCallWithRetry, `/${resourceType}/${id}`)
    );

    const origin = { id, lastModified: 100 };
    const putEffect = saga.next(origin).value;
    const conflict = [
      {
        op: 'add',
        path: '/id',
        value: 1,
      },
    ];

    expect(putEffect).toEqual(
      put(actions.resource.commitConflict(id, conflict))
    );

    expect(saga.next().value).toEqual(
      put(actions.resource.received(resourceType, origin))
    );

    const finalEffect = saga.next();

    expect(finalEffect).toEqual({ done: true, value: undefined });
  });

  test('should complete with dispatch of received and clear stage actions when commit succeeds.', () => {
    const saga = commitStagedChanges({ resourceType, id });
    const selectEffect = saga.next().value;

    expect(selectEffect).toEqual(
      select(selectors.resourceData, resourceType, id)
    );

    const origin = { id, lastModified: 100 };
    const merged = { id, lastModified: 100 };
    const path = `/${resourceType}/${id}`;
    const getCallEffect = saga.next({
      master: { lastModified: 100 },
      merged,
      patch: true,
    }).value;

    expect(getCallEffect).toEqual(call(apiCallWithRetry, path));

    const putCallEffect = saga.next(merged, origin).value;

    expect(putCallEffect).toEqual(
      call(apiCallWithRetry, path, {
        method: 'put',
        body: JSON.stringify(merged),
      })
    );

    const updated = { id: 1 };
    const putEffect = saga.next(updated).value;

    expect(putEffect).toEqual(
      put(actions.resource.received(resourceType, updated))
    );

    expect(saga.next().value).toEqual(put(actions.resource.clearStaged(id)));

    const finalEffect = saga.next();

    expect(finalEffect).toEqual({ done: true, value: undefined });
  });
});
