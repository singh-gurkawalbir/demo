/* global describe, expect, test */
import { call, cancel, fork, select, take } from 'redux-saga/effects';
import { expectSaga, testSaga } from 'redux-saga-test-plan';
import { throwError } from 'redux-saga-test-plan/providers';
import { createMockTask } from '@redux-saga/testing-utils';
import { apiCallWithRetry } from '../../..';
import actions from '../../../../actions';
import actionTypes from '../../../../actions/types';
import { selectors } from '../../../../reducers';
import { JOB_STATUS, JOB_TYPES } from '../../../../utils/constants';
import getRequestOptions from '../../../../utils/requestOptions';
import {
  refreshForMultipleFlowJobs,
  getJobFamily,
  getInProgressJobsStatus,
  pollForInProgressJobs,
  requestLatestJobs,
  cancelJob,
  cancelLatestJobs,
  startPollingForInProgressJobs,
} from './index';

describe('refreshForMultipleFlowJobs saga', () => {
  const flowId = 'f1';
  const jobState1 = {
    _id: 'j1',
    type: JOB_TYPES.FLOW,
    status: JOB_STATUS.RUNNING,
    startedAt: '2019-08-11T10:50:00.000Z',
    _integrationId: 'i1',
    duration: undefined,
    doneExporting: false,
    numPagesProcessed: 0,
    uiStatus: JOB_STATUS.RUNNING,
    children: [
      {
        type: JOB_TYPES.EXPORT,
        status: JOB_STATUS.RUNNING,
        duration: undefined,
        uiStatus: JOB_STATUS.RUNNING,
        _integrationId: 'i1',
      },
      {
        type: JOB_TYPES.IMPORT,
        status: JOB_STATUS.QUEUED,
        duration: undefined,
        uiStatus: JOB_STATUS.QUEUED,
        _integrationId: 'i1',
      },
      {
        type: JOB_TYPES.IMPORT,
        status: JOB_STATUS.QUEUED,
        duration: undefined,
        uiStatus: JOB_STATUS.QUEUED,
        _integrationId: 'i1',
      },
    ],
  };
  const jobState2 = {
    _id: 'j1',
    type: JOB_TYPES.FLOW,
    status: JOB_STATUS.RUNNING,
    startedAt: '2019-08-11T10:50:00.000Z',
    _integrationId: 'i1',
    duration: undefined,
    doneExporting: false,
    numPagesProcessed: 0,
    uiStatus: JOB_STATUS.RUNNING,
    children: [
      {
        type: JOB_TYPES.EXPORT,
        status: JOB_STATUS.COMPLETED,
        duration: undefined,
        uiStatus: JOB_STATUS.COMPLETED,
        _integrationId: 'i1',
      },
      {
        type: JOB_TYPES.IMPORT,
        status: JOB_STATUS.RUNNING,
        duration: undefined,
        uiStatus: JOB_STATUS.RUNNING,
        _integrationId: 'i1',
      },
      {
        type: JOB_TYPES.IMPORT,
        status: JOB_STATUS.QUEUED,
        duration: undefined,
        uiStatus: JOB_STATUS.QUEUED,
        _integrationId: 'i1',
      },
    ],
  };

  test('should do nothing if the export child of the job is still in inprogress status', () => {
    const latestJobs = [
      {
        _id: 'j1',
        type: JOB_TYPES.FLOW,
        status: JOB_STATUS.COMPLETED,
        startedAt: '2019-08-11T10:50:00.000Z',
        _integrationId: 'i1',
        duration: undefined,
        doneExporting: false,
        uiStatus: JOB_STATUS.COMPLETED,
        children: [
          {
            type: JOB_TYPES.EXPORT,
            status: JOB_STATUS.COMPLETED,
            duration: undefined,
            uiStatus: JOB_STATUS.COMPLETED,
            _integrationId: 'i1',
          },
          {
            type: JOB_TYPES.IMPORT,
            status: JOB_STATUS.COMPLETED,
            duration: undefined,
            uiStatus: JOB_STATUS.COMPLETED,
            percentComplete: 0,
            _integrationId: 'i1',
          },
          {
            type: JOB_TYPES.IMPORT,
            status: JOB_STATUS.COMPLETED,
            duration: undefined,
            uiStatus: JOB_STATUS.COMPLETED,
            percentComplete: 0,
            _integrationId: 'i1',
          },
        ],
      },
    ];

    return expectSaga(refreshForMultipleFlowJobs, { flowId, job: jobState1, latestJobs}).run();
  });
  test('should do nothing if the job field _lastPageGeneratorJob is set true', () => {
    const latestJobs = [
      {
        _id: 'j1',
        type: JOB_TYPES.FLOW,
        status: JOB_STATUS.COMPLETED,
        startedAt: '2019-08-11T10:50:00.000Z',
        _integrationId: 'i1',
        duration: undefined,
        doneExporting: false,
        uiStatus: JOB_STATUS.COMPLETED,
        _lastPageGeneratorJob: true,
        children: [
          {
            type: JOB_TYPES.EXPORT,
            status: JOB_STATUS.COMPLETED,
            duration: undefined,
            uiStatus: JOB_STATUS.COMPLETED,
            _integrationId: 'i1',
          },
          {
            type: JOB_TYPES.IMPORT,
            status: JOB_STATUS.COMPLETED,
            duration: undefined,
            uiStatus: JOB_STATUS.COMPLETED,
            percentComplete: 0,
            _integrationId: 'i1',
          },
          {
            type: JOB_TYPES.IMPORT,
            status: JOB_STATUS.COMPLETED,
            duration: undefined,
            uiStatus: JOB_STATUS.COMPLETED,
            percentComplete: 0,
            _integrationId: 'i1',
          },
        ],
      },
    ];

    return expectSaga(refreshForMultipleFlowJobs, { flowId, job: jobState1, latestJobs}).run();
  });
  test('should do nothing if the both the previous and present status of export child of job is in fininshed', () => {
    const latestJobs = [
      {
        _id: 'j1',
        type: JOB_TYPES.FLOW,
        status: JOB_STATUS.COMPLETED,
        startedAt: '2019-08-11T10:50:00.000Z',
        _integrationId: 'i1',
        duration: undefined,
        doneExporting: false,
        uiStatus: JOB_STATUS.COMPLETED,
        _lastPageGeneratorJob: true,
        children: [
          {
            type: JOB_TYPES.EXPORT,
            status: JOB_STATUS.COMPLETED,
            duration: undefined,
            uiStatus: JOB_STATUS.COMPLETED,
            _integrationId: 'i1',
          },
          {
            type: JOB_TYPES.IMPORT,
            status: JOB_STATUS.COMPLETED,
            duration: undefined,
            uiStatus: JOB_STATUS.COMPLETED,
            percentComplete: 0,
            _integrationId: 'i1',
          },
          {
            type: JOB_TYPES.IMPORT,
            status: JOB_STATUS.COMPLETED,
            duration: undefined,
            uiStatus: JOB_STATUS.COMPLETED,
            percentComplete: 0,
            _integrationId: 'i1',
          },
        ],
      },
    ];

    return expectSaga(refreshForMultipleFlowJobs, { flowId, job: jobState2, latestJobs}).run();
  });
  test('should dispatch request action if the export child of job is completed and previous state of the export child of job is in inprogress status', () => {
    const latestJobs = [
      {
        _id: 'j1',
        type: JOB_TYPES.FLOW,
        status: JOB_STATUS.RUNNING,
        startedAt: '2019-08-11T10:50:00.000Z',
        _integrationId: 'i1',
        duration: undefined,
        doneExporting: false,
        uiStatus: JOB_STATUS.RUNNING,
        _lastPageGeneratorJob: true,
        children: [
          {
            type: JOB_TYPES.EXPORT,
            status: JOB_STATUS.RUNNING,
            duration: undefined,
            uiStatus: JOB_STATUS.RUNNING,
            _integrationId: 'i1',
          },
          {
            type: JOB_TYPES.IMPORT,
            status: JOB_STATUS.QUEUED,
            duration: undefined,
            uiStatus: JOB_STATUS.QUEUED,
            percentComplete: 0,
            _integrationId: 'i1',
          },
          {
            type: JOB_TYPES.IMPORT,
            status: JOB_STATUS.QUEUED,
            duration: undefined,
            uiStatus: JOB_STATUS.QUEUED,
            percentComplete: 0,
            _integrationId: 'i1',
          },
        ],
      },
    ];

    return expectSaga(refreshForMultipleFlowJobs, { flowId, job: jobState2, latestJobs})
      .put(actions.errorManager.latestFlowJobs.request({ flowId }))
      .run();
  });
});

