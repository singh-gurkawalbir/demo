/* global describe, test, expect */
import reducer, * as selectors from './';
import actions from '../../../actions';
import { JOB_TYPES, JOB_STATUS } from '../../../utils/constants';
import { DEFAULT_STATE, parseJobs, parseJobFamily } from './util';

describe('jobs reducer', () => {
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

describe('flowJobList selector', () => {
  test('should return correct results when state is empty', () => {
    const state = reducer(undefined, 'some action');

    expect(selectors.flowJobList(state)).toEqual([]);
  });

  test('should return correct results when there are no bulk retry jobs', () => {
    const jobs = [
      {
        _id: 'j1',
        type: JOB_TYPES.FLOW,
        status: JOB_STATUS.QUEUED,
      },
      {
        _id: 'j2',
        type: JOB_TYPES.FLOW,
        status: JOB_STATUS.RUNNING,
        startedAt: '2019-08-11T10:50:00.000Z',
        numError: 1,
        numIgnore: 2,
        numPagesGenerated: 10,
        numResolved: 0,
        numSuccess: 20,
      },
      {
        _id: 'j3',
        type: JOB_TYPES.FLOW,
        status: JOB_STATUS.COMPLETED,
        startedAt: '2019-08-11T09:34:00.000Z',
        endedAt: '2019-08-11T09:51:00.000Z',
        numPagesGenerated: 10,
      },
      {
        _id: 'j4',
        type: JOB_TYPES.FLOW,
        status: JOB_STATUS.COMPLETED,
        startedAt: '2019-08-11T09:14:00.000Z',
        endedAt: '2019-08-11T09:19:00.000Z',
        doneExporting: true,
      },
      {
        _id: 'j5',
        type: JOB_TYPES.FLOW,
        status: JOB_STATUS.CANCELED,
        startedAt: '2019-08-11T08:14:00.000Z',
        endedAt: '2019-08-11T08:20:00.000Z',
        numError: 1,
        numIgnore: 2,
        numPagesGenerated: 10,
        numResolved: 5,
        numSuccess: 20,
      },
    ];
    const jobsReceivedAction = actions.job.receivedCollection({
      collection: jobs,
    });
    const state = reducer(undefined, jobsReceivedAction);
    const jobFamilyJ3 = {
      _id: 'j3',
      type: JOB_TYPES.FLOW,
      status: JOB_STATUS.COMPLETED,
      startedAt: '2019-08-11T09:34:00.000Z',
      endedAt: '2019-08-11T09:51:00.000Z',
      numPagesGenerated: 10,
      children: [
        {
          type: JOB_TYPES.EXPORT,
          status: JOB_STATUS.COMPLETED,
          startedAt: '2019-08-11T09:34:10.000Z',
          endedAt: '2019-08-11T09:40:00.000Z',
        },
        {
          type: JOB_TYPES.IMPORT,
          status: JOB_STATUS.COMPLETED,
          startedAt: '2019-08-11T09:34:15.000Z',
          endedAt: '2019-08-11T09:41:00.000Z',
          numPagesProcessed: 7,
          retriable: true,
          retries: [
            {
              status: JOB_STATUS.QUEUED,
            },
          ],
        },
      ],
    };
    const jobFamilyJ3ReceivedAction = actions.job.receivedFamily({
      job: jobFamilyJ3,
    });
    const state2 = reducer(state, jobFamilyJ3ReceivedAction);
    const jobFamilyJ5 = {
      _id: 'j5',
      type: JOB_TYPES.FLOW,
      status: JOB_STATUS.CANCELED,
      startedAt: '2019-08-11T08:14:00.000Z',
      endedAt: '2019-08-11T08:20:00.000Z',
      numError: 1,
      numIgnore: 2,
      numPagesGenerated: 10,
      numResolved: 5,
      numSuccess: 20,
      children: [
        {
          type: JOB_TYPES.EXPORT,
          status: JOB_STATUS.COMPLETED,
        },
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
          status: JOB_STATUS.CANCELED,
        },
      ],
    };
    const jobFamilyJ5ReceivedAction = actions.job.receivedFamily({
      job: jobFamilyJ5,
    });
    const state3 = reducer(state2, jobFamilyJ5ReceivedAction);
    const jobFamilyJ2 = {
      _id: 'j2',
      type: JOB_TYPES.FLOW,
      status: JOB_STATUS.RUNNING,
      startedAt: '2019-08-11T10:50:00.000Z',
      numError: 1,
      numIgnore: 2,
      numPagesGenerated: 10,
      numResolved: 0,
      numSuccess: 20,
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
    };
    const jobFamilyJ2ReceivedAction = actions.job.receivedFamily({
      job: jobFamilyJ2,
    });
    const state4 = reducer(state3, jobFamilyJ2ReceivedAction);

    expect(selectors.flowJobList(state4)).toEqual([
      {
        _id: 'j1',
        type: JOB_TYPES.FLOW,
        status: JOB_STATUS.QUEUED,

        duration: undefined,
        doneExporting: false,
        numError: 0,
        numIgnore: 0,
        numPagesGenerated: 0,
        numPagesProcessed: 0,
        numResolved: 0,
        numSuccess: 0,
        uiStatus: JOB_STATUS.QUEUED,
      },
      {
        _id: 'j2',
        type: JOB_TYPES.FLOW,
        status: JOB_STATUS.RUNNING,
        startedAt: '2019-08-11T10:50:00.000Z',

        duration: undefined,
        doneExporting: false,
        numError: 1,
        numIgnore: 2,
        numPagesGenerated: 10,
        numResolved: 0,
        numSuccess: 20,
        numPagesProcessed: 0,
        uiStatus: JOB_STATUS.RUNNING,
        children: [
          {
            type: JOB_TYPES.EXPORT,
            status: JOB_STATUS.COMPLETED,

            duration: undefined,
            numError: 0,
            numIgnore: 0,
            numPagesGenerated: 0,
            numResolved: 0,
            numSuccess: 0,
            numPagesProcessed: 0,
            uiStatus: JOB_STATUS.COMPLETED,
          },
          {
            type: JOB_TYPES.IMPORT,
            status: JOB_STATUS.COMPLETED,
            duration: undefined,
            numError: 0,
            numIgnore: 0,
            numPagesGenerated: 0,
            numResolved: 0,
            numSuccess: 0,
            numPagesProcessed: 0,
            uiStatus: JOB_STATUS.COMPLETED,
            percentComplete: 0,
          },
          {
            type: JOB_TYPES.IMPORT,
            status: JOB_STATUS.RUNNING,
            duration: undefined,
            numError: 0,
            numIgnore: 0,
            numPagesGenerated: 0,
            numResolved: 0,
            numSuccess: 0,
            numPagesProcessed: 0,
            uiStatus: JOB_STATUS.RUNNING,
            percentComplete: 0,
          },
        ],
      },
      {
        _id: 'j3',
        type: JOB_TYPES.FLOW,
        status: JOB_STATUS.COMPLETED,
        startedAt: '2019-08-11T09:34:00.000Z',
        endedAt: '2019-08-11T09:51:00.000Z',

        duration: '00:17:00',
        doneExporting: true,
        numError: 0,
        numIgnore: 0,
        numResolved: 0,
        numSuccess: 0,
        uiStatus: JOB_STATUS.RETRYING,
        numPagesGenerated: 10,
        numPagesProcessed: 7,
        retriable: true,
        children: [
          {
            type: JOB_TYPES.EXPORT,
            status: JOB_STATUS.COMPLETED,
            startedAt: '2019-08-11T09:34:10.000Z',
            endedAt: '2019-08-11T09:40:00.000Z',

            duration: '00:05:50',
            numError: 0,
            numIgnore: 0,
            numResolved: 0,
            numSuccess: 0,
            uiStatus: JOB_STATUS.COMPLETED,
            numPagesGenerated: 0,
            numPagesProcessed: 0,
          },
          {
            type: JOB_TYPES.IMPORT,
            status: JOB_STATUS.COMPLETED,
            startedAt: '2019-08-11T09:34:15.000Z',
            endedAt: '2019-08-11T09:41:00.000Z',
            numPagesProcessed: 7,

            duration: '00:06:45',
            numError: 0,
            numIgnore: 0,
            numResolved: 0,
            numSuccess: 0,
            uiStatus: JOB_STATUS.RETRYING,
            numPagesGenerated: 0,
            percentComplete: 70,
            retriable: true,

            retries: [
              {
                status: JOB_STATUS.QUEUED,
              },
            ],
          },
        ],
      },
      {
        _id: 'j4',
        type: JOB_TYPES.FLOW,
        status: JOB_STATUS.COMPLETED,
        startedAt: '2019-08-11T09:14:00.000Z',
        endedAt: '2019-08-11T09:19:00.000Z',

        duration: '00:05:00',
        doneExporting: true,
        numError: 0,
        numIgnore: 0,
        numPagesGenerated: 0,
        numPagesProcessed: 0,
        numResolved: 0,
        numSuccess: 0,
        uiStatus: JOB_STATUS.COMPLETED,
      },
      {
        _id: 'j5',
        type: JOB_TYPES.FLOW,
        status: JOB_STATUS.CANCELED,
        startedAt: '2019-08-11T08:14:00.000Z',
        endedAt: '2019-08-11T08:20:00.000Z',
        numError: 1,
        numIgnore: 2,
        numPagesGenerated: 10,
        numPagesProcessed: 0,
        numResolved: 5,
        numSuccess: 20,

        duration: '00:06:00',
        doneExporting: true,
        uiStatus: JOB_STATUS.CANCELED,
        children: [
          {
            type: JOB_TYPES.EXPORT,
            status: JOB_STATUS.COMPLETED,
            duration: undefined,
            numError: 0,
            numIgnore: 0,
            numPagesGenerated: 0,
            numPagesProcessed: 0,
            numResolved: 0,
            numSuccess: 0,
            uiStatus: JOB_STATUS.COMPLETED,
          },
          {
            type: JOB_TYPES.EXPORT,
            status: JOB_STATUS.COMPLETED,
            duration: undefined,
            numError: 0,
            numIgnore: 0,
            numPagesGenerated: 0,
            numPagesProcessed: 0,
            numResolved: 0,
            numSuccess: 0,
            uiStatus: JOB_STATUS.COMPLETED,
          },
          {
            type: JOB_TYPES.IMPORT,
            status: JOB_STATUS.COMPLETED,
            duration: undefined,
            numError: 0,
            numIgnore: 0,
            numPagesGenerated: 0,
            numPagesProcessed: 0,
            numResolved: 0,
            numSuccess: 0,
            percentComplete: 0,
            uiStatus: JOB_STATUS.COMPLETED,
          },
          {
            type: JOB_TYPES.IMPORT,
            status: JOB_STATUS.CANCELED,
            duration: undefined,
            numError: 0,
            numIgnore: 0,
            numPagesGenerated: 0,
            numPagesProcessed: 0,
            numResolved: 0,
            numSuccess: 0,
            percentComplete: 0,
            uiStatus: JOB_STATUS.CANCELED,
          },
        ],
      },
    ]);
  });

  describe('flowJobList selector when there are integration level bulk retries', () => {
    test('should return correct results when there are no bulk retry jobs in queued state', () => {
      const jobs = [
        {
          _id: 'j1',
          type: JOB_TYPES.FLOW,
          status: JOB_STATUS.QUEUED,
          _integrationId: 'i1',
        },
        {
          _id: 'j2',
          type: JOB_TYPES.FLOW,
          status: JOB_STATUS.RUNNING,
          startedAt: '2019-08-11T10:50:00.000Z',
          _integrationId: 'i1',
        },
        {
          _id: 'j3',
          type: JOB_TYPES.FLOW,
          status: JOB_STATUS.COMPLETED,
          startedAt: '2019-08-11T09:34:00.000Z',
          endedAt: '2019-08-11T09:51:00.000Z',
          numPagesGenerated: 10,
          _integrationId: 'i1',
        },
        {
          _id: 'j4',
          type: JOB_TYPES.FLOW,
          status: JOB_STATUS.COMPLETED,
          startedAt: '2019-08-11T09:14:00.000Z',
          endedAt: '2019-08-11T09:19:00.000Z',
          doneExporting: true,
          _integrationId: 'i1',
        },
        {
          _id: 'j5',
          type: JOB_TYPES.FLOW,
          status: JOB_STATUS.CANCELED,
          startedAt: '2019-08-11T08:14:00.000Z',
          endedAt: '2019-08-11T08:20:00.000Z',
          numError: 1,
          numIgnore: 2,
          numPagesGenerated: 10,
          numResolved: 5,
          numSuccess: 20,
          _integrationId: 'i1',
        },
        {
          _id: 'brj1',
          type: JOB_TYPES.BULK_RETRY,
          status: JOB_STATUS.RUNNING,
          _integrationId: 'i1',
        },
        {
          _id: 'brj2',
          type: JOB_TYPES.BULK_RETRY,
          status: JOB_STATUS.CANCELED,
          _integrationId: 'i1',
        },
        {
          _id: 'brj3',
          type: JOB_TYPES.BULK_RETRY,
          status: JOB_STATUS.COMPLETED,
          _integrationId: 'i1',
        },
      ];
      const jobsReceivedAction = actions.job.receivedCollection({
        collection: jobs,
      });
      const state = reducer(undefined, jobsReceivedAction);
      const jobFamilyJ3 = {
        _id: 'j3',
        type: JOB_TYPES.FLOW,
        status: JOB_STATUS.COMPLETED,
        startedAt: '2019-08-11T09:34:00.000Z',
        endedAt: '2019-08-11T09:51:00.000Z',
        numPagesGenerated: 10,
        _integrationId: 'i1',
        children: [
          {
            type: JOB_TYPES.EXPORT,
            status: JOB_STATUS.COMPLETED,
            startedAt: '2019-08-11T09:34:10.000Z',
            endedAt: '2019-08-11T09:40:00.000Z',
          },
          {
            type: JOB_TYPES.IMPORT,
            status: JOB_STATUS.COMPLETED,
            startedAt: '2019-08-11T09:34:15.000Z',
            endedAt: '2019-08-11T09:41:00.000Z',
            numPagesProcessed: 7,
            retriable: true,
            retries: [
              {
                status: JOB_STATUS.QUEUED,
              },
            ],
          },
        ],
      };
      const jobFamilyJ3ReceivedAction = actions.job.receivedFamily({
        job: jobFamilyJ3,
      });
      const state2 = reducer(state, jobFamilyJ3ReceivedAction);
      const jobFamilyJ5 = {
        _id: 'j5',
        type: JOB_TYPES.FLOW,
        status: JOB_STATUS.CANCELED,
        startedAt: '2019-08-11T08:14:00.000Z',
        endedAt: '2019-08-11T08:20:00.000Z',
        numError: 1,
        numIgnore: 2,
        numPagesGenerated: 10,
        numResolved: 5,
        numSuccess: 20,
        _integrationId: 'i1',
        children: [
          {
            type: JOB_TYPES.EXPORT,
            status: JOB_STATUS.COMPLETED,
          },
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
            status: JOB_STATUS.CANCELED,
          },
        ],
      };
      const jobFamilyJ5ReceivedAction = actions.job.receivedFamily({
        job: jobFamilyJ5,
      });
      const state3 = reducer(state2, jobFamilyJ5ReceivedAction);
      const jobFamilyJ2 = {
        _id: 'j2',
        type: JOB_TYPES.FLOW,
        status: JOB_STATUS.RUNNING,
        startedAt: '2019-08-11T10:50:00.000Z',
        numError: 1,
        numIgnore: 2,
        numPagesGenerated: 10,
        numResolved: 0,
        numSuccess: 20,
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
      };
      const jobFamilyJ2ReceivedAction = actions.job.receivedFamily({
        job: jobFamilyJ2,
      });
      const state4 = reducer(state3, jobFamilyJ2ReceivedAction);

      expect(selectors.flowJobList(state4)).toEqual([
        {
          _id: 'j1',
          type: JOB_TYPES.FLOW,
          status: JOB_STATUS.QUEUED,
          _integrationId: 'i1',
          duration: undefined,
          doneExporting: false,
          numError: 0,
          numIgnore: 0,
          numPagesGenerated: 0,
          numPagesProcessed: 0,
          numResolved: 0,
          numSuccess: 0,
          uiStatus: JOB_STATUS.QUEUED,
        },
        {
          _id: 'j2',
          type: JOB_TYPES.FLOW,
          status: JOB_STATUS.RUNNING,
          startedAt: '2019-08-11T10:50:00.000Z',
          _integrationId: 'i1',
          duration: undefined,
          doneExporting: false,
          numError: 1,
          numIgnore: 2,
          numPagesGenerated: 10,
          numResolved: 0,
          numSuccess: 20,
          numPagesProcessed: 0,
          uiStatus: JOB_STATUS.RUNNING,
          children: [
            {
              type: JOB_TYPES.EXPORT,
              status: JOB_STATUS.COMPLETED,
              duration: undefined,
              numError: 0,
              numIgnore: 0,
              numPagesGenerated: 0,
              numResolved: 0,
              numSuccess: 0,
              numPagesProcessed: 0,
              uiStatus: JOB_STATUS.COMPLETED,
            },
            {
              type: JOB_TYPES.IMPORT,
              status: JOB_STATUS.COMPLETED,
              duration: undefined,
              numError: 0,
              numIgnore: 0,
              numPagesGenerated: 0,
              numResolved: 0,
              numSuccess: 0,
              numPagesProcessed: 0,
              uiStatus: JOB_STATUS.COMPLETED,
              percentComplete: 0,
            },
            {
              type: JOB_TYPES.IMPORT,
              status: JOB_STATUS.RUNNING,
              duration: undefined,
              numError: 0,
              numIgnore: 0,
              numPagesGenerated: 0,
              numResolved: 0,
              numSuccess: 0,
              numPagesProcessed: 0,
              uiStatus: JOB_STATUS.RUNNING,
              percentComplete: 0,
            },
          ],
        },
        {
          _id: 'j3',
          type: JOB_TYPES.FLOW,
          status: JOB_STATUS.COMPLETED,
          startedAt: '2019-08-11T09:34:00.000Z',
          endedAt: '2019-08-11T09:51:00.000Z',
          duration: '00:17:00',
          doneExporting: true,
          numError: 0,
          numIgnore: 0,
          numResolved: 0,
          numSuccess: 0,
          uiStatus: JOB_STATUS.RETRYING,
          numPagesGenerated: 10,
          numPagesProcessed: 7,
          retriable: true,
          _integrationId: 'i1',
          children: [
            {
              type: JOB_TYPES.EXPORT,
              status: JOB_STATUS.COMPLETED,
              startedAt: '2019-08-11T09:34:10.000Z',
              endedAt: '2019-08-11T09:40:00.000Z',
              duration: '00:05:50',
              numError: 0,
              numIgnore: 0,
              numResolved: 0,
              numSuccess: 0,
              uiStatus: JOB_STATUS.COMPLETED,
              numPagesGenerated: 0,
              numPagesProcessed: 0,
            },
            {
              type: JOB_TYPES.IMPORT,
              status: JOB_STATUS.COMPLETED,
              startedAt: '2019-08-11T09:34:15.000Z',
              endedAt: '2019-08-11T09:41:00.000Z',
              numPagesProcessed: 7,
              duration: '00:06:45',
              numError: 0,
              numIgnore: 0,
              numResolved: 0,
              numSuccess: 0,
              uiStatus: JOB_STATUS.RETRYING,
              numPagesGenerated: 0,
              percentComplete: 70,
              retriable: true,
              retries: [
                {
                  status: JOB_STATUS.QUEUED,
                },
              ],
            },
          ],
        },
        {
          _id: 'j4',
          type: JOB_TYPES.FLOW,
          status: JOB_STATUS.COMPLETED,
          startedAt: '2019-08-11T09:14:00.000Z',
          endedAt: '2019-08-11T09:19:00.000Z',
          _integrationId: 'i1',
          duration: '00:05:00',
          doneExporting: true,
          numError: 0,
          numIgnore: 0,
          numPagesGenerated: 0,
          numPagesProcessed: 0,
          numResolved: 0,
          numSuccess: 0,
          uiStatus: JOB_STATUS.COMPLETED,
        },
        {
          _id: 'j5',
          type: JOB_TYPES.FLOW,
          status: JOB_STATUS.CANCELED,
          startedAt: '2019-08-11T08:14:00.000Z',
          endedAt: '2019-08-11T08:20:00.000Z',
          numError: 1,
          numIgnore: 2,
          numPagesGenerated: 10,
          numPagesProcessed: 0,
          numResolved: 5,
          numSuccess: 20,
          _integrationId: 'i1',
          duration: '00:06:00',
          doneExporting: true,
          uiStatus: JOB_STATUS.CANCELED,
          children: [
            {
              type: JOB_TYPES.EXPORT,
              status: JOB_STATUS.COMPLETED,
              duration: undefined,
              numError: 0,
              numIgnore: 0,
              numPagesGenerated: 0,
              numPagesProcessed: 0,
              numResolved: 0,
              numSuccess: 0,
              uiStatus: JOB_STATUS.COMPLETED,
            },
            {
              type: JOB_TYPES.EXPORT,
              status: JOB_STATUS.COMPLETED,
              duration: undefined,
              numError: 0,
              numIgnore: 0,
              numPagesGenerated: 0,
              numPagesProcessed: 0,
              numResolved: 0,
              numSuccess: 0,
              uiStatus: JOB_STATUS.COMPLETED,
            },
            {
              type: JOB_TYPES.IMPORT,
              status: JOB_STATUS.COMPLETED,
              duration: undefined,
              numError: 0,
              numIgnore: 0,
              numPagesGenerated: 0,
              numPagesProcessed: 0,
              numResolved: 0,
              numSuccess: 0,
              percentComplete: 0,
              uiStatus: JOB_STATUS.COMPLETED,
            },
            {
              type: JOB_TYPES.IMPORT,
              status: JOB_STATUS.CANCELED,
              duration: undefined,
              numError: 0,
              numIgnore: 0,
              numPagesGenerated: 0,
              numPagesProcessed: 0,
              numResolved: 0,
              numSuccess: 0,
              percentComplete: 0,
              uiStatus: JOB_STATUS.CANCELED,
            },
          ],
        },
      ]);
    });

    test('should return correct results when there are bulk retry jobs in queued state', () => {
      const jobs = [
        {
          _id: 'j1',
          type: JOB_TYPES.FLOW,
          status: JOB_STATUS.QUEUED,
          _integrationId: 'i1',
        },
        {
          _id: 'j2',
          type: JOB_TYPES.FLOW,
          status: JOB_STATUS.RUNNING,
          startedAt: '2019-08-11T10:50:00.000Z',
          numError: 1,
          numIgnore: 2,
          numPagesGenerated: 10,
          numResolved: 0,
          numSuccess: 20,
          _integrationId: 'i1',
        },
        {
          _id: 'j3',
          type: JOB_TYPES.FLOW,
          status: JOB_STATUS.COMPLETED,
          startedAt: '2019-08-11T09:34:00.000Z',
          endedAt: '2019-08-11T09:51:00.000Z',
          numPagesGenerated: 10,
          numError: 5,
          _integrationId: 'i1',
        },
        {
          _id: 'j4',
          type: JOB_TYPES.FLOW,
          status: JOB_STATUS.COMPLETED,
          startedAt: '2019-08-11T09:14:00.000Z',
          endedAt: '2019-08-11T09:19:00.000Z',
          doneExporting: true,
          _integrationId: 'i1',
        },
        {
          _id: 'j5',
          type: JOB_TYPES.FLOW,
          status: JOB_STATUS.CANCELED,
          startedAt: '2019-08-11T08:14:00.000Z',
          endedAt: '2019-08-11T08:20:00.000Z',
          numError: 1,
          numIgnore: 2,
          numPagesGenerated: 10,
          numResolved: 5,
          numSuccess: 20,
          _integrationId: 'i1',
        },
        {
          _id: 'brj1',
          type: JOB_TYPES.BULK_RETRY,
          status: JOB_STATUS.QUEUED,
          _integrationId: 'i1',
        },
        {
          _id: 'brj2',
          type: JOB_TYPES.BULK_RETRY,
          status: JOB_STATUS.CANCELED,
          _integrationId: 'i1',
        },
        {
          _id: 'brj3',
          type: JOB_TYPES.BULK_RETRY,
          status: JOB_STATUS.COMPLETED,
          _integrationId: 'i1',
        },
      ];
      const jobsReceivedAction = actions.job.receivedCollection({
        collection: jobs,
      });
      const state = reducer(undefined, jobsReceivedAction);
      const jobFamilyJ3 = {
        _id: 'j3',
        type: JOB_TYPES.FLOW,
        status: JOB_STATUS.COMPLETED,
        startedAt: '2019-08-11T09:34:00.000Z',
        endedAt: '2019-08-11T09:51:00.000Z',
        numPagesGenerated: 10,
        numError: 5,
        _integrationId: 'i1',
        children: [
          {
            type: JOB_TYPES.EXPORT,
            status: JOB_STATUS.COMPLETED,
            startedAt: '2019-08-11T09:34:10.000Z',
            endedAt: '2019-08-11T09:40:00.000Z',
          },
          {
            type: JOB_TYPES.IMPORT,
            status: JOB_STATUS.COMPLETED,
            startedAt: '2019-08-11T09:34:15.000Z',
            endedAt: '2019-08-11T09:41:00.000Z',
            numPagesProcessed: 7,
            numError: 5,
            retriable: true,
            retries: [
              {
                status: JOB_STATUS.COMPLETED,
              },
            ],
          },
        ],
      };
      const jobFamilyJ3ReceivedAction = actions.job.receivedFamily({
        job: jobFamilyJ3,
      });
      const state2 = reducer(state, jobFamilyJ3ReceivedAction);
      const jobFamilyJ5 = {
        _id: 'j5',
        type: JOB_TYPES.FLOW,
        status: JOB_STATUS.CANCELED,
        startedAt: '2019-08-11T08:14:00.000Z',
        endedAt: '2019-08-11T08:20:00.000Z',
        numError: 3,
        numIgnore: 2,
        numPagesGenerated: 10,
        numResolved: 5,
        numSuccess: 20,
        _integrationId: 'i1',
        children: [
          {
            type: JOB_TYPES.EXPORT,
            status: JOB_STATUS.COMPLETED,
          },
          {
            type: JOB_TYPES.EXPORT,
            status: JOB_STATUS.COMPLETED,
          },
          {
            type: JOB_TYPES.IMPORT,
            status: JOB_STATUS.COMPLETED,
            numError: 1,
            numIgnore: 2,
            numResolved: 5,
            numSuccess: 20,
            retriable: true,
          },
          {
            type: JOB_TYPES.IMPORT,
            status: JOB_STATUS.CANCELED,
            numError: 2,
            retriable: true,
          },
        ],
      };
      const jobFamilyJ5ReceivedAction = actions.job.receivedFamily({
        job: jobFamilyJ5,
      });
      const state3 = reducer(state2, jobFamilyJ5ReceivedAction);
      const jobFamilyJ2 = {
        _id: 'j2',
        type: JOB_TYPES.FLOW,
        status: JOB_STATUS.RUNNING,
        startedAt: '2019-08-11T10:50:00.000Z',
        numError: 1,
        numIgnore: 2,
        numPagesGenerated: 10,
        numResolved: 0,
        numSuccess: 20,
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
      };
      const jobFamilyJ2ReceivedAction = actions.job.receivedFamily({
        job: jobFamilyJ2,
      });
      const state4 = reducer(state3, jobFamilyJ2ReceivedAction);

      expect(selectors.flowJobList(state4)).toEqual([
        {
          _id: 'j1',
          type: JOB_TYPES.FLOW,
          status: JOB_STATUS.QUEUED,
          _integrationId: 'i1',
          duration: undefined,
          doneExporting: false,
          numError: 0,
          numIgnore: 0,
          numPagesGenerated: 0,
          numPagesProcessed: 0,
          numResolved: 0,
          numSuccess: 0,
          uiStatus: JOB_STATUS.QUEUED,
        },
        {
          _id: 'j2',
          type: JOB_TYPES.FLOW,
          status: JOB_STATUS.RUNNING,
          startedAt: '2019-08-11T10:50:00.000Z',
          _integrationId: 'i1',
          duration: undefined,
          doneExporting: false,
          numError: 1,
          numIgnore: 2,
          numPagesGenerated: 10,
          numResolved: 0,
          numSuccess: 20,
          numPagesProcessed: 0,
          uiStatus: JOB_STATUS.RUNNING,
          children: [
            {
              type: JOB_TYPES.EXPORT,
              status: JOB_STATUS.COMPLETED,

              duration: undefined,
              numError: 0,
              numIgnore: 0,
              numPagesGenerated: 0,
              numPagesProcessed: 0,
              numResolved: 0,
              numSuccess: 0,
              uiStatus: JOB_STATUS.COMPLETED,
            },
            {
              type: JOB_TYPES.IMPORT,
              status: JOB_STATUS.COMPLETED,

              duration: undefined,
              numError: 0,
              numIgnore: 0,
              numPagesGenerated: 0,
              numPagesProcessed: 0,
              numResolved: 0,
              numSuccess: 0,
              percentComplete: 0,
              uiStatus: JOB_STATUS.COMPLETED,
            },
            {
              type: JOB_TYPES.IMPORT,
              status: JOB_STATUS.RUNNING,

              duration: undefined,
              numError: 0,
              numIgnore: 0,
              numPagesGenerated: 0,
              numPagesProcessed: 0,
              numResolved: 0,
              numSuccess: 0,
              percentComplete: 0,
              uiStatus: JOB_STATUS.RUNNING,
            },
          ],
        },
        {
          _id: 'j3',
          type: JOB_TYPES.FLOW,
          status: JOB_STATUS.COMPLETED,
          startedAt: '2019-08-11T09:34:00.000Z',
          endedAt: '2019-08-11T09:51:00.000Z',
          _integrationId: 'i1',
          duration: '00:17:00',
          doneExporting: true,
          numError: 5,
          numIgnore: 0,
          numResolved: 0,
          numSuccess: 0,
          uiStatus: JOB_STATUS.RETRYING,
          numPagesGenerated: 10,
          numPagesProcessed: 7,
          retriable: true,
          children: [
            {
              type: JOB_TYPES.EXPORT,
              status: JOB_STATUS.COMPLETED,
              startedAt: '2019-08-11T09:34:10.000Z',
              endedAt: '2019-08-11T09:40:00.000Z',
              duration: '00:05:50',
              numError: 0,
              numIgnore: 0,
              numPagesGenerated: 0,
              numPagesProcessed: 0,
              numResolved: 0,
              numSuccess: 0,
              uiStatus: JOB_STATUS.COMPLETED,
            },
            {
              type: JOB_TYPES.IMPORT,
              status: JOB_STATUS.COMPLETED,
              startedAt: '2019-08-11T09:34:15.000Z',
              endedAt: '2019-08-11T09:41:00.000Z',
              numPagesProcessed: 7,
              retriable: true,
              duration: '00:06:45',
              numError: 5,
              numIgnore: 0,
              numPagesGenerated: 0,
              numResolved: 0,
              numSuccess: 0,
              percentComplete: 70,
              uiStatus: JOB_STATUS.RETRYING,
              retries: [
                {
                  status: JOB_STATUS.COMPLETED,
                },
              ],
            },
          ],
        },
        {
          _id: 'j4',
          type: JOB_TYPES.FLOW,
          status: JOB_STATUS.COMPLETED,
          startedAt: '2019-08-11T09:14:00.000Z',
          endedAt: '2019-08-11T09:19:00.000Z',
          _integrationId: 'i1',
          duration: '00:05:00',
          doneExporting: true,
          numError: 0,
          numIgnore: 0,
          numPagesGenerated: 0,
          numPagesProcessed: 0,
          numResolved: 0,
          numSuccess: 0,
          uiStatus: JOB_STATUS.COMPLETED,
        },
        {
          _id: 'j5',
          type: JOB_TYPES.FLOW,
          status: JOB_STATUS.CANCELED,
          startedAt: '2019-08-11T08:14:00.000Z',
          endedAt: '2019-08-11T08:20:00.000Z',
          numError: 3,
          numIgnore: 2,
          numPagesGenerated: 10,
          numPagesProcessed: 0,
          numResolved: 5,
          numSuccess: 20,
          retriable: true,
          _integrationId: 'i1',
          duration: '00:06:00',
          doneExporting: true,
          uiStatus: JOB_STATUS.RETRYING,
          children: [
            {
              type: JOB_TYPES.EXPORT,
              status: JOB_STATUS.COMPLETED,
              duration: undefined,
              numError: 0,
              numIgnore: 0,
              numPagesGenerated: 0,
              numPagesProcessed: 0,
              numResolved: 0,
              numSuccess: 0,
              uiStatus: JOB_STATUS.COMPLETED,
            },
            {
              type: JOB_TYPES.EXPORT,
              status: JOB_STATUS.COMPLETED,
              duration: undefined,
              numError: 0,
              numIgnore: 0,
              numPagesGenerated: 0,
              numPagesProcessed: 0,
              numResolved: 0,
              numSuccess: 0,
              uiStatus: JOB_STATUS.COMPLETED,
            },
            {
              type: JOB_TYPES.IMPORT,
              status: JOB_STATUS.COMPLETED,
              numError: 1,
              numIgnore: 2,
              numResolved: 5,
              numSuccess: 20,
              retriable: true,
              duration: undefined,
              numPagesGenerated: 0,
              numPagesProcessed: 0,
              percentComplete: 0,
              uiStatus: JOB_STATUS.RETRYING,
            },
            {
              type: JOB_TYPES.IMPORT,
              status: JOB_STATUS.CANCELED,
              retriable: true,
              duration: undefined,
              numError: 2,
              numIgnore: 0,
              numPagesGenerated: 0,
              numPagesProcessed: 0,
              numResolved: 0,
              numSuccess: 0,
              percentComplete: 0,
              uiStatus: JOB_STATUS.RETRYING,
            },
          ],
        },
      ]);
    });
  });

  describe('flowJobList selector when there are flow level bulk retries', () => {
    test('should return correct results when there are no bulk retry jobs in queued state', () => {
      const jobs = [
        {
          _id: 'j1',
          type: JOB_TYPES.FLOW,
          status: JOB_STATUS.QUEUED,
          _integrationId: 'i1',
          _flowId: 'f1',
        },
        {
          _id: 'j2',
          type: JOB_TYPES.FLOW,
          status: JOB_STATUS.RUNNING,
          startedAt: '2019-08-11T10:50:00.000Z',
          _integrationId: 'i1',
          _flowId: 'f1',
        },
        {
          _id: 'j3',
          type: JOB_TYPES.FLOW,
          status: JOB_STATUS.COMPLETED,
          startedAt: '2019-08-11T09:34:00.000Z',
          endedAt: '2019-08-11T09:51:00.000Z',
          numPagesGenerated: 10,
          _integrationId: 'i1',
          _flowId: 'f1',
        },
        {
          _id: 'j4',
          type: JOB_TYPES.FLOW,
          status: JOB_STATUS.COMPLETED,
          startedAt: '2019-08-11T09:14:00.000Z',
          endedAt: '2019-08-11T09:19:00.000Z',
          doneExporting: true,
          _integrationId: 'i1',
          _flowId: 'f1',
        },
        {
          _id: 'j5',
          type: JOB_TYPES.FLOW,
          status: JOB_STATUS.CANCELED,
          startedAt: '2019-08-11T08:14:00.000Z',
          endedAt: '2019-08-11T08:20:00.000Z',
          numError: 1,
          numIgnore: 2,
          numPagesGenerated: 10,
          numResolved: 5,
          numSuccess: 20,
          _integrationId: 'i1',
          _flowId: 'f1',
        },
        {
          _id: 'brj1',
          type: JOB_TYPES.BULK_RETRY,
          status: JOB_STATUS.RUNNING,
          _integrationId: 'i1',
          _flowId: 'f1',
        },
        {
          _id: 'brj2',
          type: JOB_TYPES.BULK_RETRY,
          status: JOB_STATUS.CANCELED,
          _integrationId: 'i1',
          _flowId: 'f1',
        },
        {
          _id: 'brj3',
          type: JOB_TYPES.BULK_RETRY,
          status: JOB_STATUS.COMPLETED,
          _integrationId: 'i1',
          _flowId: 'f1',
        },
      ];
      const jobsReceivedAction = actions.job.receivedCollection({
        collection: jobs,
      });
      const state = reducer(undefined, jobsReceivedAction);
      const jobFamilyJ3 = {
        _id: 'j3',
        type: JOB_TYPES.FLOW,
        status: JOB_STATUS.COMPLETED,
        startedAt: '2019-08-11T09:34:00.000Z',
        endedAt: '2019-08-11T09:51:00.000Z',
        numPagesGenerated: 10,
        _integrationId: 'i1',
        _flowId: 'f1',
        children: [
          {
            type: JOB_TYPES.EXPORT,
            status: JOB_STATUS.COMPLETED,
            startedAt: '2019-08-11T09:34:10.000Z',
            endedAt: '2019-08-11T09:40:00.000Z',
          },
          {
            type: JOB_TYPES.IMPORT,
            status: JOB_STATUS.COMPLETED,
            startedAt: '2019-08-11T09:34:15.000Z',
            endedAt: '2019-08-11T09:41:00.000Z',
            numPagesProcessed: 7,
            retriable: true,
            retries: [
              {
                status: JOB_STATUS.QUEUED,
              },
            ],
          },
        ],
      };
      const jobFamilyJ3ReceivedAction = actions.job.receivedFamily({
        job: jobFamilyJ3,
      });
      const state2 = reducer(state, jobFamilyJ3ReceivedAction);
      const jobFamilyJ5 = {
        _id: 'j5',
        type: JOB_TYPES.FLOW,
        status: JOB_STATUS.CANCELED,
        startedAt: '2019-08-11T08:14:00.000Z',
        endedAt: '2019-08-11T08:20:00.000Z',
        numError: 1,
        numIgnore: 2,
        numPagesGenerated: 10,
        numResolved: 5,
        numSuccess: 20,
        _integrationId: 'i1',
        _flowId: 'f1',
        children: [
          {
            type: JOB_TYPES.EXPORT,
            status: JOB_STATUS.COMPLETED,
          },
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
            status: JOB_STATUS.CANCELED,
          },
        ],
      };
      const jobFamilyJ5ReceivedAction = actions.job.receivedFamily({
        job: jobFamilyJ5,
      });
      const state3 = reducer(state2, jobFamilyJ5ReceivedAction);
      const jobFamilyJ2 = {
        _id: 'j2',
        type: JOB_TYPES.FLOW,
        status: JOB_STATUS.RUNNING,
        startedAt: '2019-08-11T10:50:00.000Z',
        numError: 1,
        numIgnore: 2,
        numPagesGenerated: 10,
        numResolved: 0,
        numSuccess: 20,
        _integrationId: 'i1',
        _flowId: 'f1',
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
      };
      const jobFamilyJ2ReceivedAction = actions.job.receivedFamily({
        job: jobFamilyJ2,
      });
      const state4 = reducer(state3, jobFamilyJ2ReceivedAction);

      expect(selectors.flowJobList(state4)).toEqual([
        {
          _id: 'j1',
          type: JOB_TYPES.FLOW,
          status: JOB_STATUS.QUEUED,
          _integrationId: 'i1',
          _flowId: 'f1',
          duration: undefined,
          doneExporting: false,
          numError: 0,
          numIgnore: 0,
          numPagesGenerated: 0,
          numPagesProcessed: 0,
          numResolved: 0,
          numSuccess: 0,
          uiStatus: JOB_STATUS.QUEUED,
        },
        {
          _id: 'j2',
          type: JOB_TYPES.FLOW,
          status: JOB_STATUS.RUNNING,
          startedAt: '2019-08-11T10:50:00.000Z',
          _integrationId: 'i1',
          _flowId: 'f1',
          duration: undefined,
          doneExporting: false,
          numError: 1,
          numIgnore: 2,
          numPagesGenerated: 10,
          numResolved: 0,
          numSuccess: 20,
          numPagesProcessed: 0,
          uiStatus: JOB_STATUS.RUNNING,
          children: [
            {
              type: JOB_TYPES.EXPORT,
              status: JOB_STATUS.COMPLETED,
              duration: undefined,
              numError: 0,
              numIgnore: 0,
              numPagesGenerated: 0,
              numResolved: 0,
              numSuccess: 0,
              numPagesProcessed: 0,
              uiStatus: JOB_STATUS.COMPLETED,
            },
            {
              type: JOB_TYPES.IMPORT,
              status: JOB_STATUS.COMPLETED,
              duration: undefined,
              numError: 0,
              numIgnore: 0,
              numPagesGenerated: 0,
              numResolved: 0,
              numSuccess: 0,
              numPagesProcessed: 0,
              uiStatus: JOB_STATUS.COMPLETED,
              percentComplete: 0,
            },
            {
              type: JOB_TYPES.IMPORT,
              status: JOB_STATUS.RUNNING,
              duration: undefined,
              numError: 0,
              numIgnore: 0,
              numPagesGenerated: 0,
              numResolved: 0,
              numSuccess: 0,
              numPagesProcessed: 0,
              uiStatus: JOB_STATUS.RUNNING,
              percentComplete: 0,
            },
          ],
        },
        {
          _id: 'j3',
          type: JOB_TYPES.FLOW,
          status: JOB_STATUS.COMPLETED,
          startedAt: '2019-08-11T09:34:00.000Z',
          endedAt: '2019-08-11T09:51:00.000Z',
          duration: '00:17:00',
          doneExporting: true,
          numError: 0,
          numIgnore: 0,
          numResolved: 0,
          numSuccess: 0,
          uiStatus: JOB_STATUS.RETRYING,
          numPagesGenerated: 10,
          numPagesProcessed: 7,
          retriable: true,
          _integrationId: 'i1',
          _flowId: 'f1',
          children: [
            {
              type: JOB_TYPES.EXPORT,
              status: JOB_STATUS.COMPLETED,
              startedAt: '2019-08-11T09:34:10.000Z',
              endedAt: '2019-08-11T09:40:00.000Z',
              duration: '00:05:50',
              numError: 0,
              numIgnore: 0,
              numResolved: 0,
              numSuccess: 0,
              uiStatus: JOB_STATUS.COMPLETED,
              numPagesGenerated: 0,
              numPagesProcessed: 0,
            },
            {
              type: JOB_TYPES.IMPORT,
              status: JOB_STATUS.COMPLETED,
              startedAt: '2019-08-11T09:34:15.000Z',
              endedAt: '2019-08-11T09:41:00.000Z',
              numPagesProcessed: 7,
              duration: '00:06:45',
              numError: 0,
              numIgnore: 0,
              numResolved: 0,
              numSuccess: 0,
              uiStatus: JOB_STATUS.RETRYING,
              numPagesGenerated: 0,
              percentComplete: 70,
              retriable: true,
              retries: [
                {
                  status: JOB_STATUS.QUEUED,
                },
              ],
            },
          ],
        },
        {
          _id: 'j4',
          type: JOB_TYPES.FLOW,
          status: JOB_STATUS.COMPLETED,
          startedAt: '2019-08-11T09:14:00.000Z',
          endedAt: '2019-08-11T09:19:00.000Z',
          _integrationId: 'i1',
          _flowId: 'f1',
          duration: '00:05:00',
          doneExporting: true,
          numError: 0,
          numIgnore: 0,
          numPagesGenerated: 0,
          numPagesProcessed: 0,
          numResolved: 0,
          numSuccess: 0,
          uiStatus: JOB_STATUS.COMPLETED,
        },
        {
          _id: 'j5',
          type: JOB_TYPES.FLOW,
          status: JOB_STATUS.CANCELED,
          startedAt: '2019-08-11T08:14:00.000Z',
          endedAt: '2019-08-11T08:20:00.000Z',
          numError: 1,
          numIgnore: 2,
          numPagesGenerated: 10,
          numPagesProcessed: 0,
          numResolved: 5,
          numSuccess: 20,
          _integrationId: 'i1',
          _flowId: 'f1',
          duration: '00:06:00',
          doneExporting: true,
          uiStatus: JOB_STATUS.CANCELED,
          children: [
            {
              type: JOB_TYPES.EXPORT,
              status: JOB_STATUS.COMPLETED,
              duration: undefined,
              numError: 0,
              numIgnore: 0,
              numPagesGenerated: 0,
              numPagesProcessed: 0,
              numResolved: 0,
              numSuccess: 0,
              uiStatus: JOB_STATUS.COMPLETED,
            },
            {
              type: JOB_TYPES.EXPORT,
              status: JOB_STATUS.COMPLETED,
              duration: undefined,
              numError: 0,
              numIgnore: 0,
              numPagesGenerated: 0,
              numPagesProcessed: 0,
              numResolved: 0,
              numSuccess: 0,
              uiStatus: JOB_STATUS.COMPLETED,
            },
            {
              type: JOB_TYPES.IMPORT,
              status: JOB_STATUS.COMPLETED,
              duration: undefined,
              numError: 0,
              numIgnore: 0,
              numPagesGenerated: 0,
              numPagesProcessed: 0,
              numResolved: 0,
              numSuccess: 0,
              percentComplete: 0,
              uiStatus: JOB_STATUS.COMPLETED,
            },
            {
              type: JOB_TYPES.IMPORT,
              status: JOB_STATUS.CANCELED,
              duration: undefined,
              numError: 0,
              numIgnore: 0,
              numPagesGenerated: 0,
              numPagesProcessed: 0,
              numResolved: 0,
              numSuccess: 0,
              percentComplete: 0,
              uiStatus: JOB_STATUS.CANCELED,
            },
          ],
        },
      ]);
    });

    test('should return correct results when there are bulk retry jobs in queued state', () => {
      const jobs = [
        {
          _id: 'j1',
          type: JOB_TYPES.FLOW,
          status: JOB_STATUS.QUEUED,
          _integrationId: 'i1',
          _flowId: 'f1',
        },
        {
          _id: 'j2',
          type: JOB_TYPES.FLOW,
          status: JOB_STATUS.RUNNING,
          startedAt: '2019-08-11T10:50:00.000Z',
          numError: 1,
          numIgnore: 2,
          numPagesGenerated: 10,
          numResolved: 0,
          numSuccess: 20,
          _integrationId: 'i1',
          _flowId: 'f1',
        },
        {
          _id: 'j3',
          type: JOB_TYPES.FLOW,
          status: JOB_STATUS.COMPLETED,
          startedAt: '2019-08-11T09:34:00.000Z',
          endedAt: '2019-08-11T09:51:00.000Z',
          numPagesGenerated: 10,
          numError: 5,
          _integrationId: 'i1',
          _flowId: 'f1',
        },
        {
          _id: 'j4',
          type: JOB_TYPES.FLOW,
          status: JOB_STATUS.COMPLETED,
          startedAt: '2019-08-11T09:14:00.000Z',
          endedAt: '2019-08-11T09:19:00.000Z',
          doneExporting: true,
          _integrationId: 'i1',
          _flowId: 'f1',
        },
        {
          _id: 'j5',
          type: JOB_TYPES.FLOW,
          status: JOB_STATUS.CANCELED,
          startedAt: '2019-08-11T08:14:00.000Z',
          endedAt: '2019-08-11T08:20:00.000Z',
          numError: 1,
          numIgnore: 2,
          numPagesGenerated: 10,
          numResolved: 5,
          numSuccess: 20,
          _integrationId: 'i1',
          _flowId: 'f1',
        },
        {
          _id: 'brj1',
          type: JOB_TYPES.BULK_RETRY,
          status: JOB_STATUS.QUEUED,
          _integrationId: 'i1',
          _flowId: 'f1',
        },
        {
          _id: 'brj2',
          type: JOB_TYPES.BULK_RETRY,
          status: JOB_STATUS.CANCELED,
          _integrationId: 'i1',
          _flowId: 'f1',
        },
        {
          _id: 'brj3',
          type: JOB_TYPES.BULK_RETRY,
          status: JOB_STATUS.COMPLETED,
          _integrationId: 'i1',
          _flowId: 'f1',
        },
      ];
      const jobsReceivedAction = actions.job.receivedCollection({
        collection: jobs,
      });
      const state = reducer(undefined, jobsReceivedAction);
      const jobFamilyJ3 = {
        _id: 'j3',
        type: JOB_TYPES.FLOW,
        status: JOB_STATUS.COMPLETED,
        startedAt: '2019-08-11T09:34:00.000Z',
        endedAt: '2019-08-11T09:51:00.000Z',
        numPagesGenerated: 10,
        numError: 5,
        _integrationId: 'i1',
        _flowId: 'f1',
        children: [
          {
            type: JOB_TYPES.EXPORT,
            status: JOB_STATUS.COMPLETED,
            startedAt: '2019-08-11T09:34:10.000Z',
            endedAt: '2019-08-11T09:40:00.000Z',
          },
          {
            type: JOB_TYPES.IMPORT,
            status: JOB_STATUS.COMPLETED,
            startedAt: '2019-08-11T09:34:15.000Z',
            endedAt: '2019-08-11T09:41:00.000Z',
            numPagesProcessed: 7,
            numError: 5,
            retriable: true,
            retries: [
              {
                status: JOB_STATUS.COMPLETED,
              },
            ],
          },
        ],
      };
      const jobFamilyJ3ReceivedAction = actions.job.receivedFamily({
        job: jobFamilyJ3,
      });
      const state2 = reducer(state, jobFamilyJ3ReceivedAction);
      const jobFamilyJ5 = {
        _id: 'j5',
        type: JOB_TYPES.FLOW,
        status: JOB_STATUS.CANCELED,
        startedAt: '2019-08-11T08:14:00.000Z',
        endedAt: '2019-08-11T08:20:00.000Z',
        numError: 3,
        numIgnore: 2,
        numPagesGenerated: 10,
        numResolved: 5,
        numSuccess: 20,
        _integrationId: 'i1',
        _flowId: 'f1',
        children: [
          {
            type: JOB_TYPES.EXPORT,
            status: JOB_STATUS.COMPLETED,
          },
          {
            type: JOB_TYPES.EXPORT,
            status: JOB_STATUS.COMPLETED,
          },
          {
            type: JOB_TYPES.IMPORT,
            status: JOB_STATUS.COMPLETED,
            numError: 1,
            numIgnore: 2,
            numResolved: 5,
            numSuccess: 20,
            retriable: true,
          },
          {
            type: JOB_TYPES.IMPORT,
            status: JOB_STATUS.CANCELED,
            numError: 2,
            retriable: true,
          },
        ],
      };
      const jobFamilyJ5ReceivedAction = actions.job.receivedFamily({
        job: jobFamilyJ5,
      });
      const state3 = reducer(state2, jobFamilyJ5ReceivedAction);
      const jobFamilyJ2 = {
        _id: 'j2',
        type: JOB_TYPES.FLOW,
        status: JOB_STATUS.RUNNING,
        startedAt: '2019-08-11T10:50:00.000Z',
        numError: 1,
        numIgnore: 2,
        numPagesGenerated: 10,
        numResolved: 0,
        numSuccess: 20,
        _integrationId: 'i1',
        _flowId: 'f1',
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
      };
      const jobFamilyJ2ReceivedAction = actions.job.receivedFamily({
        job: jobFamilyJ2,
      });
      const state4 = reducer(state3, jobFamilyJ2ReceivedAction);

      expect(selectors.flowJobList(state4)).toEqual([
        {
          _id: 'j1',
          type: JOB_TYPES.FLOW,
          status: JOB_STATUS.QUEUED,
          _integrationId: 'i1',
          _flowId: 'f1',
          duration: undefined,
          doneExporting: false,
          numError: 0,
          numIgnore: 0,
          numPagesGenerated: 0,
          numPagesProcessed: 0,
          numResolved: 0,
          numSuccess: 0,
          uiStatus: JOB_STATUS.QUEUED,
        },
        {
          _id: 'j2',
          type: JOB_TYPES.FLOW,
          status: JOB_STATUS.RUNNING,
          startedAt: '2019-08-11T10:50:00.000Z',
          _integrationId: 'i1',
          _flowId: 'f1',
          duration: undefined,
          doneExporting: false,
          numError: 1,
          numIgnore: 2,
          numPagesGenerated: 10,
          numResolved: 0,
          numSuccess: 20,
          numPagesProcessed: 0,
          uiStatus: JOB_STATUS.RUNNING,
          children: [
            {
              type: JOB_TYPES.EXPORT,
              status: JOB_STATUS.COMPLETED,

              duration: undefined,
              numError: 0,
              numIgnore: 0,
              numPagesGenerated: 0,
              numPagesProcessed: 0,
              numResolved: 0,
              numSuccess: 0,
              uiStatus: JOB_STATUS.COMPLETED,
            },
            {
              type: JOB_TYPES.IMPORT,
              status: JOB_STATUS.COMPLETED,

              duration: undefined,
              numError: 0,
              numIgnore: 0,
              numPagesGenerated: 0,
              numPagesProcessed: 0,
              numResolved: 0,
              numSuccess: 0,
              percentComplete: 0,
              uiStatus: JOB_STATUS.COMPLETED,
            },
            {
              type: JOB_TYPES.IMPORT,
              status: JOB_STATUS.RUNNING,

              duration: undefined,
              numError: 0,
              numIgnore: 0,
              numPagesGenerated: 0,
              numPagesProcessed: 0,
              numResolved: 0,
              numSuccess: 0,
              percentComplete: 0,
              uiStatus: JOB_STATUS.RUNNING,
            },
          ],
        },
        {
          _id: 'j3',
          type: JOB_TYPES.FLOW,
          status: JOB_STATUS.COMPLETED,
          startedAt: '2019-08-11T09:34:00.000Z',
          endedAt: '2019-08-11T09:51:00.000Z',
          _integrationId: 'i1',
          _flowId: 'f1',
          duration: '00:17:00',
          doneExporting: true,
          numError: 5,
          numIgnore: 0,
          numResolved: 0,
          numSuccess: 0,
          uiStatus: JOB_STATUS.RETRYING,
          numPagesGenerated: 10,
          numPagesProcessed: 7,
          retriable: true,
          children: [
            {
              type: JOB_TYPES.EXPORT,
              status: JOB_STATUS.COMPLETED,
              startedAt: '2019-08-11T09:34:10.000Z',
              endedAt: '2019-08-11T09:40:00.000Z',
              duration: '00:05:50',
              numError: 0,
              numIgnore: 0,
              numPagesGenerated: 0,
              numPagesProcessed: 0,
              numResolved: 0,
              numSuccess: 0,
              uiStatus: JOB_STATUS.COMPLETED,
            },
            {
              type: JOB_TYPES.IMPORT,
              status: JOB_STATUS.COMPLETED,
              startedAt: '2019-08-11T09:34:15.000Z',
              endedAt: '2019-08-11T09:41:00.000Z',
              numPagesProcessed: 7,
              retriable: true,
              duration: '00:06:45',
              numError: 5,
              numIgnore: 0,
              numPagesGenerated: 0,
              numResolved: 0,
              numSuccess: 0,
              percentComplete: 70,
              uiStatus: JOB_STATUS.RETRYING,
              retries: [
                {
                  status: JOB_STATUS.COMPLETED,
                },
              ],
            },
          ],
        },
        {
          _id: 'j4',
          type: JOB_TYPES.FLOW,
          status: JOB_STATUS.COMPLETED,
          startedAt: '2019-08-11T09:14:00.000Z',
          endedAt: '2019-08-11T09:19:00.000Z',
          _integrationId: 'i1',
          _flowId: 'f1',
          duration: '00:05:00',
          doneExporting: true,
          numError: 0,
          numIgnore: 0,
          numPagesGenerated: 0,
          numPagesProcessed: 0,
          numResolved: 0,
          numSuccess: 0,
          uiStatus: JOB_STATUS.COMPLETED,
        },
        {
          _id: 'j5',
          type: JOB_TYPES.FLOW,
          status: JOB_STATUS.CANCELED,
          startedAt: '2019-08-11T08:14:00.000Z',
          endedAt: '2019-08-11T08:20:00.000Z',
          numError: 3,
          numIgnore: 2,
          numPagesGenerated: 10,
          numPagesProcessed: 0,
          numResolved: 5,
          numSuccess: 20,
          retriable: true,
          _integrationId: 'i1',
          _flowId: 'f1',
          duration: '00:06:00',
          doneExporting: true,
          uiStatus: JOB_STATUS.RETRYING,
          children: [
            {
              type: JOB_TYPES.EXPORT,
              status: JOB_STATUS.COMPLETED,
              duration: undefined,
              numError: 0,
              numIgnore: 0,
              numPagesGenerated: 0,
              numPagesProcessed: 0,
              numResolved: 0,
              numSuccess: 0,
              uiStatus: JOB_STATUS.COMPLETED,
            },
            {
              type: JOB_TYPES.EXPORT,
              status: JOB_STATUS.COMPLETED,
              duration: undefined,
              numError: 0,
              numIgnore: 0,
              numPagesGenerated: 0,
              numPagesProcessed: 0,
              numResolved: 0,
              numSuccess: 0,
              uiStatus: JOB_STATUS.COMPLETED,
            },
            {
              type: JOB_TYPES.IMPORT,
              status: JOB_STATUS.COMPLETED,
              numError: 1,
              numIgnore: 2,
              numResolved: 5,
              numSuccess: 20,
              retriable: true,
              duration: undefined,
              numPagesGenerated: 0,
              numPagesProcessed: 0,
              percentComplete: 0,
              uiStatus: JOB_STATUS.RETRYING,
            },
            {
              type: JOB_TYPES.IMPORT,
              status: JOB_STATUS.CANCELED,
              retriable: true,
              duration: undefined,
              numError: 2,
              numIgnore: 0,
              numPagesGenerated: 0,
              numPagesProcessed: 0,
              numResolved: 0,
              numSuccess: 0,
              percentComplete: 0,
              uiStatus: JOB_STATUS.RETRYING,
            },
          ],
        },
      ]);
    });
  });
});

