/* global describe, test, expect */

import { call, put, select } from 'redux-saga/effects';
import actions from '../../actions';
import actionTypes from '../../actions/types';
import { apiCallWithRetry } from '../index';
import getRequestOptions from '../../utils/requestOptions';
import * as selectors from '../../reducers/index';
import { JOB_TYPES, JOB_STATUS } from '../../utils/constants';
import { run } from './';

describe('run saga', () => {
  const flowId = 'f1';
  const flowResource = { _id: flowId, _integrationId: 'i1' };

  test('should succeed on successful api call', () => {
    const saga = run({ flowId });
    const { path, opts } = getRequestOptions(actionTypes.FLOW.RUN, {
      resourceId: flowId,
    });

    expect(saga.next().value).toEqual(call(apiCallWithRetry, { path, opts }));
    const response = { _jobId: 'j1', something: 'some thing' };

    expect(saga.next(response).value).toEqual(
      select(selectors.resource, 'flows', flowId)
    );

    expect(saga.next(flowResource).value).toEqual(
      put(
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
    );
    expect(saga.next().value).toEqual(
      put(actions.job.requestInProgressJobStatus())
    );
    expect(saga.next().done).toEqual(true);
  });

  test('should handle api error properly', () => {
    const saga = run({ flowId });
    const { path, opts } = getRequestOptions(actionTypes.FLOW.RUN, {
      resourceId: flowId,
    });

    expect(saga.next().value).toEqual(call(apiCallWithRetry, { path, opts }));
    expect(saga.throw(new Error()).value).toEqual(true);
    expect(saga.next().done).toEqual(true);
  });
});
