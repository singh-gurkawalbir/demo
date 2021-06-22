/* global expect, describe, test */

import { call, cancel, fork, take } from 'redux-saga/effects';
import { expectSaga, testSaga } from 'redux-saga-test-plan';
import { throwError } from 'redux-saga-test-plan/providers';
import { createMockTask } from '@redux-saga/testing-utils';
import { pollForLatestJobs, requestLatestJobs, startPollingForLatestJobs } from '.';
import { apiCallWithRetry } from '../../..';
import actions from '../../../../actions';
import actionTypes from '../../../../actions/types';

describe('requestLatestJobs saga', () => {
  const integrationId = 'i1';
  const path = `/integrations/${integrationId}/jobs/latest`;
  const method = 'GET';

  test('should dispatch integrationLatestJobs received action on successful api call', () => {
    const integrationLatestJobs = [
      {
        _id: 'j1',
      },
    ];

    return expectSaga(requestLatestJobs, {integrationId})
      .provide([
        [call(apiCallWithRetry, {path, opts: {method}, hidden: true}), integrationLatestJobs],
      ])
      .call(apiCallWithRetry, {path, opts: {method}, hidden: true})
      .put(
        actions.errorManager.integrationLatestJobs.received({
          integrationId,
          latestJobs: integrationLatestJobs,
        })
      )
      .run();
  });
  test('should dispatch integrationLatestJobs error action if api call fails', () => {
    const error = { message: 'something' };

    return expectSaga(requestLatestJobs, {integrationId})
      .provide([
        [call(apiCallWithRetry, {path, opts: {method}, hidden: true}), throwError(error)],
      ])
      .call(apiCallWithRetry, {path, opts: {method}, hidden: true})
      .not.put(
        actions.errorManager.integrationLatestJobs.received({
          integrationId,
          latestJobs: [],
        })
      )
      .put(
        actions.errorManager.integrationLatestJobs.error({
          integrationId,
        })
      )
      .run();
  });
});

describe('pollForLatestJobs saga', () => {
  test('should repeatedly call requestLatestJobs', () => {
    const integrationId = 'i1';

    testSaga(pollForLatestJobs, {integrationId})
      .next()
      .put(actions.errorManager.integrationLatestJobs.request({ integrationId }))
      .next()
      .call(requestLatestJobs, {integrationId})
      .next()
      .delay(5 * 1000)
      .next()
      .call(requestLatestJobs, {integrationId})
      .next()
      .delay(5 * 1000)
      .next()
      .call(requestLatestJobs, {integrationId});
  });
});

describe('startPollingForLatestJobs saga', () => {
  test('should fork pollForLatestJobs, wait for integration job cancel_poll action is dispatched then cancel pollForLatestJobs', () => {
    const integrationId = 'i1';
    const saga = startPollingForLatestJobs({integrationId});

    expect(saga.next().value).toEqual(fork(pollForLatestJobs, {integrationId}));

    const watcherTask = createMockTask();

    expect(saga.next(watcherTask).value).toEqual(take(actionTypes.ERROR_MANAGER.INTEGRATION_LATEST_JOBS.CANCEL_POLL));
    expect(saga.next().value).toEqual(cancel(watcherTask));
    expect(saga.next().done).toEqual(true);
  });
});
