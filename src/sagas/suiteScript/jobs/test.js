/* global describe, test, expect */

import { expectSaga } from 'redux-saga-test-plan';
import { throwError } from 'redux-saga-test-plan/providers';
import { call, fork, take, cancel, select, delay, put, all } from 'redux-saga/effects';
import { createMockTask } from '@redux-saga/testing-utils';
import * as matchers from 'redux-saga-test-plan/matchers';
import actions from '../../../actions';
import { apiCallWithRetry } from '../../index';
import {
  getJob,
  requestJobCollection,
  getJobCollection,
  requestJobErrorCollection,
  getJobErrors,
  getInProgressJobsStatus,
  pollForInProgressJobs,
  startPollingForInProgressJobs,
  resolveSelectedErrors,
  resolveJobExports,
  resolveJobImports,
  resolveLogs,
  resolveCommit,
  resolveSelected,
  resolveAllCommit,
  resolveAll,
} from '.';
import actionTypes from '../../../actions/types';
import { selectors } from '../../../reducers';

describe('suitescript jobs testcases', () => {
  const ssLinkedConnectionId = 'c1';
  const integrationId = 'i1';
  const flowId = 'f1';
  const jobId = 'j1';

  describe('getJob saga tests', () => {
    const jobType = 'jt';
    const requestOptions = {
      path: `/suitescript/connections/${ssLinkedConnectionId}/integrations/${integrationId}/jobs/${jobId}?type=${jobType}`,
      opts: {
        method: 'GET',
      },
    };

    const job = {
      numSuccess: '5',
    };

    test('should call action received if api call is successful', () => expectSaga(getJob, { ssLinkedConnectionId, integrationId, jobId, jobType })
      .provide([
        [call(apiCallWithRetry, requestOptions), job],
      ])
      .call(apiCallWithRetry, requestOptions)
      .put(actions.suiteScript.job.received({job}))
      .run()
    );

    test('should handle properly if api call is not successful', () => {
      const error = { code: 422, message: 'error occured' };

      return expectSaga(getJob, { ssLinkedConnectionId, integrationId, jobId, jobType })
        .provide([
          [call(apiCallWithRetry, requestOptions), throwError(error)],
        ])
        .call(apiCallWithRetry, requestOptions)
        .not.put(actions.suiteScript.job.received({job}))
        .returns(true)
        .run();
    }
    );
  });

  describe('requestJobCollection saga tests', () => {
    test('should request for all the jobs if no filters selected', () => {
      const opts = { method: 'GET' };
      const path = `/suitescript/connections/${ssLinkedConnectionId}/integrations/${integrationId}/jobs?`;
      const jobsCollection = [
        {
          type: 'import',
          _id: '1',
          _integrationId: '1',
          _flowId: '26',
          createdAt: '2020-12-04T11:03:00.000Z',
          startedAt: '2020-12-04T10:00:00.000Z',
          endedAt: '2020-12-04T10:59:59.000Z',
          status: 'completed',
          numError: 0,
          numSuccess: 2,
        },
        {
          type: 'import',
          _id: '2',
          _integrationId: '1',
          _flowId: '31',
          createdAt: '2020-12-04T11:03:00.000Z',
          startedAt: '2020-12-04T10:00:00.000Z',
          endedAt: '2020-12-04T10:59:59.000Z',
          status: 'completed',
          numError: 0,
          numSuccess: 2,
        },
        {
          type: 'export',
          _id: '25901',
          _integrationId: '1',
          _flowId: '41',
          createdAt: '2020-12-04T11:03:00.000Z',
          startedAt: '2020-12-04T10:00:00.000Z',
          endedAt: '2020-12-04T10:59:59.000Z',
          status: 'completed',
        }];

      return expectSaga(requestJobCollection, { ssLinkedConnectionId, integrationId })
        .provide([
          [call(apiCallWithRetry, {
            path,
            opts,
          }), jobsCollection],
        ])
        .call(apiCallWithRetry, {
          path,
          opts,
        })
        .put(actions.suiteScript.job.receivedCollection({ collection: jobsCollection }))
        .put(actions.suiteScript.job.requestInProgressJobStatus({
          ssLinkedConnectionId,
          integrationId,
        }))
        .run();
    });

    test('should request for speicific flowId jobs if flowID is passed as argument', () => {
      const opts = { method: 'GET' };
      const path = `/suitescript/connections/${ssLinkedConnectionId}/integrations/${integrationId}/jobs?flowId=f1`;
      const jobsCollection = [
        {
          type: 'import',
          _id: '1',
          _integrationId: '1',
          _flowId: 'f1',
          createdAt: '2020-12-04T11:03:00.000Z',
          startedAt: '2020-12-04T10:00:00.000Z',
          endedAt: '2020-12-04T10:59:59.000Z',
          status: 'completed',
          numError: 0,
          numSuccess: 2,
        }];

      return expectSaga(requestJobCollection, { ssLinkedConnectionId, integrationId, flowId })
        .provide([
          [call(apiCallWithRetry, {
            path,
            opts,
          }), jobsCollection],
        ])
        .call(apiCallWithRetry, {
          path,
          opts,
        })
        .put(actions.suiteScript.job.receivedCollection({ collection: jobsCollection }))
        .put(actions.suiteScript.job.requestInProgressJobStatus({
          ssLinkedConnectionId,
          integrationId,
        }))
        .run();
    });

    test('should request for errored jobs if containsError filter is selected', () => {
      const opts = { method: 'GET' };
      const path = `/suitescript/connections/${ssLinkedConnectionId}/integrations/${integrationId}/jobs?flowId=f1&numError_gte=1`;
      const jobsCollection = [
        {
          type: 'import',
          _id: '1',
          _integrationId: '1',
          _flowId: 'f1',
          createdAt: '2020-12-04T11:03:00.000Z',
          startedAt: '2020-12-04T10:00:00.000Z',
          endedAt: '2020-12-04T10:59:59.000Z',
          status: 'completed',
          numError: 2,
          numSuccess: 0,
        }];

      return expectSaga(requestJobCollection, { ssLinkedConnectionId,
        integrationId,
        flowId,
        filters: {
          status: 'error',
        } })
        .provide([
          [call(apiCallWithRetry, {
            path,
            opts,
          }), jobsCollection],
        ])
        .call(apiCallWithRetry, {
          path,
          opts,
        })
        .put(actions.suiteScript.job.receivedCollection({ collection: jobsCollection }))
        .put(actions.suiteScript.job.requestInProgressJobStatus({
          ssLinkedConnectionId,
          integrationId,
        }))
        .run();
    });

    test('should handle properly if api call failed with an error', () => {
      const opts = { method: 'GET' };
      const path = `/suitescript/connections/${ssLinkedConnectionId}/integrations/${integrationId}/jobs?flowId=f1`;
      const error = { code: 422, message: 'error occured' };

      return expectSaga(requestJobCollection, { ssLinkedConnectionId,
        integrationId,
        flowId,
      })
        .provide([
          [call(apiCallWithRetry, {
            path,
            opts,
          }), throwError(error)],
        ])
        .call(apiCallWithRetry, {
          path,
          opts,
        })
        .not.put(actions.suiteScript.job.receivedCollection({ collection: undefined }))
        .not.put(actions.suiteScript.job.requestInProgressJobStatus({
          ssLinkedConnectionId,
          integrationId,
        }))
        .returns(true)
        .run();
    });
  });

  describe('getJobCollection saga tests', () => {
    test('should fork requestJobCollection, waits for job clear action and then cancels requestJobCollection', () => {
      const saga = getJobCollection({ssLinkedConnectionId, integrationId, flowId, filters: {}});

      expect(saga.next().value).toEqual(fork(requestJobCollection, {
        ssLinkedConnectionId,
        integrationId,
        flowId,
        filters: {},
      }));

      const watcherTask = createMockTask();

      expect(saga.next(watcherTask).value).toEqual(take(actionTypes.SUITESCRIPT.JOB.CLEAR));
      expect(saga.next().value).toEqual(cancel(watcherTask));
      expect(saga.next().done).toEqual(true);
    });
  });

  describe('requestJobErrorCollection saga tests', () => {
    const jobType = 'import';

    const path = `/suitescript/connections/${ssLinkedConnectionId}/integrations/${integrationId}/jobs/${jobId}/errors?type=${jobType}`;
    const opts = {
      method: 'GET',
    };

    test('should call receivedErrors on successful api call', () => {
      const collection = [
        {
          source: 's1',
          error: 'e1',
        },
      ];

      return expectSaga(requestJobErrorCollection, {ssLinkedConnectionId, integrationId, jobId, jobType})
        .provide([
          [call(apiCallWithRetry, {
            path,
            opts,
          }), collection],
        ])
        .call(apiCallWithRetry, {
          path,
          opts,
        })
        .put(actions.suiteScript.job.receivedErrors({
          collection,
          ssLinkedConnectionId,
          integrationId,
          jobId,
          jobType,
        }))
        .run();
    });

    test('should handle incase api call fails', () => {
      const error = { code: 422, message: 'error occured' };

      return expectSaga(requestJobErrorCollection, {ssLinkedConnectionId, integrationId, jobId, jobType})
        .provide([
          [call(apiCallWithRetry, {
            path,
            opts,
          }), throwError(error)],
        ])
        .call(apiCallWithRetry, {
          path,
          opts,
        })
        .not.put(actions.suiteScript.job.receivedErrors({
          collection: undefined,
          ssLinkedConnectionId,
          integrationId,
          jobId,
          jobType,
        }))
        .returns(true)
        .run();
    });
  });

  describe('getJobErrors saga tests', () => {
    const jobType = 'import';

    test('should fork requestJobErrorCollection, waits for job clear action and then cancels requestJobErrorCollection', () => {
      const saga = getJobErrors({ssLinkedConnectionId, integrationId, jobId, jobType});

      expect(saga.next().value).toEqual(fork(requestJobErrorCollection, {
        ssLinkedConnectionId,
        integrationId,
        jobId,
        jobType,
      }));

      const watcherTask = createMockTask();

      expect(saga.next(watcherTask).value).toEqual(take(actionTypes.SUITESCRIPT.JOB.ERROR.CLEAR));
      expect(saga.next().value).toEqual(cancel(watcherTask));
      expect(saga.next().done).toEqual(true);
    });
  });

  describe('getInProgressJobsStatus saga tests', () => {
    test('should dispatch no inprogress jobs action when there are no jobs in running state', () => {
      const jobCollection = [
        {
          _id: '1',
          status: 'completed',
        },
      ];

      return expectSaga(getInProgressJobsStatus, {
        ssLinkedConnectionId,
        integrationId,
      })
        .provide([
          [
            select(selectors.suiteScriptResourceList, {
              resourceType: 'jobs',
            }), jobCollection,
          ],
        ])
        .put(actions.suiteScript.job.noInProgressJobs())
        .returns(true)
        .run();
    });
    test('should call getJobFamily for each flow job in running state', () => {
      const jobCollection = [
        {
          _id: '1',
          status: 'queued',
          type: 'export',
        },
        {
          _id: '2',
          status: 'running',
          type: 'import',
        },
        {
          _id: '3',
          status: 'completed',
          type: 'import',
        },
      ];

      return expectSaga(getInProgressJobsStatus, {
        ssLinkedConnectionId,
        integrationId,
      })
        .provide([
          [
            select(selectors.suiteScriptResourceList, {
              resourceType: 'jobs',
            }), jobCollection,
          ],
        ])
        .not.put(actions.suiteScript.job.noInProgressJobs())
        .call(getJob, {
          ssLinkedConnectionId,
          integrationId,
          jobId: '1',
          jobType: 'export',
        })
        .call(getJob, {
          ssLinkedConnectionId,
          integrationId,
          jobId: '2',
          jobType: 'import',
        })
        .run();
    });
  });

  describe('pollForInProgressJobs saga tests', () => {
    test('should call getInProgressJobsStatus after 5 seconds delay continuously', () => {
      const saga = pollForInProgressJobs({
        ssLinkedConnectionId,
        integrationId,
      });

      expect(saga.next().value).toEqual(delay(5000));
      expect(saga.next().value).toEqual(call(getInProgressJobsStatus, {
        ssLinkedConnectionId,
        integrationId,
      }));
      expect(saga.next().done).toEqual(false);
    });
  });

  describe('startPollingForInProgressJobs saga', () => {
    test('should fork pollForInProgressJobs, waits for job clear or no running jobs or request inprogress jobs status action and then cancels pollForInProgressJobs', () => {
      const saga = startPollingForInProgressJobs({
        ssLinkedConnectionId,
        integrationId,
      });

      expect(saga.next().value).toEqual(fork(pollForInProgressJobs, {
        ssLinkedConnectionId,
        integrationId,
      }));

      const watcherTask = createMockTask();

      expect(saga.next(watcherTask).value).toEqual(
        take([
          actionTypes.SUITESCRIPT.JOB.CLEAR,
          actionTypes.SUITESCRIPT.JOB.NO_IN_PROGRESS_JOBS,
          actionTypes.SUITESCRIPT.JOB.REQUEST_IN_PROGRESS_JOBS_STATUS,
        ])
      );
      expect(saga.next().value).toEqual(cancel(watcherTask));
      expect(saga.next().done).toEqual(true);
    });
  });

  describe('resolveSelectedErrors saga tests', () => {
    const jobType = 'import';
    const selectedErrorIds = ['1', '2'];

    const path = `/suitescript/connections/${ssLinkedConnectionId}/integrations/${integrationId}/jobs/${jobId}/resolve`;
    const opts = {
      method: 'PUT',
    };

    test('should resolve selected errorIds on successful api call', () => expectSaga(resolveSelectedErrors, {
      ssLinkedConnectionId,
      integrationId,
      jobId,
      jobType,
      selectedErrorIds,
    })
      .provide([
        [
          call(apiCallWithRetry, {
            path,
            opts: {
              ...opts,
              body: {
                celigo_method: 'resolveJobErrors',
                type: jobType,
                errorIdsToResolve: selectedErrorIds,
              },
            },
          }), {
            success: true,
          },
        ],
      ])
      .put(
        actions.suiteScript.job.resolveSelectedErrorsInit({
          selectedErrorIds,
        })
      )
      .call(apiCallWithRetry, {
        path,
        opts: {
          ...opts,
          body: {
            celigo_method: 'resolveJobErrors',
            type: jobType,
            errorIdsToResolve: selectedErrorIds,
          },
        },
      })
      .call(getJob, { ssLinkedConnectionId, integrationId, jobId, jobType })
      .run()
    );

    test('should not call getJob in case api call fails with an error', () => {
      const error = {
        statusCode: '422',
        message: 'error occured',
      };

      return expectSaga(resolveSelectedErrors, {
        ssLinkedConnectionId,
        integrationId,
        jobId,
        jobType,
        selectedErrorIds,
      })
        .provide([
          [
            call(apiCallWithRetry, {
              path,
              opts: {
                ...opts,
                body: {
                  celigo_method: 'resolveJobErrors',
                  type: jobType,
                  errorIdsToResolve: selectedErrorIds,
                },
              },
            }), throwError(error),
          ],
        ])
        .put(
          actions.suiteScript.job.resolveSelectedErrorsInit({
            selectedErrorIds,
          })
        )
        .call(apiCallWithRetry, {
          path,
          opts: {
            ...opts,
            body: {
              celigo_method: 'resolveJobErrors',
              type: jobType,
              errorIdsToResolve: selectedErrorIds,
            },
          },
        })
        .not.call(getJob, { ssLinkedConnectionId, integrationId, jobId, jobType })
        .run();
    }
    );
  });

  describe('resolveJobExports saga tests', () => {
    test('should resolve selected job exports on successful api call', () => expectSaga(resolveJobExports, {
      ssLinkedConnectionId,
      integrationId,
      flowId,
      jobIdsToResolve: ['1', '2'],
    })
      .provide([
        [matchers.call.fn(apiCallWithRetry), {
          success: true,
        }],
      ])
      .call.fn(apiCallWithRetry)
      .call(getJob, {
        ssLinkedConnectionId,
        integrationId,
        jobId: '1',
        jobType: 'export',
      })
      .call(getJob, {
        ssLinkedConnectionId,
        integrationId,
        jobId: '2',
        jobType: 'export',
      })
      .run()
    );

    test('should resolve all job exports on successful api call and should not call getJob', () => expectSaga(resolveJobExports, {
      ssLinkedConnectionId,
      integrationId,
      flowId,
      jobIdsToResolve: null,
    })
      .provide([
        [matchers.call.fn(apiCallWithRetry), {
          success: true,
        }],
      ])
      .call.fn(apiCallWithRetry)
      .not.call(getJob, {
        ssLinkedConnectionId,
        integrationId,
        jobId: '1',
        jobType: 'export',
      })
      .not.call(getJob, {
        ssLinkedConnectionId,
        integrationId,
        jobId: '2',
        jobType: 'export',
      })
      .run()
    );

    test('should handle api error properly and not call getJobExport', () => {
      const error = {
        statusCode: '422',
        errorMessage: 'error occured',
      };

      return expectSaga(resolveJobExports, {
        ssLinkedConnectionId,
        integrationId,
        flowId,
        jobIdsToResolve: ['1', '2'],
      })
        .provide([
          [matchers.call.fn(apiCallWithRetry), throwError(error)],
        ])
        .call.fn(apiCallWithRetry)
        .not.call(getJob, {
          ssLinkedConnectionId,
          integrationId,
          jobId: '1',
          jobType: 'export',
        })
        .not.call(getJob, {
          ssLinkedConnectionId,
          integrationId,
          jobId: '2',
          jobType: 'export',
        })
        .returns(true)
        .run();
    });
  });

  describe('resolveJobImports saga tests', () => {
    test('should resolve selected job imports on successful api call', () => expectSaga(resolveJobImports, {
      ssLinkedConnectionId,
      integrationId,
      flowId,
      jobIdsToResolve: ['1', '2'],
    })
      .provide([
        [matchers.call.fn(apiCallWithRetry), {
          success: true,
        }],
      ])
      .call.fn(apiCallWithRetry)
      .call(getJob, {
        ssLinkedConnectionId,
        integrationId,
        jobId: '1',
        jobType: 'import',
      })
      .call(getJob, {
        ssLinkedConnectionId,
        integrationId,
        jobId: '2',
        jobType: 'import',
      })
      .run()
    );

    test('should resolve all job imports on successful api call and should not call getJob', () => expectSaga(resolveJobImports, {
      ssLinkedConnectionId,
      integrationId,
      flowId,
      jobIdsToResolve: null,
    })
      .provide([
        [matchers.call.fn(apiCallWithRetry), {
          success: true,
        }],
      ])
      .call.fn(apiCallWithRetry)
      .not.call(getJob, {
        ssLinkedConnectionId,
        integrationId,
        jobId: '1',
        jobType: 'import',
      })
      .not.call(getJob, {
        ssLinkedConnectionId,
        integrationId,
        jobId: '2',
        jobType: 'import',
      })
      .run()
    );

    test('should handle api error properly and not call getJobImport', () => {
      const error = {
        statusCode: '422',
        errorMessage: 'error occured',
      };

      return expectSaga(resolveJobImports, {
        ssLinkedConnectionId,
        integrationId,
        flowId,
        jobIdsToResolve: ['1', '2'],
      })
        .provide([
          [matchers.call.fn(apiCallWithRetry), throwError(error)],
        ])
        .call.fn(apiCallWithRetry)
        .not.call(getJob, {
          ssLinkedConnectionId,
          integrationId,
          jobId: '1',
          jobType: 'import',
        })
        .not.call(getJob, {
          ssLinkedConnectionId,
          integrationId,
          jobId: '2',
          jobType: 'import',
        })
        .returns(true)
        .run();
    });
  });

  describe('resolveLogs saga tests', () => {
    const parentLogIds = ['1', '2'];

    test('should successfully resolve provided log ids', () => expectSaga(resolveLogs, {
      ssLinkedConnectionId,
      integrationId,
      flowId,
      parentLogIds,
    })
      .provide([
        [matchers.call.fn(apiCallWithRetry), {
          success: true,
        }],
      ])
      .call.fn(apiCallWithRetry)
      .run()
    );

    test('should handle errors properly if api call fails with an error', () => {
      const error = {
        statusCode: '422',
        errorMessage: 'error occurred',
      };

      return expectSaga(resolveLogs, {
        ssLinkedConnectionId,
        integrationId,
        flowId,
        parentLogIds,
      })
        .provide([
          [matchers.call.fn(apiCallWithRetry), throwError(error)],
        ])
        .call.fn(apiCallWithRetry)
        .returns(true)
        .run();
    });
  });

  describe('resolveCommit saga tests', () => {
    test('should resolve all exports, imports and jobs', () => {
      const jobs = [
        {
          jobType: 'export',
          jobId: 'e1',
        },
        {
          jobType: 'import',
          jobId: 'i1',
        },
        {
          log: 'l1',
        },
      ];

      return expectSaga(resolveCommit, {
        ssLinkedConnectionId,
        integrationId,
        flowId,
        jobs,
      })
        .call(resolveJobExports, {
          ssLinkedConnectionId,
          integrationId,
          flowId,
          jobIdsToResolve: ['e1'],
        })
        .call(resolveJobImports, {
          ssLinkedConnectionId,
          integrationId,
          flowId,
          jobIdsToResolve: ['i1'],
        })
        .call(resolveLogs, {
          ssLinkedConnectionId,
          integrationId,
          flowId,
          parentLogIds: ['l1'],
        })
        .run();
    });

    test('should resolve only exports and jobs and not imports if there are no imports', () => {
      const jobs = [
        {
          jobType: 'export',
          jobId: 'e1',
        },
        {
          log: 'l1',
        },
      ];

      return expectSaga(resolveCommit, {
        ssLinkedConnectionId,
        integrationId,
        flowId,
        jobs,
      })
        .call(resolveJobExports, {
          ssLinkedConnectionId,
          integrationId,
          flowId,
          jobIdsToResolve: ['e1'],
        })
        .not.call(resolveJobImports, {
          ssLinkedConnectionId,
          integrationId,
          flowId,
          jobIdsToResolve: ['i1'],
        })
        .call(resolveLogs, {
          ssLinkedConnectionId,
          integrationId,
          flowId,
          parentLogIds: ['l1'],
        })
        .run();
    });
  });

  describe('resolveSelected saga tests', () => {
    const jobs = [
      {
        jobType: 'export',
        jobId: 'e1',
      },
    ];

    test('should resolve all pending and init resolve for passed in jobs, wait for resolve all pending and then commit resolve', () => {
      const saga = resolveSelected({
        ssLinkedConnectionId,
        integrationId,
        flowId,
        jobs,
      });

      expect(saga.next().value).toEqual(put(actions.suiteScript.job.resolveAllPending()));

      expect(saga.next().value).toEqual(
        all(jobs.map(job => put(actions.suiteScript.job.resolveInit(job))))
      );

      expect(saga.next().value).toEqual(
        take([
          actionTypes.SUITESCRIPT.JOB.RESOLVE_COMMIT,
          actionTypes.SUITESCRIPT.JOB.RESOLVE_UNDO,
          actionTypes.SUITESCRIPT.JOB.RESOLVE_ALL_PENDING,
        ])
      );

      expect(saga.next(actions.suiteScript.job.resolveAllPending()).value).toEqual(
        call(resolveCommit, {
          ssLinkedConnectionId,
          integrationId,
          flowId,
          jobs,
        })
      );
      expect(saga.next().done).toEqual(true);
    });

    test('should resolve all pending and init resolve for passed in jobs, wait for resolve commit and then commit resolve', () => {
      const saga = resolveSelected({
        ssLinkedConnectionId,
        integrationId,
        flowId,
        jobs,
      });

      expect(saga.next().value).toEqual(put(actions.suiteScript.job.resolveAllPending()));

      expect(saga.next().value).toEqual(
        all(jobs.map(job => put(actions.suiteScript.job.resolveInit(job))))
      );

      expect(saga.next().value).toEqual(
        take([
          actionTypes.SUITESCRIPT.JOB.RESOLVE_COMMIT,
          actionTypes.SUITESCRIPT.JOB.RESOLVE_UNDO,
          actionTypes.SUITESCRIPT.JOB.RESOLVE_ALL_PENDING,
        ])
      );

      expect(saga.next(actions.suiteScript.job.resolveCommit()).value).toEqual(
        call(resolveCommit, {
          ssLinkedConnectionId,
          integrationId,
          flowId,
          jobs,
        })
      );
      expect(saga.next().done).toEqual(true);
    });

    test('should resolve all pending and init resolve for passed in jobs, wait for resolve undo and then return', () => {
      const saga = resolveSelected({
        ssLinkedConnectionId,
        integrationId,
        flowId,
        jobs,
      });

      expect(saga.next().value).toEqual(put(actions.suiteScript.job.resolveAllPending()));

      expect(saga.next().value).toEqual(
        all(jobs.map(job => put(actions.suiteScript.job.resolveInit(job))))
      );

      expect(saga.next().value).toEqual(
        take([
          actionTypes.SUITESCRIPT.JOB.RESOLVE_COMMIT,
          actionTypes.SUITESCRIPT.JOB.RESOLVE_UNDO,
          actionTypes.SUITESCRIPT.JOB.RESOLVE_ALL_PENDING,
        ])
      );

      expect(saga.next(actions.suiteScript.job.resolveUndo()).done).toEqual(
        true
      );
    });
  });

  describe('resolveAllCommit saga tests', () => {
    test('should resolve exports, imports and logs', () =>
      expectSaga(resolveAllCommit, {
        ssLinkedConnectionId,
        integrationId,
        flowId,
      })
        .call(resolveJobExports, {
          ssLinkedConnectionId,
          integrationId,
          flowId,
        })
        .call(resolveJobImports, {
          ssLinkedConnectionId,
          integrationId,
          flowId,
        })
        .call(resolveLogs, {
          ssLinkedConnectionId,
          integrationId,
          flowId,
        })
        .run()
    );
  });

  describe('resolveAll saga tests', () => {
    test('should resolve all pending and resolve all init, wait for resolve all pending and then commit resolve', () => {
      const saga = resolveAll({
        ssLinkedConnectionId,
        integrationId,
        flowId,
      });

      expect(saga.next().value).toEqual(put(actions.suiteScript.job.resolveAllPending()));

      expect(saga.next().value).toEqual(put(actions.suiteScript.job.resolveAllInit()));

      expect(saga.next().value).toEqual(
        take([
          actionTypes.SUITESCRIPT.JOB.RESOLVE_ALL_COMMIT,
          actionTypes.SUITESCRIPT.JOB.RESOLVE_ALL_UNDO,
          actionTypes.SUITESCRIPT.JOB.RESOLVE_ALL_PENDING,
        ])
      );

      expect(saga.next(actions.suiteScript.job.resolveAllPending()).value).toEqual(
        call(resolveAllCommit, {
          ssLinkedConnectionId,
          integrationId,
          flowId,
        })
      );
      expect(saga.next().done).toEqual(true);
    });

    test('should resolve all pending and resolve all init, wait for resolve all commit and then commit resolve', () => {
      const saga = resolveAll({
        ssLinkedConnectionId,
        integrationId,
        flowId,
      });

      expect(saga.next().value).toEqual(put(actions.suiteScript.job.resolveAllPending()));

      expect(saga.next().value).toEqual(put(actions.suiteScript.job.resolveAllInit()));

      expect(saga.next().value).toEqual(
        take([
          actionTypes.SUITESCRIPT.JOB.RESOLVE_ALL_COMMIT,
          actionTypes.SUITESCRIPT.JOB.RESOLVE_ALL_UNDO,
          actionTypes.SUITESCRIPT.JOB.RESOLVE_ALL_PENDING,
        ])
      );

      expect(saga.next(actions.suiteScript.job.resolveAllCommit()).value).toEqual(
        call(resolveAllCommit, {
          ssLinkedConnectionId,
          integrationId,
          flowId,
        })
      );
      expect(saga.next().done).toEqual(true);
    });

    test('should resolve all pending and resolve all init, wait for resolve all undo and then return', () => {
      const saga = resolveAll({
        ssLinkedConnectionId,
        integrationId,
        flowId,
      });

      expect(saga.next().value).toEqual(put(actions.suiteScript.job.resolveAllPending()));

      expect(saga.next().value).toEqual(put(actions.suiteScript.job.resolveAllInit()));

      expect(saga.next().value).toEqual(
        take([
          actionTypes.SUITESCRIPT.JOB.RESOLVE_ALL_COMMIT,
          actionTypes.SUITESCRIPT.JOB.RESOLVE_ALL_UNDO,
          actionTypes.SUITESCRIPT.JOB.RESOLVE_ALL_PENDING,
        ])
      );

      expect(saga.next(actions.suiteScript.job.resolveAllUndo({
        flowId,
        integrationId,
        ssLinkedConnectionId,
      })).done).toEqual(true);
    });
  });
});

