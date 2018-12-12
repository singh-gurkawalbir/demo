/* global describe, test, expect */
import { call, put, select } from 'redux-saga/effects';
import actions from '../../actions';
import * as selectors from '../../reducers';
import { apiCallWithRetry } from '../index';
import { commitStagedChanges } from './';

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
        body: merged,
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
