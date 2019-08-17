/* global describe, test, expect */

import {
  call,
  put,
  fork,
  take,
  cancel,
  delay,
  select,
  all,
} from 'redux-saga/effects';
import { createMockTask } from '@redux-saga/testing-utils';
import actions from '../../actions';
import actionTypes from '../../actions/types';
import { apiCallWithRetry } from '../index';
import getRequestOptions from '../../utils/requestOptions';
import {
  getJobFamily,
  getInProgressJobsStatus,
  pollForInProgressJobs,
  startPollingForInProgressJobs,
  requestJobCollection,
  getJobCollection,
  downloadDiagnosticsFile,
  cancelJob,
} from './';
import * as selectors from '../../reducers/index';
import { JOB_TYPES } from '../../utils/constants';
import openExternalUrl from '../../utils/window';

describe('job sagas', () => {
  describe('getJobFamily saga', () => {
    test('should succeed on successful api call for bulk retry job', () => {
      const dataIn = { jobId: 'brj1', type: JOB_TYPES.BULK_RETRY };
      const saga = getJobFamily(dataIn);
      const { path, opts } = getRequestOptions(actionTypes.JOB.REQUEST, {
        resourceId: dataIn.jobId,
      });

      expect(saga.next().value).toEqual(
        call(apiCallWithRetry, {
          path,
          opts,
        })
      );
      const job = { ...dataIn, some: 'thing' };

      expect(saga.next(job).value).toEqual(
        put(actions.job.receivedFamily({ job }))
      );
      expect(saga.next().done).toEqual(true);
    });
    test('should succeed on successful api call for flow job', () => {
      const dataIn = { jobId: 'fj1' };
      const saga = getJobFamily(dataIn);
      const { path, opts } = getRequestOptions(actionTypes.JOB.REQUEST_FAMILY, {
        resourceId: dataIn.jobId,
      });

      expect(saga.next().value).toEqual(
        call(apiCallWithRetry, {
          path,
          opts,
        })
      );
      const job = { ...dataIn, some: 'thing' };

      expect(saga.next(job).value).toEqual(
        put(actions.job.receivedFamily({ job }))
      );
      expect(saga.next().done).toEqual(true);
    });
    test('should handle api error properly', () => {
      const dataIn = { jobId: 'fj1' };
      const saga = getJobFamily(dataIn);
      const { path, opts } = getRequestOptions(actionTypes.JOB.REQUEST_FAMILY, {
        resourceId: dataIn.jobId,
      });

      expect(saga.next().value).toEqual(
        call(apiCallWithRetry, {
          path,
          opts,
        })
      );

      expect(saga.throw(new Error()).value).toEqual(true);
      expect(saga.next().done).toEqual(true);
    });
  });

  describe('getInProgressJobsStatus saga', () => {
    test('should dispatch no inprogress jobs action when there are no jobs in running state', () => {
      const saga = getInProgressJobsStatus();

      expect(saga.next().value).toEqual(select(selectors.inProgressJobIds));
      expect(saga.next({ flowJobs: [], bulkRetryJobs: [] }).value).toEqual(
        put(actions.job.noInProgressJobs())
      );
      expect(saga.next().done).toEqual(true);
    });
    test('should call getJobFamily for each flow job in running state', () => {
      const saga = getInProgressJobsStatus();

      expect(saga.next().value).toEqual(select(selectors.inProgressJobIds));
      const inProgressJobIds = {
        flowJobs: ['fj1', 'fj2'],
        bulkRetryJobs: [],
      };

      expect(saga.next(inProgressJobIds).value).toEqual(
        all(
          inProgressJobIds.flowJobs.map(jobId => call(getJobFamily, { jobId }))
        )
      );
      expect(saga.next().done).toEqual(true);
    });
    test('should call getJobFamily for each bulk retry job in running state', () => {
      const saga = getInProgressJobsStatus();

      expect(saga.next().value).toEqual(select(selectors.inProgressJobIds));
      const inProgressJobIds = {
        flowJobs: [],
        bulkRetryJobs: ['brj1', 'brj2'],
      };

      expect(saga.next(inProgressJobIds).value).toEqual(
        all(
          inProgressJobIds.bulkRetryJobs.map(jobId =>
            call(getJobFamily, { jobId, type: JOB_TYPES.BULK_RETRY })
          )
        )
      );
      expect(saga.next().done).toEqual(true);
    });
  });

  describe('pollForInProgressJobs saga', () => {
    test('should call getInProgressJobsStatus after 5 seconds delay continuously', () => {
      const saga = pollForInProgressJobs();

      expect(saga.next().value).toEqual(delay(5000));
      expect(saga.next().value).toEqual(call(getInProgressJobsStatus));
      expect(saga.next().done).toEqual(false);
    });
  });

  describe('startPollingForInProgressJobs saga', () => {
    test('should fork pollForInProgressJobs, waits for job clear or no running jobs or request inprogress jobs status action and then cancels pollForInProgressJobs', () => {
      const saga = startPollingForInProgressJobs();

      expect(saga.next().value).toEqual(fork(pollForInProgressJobs));

      const watcherTask = createMockTask();

      expect(saga.next(watcherTask).value).toEqual(
        take([
          actionTypes.JOB.CLEAR,
          actionTypes.JOB.NO_IN_PROGRESS_JOBS,
          actionTypes.JOB.REQUEST_IN_PROGRESS_JOBS_STATUS,
        ])
      );
      expect(saga.next().value).toEqual(cancel(watcherTask));
      expect(saga.next().done).toEqual(true);
    });
  });

  describe('requestJobCollection saga', () => {
    test('should succeed on successful api call', () => {
      const dataIn = {
        integrationId: 'i1',
      };
      const saga = requestJobCollection(dataIn);
      const { path, opts } = getRequestOptions(
        actionTypes.JOB.REQUEST_COLLECTION,
        {
          filters: { integrationId: dataIn.integrationId },
        }
      );

      expect(saga.next().value).toEqual(
        call(apiCallWithRetry, {
          path,
          opts,
        })
      );

      const jobs = [{ _id: 'j1' }, { _id: 'j2' }];

      expect(saga.next(jobs).value).toEqual(
        put(actions.job.receivedCollection({ collection: jobs }))
      );
      expect(saga.next().value).toEqual(
        put(actions.job.getInProgressJobStatus())
      );
      expect(saga.next().done).toEqual(true);
    });
    test('should succeed on successful api call (with filters)', () => {
      const dataIn = {
        integrationId: 'i1',
        filters: { some: 'thing' },
      };
      const saga = requestJobCollection(dataIn);
      const { path, opts } = getRequestOptions(
        actionTypes.JOB.REQUEST_COLLECTION,
        {
          filters: { ...dataIn.filters, integrationId: dataIn.integrationId },
        }
      );

      expect(saga.next().value).toEqual(
        call(apiCallWithRetry, {
          path,
          opts,
        })
      );

      const jobs = [{ _id: 'j1' }, { _id: 'j2' }];

      expect(saga.next(jobs).value).toEqual(
        put(actions.job.receivedCollection({ collection: jobs }))
      );
      expect(saga.next().value).toEqual(
        put(actions.job.getInProgressJobStatus())
      );
      expect(saga.next().done).toEqual(true);
    });
    test('should succeed on successful api call (with filters and flow id)', () => {
      const dataIn = {
        integrationId: 'i1',
        filters: { flowId: 'someFlowId', some: 'thing' },
      };
      const saga = requestJobCollection(dataIn);
      const { path, opts } = getRequestOptions(
        actionTypes.JOB.REQUEST_COLLECTION,
        {
          filters: { ...dataIn.filters, integrationId: dataIn.integrationId },
        }
      );

      expect(saga.next().value).toEqual(
        call(apiCallWithRetry, {
          path,
          opts,
        })
      );

      const jobs = [{ _id: 'j1' }, { _id: 'j2' }];

      expect(saga.next(jobs).value).toEqual(
        put(actions.job.receivedCollection({ collection: jobs }))
      );
      expect(saga.next().value).toEqual(
        put(actions.job.getInProgressJobStatus())
      );
      expect(saga.next().done).toEqual(true);
    });
    test('should handle api error properly', () => {
      const dataIn = {
        integrationId: 'i1',
        filters: { flowId: 'someFlowId', some: 'thing' },
      };
      const saga = requestJobCollection(dataIn);
      const { path, opts } = getRequestOptions(
        actionTypes.JOB.REQUEST_COLLECTION,
        {
          filters: { ...dataIn.filters, integrationId: dataIn.integrationId },
        }
      );

      expect(saga.next().value).toEqual(
        call(apiCallWithRetry, {
          path,
          opts,
        })
      );
      expect(saga.throw(new Error()).value).toEqual(true);
      expect(saga.next().done).toEqual(true);
    });
  });

  describe('getJobCollection saga', () => {
    test('should fork requestJobCollection, waits for job clear action and then cancels requestJobCollection', () => {
      const dataIn = {
        integrationId: 'i1',
        filters: { some: 'thing' },
      };
      const saga = getJobCollection(dataIn);

      expect(saga.next().value).toEqual(fork(requestJobCollection, dataIn));

      const watcherTask = createMockTask();

      expect(saga.next(watcherTask).value).toEqual(take(actionTypes.JOB.CLEAR));
      expect(saga.next().value).toEqual(cancel(watcherTask));
      expect(saga.next().done).toEqual(true);
    });
  });

  describe('downloadDiagnosticsFile saga', () => {
    test('should succeed on successful api call', () => {
      const jobId = 'something';
      const saga = downloadDiagnosticsFile({ jobId });
      const { path, opts } = getRequestOptions(
        actionTypes.JOB.REQUEST_DIAGNOSTICS_FILE_URL,
        { resourceId: jobId }
      );

      expect(saga.next().value).toEqual(
        call(apiCallWithRetry, {
          path,
          opts,
        })
      );
      const response = { signedURL: 'some url' };

      expect(saga.next(response).value).toEqual(
        call(openExternalUrl, { url: response.signedURL })
      );
      expect(saga.next().done).toEqual(true);
    });

    test('should handle api error properly', () => {
      const jobId = 'something';
      const saga = downloadDiagnosticsFile({ jobId });
      const { path, opts } = getRequestOptions(
        actionTypes.JOB.REQUEST_DIAGNOSTICS_FILE_URL,
        { resourceId: jobId }
      );

      expect(saga.next().value).toEqual(
        call(apiCallWithRetry, {
          path,
          opts,
        })
      );
      expect(saga.throw(new Error()).value).toEqual(true);
      expect(saga.next().done).toEqual(true);
    });
  });

  describe('cancelJob saga', () => {
    test('should succeed on successful api call (bulk retry job)', () => {
      const jobId = 'brj1';
      const saga = cancelJob({ jobId });
      const { path, opts } = getRequestOptions(actionTypes.JOB.CANCEL, {
        resourceId: jobId,
      });

      expect(saga.next().value).toEqual(
        call(apiCallWithRetry, {
          path,
          opts,
        })
      );
      const response = { jobId, type: JOB_TYPES.BULK_RETRY };

      expect(saga.next(response).value).toEqual(
        put(actions.job.receivedFamily({ job: response }))
      );
      expect(saga.next().done).toEqual(true);
    });
    test('should succeed on successful api call (flow job)', () => {
      const jobId = 'fj1';
      const saga = cancelJob({ jobId });
      const { path, opts } = getRequestOptions(actionTypes.JOB.CANCEL, {
        resourceId: jobId,
      });

      expect(saga.next().value).toEqual(
        call(apiCallWithRetry, {
          path,
          opts,
        })
      );
      const response = { jobId, type: JOB_TYPES.FLOW };

      expect(saga.next(response).value).toEqual(
        put(actions.job.receivedFamily({ job: response }))
      );
      expect(saga.next().done).toEqual(true);
    });
    test('should succeed on successful api call (flow child job)', () => {
      const jobId = 'fj1i1';
      const saga = cancelJob({ jobId });
      const { path, opts } = getRequestOptions(actionTypes.JOB.CANCEL, {
        resourceId: jobId,
      });

      expect(saga.next().value).toEqual(
        call(apiCallWithRetry, {
          path,
          opts,
        })
      );
      const response = { jobId, type: JOB_TYPES.IMPORT, _flowJobId: 'fj1' };

      expect(saga.next(response).value).toEqual(
        call(getJobFamily, { jobId: 'fj1' })
      );
      expect(saga.next().done).toEqual(true);
    });
  });
});
