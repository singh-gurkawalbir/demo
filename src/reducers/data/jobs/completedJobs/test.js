/* global describe, test, expect */
import reducer, { selectors} from '.';
import actions from '../../../../actions';
import { JOB_TYPES, JOB_STATUS } from '../../../../utils/constants';

const DEFAULT_STATE = {};
const _integrationId = 'i1';
const jobs = [
  {
    type: JOB_TYPES.FLOW,
    _id: 'fj2',
    _integrationId,
    status: JOB_STATUS.COMPLETED,
    numError: 0,
  },
  {
    type: JOB_TYPES.FLOW,
    _id: 'fj3',
    _integrationId,
    status: JOB_STATUS.COMPLETED,
    numError: 5,
  },
  {
    type: JOB_TYPES.FLOW,
    _id: 'fj4',
    _integrationId,
    status: JOB_STATUS.COMPLETED,
    numError: 8,
    numResolved: 2,
    children: [
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
        completedJobs: [{ _id: 1 }],
        status: 'loading',
      },
      'someaction'
    );
    const expectedState = {completedJobs: []};
    const newState = reducer(state, actions.job.dashboard.completed.clear());

    expect(newState).toEqual(expectedState);
  });

  describe('should update the state properly when job collection received', () => {
    const jobsReceivedAction = actions.job.dashboard.completed.receivedCollection({
      collection: jobs,
    });

    test('should update the state properly when the current state is undefined', () => {
      const state = reducer(undefined, jobsReceivedAction);

      expect(state).toEqual({
        completedJobs: jobs,
      });
    });

    test('should update the state properly when the current state is not empty', () => {
      const newState = reducer(
        {
          completedJobs: [{ _id: 'something' }],
        },
        jobsReceivedAction
      );

      expect(newState).toEqual({
        completedJobs: jobs,
      });
    });
  });

  describe('should update the state properly when job collection requested', () => {
    const jobsRequestedAction = actions.job.dashboard.completed.requestCollection();

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
  describe('should update the state properly when job error is received', () => {
    const jobsErrorActionReceived = actions.job.dashboard.completed.error();

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

describe('Completed jobs selectors', () => {
  describe('CompletedJobs', () => {
    test('should return correct details when state is empty', () => {
      expect(selectors.completedJobs()).toEqual({jobs: []});
    });

    describe('should return correct details when there are jobs in state', () => {
      const jobsReceivedAction = actions.job.dashboard.completed.receivedCollection({
        collection: jobs,
      });
      const state = reducer(undefined, jobsReceivedAction);

      expect(selectors.completedJobs(state)).toEqual({jobs});
    });
  });
  describe('isCompletedJobsCollectionLoading', () => {
    test('should return false when state is empty', () => {
      expect(selectors.isCompletedJobsCollectionLoading()).toEqual(false);
    });

    describe('should return false when status is loading in state', () => {
      const jobsRequestedAction = actions.job.dashboard.completed.requestCollection();
      const state = reducer(undefined, jobsRequestedAction);

      expect(selectors.isCompletedJobsCollectionLoading(state)).toEqual(true);
    });
  });
});