describe('getJobFamily saga', () => {
  const flowId = 'f1';
  const jobId = 'j1';

  test('should dispatch receivedJobFamily and call refreshForMultipleFlowJobs on successFul api call', () => {
    const job = {
      _id: 'j1',
      type: JOB_TYPES.FLOW,
      status: JOB_STATUS.COMPLETED,
      startedAt: '2019-08-11T10:50:00.000Z',
      _integrationId: 'i1',
      duration: undefined,
      doneExporting: false,
      uiStatus: JOB_STATUS.COMPLETED,
    };
    const latestJobsState = {
      status: 'received',
      data: [
        {
          _id: 'j1',
          _userId: '5677d8839799c292124350c5',
          type: 'flow',
          _flowId: 'f1',
          _exportId: 'e1',
          _integrationId: 'f1',
          status: 'queued',
        },
      ],
    };
    const { path, opts } = getRequestOptions(actionTypes.JOB.REQUEST_FAMILY, { resourceId: jobId });

    return expectSaga(getJobFamily, { flowId, jobId })
      .provide([
        [select(selectors.latestFlowJobsList, flowId), latestJobsState],
        [call(apiCallWithRetry, {
          path, opts, hidden: true,
        }), job],
        [call(refreshForMultipleFlowJobs, {flowId, job, latestJobs: latestJobsState.data})],
      ])
      .call(apiCallWithRetry, {
        path, opts, hidden: true,
      })
      .put(actions.errorManager.latestFlowJobs.receivedJobFamily({flowId, job }))
      .call(refreshForMultipleFlowJobs, {flowId, job, latestJobs: latestJobsState.data})
      .run();
  });
  test('should do nothing if api call fails', () => {
    const error = { message: 'something' };
    const { path, opts } = getRequestOptions(actionTypes.JOB.REQUEST_FAMILY, { resourceId: jobId });

    return expectSaga(getJobFamily, { flowId, jobId })
      .provide([
        [call(apiCallWithRetry, {
          path, opts, hidden: true,
        }), throwError(error)],
      ])
      .call(apiCallWithRetry, {
        path, opts, hidden: true,
      })
      .not.put(actions.errorManager.latestFlowJobs.receivedJobFamily({flowId}))
      .not.call(refreshForMultipleFlowJobs, {flowId})
      .run();
  });
});

