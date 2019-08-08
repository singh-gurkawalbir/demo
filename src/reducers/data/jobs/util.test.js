/* global describe, test, expect */
import each from 'jest-each';
import moment from 'moment';
import { JOB_TYPES, JOB_STATUS } from '../../../utils/constants';
import {
  getJobDuration,
  getFlowJobIdsThatArePartOfABulkRetryJob,
  getFlowJobIdsThatArePartOfBulkRetryJobs,
  DEFAULT_JOB_PROPS,
  parseJobs,
  parseJobFamily,
} from './util';

describe('getJobDuration util method', () => {
  const testCases = [
    [undefined, {}],
    [undefined, { endedAt: moment().toISOString() }],
    [undefined, { startedAt: moment().toISOString() }],
    [
      '00:00:00',
      {
        startedAt: moment().toISOString(),
        endedAt: moment()
          .add(100, 'ms')
          .toISOString(),
      },
    ],
    [
      '00:00:01',
      {
        startedAt: moment().toISOString(),
        endedAt: moment()
          .add(1, 's')
          .toISOString(),
      },
    ],
    [
      '00:00:59',
      {
        startedAt: moment().toISOString(),
        endedAt: moment()
          .add(59, 's')
          .toISOString(),
      },
    ],
    [
      '00:01:00',
      {
        startedAt: moment().toISOString(),
        endedAt: moment()
          .add(1, 'm')
          .toISOString(),
      },
    ],
    [
      '00:59:58',
      {
        startedAt: moment().toISOString(),
        endedAt: moment()
          .add(59, 'm')
          .add(58, 's')
          .toISOString(),
      },
    ],
    [
      '01:00:00',
      {
        startedAt: moment().toISOString(),
        endedAt: moment()
          .add(1, 'h')
          .toISOString(),
      },
    ],
    [
      '01:00:01',
      {
        startedAt: moment().toISOString(),
        endedAt: moment()
          .add(1, 'h')
          .add(1, 's')
          .toISOString(),
      },
    ],
    [
      '01:01:59',
      {
        startedAt: moment().toISOString(),
        endedAt: moment()
          .add(1, 'h')
          .add(1, 'm')
          .add(59, 's')
          .toISOString(),
      },
    ],
    [
      '23:59:59',
      {
        startedAt: moment().toISOString(),
        endedAt: moment()
          .add(23, 'h')
          .add(59, 'm')
          .add(59, 's')
          .toISOString(),
      },
    ],
    [
      '30:59:59',
      {
        startedAt: moment().toISOString(),
        endedAt: moment()
          .add(1, 'd')
          .add(6, 'h')
          .add(59, 'm')
          .add(59, 's')
          .toISOString(),
      },
    ],
    [
      '59:59:59',
      {
        startedAt: moment().toISOString(),
        endedAt: moment()
          .add(2, 'd')
          .add(11, 'h')
          .add(59, 'm')
          .add(59, 's')
          .toISOString(),
      },
    ],
  ];

  each(testCases).test('should return %s for %o', (expected, job) => {
    expect(getJobDuration(job)).toEqual(expected);
  });
});