describe('inProgressJobIds selector', () => {
  test('should return correct details when state is empty', () => {
    const state = reducer(undefined, 'some action');

    expect(selectors.inProgressJobIds(state)).toEqual({
      flowJobs: [],
      bulkRetryJobs: [],
    });
  });

  test('should return correct results when there are no bulk retry jobs', () => {
    let state = reducer(
      undefined,
      actions.job.receivedCollection({
        collection: [
          {
            _id: 'j1',
            type: JOB_TYPES.FLOW,
            status: JOB_STATUS.QUEUED,
          },
          {
            _id: 'j2',
            type: JOB_TYPES.FLOW,
            status: JOB_STATUS.RUNNING,
          },
          {
            _id: 'j3',
            type: JOB_TYPES.FLOW,
            status: JOB_STATUS.RETRYING,
          },
          {
            _id: 'j4',
            type: JOB_TYPES.FLOW,
            status: JOB_STATUS.COMPLETED,
          },
          {
            _id: 'j5',
            type: JOB_TYPES.FLOW,
            status: JOB_STATUS.CANCELED,
          },
          {
            _id: 'j6',
            type: JOB_TYPES.FLOW,
            status: JOB_STATUS.FAILED,
          },
          {
            _id: 'j7',
            type: JOB_TYPES.FLOW,
            status: JOB_STATUS.CANCELED,
          },
          {
            _id: 'j8',
            type: JOB_TYPES.FLOW,
            status: JOB_STATUS.FAILED,
          },
          {
            _id: 'j9',
            type: JOB_TYPES.FLOW,
            status: JOB_STATUS.COMPLETED,
          },
          {
            _id: 'j10',
            type: JOB_TYPES.FLOW,
            status: JOB_STATUS.CANCELED,
          },
          {
            _id: 'j11',
            type: JOB_TYPES.FLOW,
            status: JOB_STATUS.FAILED,
          },
          {
            _id: 'j12',
            type: JOB_TYPES.FLOW,
            status: JOB_STATUS.COMPLETED,
          },
        ],
      })
    );
    const jobsWithChildren = [
      {
        _id: 'j7',
        type: JOB_TYPES.FLOW,
        status: JOB_STATUS.CANCELED,
        children: [
          {
            type: JOB_TYPES.EXPORT,
            status: JOB_STATUS.COMPLETED,
          },
          {
            type: JOB_TYPES.IMPORT,
            status: JOB_STATUS.RETRYING,
          },
        ],
      },
      {
        _id: 'j8',
        type: JOB_TYPES.FLOW,
        status: JOB_STATUS.FAILED,
        children: [
          {
            type: JOB_TYPES.EXPORT,
            status: JOB_STATUS.COMPLETED,
          },
          {
            type: JOB_TYPES.IMPORT,
            status: JOB_STATUS.RUNNING,
          },
        ],
      },
      {
        _id: 'j9',
        type: JOB_TYPES.FLOW,
        status: JOB_STATUS.COMPLETED,
        children: [
          {
            type: JOB_TYPES.EXPORT,
            status: JOB_STATUS.COMPLETED,
          },
          {
            type: JOB_TYPES.IMPORT,
            status: JOB_STATUS.QUEUED,
          },
        ],
      },
      {
        _id: 'j10',
        type: JOB_TYPES.FLOW,
        status: JOB_STATUS.CANCELED,
        children: [
          {
            type: JOB_TYPES.EXPORT,
            status: JOB_STATUS.COMPLETED,
          },
          {
            type: JOB_TYPES.IMPORT,
            status: JOB_STATUS.CANCELED,
          },
        ],
      },
      {
        _id: 'j11',
        type: JOB_TYPES.FLOW,
        status: JOB_STATUS.FAILED,
        children: [
          {
            type: JOB_TYPES.EXPORT,
            status: JOB_STATUS.COMPLETED,
          },
          {
            type: JOB_TYPES.IMPORT,
            status: JOB_STATUS.FAILED,
          },
        ],
      },
      {
        _id: 'j12',
        type: JOB_TYPES.FLOW,
        status: JOB_STATUS.COMPLETED,
        children: [
          {
            type: JOB_TYPES.EXPORT,
            status: JOB_STATUS.COMPLETED,
          },
          {
            type: JOB_TYPES.IMPORT,
            status: JOB_STATUS.COMPLETED,
          },
        ],
      },
    ];

    jobsWithChildren.forEach(job => {
      state = reducer(
        state,
        actions.job.receivedFamily({
          job,
        })
      );
    });

    expect(selectors.inProgressJobIds(state)).toEqual({
      flowJobs: ['j1', 'j2', 'j3', 'j7', 'j8', 'j9'],
      bulkRetryJobs: [],
    });
  });

  test('should return correct results when there are no bulk retry jobs in queued/running state', () => {
    let state = reducer(
      undefined,
      actions.job.receivedCollection({
        collection: [
          {
            _id: 'j1',
            type: JOB_TYPES.FLOW,
            status: JOB_STATUS.QUEUED,
          },
          {
            _id: 'j2',
            type: JOB_TYPES.FLOW,
            status: JOB_STATUS.RUNNING,
          },
          {
            _id: 'j3',
            type: JOB_TYPES.FLOW,
            status: JOB_STATUS.RETRYING,
          },
          {
            _id: 'j4',
            type: JOB_TYPES.FLOW,
            status: JOB_STATUS.COMPLETED,
          },
          {
            _id: 'j5',
            type: JOB_TYPES.FLOW,
            status: JOB_STATUS.CANCELED,
          },
          {
            _id: 'j6',
            type: JOB_TYPES.FLOW,
            status: JOB_STATUS.FAILED,
          },
          {
            _id: 'j7',
            type: JOB_TYPES.FLOW,
            status: JOB_STATUS.CANCELED,
          },
          {
            _id: 'j8',
            type: JOB_TYPES.FLOW,
            status: JOB_STATUS.FAILED,
          },
          {
            _id: 'j9',
            type: JOB_TYPES.FLOW,
            status: JOB_STATUS.COMPLETED,
          },
          {
            _id: 'j10',
            type: JOB_TYPES.FLOW,
            status: JOB_STATUS.CANCELED,
          },
          {
            _id: 'j11',
            type: JOB_TYPES.FLOW,
            status: JOB_STATUS.FAILED,
          },
          {
            _id: 'j12',
            type: JOB_TYPES.FLOW,
            status: JOB_STATUS.COMPLETED,
          },
          {
            _id: 'brj1',
            type: JOB_TYPES.BULK_RETRY,
            status: JOB_STATUS.CANCELED,
          },
          {
            _id: 'brj2',
            type: JOB_TYPES.BULK_RETRY,
            status: JOB_STATUS.COMPLETED,
          },
          {
            _id: 'brj3',
            type: JOB_TYPES.BULK_RETRY,
            status: JOB_STATUS.FAILED,
          },
        ],
      })
    );
    const jobsWithChildren = [
      {
        _id: 'j7',
        type: JOB_TYPES.FLOW,
        status: JOB_STATUS.CANCELED,
        children: [
          {
            type: JOB_TYPES.EXPORT,
            status: JOB_STATUS.COMPLETED,
          },
          {
            type: JOB_TYPES.IMPORT,
            status: JOB_STATUS.RETRYING,
          },
        ],
      },
      {
        _id: 'j8',
        type: JOB_TYPES.FLOW,
        status: JOB_STATUS.FAILED,
        children: [
          {
            type: JOB_TYPES.EXPORT,
            status: JOB_STATUS.COMPLETED,
          },
          {
            type: JOB_TYPES.IMPORT,
            status: JOB_STATUS.RUNNING,
          },
        ],
      },
      {
        _id: 'j9',
        type: JOB_TYPES.FLOW,
        status: JOB_STATUS.COMPLETED,
        children: [
          {
            type: JOB_TYPES.EXPORT,
            status: JOB_STATUS.COMPLETED,
          },
          {
            type: JOB_TYPES.IMPORT,
            status: JOB_STATUS.QUEUED,
          },
        ],
      },
      {
        _id: 'j10',
        type: JOB_TYPES.FLOW,
        status: JOB_STATUS.CANCELED,
        children: [
          {
            type: JOB_TYPES.EXPORT,
            status: JOB_STATUS.COMPLETED,
          },
          {
            type: JOB_TYPES.IMPORT,
            status: JOB_STATUS.CANCELED,
          },
        ],
      },
      {
        _id: 'j11',
        type: JOB_TYPES.FLOW,
        status: JOB_STATUS.FAILED,
        children: [
          {
            type: JOB_TYPES.EXPORT,
            status: JOB_STATUS.COMPLETED,
          },
          {
            type: JOB_TYPES.IMPORT,
            status: JOB_STATUS.FAILED,
          },
        ],
      },
      {
        _id: 'j12',
        type: JOB_TYPES.FLOW,
        status: JOB_STATUS.COMPLETED,
        children: [
          {
            type: JOB_TYPES.EXPORT,
            status: JOB_STATUS.COMPLETED,
          },
          {
            type: JOB_TYPES.IMPORT,
            status: JOB_STATUS.COMPLETED,
          },
        ],
      },
    ];

    jobsWithChildren.forEach(job => {
      state = reducer(
        state,
        actions.job.receivedFamily({
          job,
        })
      );
    });

    expect(selectors.inProgressJobIds(state)).toEqual({
      flowJobs: ['j1', 'j2', 'j3', 'j7', 'j8', 'j9'],
      bulkRetryJobs: [],
    });
  });

  test('should return correct results when there are bulk retry jobs in queued state', () => {
    let state = reducer(
      undefined,
      actions.job.receivedCollection({
        collection: [
          {
            _id: 'j1',
            type: JOB_TYPES.FLOW,
            status: JOB_STATUS.QUEUED,
          },
          {
            _id: 'j2',
            type: JOB_TYPES.FLOW,
            status: JOB_STATUS.RUNNING,
          },
          {
            _id: 'j3',
            type: JOB_TYPES.FLOW,
            status: JOB_STATUS.RETRYING,
          },
          {
            _id: 'j4',
            type: JOB_TYPES.FLOW,
            status: JOB_STATUS.COMPLETED,
          },
          {
            _id: 'j5',
            type: JOB_TYPES.FLOW,
            status: JOB_STATUS.CANCELED,
          },
          {
            _id: 'j6',
            type: JOB_TYPES.FLOW,
            status: JOB_STATUS.FAILED,
          },
          {
            _id: 'j7',
            type: JOB_TYPES.FLOW,
            status: JOB_STATUS.CANCELED,
          },
          {
            _id: 'j8',
            type: JOB_TYPES.FLOW,
            status: JOB_STATUS.FAILED,
          },
          {
            _id: 'j9',
            type: JOB_TYPES.FLOW,
            status: JOB_STATUS.COMPLETED,
          },
          {
            _id: 'j10',
            type: JOB_TYPES.FLOW,
            status: JOB_STATUS.CANCELED,
          },
          {
            _id: 'j11',
            type: JOB_TYPES.FLOW,
            status: JOB_STATUS.FAILED,
          },
          {
            _id: 'j12',
            type: JOB_TYPES.FLOW,
            status: JOB_STATUS.COMPLETED,
          },
          {
            _id: 'brj1',
            type: JOB_TYPES.BULK_RETRY,
            status: JOB_STATUS.QUEUED,
          },
          {
            _id: 'brj2',
            type: JOB_TYPES.BULK_RETRY,
            status: JOB_STATUS.COMPLETED,
          },
          {
            _id: 'brj3',
            type: JOB_TYPES.BULK_RETRY,
            status: JOB_STATUS.FAILED,
          },
        ],
      })
    );
    const jobsWithChildren = [
      {
        _id: 'j7',
        type: JOB_TYPES.FLOW,
        status: JOB_STATUS.CANCELED,
        children: [
          {
            type: JOB_TYPES.EXPORT,
            status: JOB_STATUS.COMPLETED,
          },
          {
            type: JOB_TYPES.IMPORT,
            status: JOB_STATUS.RETRYING,
          },
        ],
      },
      {
        _id: 'j8',
        type: JOB_TYPES.FLOW,
        status: JOB_STATUS.FAILED,
        children: [
          {
            type: JOB_TYPES.EXPORT,
            status: JOB_STATUS.COMPLETED,
          },
          {
            type: JOB_TYPES.IMPORT,
            status: JOB_STATUS.RUNNING,
          },
        ],
      },
      {
        _id: 'j9',
        type: JOB_TYPES.FLOW,
        status: JOB_STATUS.COMPLETED,
        children: [
          {
            type: JOB_TYPES.EXPORT,
            status: JOB_STATUS.COMPLETED,
          },
          {
            type: JOB_TYPES.IMPORT,
            status: JOB_STATUS.QUEUED,
          },
        ],
      },
      {
        _id: 'j10',
        type: JOB_TYPES.FLOW,
        status: JOB_STATUS.CANCELED,
        children: [
          {
            type: JOB_TYPES.EXPORT,
            status: JOB_STATUS.COMPLETED,
          },
          {
            type: JOB_TYPES.IMPORT,
            status: JOB_STATUS.CANCELED,
          },
        ],
      },
      {
        _id: 'j11',
        type: JOB_TYPES.FLOW,
        status: JOB_STATUS.FAILED,
        children: [
          {
            type: JOB_TYPES.EXPORT,
            status: JOB_STATUS.COMPLETED,
          },
          {
            type: JOB_TYPES.IMPORT,
            status: JOB_STATUS.FAILED,
          },
        ],
      },
      {
        _id: 'j12',
        type: JOB_TYPES.FLOW,
        status: JOB_STATUS.COMPLETED,
        children: [
          {
            type: JOB_TYPES.EXPORT,
            status: JOB_STATUS.COMPLETED,
          },
          {
            type: JOB_TYPES.IMPORT,
            status: JOB_STATUS.COMPLETED,
          },
        ],
      },
    ];

    jobsWithChildren.forEach(job => {
      state = reducer(
        state,
        actions.job.receivedFamily({
          job,
        })
      );
    });

    expect(selectors.inProgressJobIds(state)).toEqual({
      flowJobs: ['j1', 'j2', 'j3', 'j7', 'j8', 'j9'],
      bulkRetryJobs: ['brj1'],
    });
  });

  test('should return correct results when there are integration level bulk retry jobs in queued state', () => {
    const _integrationId = 'i1';
    let state = reducer(
      undefined,
      actions.job.receivedCollection({
        collection: [
          {
            _id: 'j1',
            type: JOB_TYPES.FLOW,
            status: JOB_STATUS.QUEUED,
            _integrationId,
          },
          {
            _id: 'j2',
            type: JOB_TYPES.FLOW,
            status: JOB_STATUS.RUNNING,
          },
          {
            _id: 'j3',
            type: JOB_TYPES.FLOW,
            status: JOB_STATUS.RETRYING,
          },
          {
            _id: 'j4',
            type: JOB_TYPES.FLOW,
            status: JOB_STATUS.COMPLETED,
          },
          {
            _id: 'j5',
            type: JOB_TYPES.FLOW,
            status: JOB_STATUS.CANCELED,
          },
          {
            _id: 'j6',
            type: JOB_TYPES.FLOW,
            status: JOB_STATUS.FAILED,
          },
          {
            _id: 'j7',
            type: JOB_TYPES.FLOW,
            status: JOB_STATUS.CANCELED,
          },
          {
            _id: 'j8',
            type: JOB_TYPES.FLOW,
            status: JOB_STATUS.FAILED,
          },
          {
            _id: 'j9',
            type: JOB_TYPES.FLOW,
            status: JOB_STATUS.COMPLETED,
          },
          {
            _id: 'j10',
            type: JOB_TYPES.FLOW,
            status: JOB_STATUS.CANCELED,
          },
          {
            _id: 'j11',
            type: JOB_TYPES.FLOW,
            status: JOB_STATUS.FAILED,
          },
          {
            _id: 'j12',
            type: JOB_TYPES.FLOW,
            status: JOB_STATUS.COMPLETED,
          },
          {
            _id: 'brj1',
            type: JOB_TYPES.BULK_RETRY,
            status: JOB_STATUS.QUEUED,
          },
          {
            _id: 'brj2',
            type: JOB_TYPES.BULK_RETRY,
            status: JOB_STATUS.COMPLETED,
          },
          {
            _id: 'brj3',
            type: JOB_TYPES.BULK_RETRY,
            status: JOB_STATUS.FAILED,
          },
        ],
      })
    );
    const jobsWithChildren = [
      {
        _id: 'j7',
        type: JOB_TYPES.FLOW,
        status: JOB_STATUS.CANCELED,
        children: [
          {
            type: JOB_TYPES.EXPORT,
            status: JOB_STATUS.COMPLETED,
          },
          {
            type: JOB_TYPES.IMPORT,
            status: JOB_STATUS.RETRYING,
          },
        ],
      },
      {
        _id: 'j8',
        type: JOB_TYPES.FLOW,
        status: JOB_STATUS.FAILED,
        children: [
          {
            type: JOB_TYPES.EXPORT,
            status: JOB_STATUS.COMPLETED,
          },
          {
            type: JOB_TYPES.IMPORT,
            status: JOB_STATUS.RUNNING,
          },
        ],
      },
      {
        _id: 'j9',
        type: JOB_TYPES.FLOW,
        status: JOB_STATUS.COMPLETED,
        children: [
          {
            type: JOB_TYPES.EXPORT,
            status: JOB_STATUS.COMPLETED,
          },
          {
            type: JOB_TYPES.IMPORT,
            status: JOB_STATUS.QUEUED,
          },
        ],
      },
      {
        _id: 'j10',
        type: JOB_TYPES.FLOW,
        status: JOB_STATUS.CANCELED,
        children: [
          {
            type: JOB_TYPES.EXPORT,
            status: JOB_STATUS.COMPLETED,
          },
          {
            type: JOB_TYPES.IMPORT,
            status: JOB_STATUS.CANCELED,
          },
        ],
      },
      {
        _id: 'j11',
        type: JOB_TYPES.FLOW,
        status: JOB_STATUS.FAILED,
        children: [
          {
            type: JOB_TYPES.EXPORT,
            status: JOB_STATUS.COMPLETED,
          },
          {
            type: JOB_TYPES.IMPORT,
            status: JOB_STATUS.FAILED,
          },
        ],
      },
      {
        _id: 'j12',
        type: JOB_TYPES.FLOW,
        status: JOB_STATUS.COMPLETED,
        children: [
          {
            type: JOB_TYPES.EXPORT,
            status: JOB_STATUS.COMPLETED,
          },
          {
            type: JOB_TYPES.IMPORT,
            status: JOB_STATUS.COMPLETED,
          },
        ],
      },
    ];

    jobsWithChildren.forEach(job => {
      state = reducer(
        state,
        actions.job.receivedFamily({
          job,
        })
      );
    });

    expect(selectors.inProgressJobIds(state)).toEqual({
      flowJobs: ['j1', 'j2', 'j3', 'j7', 'j8', 'j9'],
      bulkRetryJobs: ['brj1'],
    });
  });

  test('should return correct results when there are integration level bulk retry jobs in running state', () => {
    const _integrationId = 'i1';
    let state = reducer(
      undefined,
      actions.job.receivedCollection({
        collection: [
          {
            _id: 'j1',
            type: JOB_TYPES.FLOW,
            status: JOB_STATUS.QUEUED,
            _integrationId,
          },
          {
            _id: 'j2',
            type: JOB_TYPES.FLOW,
            status: JOB_STATUS.RUNNING,
          },
          {
            _id: 'j3',
            type: JOB_TYPES.FLOW,
            status: JOB_STATUS.RETRYING,
          },
          {
            _id: 'j4',
            type: JOB_TYPES.FLOW,
            status: JOB_STATUS.COMPLETED,
          },
          {
            _id: 'j5',
            type: JOB_TYPES.FLOW,
            status: JOB_STATUS.CANCELED,
          },
          {
            _id: 'j6',
            type: JOB_TYPES.FLOW,
            status: JOB_STATUS.FAILED,
          },
          {
            _id: 'j7',
            type: JOB_TYPES.FLOW,
            status: JOB_STATUS.CANCELED,
          },
          {
            _id: 'j8',
            type: JOB_TYPES.FLOW,
            status: JOB_STATUS.FAILED,
          },
          {
            _id: 'j9',
            type: JOB_TYPES.FLOW,
            status: JOB_STATUS.COMPLETED,
          },
          {
            _id: 'j10',
            type: JOB_TYPES.FLOW,
            status: JOB_STATUS.CANCELED,
          },
          {
            _id: 'j11',
            type: JOB_TYPES.FLOW,
            status: JOB_STATUS.FAILED,
          },
          {
            _id: 'j12',
            type: JOB_TYPES.FLOW,
            status: JOB_STATUS.COMPLETED,
          },
          {
            _id: 'brj1',
            type: JOB_TYPES.BULK_RETRY,
            status: JOB_STATUS.RUNNING,
          },
          {
            _id: 'brj2',
            type: JOB_TYPES.BULK_RETRY,
            status: JOB_STATUS.COMPLETED,
          },
          {
            _id: 'brj3',
            type: JOB_TYPES.BULK_RETRY,
            status: JOB_STATUS.FAILED,
          },
        ],
      })
    );
    const jobsWithChildren = [
      {
        _id: 'j7',
        type: JOB_TYPES.FLOW,
        status: JOB_STATUS.CANCELED,
        children: [
          {
            type: JOB_TYPES.EXPORT,
            status: JOB_STATUS.COMPLETED,
          },
          {
            type: JOB_TYPES.IMPORT,
            status: JOB_STATUS.RETRYING,
          },
        ],
      },
      {
        _id: 'j8',
        type: JOB_TYPES.FLOW,
        status: JOB_STATUS.FAILED,
        children: [
          {
            type: JOB_TYPES.EXPORT,
            status: JOB_STATUS.COMPLETED,
          },
          {
            type: JOB_TYPES.IMPORT,
            status: JOB_STATUS.RUNNING,
          },
        ],
      },
      {
        _id: 'j9',
        type: JOB_TYPES.FLOW,
        status: JOB_STATUS.COMPLETED,
        children: [
          {
            type: JOB_TYPES.EXPORT,
            status: JOB_STATUS.COMPLETED,
          },
          {
            type: JOB_TYPES.IMPORT,
            status: JOB_STATUS.QUEUED,
          },
        ],
      },
      {
        _id: 'j10',
        type: JOB_TYPES.FLOW,
        status: JOB_STATUS.CANCELED,
        children: [
          {
            type: JOB_TYPES.EXPORT,
            status: JOB_STATUS.COMPLETED,
          },
          {
            type: JOB_TYPES.IMPORT,
            status: JOB_STATUS.CANCELED,
          },
        ],
      },
      {
        _id: 'j11',
        type: JOB_TYPES.FLOW,
        status: JOB_STATUS.FAILED,
        children: [
          {
            type: JOB_TYPES.EXPORT,
            status: JOB_STATUS.COMPLETED,
          },
          {
            type: JOB_TYPES.IMPORT,
            status: JOB_STATUS.FAILED,
          },
        ],
      },
      {
        _id: 'j12',
        type: JOB_TYPES.FLOW,
        status: JOB_STATUS.COMPLETED,
        children: [
          {
            type: JOB_TYPES.EXPORT,
            status: JOB_STATUS.COMPLETED,
          },
          {
            type: JOB_TYPES.IMPORT,
            status: JOB_STATUS.COMPLETED,
          },
        ],
      },
    ];

    jobsWithChildren.forEach(job => {
      state = reducer(
        state,
        actions.job.receivedFamily({
          job,
        })
      );
    });

    expect(selectors.inProgressJobIds(state)).toEqual({
      flowJobs: ['j1', 'j2', 'j3', 'j7', 'j8', 'j9'],
      bulkRetryJobs: ['brj1'],
    });
  });
});