describe('getInProgressJobsStatus saga', () => {
  const flowId = 'f1';

  test('if there are inprogressJobs then should call jobFamily api for every inprogress job', () => {
    const inProgressJobs = ['j1', 'j2', 'j3'];

    const saga = expectSaga(getInProgressJobsStatus, { flowId }).provide([
      [select(selectors.getInProgressLatestJobs, flowId, true), inProgressJobs],
      [call(getJobFamily)],
    ]);

    inProgressJobs.map(jobId => saga.call(getJobFamily, { flowId, jobId}));

    return saga.not.put(actions.errorManager.latestFlowJobs.noInProgressJobs()).run();
  });
  test('dispatch noInprogressjobs action of errorManager if there are no noInprogressJobs', () => {
    const inProgressJobs = [];

    return expectSaga(getInProgressJobsStatus, {flowId})
      .provide([[select(selectors.getInProgressLatestJobs, flowId), inProgressJobs]])
      .put(actions.errorManager.latestFlowJobs.noInProgressJobs())
      .not.call(getJobFamily)
      .run();
  });
});

describe('pollForInprogressJobs saga', () => {
  test('should repeatedly call getInProgressJobStatus', () => {
    const flowId = 'f1';

    testSaga(pollForInProgressJobs, {flowId})
      .next()
      .delay(5 * 1000)
      .next()
      .call(getInProgressJobsStatus, {flowId})
      .next()
      .delay(5 * 1000)
      .next()
      .call(getInProgressJobsStatus, {flowId})
      .next()
      .delay(5 * 1000);
  });
});

describe('startPollingForInProgressJobs saga', () => {
  test('should fork pollForInProgressJobs, wait for any of the required actions are dispatched then cancel pollFOrInProgressJobs', () => {
    const flowId = 'f1';
    const saga = startPollingForInProgressJobs({flowId});

    expect(saga.next().value).toEqual(fork(pollForInProgressJobs, {flowId}));

    const watcherTask = createMockTask();

    expect(saga.next(watcherTask).value).toEqual(take([
      actionTypes.ERROR_MANAGER.FLOW_LATEST_JOBS.CLEAR,
      actionTypes.ERROR_MANAGER.FLOW_LATEST_JOBS.CANCEL,
      actionTypes.ERROR_MANAGER.FLOW_LATEST_JOBS.REQUEST,
      actionTypes.ERROR_MANAGER.FLOW_LATEST_JOBS.NO_IN_PROGRESS_JOBS,
    ]));
    expect(saga.next().value).toEqual(cancel(watcherTask));
    expect(saga.next().done).toEqual(true);
  });
});

