/* global describe, test, expect */

import { call, select } from 'redux-saga/effects';
import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import actions from '../../actions';
import actionTypes from '../../actions/types';
import { apiCallWithRetry } from '../index';
import getRequestOptions from '../../utils/requestOptions';
import { selectors } from '../../reducers/index';
import { JOB_TYPES, JOB_STATUS } from '../../utils/constants';
import { run } from '.';

describe('run saga', () => {
  const flowId = 'f1';
  const flowResource = { _id: flowId, _integrationId: 'i1' };

  test('should call latestFlowJobs on successful api call in case of EM 2.0 ', () => {
    const response = { _jobId: 'j1', something: 'some thing' };

    return expectSaga(run, { flowId })
      .provide([
        [matchers.call.fn(apiCallWithRetry), response],
        [select(selectors.isOwnerUserInErrMgtTwoDotZero), true],
        [select(selectors.resource, 'flows', flowId), flowResource],
      ])
      .call.fn(apiCallWithRetry)
      .put(actions.errorManager.latestFlowJobs.request({ flowId }))
      .run();
  });

  test('should update job with received response on successful api call ', () => {
    const response = { _jobId: 'j1', something: 'some thing' };

    return expectSaga(run, { flowId })
      .provide([
        [matchers.call.fn(apiCallWithRetry), response],
        [select(selectors.isOwnerUserInErrMgtTwoDotZero), false],
        [select(selectors.resource, 'flows', flowId), flowResource],
      ])
      .call.fn(apiCallWithRetry)
      .put(
        actions.job.receivedFamily({
          job: {
            ...response,
            _id: response._jobId,
            _flowId: flowId,
            type: JOB_TYPES.FLOW,
            status: JOB_STATUS.QUEUED,
            _integrationId: 'i1',
          },
        })
      )
      .put(actions.job.requestInProgressJobStatus())
      .run();
  });

  test('should handle api error properly', () => {
    const saga = run({ flowId });

    saga.next();
    expect(saga.next(flowResource).value).toEqual(
      select(selectors.resource, 'flows', flowId)
    );

    const { path, opts } = getRequestOptions(actionTypes.FLOW.RUN, {
      resourceId: flowId,
    });

    expect(saga.next(flowResource).value).toEqual(
      call(apiCallWithRetry, { path, opts })
    );
    expect(saga.throw(new Error()).value).toEqual(true);
    expect(saga.next().done).toEqual(true);
  });
});