describe('getFlowJobIdsThatArePartOfABulkRetryJob util method', () => {
  const flowJobs = [
    {
      _flowId: 'f1',
      _id: 'f1j1',
      type: JOB_TYPES.FLOW,
      status: JOB_STATUS.RUNNING,
      numError: 1,
    },
    {
      _flowId: 'f1',
      _id: 'f1j2',
      type: JOB_TYPES.FLOW,
      status: JOB_STATUS.COMPLETED,
      numError: 0,
    },
    {
      _flowId: 'f1',
      _id: 'f1j3',
      type: JOB_TYPES.FLOW,
      status: JOB_STATUS.COMPLETED,
      numError: 5,
    },
    {
      _flowId: 'f2',
      _id: 'f2j1',
      type: JOB_TYPES.FLOW,
      status: JOB_STATUS.RUNNING,
    },
    {
      _flowId: 'f2',
      _id: 'f2j2',
      type: JOB_TYPES.FLOW,
      status: JOB_STATUS.FAILED,
      numError: 0,
    },
    {
      _flowId: 'f2',
      _id: 'f2j3',
      type: JOB_TYPES.FLOW,
      status: JOB_STATUS.FAILED,
      numError: 5,
    },
    {
      _flowId: 'f3',
      _id: 'f3j1',
      type: JOB_TYPES.FLOW,
      status: JOB_STATUS.CANCELED,
    },
    {
      _flowId: 'f3',
      _id: 'f3j2',
      type: JOB_TYPES.FLOW,
      status: JOB_STATUS.CANCELED,
      numError: 6,
    },
    {
      _flowId: 'f3',
      _id: 'f3j3',
      type: JOB_TYPES.FLOW,
      status: JOB_STATUS.QUEUED,
    },
  ];
  const testCases = [
    [[], { flowJobs, bulkRetryJob: { status: JOB_STATUS.RUNNING } }],
    [
      ['f1j3', 'f2j3', 'f3j2'],
      {
        flowJobs,
        bulkRetryJob: { status: JOB_STATUS.QUEUED },
      },
    ],
    [
      ['f1j3'],
      {
        flowJobs,
        bulkRetryJob: { status: JOB_STATUS.QUEUED, _flowId: 'f1' },
      },
    ],
    [
      ['f2j3'],
      {
        flowJobs,
        bulkRetryJob: { status: JOB_STATUS.QUEUED, _flowId: 'f2' },
      },
    ],
    [
      ['f3j2'],
      {
        flowJobs,
        bulkRetryJob: { status: JOB_STATUS.QUEUED, _flowId: 'f3' },
      },
    ],
  ];

  each(testCases).test('should return %o for %o', (expected, data) => {
    expect(
      getFlowJobIdsThatArePartOfABulkRetryJob(data.flowJobs, data.bulkRetryJob)
    ).toEqual(expected);
  });
});

describe('getFlowJobIdsThatArePartOfBulkRetryJobs util method', () => {
  const flowJobs = [
    {
      _flowId: 'f1',
      _id: 'f1j1',
      type: JOB_TYPES.FLOW,
      status: JOB_STATUS.RUNNING,
      numError: 1,
    },
    {
      _flowId: 'f1',
      _id: 'f1j2',
      type: JOB_TYPES.FLOW,
      status: JOB_STATUS.COMPLETED,
      numError: 0,
    },
    {
      _flowId: 'f1',
      _id: 'f1j3',
      type: JOB_TYPES.FLOW,
      status: JOB_STATUS.COMPLETED,
      numError: 5,
    },
    {
      _flowId: 'f2',
      _id: 'f2j1',
      type: JOB_TYPES.FLOW,
      status: JOB_STATUS.RUNNING,
    },
    {
      _flowId: 'f2',
      _id: 'f2j2',
      type: JOB_TYPES.FLOW,
      status: JOB_STATUS.FAILED,
      numError: 0,
    },
    {
      _flowId: 'f2',
      _id: 'f2j3',
      type: JOB_TYPES.FLOW,
      status: JOB_STATUS.FAILED,
      numError: 5,
    },
    {
      _flowId: 'f3',
      _id: 'f3j1',
      type: JOB_TYPES.FLOW,
      status: JOB_STATUS.CANCELED,
    },
    {
      _flowId: 'f3',
      _id: 'f3j2',
      type: JOB_TYPES.FLOW,
      status: JOB_STATUS.CANCELED,
      numError: 6,
    },
    {
      _flowId: 'f3',
      _id: 'f3j3',
      type: JOB_TYPES.FLOW,
      status: JOB_STATUS.QUEUED,
    },
  ];
  const testCases = [
    [[], { flowJobs, bulkRetryJobs: [{ status: JOB_STATUS.RUNNING }] }],
    [
      ['f1j3', 'f2j3', 'f3j2'],
      {
        flowJobs,
        bulkRetryJobs: [{ status: JOB_STATUS.QUEUED }],
      },
    ],
    [
      ['f1j3'],
      {
        flowJobs,
        bulkRetryJobs: [{ status: JOB_STATUS.QUEUED, _flowId: 'f1' }],
      },
    ],
    [
      ['f2j3', 'f3j2'],
      {
        flowJobs,
        bulkRetryJobs: [
          { status: JOB_STATUS.QUEUED, _flowId: 'f2' },
          { status: JOB_STATUS.QUEUED, _flowId: 'f3' },
        ],
      },
    ],
  ];

  each(testCases).test('should return %o for %o', (expected, data) => {
    expect(
      getFlowJobIdsThatArePartOfBulkRetryJobs(data.flowJobs, data.bulkRetryJobs)
    ).toEqual(expected);
  });
});