describe('requestLatestJobs saga', () => {
  const flowId = 'f1';
  const path = `/flows/${flowId}/jobs/latest`;
  const method = 'GET';
  const latestFlowJobs = [
    {
      _id: 'j1',
      _userId: '5677d8839799c292124350c5',
      type: 'flow',
      _flowId: 'f1',
      _exportId: 'e1',
      _integrationId: 'i1',
      status: JOB_STATUS.RUNNING,
    },
    {
      _id: 'j2',
      _userId: '5677d8839799c292124350c5',
      type: 'flow',
      _flowId: 'f1',
      _importId: 'im1',
      _integrationId: 'i1',
      status: JOB_STATUS.QUEUED,
    },
    {
      _id: 'j3',
      _userId: '5677d8839799c292124350c5',
      type: 'flow',
      _flowId: 'f1',
      _importId: 'im2',
      _integrationId: 'i1',
      status: JOB_STATUS.QUEUED,
    },
  ];

  test('should dispatch required actions and call getJobFamily for every latestJob if the api call is succesfull', () => {
    const saga = expectSaga(requestLatestJobs, {flowId})
      .provide([
        [call(apiCallWithRetry, { path, opts: {method}, hidden: true}), latestFlowJobs],
        [call(getJobFamily)],
      ])
      .call(apiCallWithRetry, { path, opts: {method}, hidden: true})
      .put(
        actions.errorManager.latestFlowJobs.received({
          flowId,
          latestJobs: latestFlowJobs,
        })
      );

    latestFlowJobs.map(latestJob => saga.call(getJobFamily, { flowId, jobId: latestJob._id }));

    return saga.put(actions.errorManager.latestFlowJobs.requestInProgressJobsPoll({ flowId })).run();
  });
  test('should not dispatch any actions or call getJobFamily if apiCallWithRetry api fails', () => {
    const error = { message: 'something' };

    return expectSaga(requestLatestJobs, {flowId})
      .provide([
        [call(apiCallWithRetry, { path, opts: {method}, hidden: true}), throwError(error)],
        [call(getJobFamily)],
      ])
      .call(apiCallWithRetry, { path, opts: {method}, hidden: true})
      .not.put(
        actions.errorManager.latestFlowJobs.received({
          flowId,
          latestJobs: {},
        })
      )
      .not.call(getJobFamily)
      .not.put(actions.errorManager.latestFlowJobs.requestInProgressJobsPoll({ flowId }))
      .run();
  });
  test('should dispatch latestFlowjobs received action but not requestInProgressJobsPoll action if apiCallWithRetry api is a success but one of the getJobFamily api fails', () => {
    const error = { message: 'something' };
    const saga = expectSaga(requestLatestJobs, {flowId})
      .provide([
        [call(apiCallWithRetry, { path, opts: {method}, hidden: true}), latestFlowJobs],
        [call(getJobFamily, {flowId, jobId: 'j2'}), throwError(error)],
      ])
      .call(apiCallWithRetry, { path, opts: {method}, hidden: true})
      .put(
        actions.errorManager.latestFlowJobs.received({
          flowId,
          latestJobs: latestFlowJobs,
        })
      );

    latestFlowJobs.some(latestJob => {
      saga.call(getJobFamily, {flowId, jobId: latestJob._id});

      return latestJob._id === 'j2';
    });

    return saga.not.put(actions.errorManager.latestFlowJobs.requestInProgressJobsPoll({ flowId })).run();
  });
});

describe('cancelJob saga', () => {
  const jobId = 'j1';

  test('should call the api', () => {
    const { path, opts } = getRequestOptions(actionTypes.JOB.CANCEL, { resourceId: jobId });

    return expectSaga(cancelJob, { jobId })
      .provide([
        [call(apiCallWithRetry, {path, opts})],
      ])
      .call(apiCallWithRetry, {path, opts})
      .run();
  });
  test('should do nothing if the api call fails', () => {
    const { path, opts } = getRequestOptions(actionTypes.JOB.CANCEL, { resourceId: jobId });
    const error = { message: 'something' };

    return expectSaga(cancelJob, { jobId })
      .provide([
        [call(apiCallWithRetry, {path, opts}), throwError(error)],
      ])
      .call(apiCallWithRetry, {path, opts})
      .run();
  });
});

describe('cancelLatestJobs saga', () => {
  const flowId = 'f1';
  const jobIds = ['j1', 'j2', 'j3'];

  test('should make a cancel call for each latestjob and dispatch latestFlowJobs request action', () => {
    const saga = expectSaga(cancelLatestJobs, {flowId, jobIds}).provide([[call(cancelJob)]]);

    jobIds.map(jobId => saga.call(cancelJob, {jobId}));

    return saga.put(actions.errorManager.latestFlowJobs.request({ flowId })).run();
  });
});
