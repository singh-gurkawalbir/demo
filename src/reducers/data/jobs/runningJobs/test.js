/* global describe, test, expect */
import reducer, { selectors} from '.';
import actions from '../../../../actions';
import { JOB_TYPES, JOB_STATUS } from '../../../../utils/constants';

const DEFAULT_STATE = {};
const _integrationId = 'i1';
const jobs = [
  {
    type: JOB_TYPES.FLOW,
    _id: 'fj1',
    _integrationId,
    status: JOB_STATUS.RUNNING,
    numError: 10,
  },
  {
    _id: 'fj2',
    type: JOB_TYPES.FLOW,
    status: JOB_STATUS.QUEUED,
    _integrationId: 'i1',
  },
  {
    _id: 'fj3',
    type: JOB_TYPES.FLOW,
    status: JOB_STATUS.RUNNING,
    startedAt: '2019-08-11T10:50:00.000Z',
    _integrationId: 'i1',
    children: [
      {
        type: JOB_TYPES.EXPORT,
        status: JOB_STATUS.COMPLETED,
      },
      {
        type: JOB_TYPES.IMPORT,
        status: JOB_STATUS.COMPLETED,
      },
      {
        type: JOB_TYPES.IMPORT,
        status: JOB_STATUS.RUNNING,
      },
    ],
  },
];

describe('jobs reducer', () => {
  test('any other action should return default state', () => {
    const state = reducer(undefined, 'someaction');

    expect(state).toEqual(DEFAULT_STATE);
  });
  test('any other action, when state exists, should return original state', () => {
    const someState = { something: 'something' };
    const state = reducer(someState, 'someaction');

    expect(state).toEqual(someState);
  });
  test('should return correct state for job clear action', () => {
    const state = reducer(
      {
        runningJobs: [{ _id: 1 }],
        status: 'loading',
      },
      'someaction'
    );
    const expectedState = {runningJobs: []};
    const newState = reducer(state, actions.job.dashboard.running.clear());

    expect(newState).toEqual(expectedState);
  });

  describe('should update the state properly when job collection received', () => {
    const jobsReceivedAction = actions.job.dashboard.running.receivedCollection({
      collection: jobs,
    });

    test('should update the state properly when the current state is undefined', () => {
      const state = reducer(undefined, jobsReceivedAction);

      expect(state).toEqual({
        runningJobs: jobs,
      });
    });

    test('should update the state properly when the current state is not empty', () => {
      const newState = reducer(
        {
          runningJobs: [{ _id: 'something' }],
        },
        jobsReceivedAction
      );

      expect(newState).toEqual({
        runningJobs: jobs,
      });
    });
  });

  describe('should update the state properly when job collection requested', () => {
    const jobsRequestedAction = actions.job.dashboard.running.requestCollection();

    test('should update the state properly when the current state is undefined', () => {
      const state = reducer(undefined, jobsRequestedAction);

      expect(state).toEqual({
        status: 'loading',
      });
    });

    test('should update the state properly when the current state is not empty', () => {
      const newState = reducer(undefined,
        jobsRequestedAction
      );

      expect(newState).toEqual({
        status: 'loading',
      });
    });
  });

  describe('should update the state properly when job canceled received', () => {
    const jobsReceivedAction = actions.job.dashboard.running.receivedCollection({
      collection: jobs,
    });
    const jobsCancelAction = actions.job.dashboard.running.canceled({jobId: 'fj1'});
    const state = reducer(undefined, jobsReceivedAction);

    test('should update the state properly when the current state is undefined', () => {
      const state = reducer(undefined, jobsCancelAction);

      expect(state).toEqual({runningJobs: []});
    });

    test('should update the state properly when the current state is not empty', () => {
      const newState = reducer(state,
        jobsCancelAction
      );

      const expected = [
        {
          _id: 'fj2',
          type: JOB_TYPES.FLOW,
          status: JOB_STATUS.QUEUED,
          _integrationId: 'i1',
        },
        {
          _id: 'fj3',
          type: JOB_TYPES.FLOW,
          status: JOB_STATUS.RUNNING,
          startedAt: '2019-08-11T10:50:00.000Z',
          _integrationId: 'i1',
          children: [
            {
              type: JOB_TYPES.EXPORT,
              status: JOB_STATUS.COMPLETED,
              uiStatus: JOB_STATUS.COMPLETED,
            },
            {
              type: JOB_TYPES.IMPORT,
              status: JOB_STATUS.COMPLETED,
              uiStatus: JOB_STATUS.COMPLETED,
              percentComplete: 0,
            },
            {
              type: JOB_TYPES.IMPORT,
              status: JOB_STATUS.RUNNING,
              uiStatus: JOB_STATUS.RUNNING,
              percentComplete: 0,
            },
          ],
        },
      ];

      expect(newState).toEqual({
        runningJobs: expected,
      });
    });
  });
  describe('should update the state properly when job family action received', () => {
    const jobsReceivedAction = actions.job.dashboard.running.receivedCollection({
      collection: jobs,
    });
    const collection = [{
      _integrationId,
      status: JOB_STATUS.RUNNING,
      numError: 10,
      _id: 'fj2',
      type: JOB_TYPES.FLOW,
    }];
    const jobsReceivedFamilyAction = actions.job.dashboard.running.receivedFamily({collection});
    const state = reducer(undefined, jobsReceivedAction);

    test('should update the state properly when the current state is undefined', () => {
      const state = reducer(undefined, jobsReceivedFamilyAction);

      expect(state).toEqual({runningJobs: []});
    });

    test('should update the state properly when the current state is not empty', () => {
      const newState = reducer(state,
        jobsReceivedFamilyAction
      );

      const expected = [
        {
          type: JOB_TYPES.FLOW,
          _id: 'fj1',
          _integrationId,
          status: JOB_STATUS.RUNNING,
          numError: 10,
        },
        {
          _integrationId,
          status: JOB_STATUS.RUNNING,
          numError: 10,
          _id: 'fj2',
          type: JOB_TYPES.FLOW,
        },
        {
          _id: 'fj3',
          type: JOB_TYPES.FLOW,
          status: JOB_STATUS.RUNNING,
          startedAt: '2019-08-11T10:50:00.000Z',
          _integrationId: 'i1',
          children: [
            {
              type: JOB_TYPES.EXPORT,
              status: JOB_STATUS.COMPLETED,
              uiStatus: JOB_STATUS.COMPLETED,
            },
            {
              type: JOB_TYPES.IMPORT,
              status: JOB_STATUS.COMPLETED,
              uiStatus: JOB_STATUS.COMPLETED,
              percentComplete: 0,
            },
            {
              type: JOB_TYPES.IMPORT,
              status: JOB_STATUS.RUNNING,
              uiStatus: JOB_STATUS.RUNNING,
              percentComplete: 0,
            },
          ],
        },
      ];

      expect(newState).toEqual({
        runningJobs: expected,
      });
    });
  });

  describe('should update the state properly when job error is received', () => {
    const jobsErrorActionReceived = actions.job.dashboard.running.error();

    test('should update the state properly when the current state is undefined', () => {
      const state = reducer({}, jobsErrorActionReceived);

      expect(state).toEqual({});
    });

    test('should update the state properly when the current state is not empty', () => {
      const state = reducer({
        status: 'loading',
      }, jobsErrorActionReceived);

      expect(state).toEqual({});
    });
  });
});

