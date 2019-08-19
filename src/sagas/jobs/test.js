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
  resolveCommit,
  resolveAllCommit,
  resolveSelected,
  resolveAll,
  retryCommit,
  retrySelected,
  retryFlowJob,
  retryAllCommit,
  retryAll,
  requestRetryObjectCollection,
  requestJobErrorCollection,
  requestRetryObjectAndJobErrorCollection,
} from './';
import * as selectors from '../../reducers/index';
import { JOB_TYPES, JOB_STATUS } from '../../utils/constants';
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
    test('should handle api error properly', () => {
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
      expect(saga.throw(new Error()).value).toEqual(true);
      expect(saga.next().done).toEqual(true);
    });
  });

  describe('resolveCommit saga', () => {
    test('should succeed on successful api call', () => {
      const jobs = [
        { _id: 'fj1' },
        { _id: 'fj2i1', _flowJobId: 'fj2' },
        { _id: 'fj2i2', _flowJobId: 'fj2' },
      ];
      const saga = resolveCommit({ jobs });
      const { path, opts } = getRequestOptions(actionTypes.JOB.RESOLVE_COMMIT);

      opts.body = jobs.map(job => job._id);

      expect(saga.next().value).toEqual(
        call(apiCallWithRetry, {
          path,
          opts,
        })
      );
      expect(saga.next().value).toEqual(
        all(['fj1', 'fj2'].map(jobId => call(getJobFamily, { jobId })))
      );
      expect(saga.next().done).toEqual(true);
    });
    test('should handle api error properly', () => {
      const jobs = [
        { _id: 'fj1' },
        { _id: 'fj2i1', _flowJobId: 'fj2' },
        { _id: 'fj2i2', _flowJobId: 'fj2' },
      ];
      const saga = resolveCommit({ jobs });
      const { path, opts } = getRequestOptions(actionTypes.JOB.RESOLVE_COMMIT);

      opts.body = jobs.map(job => job._id);

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

  describe('resolveAllCommit saga', () => {
    test('should succeed on successful api call (integration level resolve)', () => {
      const dataIn = { integrationId: 'i1' };
      const saga = resolveAllCommit(dataIn);
      const { path, opts } = getRequestOptions(
        actionTypes.JOB.RESOLVE_ALL_IN_INTEGRATION_COMMIT,
        {
          resourceId: dataIn.integrationId,
        }
      );

      expect(saga.next().value).toEqual(
        call(apiCallWithRetry, {
          path,
          opts,
        })
      );
      expect(saga.next().done).toEqual(true);
    });
    test('should succeed on successful api call (flow level resolve)', () => {
      const dataIn = { flowId: 'f1' };
      const saga = resolveAllCommit(dataIn);
      const { path, opts } = getRequestOptions(
        actionTypes.JOB.RESOLVE_ALL_IN_FLOW_COMMIT,
        {
          resourceId: dataIn.flowId,
        }
      );

      expect(saga.next().value).toEqual(
        call(apiCallWithRetry, {
          path,
          opts,
        })
      );
      expect(saga.next().done).toEqual(true);
    });
    test('should handle api error properly', () => {
      const dataIn = { integrationId: 'i1' };
      const saga = resolveAllCommit(dataIn);
      const { path, opts } = getRequestOptions(
        actionTypes.JOB.RESOLVE_ALL_IN_INTEGRATION_COMMIT,
        {
          resourceId: dataIn.integrationId,
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

  describe('resolveSelected saga', () => {
    test('should resolve all pending and init resolve for passed in jobs, wait for resolve all pending and then commit resolve', () => {
      const jobs = [
        { _id: 'fj1' },
        { _id: 'fj2i1', _flowJobId: 'fj2' },
        { _id: 'fj2i2', _flowJobId: 'fj2' },
      ];
      const saga = resolveSelected({ jobs });

      expect(saga.next().value).toEqual(put(actions.job.resolveAllPending()));
      expect(saga.next().value).toEqual(
        all(
          jobs.map(job =>
            put(
              actions.job.resolveInit({
                parentJobId: job._flowJobId || job._id,
                childJobId: job._flowJobId ? job._id : null,
              })
            )
          )
        )
      );

      expect(saga.next().value).toEqual(
        take([
          actionTypes.JOB.RESOLVE_COMMIT,
          actionTypes.JOB.RESOLVE_UNDO,
          actionTypes.JOB.RESOLVE_ALL_PENDING,
        ])
      );
      expect(saga.next(actions.job.resolveAllPending()).value).toEqual(
        call(resolveCommit, { jobs })
      );
      expect(saga.next().done).toEqual(true);
    });

    test('should resolve all pending and init resolve for passed in jobs, wait for resolve commit and then commit resolve', () => {
      const jobs = [
        { _id: 'fj1' },
        { _id: 'fj2i1', _flowJobId: 'fj2' },
        { _id: 'fj2i2', _flowJobId: 'fj2' },
      ];
      const saga = resolveSelected({ jobs });

      expect(saga.next().value).toEqual(put(actions.job.resolveAllPending()));
      expect(saga.next().value).toEqual(
        all(
          jobs.map(job =>
            put(
              actions.job.resolveInit({
                parentJobId: job._flowJobId || job._id,
                childJobId: job._flowJobId ? job._id : null,
              })
            )
          )
        )
      );

      expect(saga.next().value).toEqual(
        take([
          actionTypes.JOB.RESOLVE_COMMIT,
          actionTypes.JOB.RESOLVE_UNDO,
          actionTypes.JOB.RESOLVE_ALL_PENDING,
        ])
      );
      expect(saga.next(actions.job.resolveCommit({ jobs })).value).toEqual(
        call(resolveCommit, { jobs })
      );
      expect(saga.next().done).toEqual(true);
    });

    test('should resolve all pending and init resolve for passed in jobs, wait for resolve undo and then return', () => {
      const jobs = [
        { _id: 'fj1' },
        { _id: 'fj2i1', _flowJobId: 'fj2' },
        { _id: 'fj2i2', _flowJobId: 'fj2' },
      ];
      const saga = resolveSelected({ jobs });

      expect(saga.next().value).toEqual(put(actions.job.resolveAllPending()));
      expect(saga.next().value).toEqual(
        all(
          jobs.map(job =>
            put(
              actions.job.resolveInit({
                parentJobId: job._flowJobId || job._id,
                childJobId: job._flowJobId ? job._id : null,
              })
            )
          )
        )
      );

      expect(saga.next().value).toEqual(
        take([
          actionTypes.JOB.RESOLVE_COMMIT,
          actionTypes.JOB.RESOLVE_UNDO,
          actionTypes.JOB.RESOLVE_ALL_PENDING,
        ])
      );
      expect(
        saga.next(actions.job.resolveUndo({ parentJobId: 'something' })).done
      ).toEqual(true);
    });
  });

  describe('resolveAll saga', () => {
    const integrationId = 'i1';

    describe('integration level resolve all', () => {
      test('should resolve all pending and init resolve all, wait for resolve all pending and then commit resolve all', () => {
        const saga = resolveAll({ integrationId });

        expect(saga.next().value).toEqual(put(actions.job.resolveAllPending()));
        expect(saga.next().value).toEqual(put(actions.job.resolveAllInit()));

        expect(saga.next().value).toEqual(
          take([
            actionTypes.JOB.RESOLVE_ALL_COMMIT,
            actionTypes.JOB.RESOLVE_ALL_UNDO,
            actionTypes.JOB.RESOLVE_ALL_PENDING,
          ])
        );
        expect(saga.next(actions.job.resolveAllPending()).value).toEqual(
          call(resolveAllCommit, { integrationId })
        );
        expect(saga.next().done).toEqual(true);
      });

      test('should resolve all pending and init resolve all, wait for resolve all commit and then commit resolve all', () => {
        const saga = resolveAll({ integrationId });

        expect(saga.next().value).toEqual(put(actions.job.resolveAllPending()));
        expect(saga.next().value).toEqual(put(actions.job.resolveAllInit()));

        expect(saga.next().value).toEqual(
          take([
            actionTypes.JOB.RESOLVE_ALL_COMMIT,
            actionTypes.JOB.RESOLVE_ALL_UNDO,
            actionTypes.JOB.RESOLVE_ALL_PENDING,
          ])
        );
        expect(saga.next(actions.job.resolveAllCommit()).value).toEqual(
          call(resolveAllCommit, { integrationId })
        );
        expect(saga.next().done).toEqual(true);
      });

      test('should resolve all pending and init resolve all, wait for resolve all undo and then return', () => {
        const saga = resolveAll({ integrationId });

        expect(saga.next().value).toEqual(put(actions.job.resolveAllPending()));
        expect(saga.next().value).toEqual(put(actions.job.resolveAllInit()));

        expect(saga.next().value).toEqual(
          take([
            actionTypes.JOB.RESOLVE_ALL_COMMIT,
            actionTypes.JOB.RESOLVE_ALL_UNDO,
            actionTypes.JOB.RESOLVE_ALL_PENDING,
          ])
        );
        expect(saga.next(actions.job.resolveAllUndo()).done).toEqual(true);
      });
    });

    describe('flow level resolve all', () => {
      const flowId = 'flow1';

      test('should resolve all pending and init resolve all, wait for resolve all pending and then commit resolve all', () => {
        const saga = resolveAll({ flowId, integrationId });

        expect(saga.next().value).toEqual(put(actions.job.resolveAllPending()));
        expect(saga.next().value).toEqual(put(actions.job.resolveAllInit()));

        expect(saga.next().value).toEqual(
          take([
            actionTypes.JOB.RESOLVE_ALL_COMMIT,
            actionTypes.JOB.RESOLVE_ALL_UNDO,
            actionTypes.JOB.RESOLVE_ALL_PENDING,
          ])
        );
        expect(saga.next(actions.job.resolveAllPending()).value).toEqual(
          call(resolveAllCommit, { flowId, integrationId })
        );
        expect(saga.next().done).toEqual(true);
      });

      test('should resolve all pending and init resolve all, wait for resolve all commit and then commit resolve all', () => {
        const saga = resolveAll({ flowId, integrationId });

        expect(saga.next().value).toEqual(put(actions.job.resolveAllPending()));
        expect(saga.next().value).toEqual(put(actions.job.resolveAllInit()));

        expect(saga.next().value).toEqual(
          take([
            actionTypes.JOB.RESOLVE_ALL_COMMIT,
            actionTypes.JOB.RESOLVE_ALL_UNDO,
            actionTypes.JOB.RESOLVE_ALL_PENDING,
          ])
        );
        expect(saga.next(actions.job.resolveAllCommit()).value).toEqual(
          call(resolveAllCommit, { flowId, integrationId })
        );
        expect(saga.next().done).toEqual(true);
      });

      test('should resolve all pending and init resolve all, wait for resolve all undo and then return', () => {
        const saga = resolveAll({ integrationId });

        expect(saga.next().value).toEqual(put(actions.job.resolveAllPending()));
        expect(saga.next().value).toEqual(put(actions.job.resolveAllInit()));

        expect(saga.next().value).toEqual(
          take([
            actionTypes.JOB.RESOLVE_ALL_COMMIT,
            actionTypes.JOB.RESOLVE_ALL_UNDO,
            actionTypes.JOB.RESOLVE_ALL_PENDING,
          ])
        );
        expect(saga.next(actions.job.resolveAllUndo()).done).toEqual(true);
      });
    });
  });

  describe('retryCommit saga', () => {
    test('should succeed on successful api call', () => {
      const jobs = [
        { _id: 'fj1' },
        { _id: 'fj2i1', _flowJobId: 'fj2' },
        { _id: 'fj2i2', _flowJobId: 'fj2' },
      ];
      const saga = retryCommit({ jobs });
      const { path, opts } = getRequestOptions(actionTypes.JOB.RETRY_COMMIT);

      opts.body = jobs.map(job => job._id);

      expect(saga.next().value).toEqual(
        call(apiCallWithRetry, {
          path,
          opts,
        })
      );
      expect(saga.next().value).toEqual(
        all(['fj1', 'fj2'].map(jobId => call(getJobFamily, { jobId })))
      );
      expect(saga.next().value).toEqual(
        put(actions.job.getInProgressJobStatus())
      );
      expect(saga.next().done).toEqual(true);
    });
    test('should handle api error properly', () => {
      const jobs = [
        { _id: 'fj1' },
        { _id: 'fj2i1', _flowJobId: 'fj2' },
        { _id: 'fj2i2', _flowJobId: 'fj2' },
      ];
      const saga = retryCommit({ jobs });
      const { path, opts } = getRequestOptions(actionTypes.JOB.RETRY_COMMIT);

      opts.body = jobs.map(job => job._id);

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

  describe('retrySelected saga', () => {
    test('should retry all pending and init retry for passed in jobs, wait for retry all pending and then commit retry', () => {
      const jobs = [
        { _id: 'fj1' },
        { _id: 'fj2i1', _flowJobId: 'fj2' },
        { _id: 'fj2i2', _flowJobId: 'fj2' },
      ];
      const saga = retrySelected({ jobs });

      expect(saga.next().value).toEqual(put(actions.job.retryAllPending()));
      expect(saga.next().value).toEqual(
        all(
          jobs.map(job =>
            put(
              actions.job.retryInit({
                parentJobId: job._flowJobId || job._id,
                childJobId: job._flowJobId ? job._id : null,
              })
            )
          )
        )
      );

      expect(saga.next().value).toEqual(
        take([
          actionTypes.JOB.RETRY_COMMIT,
          actionTypes.JOB.RETRY_UNDO,
          actionTypes.JOB.RETRY_ALL_PENDING,
          actionTypes.JOB.RETRY_FLOW_JOB_COMMIT,
        ])
      );
      expect(saga.next(actions.job.retryAllPending()).value).toEqual(
        call(retryCommit, { jobs })
      );
      expect(saga.next().done).toEqual(true);
    });

    test('should retry all pending and init retry for passed in jobs, wait for retry commit and then commit retry', () => {
      const jobs = [
        { _id: 'fj1' },
        { _id: 'fj2i1', _flowJobId: 'fj2' },
        { _id: 'fj2i2', _flowJobId: 'fj2' },
      ];
      const saga = retrySelected({ jobs });

      expect(saga.next().value).toEqual(put(actions.job.retryAllPending()));
      expect(saga.next().value).toEqual(
        all(
          jobs.map(job =>
            put(
              actions.job.retryInit({
                parentJobId: job._flowJobId || job._id,
                childJobId: job._flowJobId ? job._id : null,
              })
            )
          )
        )
      );

      expect(saga.next().value).toEqual(
        take([
          actionTypes.JOB.RETRY_COMMIT,
          actionTypes.JOB.RETRY_UNDO,
          actionTypes.JOB.RETRY_ALL_PENDING,
          actionTypes.JOB.RETRY_FLOW_JOB_COMMIT,
        ])
      );
      expect(saga.next(actions.job.retryCommit()).value).toEqual(
        call(retryCommit, { jobs })
      );
      expect(saga.next().done).toEqual(true);
    });

    test('should retry all pending and init retry for passed in jobs, wait for retry flow job commit and then commit retry', () => {
      const jobs = [
        { _id: 'fj1' },
        { _id: 'fj2i1', _flowJobId: 'fj2' },
        { _id: 'fj2i2', _flowJobId: 'fj2' },
      ];
      const saga = retrySelected({ jobs });

      expect(saga.next().value).toEqual(put(actions.job.retryAllPending()));
      expect(saga.next().value).toEqual(
        all(
          jobs.map(job =>
            put(
              actions.job.retryInit({
                parentJobId: job._flowJobId || job._id,
                childJobId: job._flowJobId ? job._id : null,
              })
            )
          )
        )
      );

      expect(saga.next().value).toEqual(
        take([
          actionTypes.JOB.RETRY_COMMIT,
          actionTypes.JOB.RETRY_UNDO,
          actionTypes.JOB.RETRY_ALL_PENDING,
          actionTypes.JOB.RETRY_FLOW_JOB_COMMIT,
        ])
      );
      expect(
        saga.next(actions.job.retryFlowJobCommit({ jobId: 'something' })).value
      ).toEqual(call(retryCommit, { jobs }));
      expect(saga.next().done).toEqual(true);
    });

    test('should retry all pending and init retry for passed in jobs, wait for retry undo and then return', () => {
      const jobs = [
        { _id: 'fj1' },
        { _id: 'fj2i1', _flowJobId: 'fj2' },
        { _id: 'fj2i2', _flowJobId: 'fj2' },
      ];
      const saga = retrySelected({ jobs });

      expect(saga.next().value).toEqual(put(actions.job.retryAllPending()));
      expect(saga.next().value).toEqual(
        all(
          jobs.map(job =>
            put(
              actions.job.retryInit({
                parentJobId: job._flowJobId || job._id,
                childJobId: job._flowJobId ? job._id : null,
              })
            )
          )
        )
      );

      expect(saga.next().value).toEqual(
        take([
          actionTypes.JOB.RETRY_COMMIT,
          actionTypes.JOB.RETRY_UNDO,
          actionTypes.JOB.RETRY_ALL_PENDING,
          actionTypes.JOB.RETRY_FLOW_JOB_COMMIT,
        ])
      );
      expect(saga.next(actions.job.retryUndo({})).done).toEqual(true);
    });
  });

  describe('retryFlowJob saga', () => {
    const jobId = 'fj1';

    test('should return true if job not exist', () => {
      const saga = retryFlowJob({ jobId });

      expect(saga.next().value).toEqual(
        select(selectors.job, { type: JOB_TYPES.FLOW, jobId })
      );
      expect(saga.next().value).toEqual(true);
      expect(saga.next().done).toEqual(true);
    });

    test('should call getJobFamily and re-select job if children not loaded', () => {
      const saga = retryFlowJob({ jobId });

      expect(saga.next().value).toEqual(
        select(selectors.job, { type: JOB_TYPES.FLOW, jobId })
      );
      expect(saga.next({ _id: jobId }).value).toEqual(
        call(getJobFamily, { jobId })
      );
      expect(saga.next().value).toEqual(
        select(selectors.job, { type: JOB_TYPES.FLOW, jobId })
      );
    });

    test('should return true if children not exist', () => {
      const saga = retryFlowJob({ jobId });

      expect(saga.next().value).toEqual(
        select(selectors.job, { type: JOB_TYPES.FLOW, jobId })
      );
      expect(saga.next({ _id: jobId, children: [] }).value).toEqual(
        call(getJobFamily, { jobId })
      );
      expect(saga.next().value).toEqual(
        select(selectors.job, { type: JOB_TYPES.FLOW, jobId })
      );
      expect(saga.next({ children: [] }).value).toEqual(true);
      expect(saga.next().done).toEqual(true);
    });

    test('should return true if retriable children not exist', () => {
      const saga = retryFlowJob({ jobId });

      expect(saga.next().value).toEqual(
        select(selectors.job, { type: JOB_TYPES.FLOW, jobId })
      );
      expect(saga.next({ _id: jobId, children: [] }).value).toEqual(
        call(getJobFamily, { jobId })
      );
      expect(saga.next().value).toEqual(
        select(selectors.job, { type: JOB_TYPES.FLOW, jobId })
      );
      expect(
        saga.next({ children: [{ _id: 'c1' }, { _id: 'c2' }] }).value
      ).toEqual(true);
      expect(saga.next().done).toEqual(true);
    });

    test('should call retrySelected if retriable children exists', () => {
      const saga = retryFlowJob({ jobId });

      expect(saga.next().value).toEqual(
        select(selectors.job, { type: JOB_TYPES.FLOW, jobId })
      );
      expect(
        saga.next({
          children: [
            { _id: 'c1', retriable: true },
            { _id: 'c2' },
            { _id: 'c3', retriable: true },
          ],
        }).value
      ).toEqual(
        call(retrySelected, {
          jobs: [
            {
              _id: 'c1',
              _flowJobId: jobId,
            },
            {
              _id: 'c3',
              _flowJobId: jobId,
            },
          ],
        })
      );
      expect(saga.next().done).toEqual(true);
    });
  });

  describe('retryAllCommit saga', () => {
    test('should succeed on successful api call (integration level retry)', () => {
      const dataIn = { integrationId: 'i1' };
      const saga = retryAllCommit(dataIn);
      const { path, opts } = getRequestOptions(
        actionTypes.JOB.RETRY_ALL_IN_INTEGRATION_COMMIT,
        {
          resourceId: dataIn.integrationId,
        }
      );

      expect(saga.next().value).toEqual(
        call(apiCallWithRetry, {
          path,
          opts,
        })
      );
      const bulkRetryJob = {
        _id: 'brj1',
        type: JOB_TYPES.BULK_RETRY,
        status: JOB_STATUS.QUEUED,
      };

      expect(saga.next(bulkRetryJob).value).toEqual(
        put(actions.job.receivedFamily({ job: bulkRetryJob }))
      );
      expect(saga.next().value).toEqual(
        put(actions.job.getInProgressJobStatus())
      );
      expect(saga.next().done).toEqual(true);
    });
    test('should succeed on successful api call (flow level retry)', () => {
      const dataIn = { integrationId: 'i1', flowId: 'f1' };
      const saga = retryAllCommit(dataIn);
      const { path, opts } = getRequestOptions(
        actionTypes.JOB.RETRY_ALL_IN_FLOW_COMMIT,
        {
          resourceId: dataIn.flowId,
        }
      );

      expect(saga.next().value).toEqual(
        call(apiCallWithRetry, {
          path,
          opts,
        })
      );
      const bulkRetryJob = {
        _id: 'brj1',
        type: JOB_TYPES.BULK_RETRY,
        status: JOB_STATUS.QUEUED,
      };

      expect(saga.next(bulkRetryJob).value).toEqual(
        put(actions.job.receivedFamily({ job: bulkRetryJob }))
      );
      expect(saga.next().value).toEqual(
        put(actions.job.getInProgressJobStatus())
      );
      expect(saga.next().done).toEqual(true);
    });
    test('should handle api error properly', () => {
      const dataIn = { integrationId: 'i1', flowId: 'f1' };
      const saga = retryAllCommit(dataIn);
      const { path, opts } = getRequestOptions(
        actionTypes.JOB.RETRY_ALL_IN_FLOW_COMMIT,
        {
          resourceId: dataIn.flowId,
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

  describe('retryAll saga', () => {
    const integrationId = 'i1';

    describe('integration level retry all', () => {
      test('should retry all pending and init retry all, wait for retry all pending and then commit retry all', () => {
        const saga = retryAll({ integrationId });

        expect(saga.next().value).toEqual(put(actions.job.retryAllPending()));
        expect(saga.next().value).toEqual(put(actions.job.retryAllInit()));

        expect(saga.next().value).toEqual(
          take([
            actionTypes.JOB.RETRY_ALL_COMMIT,
            actionTypes.JOB.RETRY_ALL_UNDO,
            actionTypes.JOB.RETRY_ALL_PENDING,
            actionTypes.JOB.RETRY_FLOW_JOB_COMMIT,
          ])
        );
        expect(saga.next(actions.job.retryAllPending()).value).toEqual(
          call(retryAllCommit, { integrationId })
        );
        expect(saga.next().done).toEqual(true);
      });

      test('should retry all pending and init retry all, wait for retry all commit and then commit retry all', () => {
        const saga = retryAll({ integrationId });

        expect(saga.next().value).toEqual(put(actions.job.retryAllPending()));
        expect(saga.next().value).toEqual(put(actions.job.retryAllInit()));

        expect(saga.next().value).toEqual(
          take([
            actionTypes.JOB.RETRY_ALL_COMMIT,
            actionTypes.JOB.RETRY_ALL_UNDO,
            actionTypes.JOB.RETRY_ALL_PENDING,
            actionTypes.JOB.RETRY_FLOW_JOB_COMMIT,
          ])
        );
        expect(saga.next(actions.job.retryAllCommit()).value).toEqual(
          call(retryAllCommit, { integrationId })
        );
        expect(saga.next().done).toEqual(true);
      });

      test('should retry all pending and init retry all, wait for retry flow job commit and then commit retry all', () => {
        const saga = retryAll({ integrationId });

        expect(saga.next().value).toEqual(put(actions.job.retryAllPending()));
        expect(saga.next().value).toEqual(put(actions.job.retryAllInit()));

        expect(saga.next().value).toEqual(
          take([
            actionTypes.JOB.RETRY_ALL_COMMIT,
            actionTypes.JOB.RETRY_ALL_UNDO,
            actionTypes.JOB.RETRY_ALL_PENDING,
            actionTypes.JOB.RETRY_FLOW_JOB_COMMIT,
          ])
        );
        expect(saga.next(actions.job.retryFlowJobCommit()).value).toEqual(
          call(retryAllCommit, { integrationId })
        );
        expect(saga.next().done).toEqual(true);
      });

      test('should retry all pending and init retry all, wait for retry all undo and then return', () => {
        const saga = retryAll({ integrationId });

        expect(saga.next().value).toEqual(put(actions.job.retryAllPending()));
        expect(saga.next().value).toEqual(put(actions.job.retryAllInit()));

        expect(saga.next().value).toEqual(
          take([
            actionTypes.JOB.RETRY_ALL_COMMIT,
            actionTypes.JOB.RETRY_ALL_UNDO,
            actionTypes.JOB.RETRY_ALL_PENDING,
            actionTypes.JOB.RETRY_FLOW_JOB_COMMIT,
          ])
        );
        expect(saga.next(actions.job.retryAllUndo()).done).toEqual(true);
      });
    });

    describe('flow level retry all', () => {
      const flowId = 'flow1';

      test('should retry all pending and init retry all, wait for retry all pending and then commit retry all', () => {
        const saga = retryAll({ integrationId, flowId });

        expect(saga.next().value).toEqual(put(actions.job.retryAllPending()));
        expect(saga.next().value).toEqual(put(actions.job.retryAllInit()));

        expect(saga.next().value).toEqual(
          take([
            actionTypes.JOB.RETRY_ALL_COMMIT,
            actionTypes.JOB.RETRY_ALL_UNDO,
            actionTypes.JOB.RETRY_ALL_PENDING,
            actionTypes.JOB.RETRY_FLOW_JOB_COMMIT,
          ])
        );
        expect(saga.next(actions.job.retryAllPending()).value).toEqual(
          call(retryAllCommit, { integrationId, flowId })
        );
        expect(saga.next().done).toEqual(true);
      });

      test('should retry all pending and init retry all, wait for retry all commit and then commit retry all', () => {
        const saga = retryAll({ integrationId, flowId });

        expect(saga.next().value).toEqual(put(actions.job.retryAllPending()));
        expect(saga.next().value).toEqual(put(actions.job.retryAllInit()));

        expect(saga.next().value).toEqual(
          take([
            actionTypes.JOB.RETRY_ALL_COMMIT,
            actionTypes.JOB.RETRY_ALL_UNDO,
            actionTypes.JOB.RETRY_ALL_PENDING,
            actionTypes.JOB.RETRY_FLOW_JOB_COMMIT,
          ])
        );
        expect(saga.next(actions.job.retryAllCommit()).value).toEqual(
          call(retryAllCommit, { integrationId, flowId })
        );
        expect(saga.next().done).toEqual(true);
      });

      test('should retry all pending and init retry all, wait for retry flow job commit and then commit retry all', () => {
        const saga = retryAll({ integrationId, flowId });

        expect(saga.next().value).toEqual(put(actions.job.retryAllPending()));
        expect(saga.next().value).toEqual(put(actions.job.retryAllInit()));

        expect(saga.next().value).toEqual(
          take([
            actionTypes.JOB.RETRY_ALL_COMMIT,
            actionTypes.JOB.RETRY_ALL_UNDO,
            actionTypes.JOB.RETRY_ALL_PENDING,
            actionTypes.JOB.RETRY_FLOW_JOB_COMMIT,
          ])
        );
        expect(saga.next(actions.job.retryFlowJobCommit()).value).toEqual(
          call(retryAllCommit, { integrationId, flowId })
        );
        expect(saga.next().done).toEqual(true);
      });

      test('should retry all pending and init retry all, wait for retry all undo and then return', () => {
        const saga = retryAll({ integrationId, flowId });

        expect(saga.next().value).toEqual(put(actions.job.retryAllPending()));
        expect(saga.next().value).toEqual(put(actions.job.retryAllInit()));

        expect(saga.next().value).toEqual(
          take([
            actionTypes.JOB.RETRY_ALL_COMMIT,
            actionTypes.JOB.RETRY_ALL_UNDO,
            actionTypes.JOB.RETRY_ALL_PENDING,
            actionTypes.JOB.RETRY_FLOW_JOB_COMMIT,
          ])
        );
        expect(saga.next(actions.job.retryAllUndo()).done).toEqual(true);
      });
    });
  });

  describe('requestRetryObjectCollection saga', () => {
    const jobId = 'something';

    test('should succeed on successful api call', () => {
      const saga = requestRetryObjectCollection({ jobId });
      const { path, opts } = getRequestOptions(
        actionTypes.JOB.REQUEST_RETRY_OBJECT_COLLECTION,
        { resourceId: jobId }
      );

      expect(saga.next().value).toEqual(call(apiCallWithRetry, { path, opts }));

      const collection = [{ _id: 'r1' }, { _id: 'r2' }];

      expect(saga.next(collection).value).toEqual(
        put(actions.job.receivedRetryObjects({ collection, jobId }))
      );
      expect(saga.next().done).toEqual(true);
    });

    test('should handle api error propely', () => {
      const saga = requestRetryObjectCollection({ jobId });
      const { path, opts } = getRequestOptions(
        actionTypes.JOB.REQUEST_RETRY_OBJECT_COLLECTION,
        { resourceId: jobId }
      );

      expect(saga.next().value).toEqual(call(apiCallWithRetry, { path, opts }));

      expect(saga.throw(new Error()).value).toEqual(true);
      expect(saga.next().done).toEqual(true);
    });
  });

  describe('requestJobErrorCollection saga', () => {
    const jobId = 'something';

    test('should succeed on successful api call', () => {
      const saga = requestJobErrorCollection({ jobId });
      const { path, opts } = getRequestOptions(
        actionTypes.JOB.ERROR.REQUEST_COLLECTION,
        { resourceId: jobId }
      );

      expect(saga.next().value).toEqual(call(apiCallWithRetry, { path, opts }));

      const collection = [
        { source: 's1', code: 'c1' },
        { source: 's2', code: 'c2' },
      ];

      expect(saga.next(collection).value).toEqual(
        put(actions.job.receivedErrors({ collection, jobId }))
      );
      expect(saga.next().done).toEqual(true);
    });

    test('should handle api error propely', () => {
      const saga = requestJobErrorCollection({ jobId });
      const { path, opts } = getRequestOptions(
        actionTypes.JOB.ERROR.REQUEST_COLLECTION,
        { resourceId: jobId }
      );

      expect(saga.next().value).toEqual(call(apiCallWithRetry, { path, opts }));

      expect(saga.throw(new Error()).value).toEqual(true);
      expect(saga.next().done).toEqual(true);
    });
  });

  describe('requestRetryObjectAndJobErrorCollection', () => {
    const jobId = 'something';

    test('should call requestRetryObjectCollection and requestJobErrorCollection', () => {
      const saga = requestRetryObjectAndJobErrorCollection({ jobId });

      expect(saga.next().value).toEqual(
        call(requestRetryObjectCollection, { jobId })
      );
      expect(saga.next().value).toEqual(
        call(requestJobErrorCollection, { jobId })
      );
      expect(saga.next().done).toEqual(true);
    });
  });
});