describe('parseJobs util method', () => {
  test('should return correct results', () => {
    const jobs = [
      {
        _id: 'j1',
      },
      {
        _id: 'fj1',
        type: JOB_TYPES.FLOW,
        numError: 1,
        numResolved: 2,
      },
      {
        _id: 'brj1',
        type: JOB_TYPES.BULK_RETRY,
      },
      {
        _id: 'brj2',
        type: JOB_TYPES.BULK_RETRY,
      },
      {
        _id: 'fj2',
        type: JOB_TYPES.FLOW,
        numSuccess: 3,
        numIgnore: 4,
      },
      {
        _id: 'fj3',
        type: JOB_TYPES.FLOW,
      },
    ];
    const flowJobs = jobs
      .filter(job => job.type === JOB_TYPES.FLOW)
      .map(job => ({
        ...DEFAULT_JOB_PROPS,
        ...job,
      }));
    const bulkRetryJobs = jobs.filter(job => job.type === JOB_TYPES.BULK_RETRY);

    expect(parseJobs(jobs)).toEqual({
      flowJobs,
      bulkRetryJobs,
    });
  });
});

describe('parseJobFamily util method', () => {
  const testCases = [
    [DEFAULT_JOB_PROPS, {}],
    [{ ...DEFAULT_JOB_PROPS, _id: 'something' }, { _id: 'something' }],
    [
      { ...DEFAULT_JOB_PROPS, ...{ something: 'else', numError: 1 } },
      { something: 'else', numError: 1 },
    ],
    [
      { ...DEFAULT_JOB_PROPS, ...{ numResolved: 5, numSuccess: 10 } },
      { numResolved: 5, numSuccess: 10 },
    ],
    [
      {
        ...DEFAULT_JOB_PROPS,
        ...{
          numError: 1,
          numResolved: 2,
          numSuccess: 3,
          numIgnore: 2,
          numPagesGenerated: 10,
          numPagesProcessed: 5,
        },
      },
      {
        numError: 1,
        numResolved: 2,
        numSuccess: 3,
        numIgnore: 2,
        numPagesGenerated: 10,
        numPagesProcessed: 5,
      },
    ],
    [
      { ...DEFAULT_JOB_PROPS, children: [{ ...DEFAULT_JOB_PROPS }] },
      { children: [{}] },
    ],
    [
      {
        ...DEFAULT_JOB_PROPS,
        ...{
          numPagesProcessed: 1,
          children: [
            { ...DEFAULT_JOB_PROPS, something: 'else', numPagesGenerated: 6 },
          ],
        },
      },
      {
        numPagesProcessed: 1,
        children: [{ something: 'else', numPagesGenerated: 6 }],
      },
    ],
    [
      {
        ...DEFAULT_JOB_PROPS,
        ...{
          numResolved: 5,
          numSuccess: 10,
          children: [
            {
              ...DEFAULT_JOB_PROPS,
              something: 'else',
              numError: 1,
              numResolved: 2,
              numSuccess: 3,
            },
            {
              ...DEFAULT_JOB_PROPS,
              somethingelse: 'something',
              numIgnore: 2,
              numPagesGenerated: 10,
              numPagesProcessed: 5,
            },
          ],
        },
      },
      {
        numResolved: 5,
        numSuccess: 10,
        children: [
          { numError: 1, numResolved: 2, numSuccess: 3, something: 'else' },
          {
            numIgnore: 2,
            numPagesGenerated: 10,
            numPagesProcessed: 5,
            somethingelse: 'something',
          },
        ],
      },
    ],
  ];

  each(testCases).test('should return %o for %o', (expected, job) => {
    expect(parseJobFamily(job)).toEqual(expected);
  });
});
