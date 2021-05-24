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
import { expectSaga } from 'redux-saga-test-plan';
import { throwError } from 'redux-saga-test-plan/providers';
import { createMockTask } from '@redux-saga/testing-utils';
import actions from '../../actions';
import actionTypes from '../../actions/types';
import { apiCallWithRetry } from '../index';
import getRequestOptions from '../../utils/requestOptions';
import {
  getJobFamily,
  getInProgressJobsStatus,
  pollForInProgressJobs,
  getJobDetails,
  startPollingForInProgressJobs,
  requestJobCollection,
  getJobCollection,
  downloadFiles,
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
  getJobErrors,
  resolveSelectedErrors,
  retrySelectedRetries,
  requestRetryData,
  updateRetryData,
  retryProcessedErrors,
} from '.';
import { selectors } from '../../reducers';
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

  describe('getJobDetails saga', () => {
    const jobId = '123';
    const path = `/jobs/${jobId}/family`;
    const opts = {
      method: 'GET',
    };

    test('should call jobs api and return result on successful api call', () => {
      const jobResponse = {
        _id: '1',
        numSuccess: 1,
      };

      return expectSaga(getJobDetails, { jobId })
        .provide([
          [call(apiCallWithRetry, { path, opts }), jobResponse],
        ])
        .call(apiCallWithRetry, {
          path,
          opts,
        })
        .returns(jobResponse)
        .run();
    });

    test('should return undefined if api call throws error', () => expectSaga(getJobDetails, { jobId })
      .provide([
        [call(apiCallWithRetry,
          { path, opts }),
        throwError({
          status: 401,
          message: '{"code":"error code"}',
        })],
      ])
      .call(apiCallWithRetry, {
        path,
        opts,
      })
      .returns(undefined)
      .run());
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
        put(actions.job.requestInProgressJobStatus())
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
        put(actions.job.requestInProgressJobStatus())
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
        put(actions.job.requestInProgressJobStatus())
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
        options: {},
      };
      const saga = getJobCollection(dataIn);

      expect(saga.next().value).toEqual(fork(requestJobCollection, dataIn));

      const watcherTask = createMockTask();

      expect(saga.next(watcherTask).value).toEqual(take(actionTypes.JOB.CLEAR));
      expect(saga.next().value).toEqual(cancel(watcherTask));
      expect(saga.next().done).toEqual(true);
    });
  });

  describe('downloadFiles saga', () => {
    test('download diagnostics file - should succeed on successful api call', () => {
      const jobId = 'something';
      const saga = downloadFiles({ jobId, fileType: 'diagnostics' });
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
        all(
          [response.signedURL].map((url, index) =>
            call(openExternalUrl, { url, index })
          )
        )
      );
      expect(saga.next().done).toEqual(true);
    });

    test('download errors file - should succeed on successful api call', () => {
      const jobId = 'something';
      const saga = downloadFiles({ jobId, fileType: 'errors' });
      const { path, opts } = getRequestOptions(
        actionTypes.JOB.REQUEST_ERROR_FILE_URL,
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
        all(
          [response.signedURL].map((url, index) =>
            call(openExternalUrl, { url, index })
          )
        )
      );
      expect(saga.next().done).toEqual(true);
    });

    test('download all files of a job - should succeed on successful api call', () => {
      const jobId = 'something';
      const saga = downloadFiles({ jobId });
      const { path, opts } = getRequestOptions(
        actionTypes.JOB.REQUEST_DOWNLOAD_FILES_URL,
        { resourceId: jobId }
      );

      expect(saga.next().value).toEqual(
        call(apiCallWithRetry, {
          path,
          opts,
        })
      );
      const response = {
        signedURLs: ['some url', 'some other url', 'something else'],
      };

      expect(saga.next(response).value).toEqual(
        all(
          response.signedURLs.map((url, index) =>
            call(openExternalUrl, { url, index })
          )
        )
      );
      expect(saga.next().done).toEqual(true);
    });

    test('download selected files of a job - should succeed on successful api call', () => {
      const jobId = 'something';
      const saga = downloadFiles({ jobId, fileIds: ['f1', 'f2'] });
      const { path, opts } = getRequestOptions(
        actionTypes.JOB.REQUEST_DOWNLOAD_FILES_URL,
        { resourceId: jobId }
      );

      expect(saga.next().value).toEqual(
        call(apiCallWithRetry, {
          path: `${path}?fileId=f1&fileId=f2`,
          opts,
        })
      );
      const response = { signedURLs: ['some url', 'some other url'] };

      expect(saga.next(response).value).toEqual(
        all(
          response.signedURLs.map((url, index) =>
            call(openExternalUrl, { url, index })
          )
        )
      );
      expect(saga.next().done).toEqual(true);
    });

    test('should handle api error properly', () => {
      const jobId = 'something';
      const saga = downloadFiles({ jobId, fileType: 'diagnostics' });
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
          resourceId: [dataIn.flowId],
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

    test('should call resolveCommit for filteredJobs if filtersJobsOnly is true', () => {
      const opts = {
        method: 'PUT',
      };
      const path = '/jobs/resolve';

      return expectSaga(resolveAllCommit, { filteredJobsOnly: true })
        .provide([
          [select(selectors.allJobs, { type: 'flowJobs' }),
            [{
              _id: 1,
              __original: {
                numError: 5,
              },
            },
            {
              _id: 2,
              __original: {
                numError: 3,
              },
            }],
          ],
        ])
        .call(apiCallWithRetry, {
          path,
          opts: {
            ...opts,
            body: [1, 2],
          },
        })
        .run();
    });
    test('should call resolveCommit for flows in the store', () => {
      const opts = {
        method: 'PUT',
      };
      const path = '/flows/jobs/resolve';

      return expectSaga(resolveAllCommit, { childId: '123' })
        .provide([
          [select(
            selectors.integrationAppFlowIds,
            undefined,
            '123'
          ),
          ['1', '2', '3'],
          ],
        ])
        .call(apiCallWithRetry, {
          path,
          opts: {
            ...opts,
            body: ['1', '2', '3'],
          },
        })
        .run();
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
    const childId = 's1';

    describe('integration level resolve all', () => {
      test('should resolve all pending and init resolve all, wait for resolve all pending and then commit resolve all', () => {
        const saga = resolveAll({ integrationId, childId });

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
          call(resolveAllCommit, { integrationId, childId })
        );
        expect(saga.next().done).toEqual(true);
      });

      test('should resolve all pending and init resolve all, wait for resolve all commit and then commit resolve all', () => {
        const saga = resolveAll({ integrationId, childId });

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
          call(resolveAllCommit, { integrationId, childId })
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
        put(actions.job.requestInProgressJobStatus())
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
      const dataIn = { flowIds: ['f1', 'f2'] };
      const saga = retryAllCommit(dataIn);
      const { path, opts } = getRequestOptions(
        actionTypes.JOB.RETRY_ALL_IN_FLOW_COMMIT,
        {
          resourceId: dataIn.flowIds,
        }
      );

      expect(saga.next().value).toEqual(
        call(apiCallWithRetry, {
          path,
          opts,
        })
      );
      const response = [{
        statusCode: 202,
        job: {
          _id: 'brj1',
          type: JOB_TYPES.BULK_RETRY,
          status: JOB_STATUS.QUEUED,
        },
      }];

      expect(saga.next(response).value).toEqual(
        put(actions.patchFilter('jobs', {refreshAt: response[0].job._id}))
      );
      expect(saga.next().done).toEqual(true);
    });
    test('should succeed on successful api call (flow level retry)', () => {
      const dataIn = { flowIds: ['f1'] };
      const saga = retryAllCommit(dataIn);
      const { path, opts } = getRequestOptions(
        actionTypes.JOB.RETRY_ALL_IN_FLOW_COMMIT,
        {
          resourceId: dataIn.flowIds,
        }
      );

      expect(saga.next().value).toEqual(
        call(apiCallWithRetry, {
          path,
          opts,
        })
      );
      const bulkRetryJob = [
        {
          statusCode: 202,
          job: {
            _id: 'brj1',
            type: JOB_TYPES.BULK_RETRY,
            status: JOB_STATUS.QUEUED,
          },
        },
      ];

      expect(saga.next(bulkRetryJob).value).toEqual(
        put(actions.patchFilter('jobs', {refreshAt: bulkRetryJob[0].job._id}))
      );
      expect(saga.next().done).toEqual(true);
    });
    test('should handle api error properly', () => {
      const dataIn = { flowIds: 'f1' };
      const saga = retryAllCommit(dataIn);
      const { path, opts } = getRequestOptions(
        actionTypes.JOB.RETRY_ALL_IN_FLOW_COMMIT,
        {
          resourceId: dataIn.flowIds,
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
    const allFlows = {
      resources: [
        {_id: 'f1', _integrationId: integrationId},
        {_id: 'f2', _integrationId: integrationId, disabled: true},
        {_id: 'f3', _integrationId: integrationId},
        {_id: 'f4', _integrationId: 'something'},
        {_id: 'f5', _integrationId: 'somethingElse'},
      ],
    };
    const enabledIntegrationFlowIds = ['f1', 'f3'];

    describe('integration level retry all', () => {
      test('should retry all pending and init retry all, wait for retry all pending and then commit retry all', () => {
        const saga = retryAll({ integrationId });

        expect(saga.next().value).toEqual(put(actions.job.retryAllPending()));
        expect(saga.next().value).toEqual(select(selectors.resourceList, { type: 'flows' }));
        expect(saga.next(allFlows).value).toEqual(put(actions.job.retryAllInit({ flowIds: enabledIntegrationFlowIds })));

        expect(saga.next().value).toEqual(
          take([
            actionTypes.JOB.RETRY_ALL_COMMIT,
            actionTypes.JOB.RETRY_ALL_UNDO,
            actionTypes.JOB.RETRY_ALL_PENDING,
            actionTypes.JOB.RETRY_FLOW_JOB_COMMIT,
          ])
        );
        expect(saga.next(actions.job.retryAllPending()).value).toEqual(
          call(retryAllCommit, { flowIds: enabledIntegrationFlowIds })
        );
        expect(saga.next().done).toEqual(true);
      });

      test('should retry all pending and init retry all, wait for retry all commit and then commit retry all', () => {
        const saga = retryAll({ integrationId });

        expect(saga.next().value).toEqual(put(actions.job.retryAllPending()));
        expect(saga.next().value).toEqual(select(selectors.resourceList, { type: 'flows' }));
        expect(saga.next(allFlows).value).toEqual(put(actions.job.retryAllInit({ flowIds: enabledIntegrationFlowIds})));

        expect(saga.next().value).toEqual(
          take([
            actionTypes.JOB.RETRY_ALL_COMMIT,
            actionTypes.JOB.RETRY_ALL_UNDO,
            actionTypes.JOB.RETRY_ALL_PENDING,
            actionTypes.JOB.RETRY_FLOW_JOB_COMMIT,
          ])
        );
        expect(saga.next(actions.job.retryAllCommit()).value).toEqual(
          call(retryAllCommit, { flowIds: enabledIntegrationFlowIds })
        );
        expect(saga.next().done).toEqual(true);
      });

      test('should retry all pending and init retry all, wait for retry flow job commit and then commit retry all', () => {
        const saga = retryAll({ integrationId });

        expect(saga.next().value).toEqual(put(actions.job.retryAllPending()));
        expect(saga.next().value).toEqual(select(selectors.resourceList, { type: 'flows' }));
        expect(saga.next(allFlows).value).toEqual(put(actions.job.retryAllInit({ flowIds: enabledIntegrationFlowIds})));

        expect(saga.next().value).toEqual(
          take([
            actionTypes.JOB.RETRY_ALL_COMMIT,
            actionTypes.JOB.RETRY_ALL_UNDO,
            actionTypes.JOB.RETRY_ALL_PENDING,
            actionTypes.JOB.RETRY_FLOW_JOB_COMMIT,
          ])
        );
        expect(saga.next(actions.job.retryFlowJobCommit()).value).toEqual(
          call(retryAllCommit, { flowIds: enabledIntegrationFlowIds })
        );
        expect(saga.next().done).toEqual(true);
      });

      test('should retry all pending and init retry all, wait for retry all undo and then return', () => {
        const saga = retryAll({ integrationId });

        expect(saga.next().value).toEqual(put(actions.job.retryAllPending()));
        expect(saga.next().value).toEqual(select(selectors.resourceList, { type: 'flows' }));
        expect(saga.next().value).toEqual(put(actions.job.retryAllInit({ flowIds: []})));

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
        expect(saga.next().value).toEqual(put(actions.job.retryAllInit({ flowIds: [flowId]})));

        expect(saga.next().value).toEqual(
          take([
            actionTypes.JOB.RETRY_ALL_COMMIT,
            actionTypes.JOB.RETRY_ALL_UNDO,
            actionTypes.JOB.RETRY_ALL_PENDING,
            actionTypes.JOB.RETRY_FLOW_JOB_COMMIT,
          ])
        );
        expect(saga.next(actions.job.retryAllPending()).value).toEqual(
          call(retryAllCommit, { flowIds: [flowId] })
        );
        expect(saga.next().done).toEqual(true);
      });

      test('should retry all pending and init retry all, wait for retry all commit and then commit retry all', () => {
        const saga = retryAll({ integrationId, flowId });

        expect(saga.next().value).toEqual(put(actions.job.retryAllPending()));
        expect(saga.next().value).toEqual(put(actions.job.retryAllInit({ flowIds: [flowId]})));

        expect(saga.next().value).toEqual(
          take([
            actionTypes.JOB.RETRY_ALL_COMMIT,
            actionTypes.JOB.RETRY_ALL_UNDO,
            actionTypes.JOB.RETRY_ALL_PENDING,
            actionTypes.JOB.RETRY_FLOW_JOB_COMMIT,
          ])
        );
        expect(saga.next(actions.job.retryAllCommit()).value).toEqual(
          call(retryAllCommit, { flowIds: [flowId] })
        );
        expect(saga.next().done).toEqual(true);
      });

      test('should retry all pending and init retry all, wait for retry flow job commit and then commit retry all', () => {
        const saga = retryAll({ integrationId, flowId });

        expect(saga.next().value).toEqual(put(actions.job.retryAllPending()));
        expect(saga.next().value).toEqual(put(actions.job.retryAllInit({ flowIds: [flowId]})));

        expect(saga.next().value).toEqual(
          take([
            actionTypes.JOB.RETRY_ALL_COMMIT,
            actionTypes.JOB.RETRY_ALL_UNDO,
            actionTypes.JOB.RETRY_ALL_PENDING,
            actionTypes.JOB.RETRY_FLOW_JOB_COMMIT,
          ])
        );
        expect(saga.next(actions.job.retryFlowJobCommit()).value).toEqual(
          call(retryAllCommit, { flowIds: [flowId] })
        );
        expect(saga.next().done).toEqual(true);
      });

      test('should retry all pending and init retry all, wait for retry all undo and then return', () => {
        const saga = retryAll({ integrationId, flowId });

        expect(saga.next().value).toEqual(put(actions.job.retryAllPending()));
        expect(saga.next().value).toEqual(put(actions.job.retryAllInit({ flowIds: [flowId]})));

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

  describe('getJobErrors saga', () => {
    test('should fork requestRetryObjectAndJobErrorCollection, waits for job error clear action and then cancels requestRetryObjectAndJobErrorCollection', () => {
      const jobId = 'something';
      const saga = getJobErrors({ jobId });

      expect(saga.next().value).toEqual(
        fork(requestRetryObjectAndJobErrorCollection, { jobId })
      );

      const watcherTask = createMockTask();

      expect(saga.next(watcherTask).value).toEqual(
        take(actionTypes.JOB.ERROR.CLEAR)
      );
      expect(saga.next().value).toEqual(cancel(watcherTask));
      expect(saga.next().done).toEqual(true);
    });
  });

  describe('resolveSelectedErrors saga', () => {
    const dataIn = {
      flowJobId: 'fj1',
      jobId: 'fj1i1',
      selectedErrorIds: ['e1', 'e3', 'e4'],
    };
    const jobErrors = [
      {
        _id: 'e1',
        source: 's1',
        code: 'c1',
        some: 'thing',
      },
      {
        _id: 'e2',
        source: 's1',
        code: 'c2',
        something: 'else',
      },
      {
        _id: 'e3',
        source: 's2',
        code: 'c3',
        some: 'thing',
      },
      {
        _id: 'e4',
        source: 's2',
        code: 'c3',
        something: 'something',
      },
      {
        _id: 'e5',
        source: 's1',
        code: 'c1',
        some: 'thing',
      },
    ];

    test('should succeed on successful api call', () => {
      const saga = resolveSelectedErrors(dataIn);

      expect(saga.next().value).toEqual(
        put(
          actions.job.resolveSelectedErrorsInit({
            selectedErrorIds: dataIn.selectedErrorIds,
          })
        )
      );
      expect(saga.next().value).toEqual(
        select(selectors.jobErrors, dataIn.jobId)
      );
      const { path, opts } = getRequestOptions(
        actionTypes.JOB.ERROR.RESOLVE_SELECTED,
        {
          resourceId: dataIn.jobId,
        }
      );

      opts.body = jobErrors.map(je => {
        const { _id, ...rest } = je;

        return { ...rest };
      });
      expect(saga.next(jobErrors).value).toEqual(
        call(apiCallWithRetry, { path, opts })
      );
      expect(saga.next().value).toEqual(
        call(getJobFamily, { jobId: dataIn.flowJobId })
      );
      expect(saga.next().done).toEqual(true);
    });

    test('should handle api error properly', () => {
      const saga = resolveSelectedErrors(dataIn);

      expect(saga.next().value).toEqual(
        put(
          actions.job.resolveSelectedErrorsInit({
            selectedErrorIds: dataIn.selectedErrorIds,
          })
        )
      );
      expect(saga.next().value).toEqual(
        select(selectors.jobErrors, dataIn.jobId)
      );
      const { path, opts } = getRequestOptions(
        actionTypes.JOB.ERROR.RESOLVE_SELECTED,
        {
          resourceId: dataIn.jobId,
        }
      );

      opts.body = jobErrors.map(je => {
        const { _id, ...rest } = je;

        return { ...rest };
      });
      expect(saga.next(jobErrors).value).toEqual(
        call(apiCallWithRetry, { path, opts })
      );
      expect(saga.throw(new Error()).value).toEqual(true);
      expect(saga.next().done).toEqual(true);
    });
  });

  describe('retrySelectedRetries saga', () => {
    const jobId = 'j1';
    const flowJobId = 'f1';
    const selectedRetryIds = ['r1', 'r3'];

    test('should succeed on successful api call', () => {
      const saga = retrySelectedRetries({ jobId, flowJobId, selectedRetryIds });
      const { path, opts } = getRequestOptions(
        actionTypes.JOB.ERROR.RETRY_SELECTED,
        {
          resourceId: jobId,
        }
      );

      opts.body = selectedRetryIds;

      expect(saga.next().value).toEqual(call(apiCallWithRetry, { path, opts }));
      expect(saga.next().value).toEqual(
        call(getJobFamily, { jobId: flowJobId })
      );
      expect(saga.next().value).toEqual(
        put(actions.job.requestInProgressJobStatus())
      );
      expect(saga.next().done).toEqual(true);
    });

    test('should handle api error properly', () => {
      const saga = retrySelectedRetries({ jobId, flowJobId, selectedRetryIds });
      const { path, opts } = getRequestOptions(
        actionTypes.JOB.ERROR.RETRY_SELECTED,
        {
          resourceId: jobId,
        }
      );

      opts.body = selectedRetryIds;

      expect(saga.next().value).toEqual(call(apiCallWithRetry, { path, opts }));
      expect(saga.throw(new Error()).value).toEqual(true);
      expect(saga.next().done).toEqual(true);
    });
  });

  describe('requestRetryData saga', () => {
    const retryId = 'r1';

    test('should succeed on successful api call', () => {
      const saga = requestRetryData({ retryId });
      const { path, opts } = getRequestOptions(
        actionTypes.JOB.ERROR.REQUEST_RETRY_DATA,
        {
          resourceId: retryId,
        }
      );

      expect(saga.next().value).toEqual(call(apiCallWithRetry, { path, opts }));
      const retryData = { some: 'thing', someThing: 'else' };

      expect(saga.next(retryData).value).toEqual(
        put(actions.job.receivedRetryData({ retryData, retryId }))
      );
      expect(saga.next().done).toEqual(true);
    });

    test('should handle api error properly', () => {
      const saga = requestRetryData({ retryId });
      const { path, opts } = getRequestOptions(
        actionTypes.JOB.ERROR.REQUEST_RETRY_DATA,
        {
          resourceId: retryId,
        }
      );

      expect(saga.next().value).toEqual(call(apiCallWithRetry, { path, opts }));

      expect(saga.throw(new Error()).value).toEqual(true);
      expect(saga.next().done).toEqual(true);
    });
  });

  describe('updateRetryData saga', () => {
    const retryId = 'r1';
    const retryData = { something: 'some thing else', nothing: 'some thing' };

    test('should succeed on successful api call', () => {
      const saga = updateRetryData({ retryId, retryData });
      const { path, opts } = getRequestOptions(
        actionTypes.JOB.ERROR.UPDATE_RETRY_DATA,
        {
          resourceId: retryId,
        }
      );

      opts.body = retryData;

      expect(saga.next().value).toEqual(call(apiCallWithRetry, { path, opts }));
      expect(saga.next().value).toEqual(
        put(actions.job.receivedRetryData({ retryData, retryId }))
      );
      expect(saga.next().done).toEqual(true);
    });

    test('should handle api error properly', () => {
      const saga = updateRetryData({ retryId, retryData });
      const { path, opts } = getRequestOptions(
        actionTypes.JOB.ERROR.UPDATE_RETRY_DATA,
        {
          resourceId: retryId,
        }
      );

      opts.body = retryData;

      expect(saga.next().value).toEqual(call(apiCallWithRetry, { path, opts }));
      expect(saga.throw(new Error()).value).toEqual(true);
      expect(saga.next().done).toEqual(true);
    });
  });

  describe('retryProcessedErrors saga', () => {
    test('should call retry api and update jobs list once retried', () => expectSaga(retryProcessedErrors, { jobId: 'j1', flowJobId: 'fj1', errorFileId: 'ef1' })
      .provide([
        [call(apiCallWithRetry, {
          path: '/jobs/j1/retries/retry',
          opts: {
            method: 'POST',
            body: { errorFile: { host: 's3', id: 'ef1' } },
          },
        }), {
          success: true,
        }],
        [
          call(getJobFamily, { jobId: 'fj1' }),
          [{
            _id: 'j1',
            numError: 0,
          }],
        ],
      ])
      .call(apiCallWithRetry, {
        path: '/jobs/j1/retries/retry',
        opts: {
          method: 'POST',
          body: { errorFile: { host: 's3', id: 'ef1' } },
        },
      })
      .call(getJobFamily, { jobId: 'fj1' })
      .put(actions.job.requestInProgressJobStatus())
      .run());

    test('should handle api error properly', () => expectSaga(retryProcessedErrors, { jobId: 'j1', flowJobId: 'fj1', errorFileId: 'ef1' })
      .provide([
        [call(apiCallWithRetry, {
          path: '/jobs/j1/retries/retry',
          opts: {
            method: 'POST',
            body: { errorFile: { host: 's3', id: 'ef1' } },
          },
        }), throwError({
          status: 401,
          message: '{"code":"error code"}',
        })],
      ])
      .call(apiCallWithRetry, {
        path: '/jobs/j1/retries/retry',
        opts: {
          method: 'POST',
          body: { errorFile: { host: 's3', id: 'ef1' } },
        },
      })
      .not.call(apiCallWithRetry, {
        path: '/jobs/j1/retries/retry',
        opts: {
          method: 'POST',
          body: { errorFile: { host: 's3', id: 'ef1' } },
        },
      })
      .run());
  });
});
