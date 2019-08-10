/* global describe, test, expect */
import reducer from './';
import actions from '../../../actions';
import { JOB_TYPES, JOB_STATUS } from '../../../utils/constants';
import { DEFAULT_STATE, parseJobs, parseJobFamily } from './util';

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
        retriable: true,
      },
      {
        _id: 'fj4i2',
        type: JOB_TYPES.IMPORT,
        status: JOB_STATUS.FAILED,
        numError: 4,
        retriable: true,
        retries: [{ _id: 'something', status: JOB_STATUS.COMPLETED }],
      },
    ],
  },
  {
    type: JOB_TYPES.BULK_RETRY,
    _id: 'brj1',
    _integrationId,
    status: JOB_STATUS.COMPLETED,
  },
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

      expectedFlowJobs[0] = parseJobFamily(jobFamily);

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

  describe('should update state properly for all jobs resolve', () => {
    const jobsReceivedAction = actions.job.receivedCollection({
      collection: jobs,
    });
    const jobFamily = flowJobs.find(job => job._id === 'fj4');
    const jobFamilyReceivedAction = actions.job.receivedFamily({
      job: jobFamily,
    });

    test('should update the state properly for init', () => {
      const state = reducer(undefined, jobsReceivedAction);
      const state2 = reducer(state, jobFamilyReceivedAction);
      const state3 = reducer(state2, actions.job.resolveAllInit({}));
      const expectedFlowJobs = [...flowJobs];
      const idsOfFlowJobsWithErrors = ['fj3', 'fj4'];

      idsOfFlowJobsWithErrors.forEach(jobId => {
        const jobIndex = expectedFlowJobs.findIndex(j => j._id === jobId);

        if (jobIndex > -1) {
          const job = parseJobFamily(expectedFlowJobs[jobIndex]);

          job.__original = {
            numError: job.numError,
            numResolved: job.numResolved,
          };
          job.numResolved += job.numError;
          job.numError = 0;

          if (job.children) {
            job.children = job.children.map(cJob => {
              if (cJob.numError === 0) {
                return cJob;
              }

              return {
                ...cJob,
                __original: {
                  numError: cJob.numError,
                  numResolved: cJob.numResolved,
                },
                numResolved: cJob.numResolved + cJob.numError,
                numError: 0,
              };
            });
          }

          expectedFlowJobs[jobIndex] = job;
        }
      });
      expect(state3).toEqual({ ...state2, flowJobs: expectedFlowJobs });
    });
    test('should update the state properly for undo', () => {
      const state = reducer(undefined, jobsReceivedAction);
      const state2 = reducer(state, jobFamilyReceivedAction);
      const state3 = reducer(state2, actions.job.resolveAllInit({}));
      const state4 = reducer(state3, actions.job.resolveAllUndo({}));

      expect(state4).toEqual(state2);
    });
  });

  describe('should update state properly for a parent job (with children) resolve', () => {
    const parentJobId = 'fj4';
    const jobsReceivedAction = actions.job.receivedCollection({
      collection: jobs,
    });
    const jobFamily = flowJobs.find(job => job._id === parentJobId);
    const jobFamilyReceivedAction = actions.job.receivedFamily({
      job: jobFamily,
    });

    test('should update the state properly for init', () => {
      const state = reducer(undefined, jobsReceivedAction);
      const state2 = reducer(state, jobFamilyReceivedAction);
      const state3 = reducer(state2, actions.job.resolveInit({ parentJobId }));
      const expectedFlowJobs = [...flowJobs];
      const jobIndex = expectedFlowJobs.findIndex(j => j._id === parentJobId);
      const job = parseJobFamily(expectedFlowJobs[jobIndex]);

      job.__original = {
        numError: job.numError,
        numResolved: job.numResolved,
      };
      job.numResolved += job.numError;
      job.numError = 0;

      job.children = job.children.map(cJob => {
        if (cJob.numError === 0) {
          return cJob;
        }

        return {
          ...cJob,
          __original: {
            numError: cJob.numError,
            numResolved: cJob.numResolved,
          },
          numResolved: cJob.numResolved + cJob.numError,
          numError: 0,
        };
      });

      expectedFlowJobs[jobIndex] = job;
      expect(state3).toEqual({ ...state2, flowJobs: expectedFlowJobs });
    });

    test('should update the state properly for undo', () => {
      const state = reducer(undefined, jobsReceivedAction);
      const state2 = reducer(state, jobFamilyReceivedAction);
      const state3 = reducer(state2, actions.job.resolveInit({ parentJobId }));
      const state4 = reducer(state3, actions.job.resolveUndo({ parentJobId }));

      expect(state4).toEqual(state2);
    });
  });

  describe('should update state properly for a parent job (without children) resolve', () => {
    const jobsReceivedAction = actions.job.receivedCollection({
      collection: jobs,
    });
    const parentJobId = 'fj3';

    test('should update the state properly for init', () => {
      const state = reducer(undefined, jobsReceivedAction);
      const state2 = reducer(state, actions.job.resolveInit({ parentJobId }));
      const expectedFlowJobs = [...flowJobs];
      const jobIndex = expectedFlowJobs.findIndex(j => j._id === parentJobId);
      const job = parseJobFamily(expectedFlowJobs[jobIndex]);

      job.__original = {
        numError: job.numError,
        numResolved: job.numResolved,
      };
      job.numResolved += job.numError;
      job.numError = 0;

      expectedFlowJobs[jobIndex] = job;
      expect(state2).toEqual({ ...state, flowJobs: expectedFlowJobs });
    });

    test('should update the state properly for undo', () => {
      const state = reducer(undefined, jobsReceivedAction);
      const state2 = reducer(state, actions.job.resolveInit({ parentJobId }));
      const state3 = reducer(state2, actions.job.resolveUndo({ parentJobId }));

      expect(state3).toEqual(state);
    });
  });

  describe('should update state properly for a child job resolve', () => {
    const jobsReceivedAction = actions.job.receivedCollection({
      collection: jobs,
    });
    const parentJobId = 'fj4';
    const childJobId = 'fj4i2';
    const jobFamily = flowJobs.find(job => job._id === parentJobId);
    const jobFamilyReceivedAction = actions.job.receivedFamily({
      job: jobFamily,
    });

    test('should update the state properly for init', () => {
      const state = reducer(undefined, jobsReceivedAction);
      const state2 = reducer(state, jobFamilyReceivedAction);
      const state3 = reducer(
        state2,
        actions.job.resolveInit({ parentJobId, childJobId })
      );
      const expectedFlowJobs = [...state2.flowJobs];
      const parentJobIndex = expectedFlowJobs.findIndex(
        j => j._id === parentJobId
      );
      let parentJob = parseJobFamily({
        ...expectedFlowJobs[parentJobIndex],
      });
      const childJobIndex = parentJob.children.findIndex(
        cj => cj._id === childJobId
      );
      const childJob = {
        ...parentJob.children[childJobIndex],
      };

      parentJob.children[childJobIndex] = {
        ...childJob,
        __original: {
          numError: childJob.numError,
          numResolved: childJob.numResolved,
        },
        numResolved: childJob.numResolved + childJob.numError,
        numError: 0,
      };

      parentJob = {
        ...parentJob,
        __original: {
          numError: parentJob.numError,
          numResolved: parentJob.numResolved,
        },
        numResolved: parentJob.numResolved + childJob.numError,
        numError: parentJob.numError - childJob.numError,
      };

      expectedFlowJobs[parentJobIndex] = parentJob;
      expect(state3).toEqual({ ...state2, flowJobs: expectedFlowJobs });
    });

    test('should update the state properly for undo', () => {
      const state = reducer(undefined, jobsReceivedAction);
      const state2 = reducer(state, jobFamilyReceivedAction);
      const state3 = reducer(
        state2,
        actions.job.resolveInit({ parentJobId, childJobId })
      );
      const state4 = reducer(
        state3,
        actions.job.resolveUndo({ parentJobId, childJobId })
      );

      expect(state4).toEqual(state2);
    });
  });

  describe('should update state properly for all jobs retry', () => {
    const jobsReceivedAction = actions.job.receivedCollection({
      collection: jobs,
    });
    const jobFamily = flowJobs.find(job => job._id === 'fj4');
    const jobFamilyReceivedAction = actions.job.receivedFamily({
      job: jobFamily,
    });

    test('should update the state properly for init', () => {
      const state = reducer(undefined, jobsReceivedAction);
      const state2 = reducer(state, jobFamilyReceivedAction);
      const state3 = reducer(state2, actions.job.retryAllInit());
      const expectedBulkRetryJobs = [
        { type: 'bulk_retry', status: JOB_STATUS.QUEUED },
        ...bulkRetryJobs,
      ];

      expect(state3).toEqual({
        ...state2,
        bulkRetryJobs: expectedBulkRetryJobs,
      });
    });

    test('should update the state properly for undo', () => {
      const state = reducer(undefined, jobsReceivedAction);
      const state2 = reducer(state, jobFamilyReceivedAction);
      const state3 = reducer(state2, actions.job.retryAllInit());
      const state4 = reducer(state3, actions.job.retryAllUndo());

      expect(state4).toEqual(state2);
    });
  });

  describe('should update state properly for a parent job (with children) retry', () => {
    const parentJobId = 'fj4';
    const jobsReceivedAction = actions.job.receivedCollection({
      collection: jobs,
    });
    const jobFamily = flowJobs.find(job => job._id === parentJobId);
    const jobFamilyReceivedAction = actions.job.receivedFamily({
      job: jobFamily,
    });

    test('should update the state properly for init', () => {
      const state = reducer(undefined, jobsReceivedAction);
      const state2 = reducer(state, jobFamilyReceivedAction);
      const state3 = reducer(state2, actions.job.retryInit({ parentJobId }));
      const expectedFlowJobs = [...flowJobs];
      const jobIndex = expectedFlowJobs.findIndex(j => j._id === parentJobId);
      const job = parseJobFamily(expectedFlowJobs[jobIndex]);

      job.children = job.children.map(cJob => {
        if (!cJob.retriable) {
          return cJob;
        }

        return {
          ...cJob,
          retries: [...(cJob.retries || []), { type: JOB_TYPES.RETRY }],
        };
      });

      expectedFlowJobs[jobIndex] = job;
      expect(state3).toEqual({ ...state2, flowJobs: expectedFlowJobs });
    });

    test('should update the state properly for undo', () => {
      const state = reducer(undefined, jobsReceivedAction);
      const state2 = reducer(state, jobFamilyReceivedAction);
      const state3 = reducer(state2, actions.job.retryInit({ parentJobId }));
      const state4 = reducer(state3, actions.job.retryUndo({ parentJobId }));

      expect(state4).toEqual(state2);
    });
  });

  describe('should update state properly for a child job retry', () => {
    const parentJobId = 'fj4';
    const childJobId = 'fj4i1';
    const jobsReceivedAction = actions.job.receivedCollection({
      collection: jobs,
    });
    const jobFamily = flowJobs.find(job => job._id === parentJobId);
    const jobFamilyReceivedAction = actions.job.receivedFamily({
      job: jobFamily,
    });

    test('should update the state properly for init', () => {
      const state = reducer(undefined, jobsReceivedAction);
      const state2 = reducer(state, jobFamilyReceivedAction);
      const state3 = reducer(
        state2,
        actions.job.retryInit({ parentJobId, childJobId })
      );
      const expectedFlowJobs = [...flowJobs];
      const parentJobIndex = expectedFlowJobs.findIndex(
        j => j._id === parentJobId
      );
      const parentJob = parseJobFamily({
        ...expectedFlowJobs[parentJobIndex],
      });
      const childJobIndex = parentJob.children.findIndex(
        cj => cj._id === childJobId
      );
      const childJob = {
        ...parentJob.children[childJobIndex],
      };

      parentJob.children[childJobIndex] = {
        ...childJob,
        retries: [...(childJob.retries || []), { type: JOB_TYPES.RETRY }],
      };

      expectedFlowJobs[parentJobIndex] = parentJob;
      expect(state3).toEqual({ ...state2, flowJobs: expectedFlowJobs });
    });

    test('should update the state properly for undo', () => {
      const state = reducer(undefined, jobsReceivedAction);
      const state2 = reducer(state, jobFamilyReceivedAction);
      const state3 = reducer(
        state2,
        actions.job.retryInit({ parentJobId, childJobId })
      );
      const state4 = reducer(
        state3,
        actions.job.retryUndo({ parentJobId, childJobId })
      );

      expect(state4).toEqual(state2);
    });
  });

  test('should update state properly when a job error collection received', () => {
    const state = reducer(
      undefined,
      actions.job.receivedCollection({
        collection: jobs,
      })
    );
    const state2 = reducer(
      state,
      actions.job.receivedRetryObjects({
        collection: [
          {
            _id: 'ro1',
            something: 'something else',
          },
          {
            _id: 'ro2',
            somethingElse: 'something',
          },
        ],
        jobId: 'something',
      })
    );
    const errors = [
      {
        source: 's1',
        code: 'c1',
        message: 'something',
      },
      {
        source: 's1',
        code: 'c2',
        message: 'something else',
      },
    ];
    const state3 = reducer(
      state2,
      actions.job.receivedErrors({
        collection: errors,
        jobId: 'something',
      })
    );
    const expectedErrors = [];

    state3.errors.forEach((e, i) => {
      expectedErrors.push({
        _id: e._id,
        ...errors[i],
      });
    });
    expect(state3).toEqual({ ...state2, errors: expectedErrors });
  });

  test('should update state properly for a job selected errors resolve init', () => {
    const errors = [
      {
        source: 's1',
        code: 'c1',
        message: 'something',
      },
      {
        source: 's1',
        code: 'c2',
        message: 'something else',
        resolved: false,
      },
      {
        source: 's2',
        code: 'c1',
        message: 'something else',
      },
    ];
    const state = reducer(
      { ...DEFAULT_STATE },
      actions.job.receivedErrors({
        collection: errors,
        jobId: 'something',
      })
    );
    const expectedErrors = [];
    const selectedErrorIds = [];

    state.errors.forEach((e, i) => {
      expectedErrors.push({
        _id: e._id,
        ...errors[i],
      });

      if (i % 2 === 0) {
        selectedErrorIds.push(e._id);
        expectedErrors[i].resolved = true;
      }
    });
    const state2 = reducer(
      state,
      actions.job.resolveSelectedErrorsInit({
        selectedErrorIds,
      })
    );

    expect(state2).toEqual({ ...state, errors: expectedErrors });
  });

  test('should update state properly when a job retry object collection received', () => {
    const jobsReceivedAction = actions.job.receivedCollection({
      collection: jobs,
    });
    const state1 = reducer(undefined, jobsReceivedAction);
    const state2 = reducer(
      state1,
      actions.job.receivedErrors({
        collection: [
          {
            source: 's1',
            code: 'c1',
            message: 'something',
          },
          {
            source: 's1',
            code: 'c2',
            message: 'something else',
          },
        ],
        jobId: 'something',
      })
    );
    const retryObjectCollection = [
      {
        _id: 'ro1',
        something: 'something else',
      },
      {
        _id: 'ro2',
        somethingElse: 'something',
      },
    ];
    const state3 = reducer(
      state2,
      actions.job.receivedRetryObjects({
        collection: retryObjectCollection,
        jobId: 'something',
      })
    );
    const expectedRetryObjects = {};

    retryObjectCollection.forEach(ro => {
      expectedRetryObjects[ro._id] = ro;
    });

    expect(state3).toEqual({ ...state2, retryObjects: expectedRetryObjects });
  });

  test('should update state properly when a retry object data received', () => {
    const retryObjectCollection = [
      {
        _id: 'ro1',
        something: 'something else',
      },
      {
        _id: 'ro2',
        somethingElse: 'something',
      },
    ];
    const state = reducer(
      { ...DEFAULT_STATE },
      actions.job.receivedRetryObjects({
        collection: retryObjectCollection,
        jobId: 'something',
      })
    );
    const retryObjectId = 'ro2';
    const retryObjectData = { some: 'thing', else: 'something' };
    const state2 = reducer(
      state,
      actions.job.receivedRetryData({
        retryId: retryObjectId,
        retryData: retryObjectData,
      })
    );
    const expectedRetryObjects = {};

    retryObjectCollection.forEach(ro => {
      expectedRetryObjects[ro._id] = ro;
    });

    expectedRetryObjects[retryObjectId].retryData = retryObjectData;

    expect(state2).toEqual({ ...state, retryObjects: expectedRetryObjects });
  });
});
