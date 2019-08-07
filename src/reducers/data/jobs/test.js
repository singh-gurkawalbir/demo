/* global describe, test, expect */
import reducer from './';
import actions from '../../../actions';
import { JOB_TYPES, JOB_STATUS } from '../../../utils/constants';
import { DEFAULT_STATE, parseJobs, DEFAULT_JOB_PROPS } from './util';

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
      {
        _id: 'fj4e1',
        type: JOB_TYPES.EXPORT,
        status: JOB_STATUS.COMPLETED,
        numError: 2,
      },
      {
        _id: 'fj4i1',
        type: JOB_TYPES.IMPORT,
        status: JOB_STATUS.COMPLETED,
        numError: 2,
        numResolved: 2,
      },
      {
        _id: 'fj4i2',
        type: JOB_TYPES.IMPORT,
        status: JOB_STATUS.FAILED,
        numError: 4,
      },
    ],
  },
  { type: JOB_TYPES.BULK_RETRY, _id: 'brj1', _integrationId },
];
const { flowJobs, bulkRetryJobs } = parseJobs(jobs);

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
  test('should return default state for job clear action', () => {
    const state = reducer(
      {
        ...DEFAULT_STATE,
        flowJobs: [{ _id: 1 }],
        bulkRetryJobs: [{ _id: 2 }],
        errors: [{ _id: 3 }],
        retryObjects: { a: 1 },
      },
      'someaction'
    );
    const newState = reducer(state, actions.job.clear());

    expect(newState).toEqual(DEFAULT_STATE);
  });
  test('should return correct state for job error clear action', () => {
    const state = reducer(
      {
        ...DEFAULT_STATE,
        flowJobs: [{ _id: 1 }],
        bulkRetryJobs: [{ _id: 2 }],
        errors: [{ _id: 3 }],
        retryObjects: { a: 1 },
      },
      'someaction'
    );
    const newState = reducer(state, actions.job.clearErrors());

    expect(newState).toEqual({
      ...DEFAULT_STATE,
      flowJobs: [{ _id: 1 }],
      bulkRetryJobs: [{ _id: 2 }],
    });
  });

  describe('should update the state properly when job collection received', () => {
    const jobsReceivedAction = actions.job.receivedCollection({
      collection: jobs,
    });

    test('should update the state properly when the current state is undefined', () => {
      const state = reducer(undefined, jobsReceivedAction);

      expect(state).toEqual({
        ...DEFAULT_STATE,
        flowJobs,
        bulkRetryJobs,
      });
    });

    test('should update the state properly when the current state is not empty', () => {
      const newState = reducer(
        {
          ...DEFAULT_STATE,
          flowJobs: [{ _id: 'something' }],
          bulkRetryJobs: [{ _id: 'something else' }],
        },
        jobsReceivedAction
      );

      expect(newState).toEqual({
        ...DEFAULT_STATE,
        flowJobs,
        bulkRetryJobs,
      });
    });
  });

  describe('should update state properly when a job family received', () => {
    test('should update the state properly when a flow job family received', () => {
      const jobsReceivedAction = actions.job.receivedCollection({
        collection: jobs,
      });
      const state = reducer(undefined, jobsReceivedAction);
      const job = flowJobs[0];
      const jobFamily = {
        ...job,
        children: [
          {
            _id: `${job._id}_e1`,
            type: JOB_TYPES.EXPORT,
          },
          {
            _id: `${job._id}_e2`,
            type: JOB_TYPES.EXPORT,
          },
          {
            _id: `${job._id}_i1`,
            type: JOB_TYPES.IMPORT,
          },
          {
            _id: `${job._id}_i2`,
            type: JOB_TYPES.IMPORT,
          },
        ],
      };
      const jobFamilyReceivedAction = actions.job.receivedFamily({
        job: jobFamily,
      });
      const newState = reducer(state, jobFamilyReceivedAction);
      const expectedFlowJobs = [...flowJobs];

      expectedFlowJobs[0] = { ...DEFAULT_JOB_PROPS, ...jobFamily };
      expectedFlowJobs[0].children = expectedFlowJobs[0].children.map(cJob => ({
        ...DEFAULT_JOB_PROPS,
        ...cJob,
      }));

      expect(newState).toEqual({
        ...state,
        flowJobs: expectedFlowJobs,
      });
    });
    test('should update the state properly when a bulk_rety job family received', () => {
      const jobsReceivedAction = actions.job.receivedCollection({
        collection: jobs,
      });
      const state = reducer(undefined, jobsReceivedAction);
      const job = bulkRetryJobs[0];
      const jobFamily = {
        ...job,
        status: JOB_STATUS.COMPLETED,
      };
      const jobFamilyReceivedAction = actions.job.receivedFamily({
        job: jobFamily,
      });
      const newState = reducer(state, jobFamilyReceivedAction);
      const expectedBulkRetryJobs = [...bulkRetryJobs];

      expectedBulkRetryJobs[0] = jobFamily;

      expect(newState).toEqual({
        ...state,
        bulkRetryJobs: expectedBulkRetryJobs,
      });
    });
  });

  describe('should update state properly for resolve all', () => {
    test('should update the state properly for integration level resolve all init', () => {
      const jobsReceivedAction = actions.job.receivedCollection({
        collection: jobs,
      });
      const state = reducer(undefined, jobsReceivedAction);
      const jobFamily = flowJobs.find(job => job._id === 'fj4');
      const jobFamilyReceivedAction = actions.job.receivedFamily({
        job: jobFamily,
      });
      const state2 = reducer(state, jobFamilyReceivedAction);
      const state3 = reducer(state2, actions.job.resolveAllInit({}));
      const expectedFlowJobs = [...flowJobs];

      ['fj3', 'fj4'].forEach(jobId => {
        const jobIndex = expectedFlowJobs.findIndex(j => j._id === jobId);

        if (jobIndex > -1) {
          let job = expectedFlowJobs[jobIndex];

          job = { ...DEFAULT_JOB_PROPS, ...job };

          job.__original = {
            numError: job.numError,
            numResolved: job.numResolved,
          };
          job.numResolved += job.numError;
          job.numError = 0;

          if (job.children) {
            job.children = job.children.map(cJob => {
              const childJob = { ...DEFAULT_JOB_PROPS, ...cJob };

              if (childJob.numError === 0) {
                return childJob;
              }

              return {
                ...childJob,
                __original: {
                  numError: childJob.numError,
                  numResolved: childJob.numResolved,
                },
                numResolved: childJob.numResolved + childJob.numError,
                numError: 0,
              };
            });
          }

          expectedFlowJobs[jobIndex] = job;
        }
      });
      expect(state3).toEqual({ ...state2, flowJobs: expectedFlowJobs });
    });
    test('should update the state properly for integration level resolve all undo', () => {
      const jobsReceivedAction = actions.job.receivedCollection({
        collection: jobs,
      });
      const state = reducer(undefined, jobsReceivedAction);
      const jobFamily = flowJobs.find(job => job._id === 'fj4');
      const jobFamilyReceivedAction = actions.job.receivedFamily({
        job: jobFamily,
      });
      const state2 = reducer(state, jobFamilyReceivedAction);
      const state3 = reducer(state2, actions.job.resolveAllInit({}));
      const state4 = reducer(state3, actions.job.resolveAllUndo({}));

      expect(state4).toEqual(state2);
    });
  });
});