describe('Running jobs selectors', () => {
  describe('RunningJobs', () => {
    test('should return correct details when state is empty', () => {
      expect(selectors.runningJobs()).toEqual({jobs: []});
    });

    describe('should return correct details when there are jobs in state', () => {
      const jobsReceivedAction = actions.job.dashboard.running.receivedCollection({
        collection: jobs,
      });
      const state = reducer(undefined, jobsReceivedAction);
      const expectedJobs = [
        {
          type: JOB_TYPES.FLOW,
          _id: 'fj1',
          _integrationId,
          status: JOB_STATUS.RUNNING,
          numError: 10,
          doneExporting: false,
          numPagesProcessed: 0,
          uiStatus: 'running',

        },
        {
          _id: 'fj2',
          type: JOB_TYPES.FLOW,
          status: JOB_STATUS.QUEUED,
          _integrationId: 'i1',
          doneExporting: false,
          numPagesProcessed: 0,
          uiStatus: 'queued',
        },
        {
          _id: 'fj3',
          type: JOB_TYPES.FLOW,
          status: JOB_STATUS.RUNNING,
          startedAt: '2019-08-11T10:50:00.000Z',
          _integrationId: 'i1',
          doneExporting: false,
          numPagesProcessed: NaN,
          uiStatus: 'running',
          children: [
            {
              type: JOB_TYPES.EXPORT,
              status: JOB_STATUS.COMPLETED,
              uiStatus: JOB_STATUS.COMPLETED,
            },
            {
              type: JOB_TYPES.IMPORT,
              status: JOB_STATUS.COMPLETED,
              uiStatus: JOB_STATUS.COMPLETED,
              percentComplete: 0,
            },
            {
              type: JOB_TYPES.IMPORT,
              status: JOB_STATUS.RUNNING,
              percentComplete: 0,
              uiStatus: JOB_STATUS.RUNNING,
            },
          ],
        },
      ];

      expect(selectors.runningJobs(state)).toEqual({jobs: expectedJobs});
    });
  });

  describe('dashboardInProgressJobIds', () => {
    test('should return empty object when state is empty or undefined', () => {
      expect(selectors.dashboardInProgressJobIds()).toEqual([]);
    });

    describe('should return correct details when there are jobs in state', () => {
      const jobsReceivedAction = actions.job.dashboard.running.receivedCollection({
        collection: jobs,
      });
      const state = reducer(undefined, jobsReceivedAction);
      const expected = ['fj1', 'fj2', 'fj3'];

      expect(selectors.dashboardInProgressJobIds(state)).toEqual(expected);
    });
  });

  describe('isRunningJobsCollectionLoading', () => {
    test('should return false when state is empty', () => {
      expect(selectors.isRunningJobsCollectionLoading()).toEqual(false);
    });

    describe('should return true when state contains status as loading', () => {
      const jobsRequestedAction = actions.job.dashboard.running.requestCollection();
      const state = reducer(undefined, jobsRequestedAction);

      expect(selectors.isRunningJobsCollectionLoading(state)).toEqual(true);
    });
  });
});

