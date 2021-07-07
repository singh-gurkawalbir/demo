/* global expect, describe, test */
import moment from 'moment';
import { getFilteredErrors, getErrorMapWithTotal, getOpenErrorDetailsMap, getErrorCountDiffMap, getSourceOptions, getJobStatus, getJobDuration } from '.';

describe('getFilteredErrors util', () => {
  test('should return empty list when no errors or empty errors are passed', () => {
    expect(getFilteredErrors()).toEqual([]);
    expect(getFilteredErrors([])).toEqual([]);
  });
  test('should return filteredList when passed a keyword searchBy items', () => {
    const errors = [
      { errorId: 'error-123', message: 'error1', retryDataKey: '234'},
      { errorId: 'error-456', message: 'error2', retryDataKey: '123'},
      { errorId: 'error-789', message: 'error3', retryDataKey: '567'},
    ];
    const searchBy = ['errorId', 'message'];
    const expectedFilteredList1 = [
      { errorId: 'error-123', message: 'error1', retryDataKey: '234'},
      { errorId: 'error-456', message: 'error2', retryDataKey: '123'},
      { errorId: 'error-789', message: 'error3', retryDataKey: '567'},
    ];
    const expectedFilteredList2 = [
      { errorId: 'error-456', message: 'error2', retryDataKey: '123'},
    ];
    const expectedFilteredList3 = [
      { errorId: 'error-123', message: 'error1', retryDataKey: '234'},
    ];

    expect(getFilteredErrors(errors, { keyword: 'error', searchBy })).toEqual(expectedFilteredList1);
    expect(getFilteredErrors(errors, { keyword: 'error2', searchBy })).toEqual(expectedFilteredList2);
    expect(getFilteredErrors(errors, { keyword: 'error-123', searchBy })).toEqual(expectedFilteredList3);
  });
  test('should return empty list when passed a invalid key word to search or searchBy is empty/invalid', () => {
    const errors = [
      { errorId: 'error-123', message: 'error1', retryDataKey: '234'},
      { errorId: 'error-456', message: 'error2', retryDataKey: '123'},
      { errorId: 'error-789', message: 'error3', retryDataKey: '567'},
    ];
    const searchBy = ['errorId', 'message'];
    const invalidSearchBy = ['name', 'address'];

    expect(getFilteredErrors(errors, { keyword: 'test', searchBy })).toEqual([]);
    expect(getFilteredErrors(errors, { keyword: 'error1', searchBy: [] })).toEqual([]);
    expect(getFilteredErrors(errors, { keyword: 'error1', searchBy: invalidSearchBy })).toEqual([]);
  });
});

describe('getErrorMapWithTotal util', () => {
  const flowErrors = [
    { _flowId: '5e44efa28015c94642722579', numError: 10 },
    { _flowId: '5f2c1b137cfd96633f3b327a', numError: 20 },
    { _flowId: '5f2cfcecfd0b8e14fef26ede', numError: 30 },
    { _flowId: '5f36bf0d8792a02cbf848dac', numError: 40 },
    { _flowId: '5f3cd5f49e86ec0ad770bdac', numError: 50 },
  ];

  test('should return empty map and count as 0 when there is empty list or no resourceId', () => {
    const expectedEmptyMap = { data: {}, total: 0 };

    expect(getErrorMapWithTotal()).toEqual(expectedEmptyMap);
    expect(getErrorMapWithTotal([], '_flowId')).toEqual(expectedEmptyMap);
    expect(getErrorMapWithTotal(flowErrors)).toEqual(expectedEmptyMap);
    expect(getErrorMapWithTotal(flowErrors, '_exportId')).toEqual(expectedEmptyMap);
  });
  test('should return map of resourceIds and respective error counts for data and total of all errors ', () => {
    const expectedMap = {
      data: {
        '5e44efa28015c94642722579': 10,
        '5f2c1b137cfd96633f3b327a': 20,
        '5f2cfcecfd0b8e14fef26ede': 30,
        '5f36bf0d8792a02cbf848dac': 40,
        '5f3cd5f49e86ec0ad770bdac': 50,
      },
      total: 150,
    };

    expect(getErrorMapWithTotal(flowErrors, '_flowId')).toEqual(expectedMap);
  });
});

describe('getOpenErrorDetailsMap util', () => {
  const lastErrorAt = new Date().toISOString();
  const flowErrors = [
    { _flowId: '5e44efa28015c94642722579', numError: 10, lastErrorAt },
    { _flowId: '5f2c1b137cfd96633f3b327a', numError: 20 },
    { _flowId: '5f2cfcecfd0b8e14fef26ede', numError: 30, lastErrorAt },
    { _flowId: '5f36bf0d8792a02cbf848dac', numError: 40 },
    { _flowId: '5f3cd5f49e86ec0ad770bdac', numError: 50 },
  ];

  test('should return empty map  when there is empty list or no resourceId', () => {
    const expectedEmptyMap = {};

    expect(getOpenErrorDetailsMap()).toEqual(expectedEmptyMap);
    expect(getOpenErrorDetailsMap([], '_flowId')).toEqual(expectedEmptyMap);
    expect(getOpenErrorDetailsMap(flowErrors)).toEqual(expectedEmptyMap);
    expect(getOpenErrorDetailsMap(flowErrors, '_exportId')).toEqual(expectedEmptyMap);
  });
  test('should return map of resourceIds and respective error counts for data and total of all errors ', () => {
    const expectedMap = {
      '5e44efa28015c94642722579': { _flowId: '5e44efa28015c94642722579', numError: 10, lastErrorAt },
      '5f2c1b137cfd96633f3b327a': { _flowId: '5f2c1b137cfd96633f3b327a', numError: 20 },
      '5f2cfcecfd0b8e14fef26ede': { _flowId: '5f2cfcecfd0b8e14fef26ede', numError: 30, lastErrorAt },
      '5f36bf0d8792a02cbf848dac': { _flowId: '5f36bf0d8792a02cbf848dac', numError: 40 },
      '5f3cd5f49e86ec0ad770bdac': { _flowId: '5f3cd5f49e86ec0ad770bdac', numError: 50 },
    };

    expect(getOpenErrorDetailsMap(flowErrors, '_flowId')).toEqual(expectedMap);
  });
});

describe('getErrorCountDiffMap util', () => {
  test('should return empty object incase of no/empty error maps passed', () => {
    expect(getErrorCountDiffMap()).toEqual({});
    expect(getErrorCountDiffMap({}, {})).toEqual({});
  });
  test('should return map of resourceIds whose error counts differ and shown negitive if reduced and positive diff when error are increased', () => {
    const prevErrorMap1 = {
      id1: 10,
      id2: 10,
      id3: 10,
      id4: 10,
    };
    const currErrorMap1 = {};

    expect(getErrorCountDiffMap(prevErrorMap1, currErrorMap1)).toEqual({
      id1: -10,
      id2: -10,
      id3: -10,
      id4: -10,
    });
    const prevErrorMap2 = {};
    const currErrorMap2 = {
      id1: 10,
      id2: 10,
      id3: 10,
      id4: 10,
    };

    expect(getErrorCountDiffMap(prevErrorMap2, currErrorMap2)).toEqual({
      id1: 10,
      id2: 10,
      id3: 10,
      id4: 10,
    });
    const prevErrorMap3 = {
      id1: 10,
      id5: 20,
      id3: 40,
      id4: 11,
    };
    const currErrorMap3 = {
      id1: 10,
      id2: 10,
      id3: 10,
      id4: 10,
    };

    expect(getErrorCountDiffMap(prevErrorMap3, currErrorMap3)).toEqual({
      id2: 10,
      id3: -30,
      id4: -1,
      id5: -20,
    });
  });
  test('should return empty object if the maps are same and no count is changed', () => {
    const prevErrorMap = {
      id1: 10,
      id2: 10,
      id3: 10,
      id4: 10,
    };
    const currErrorMap = {
      id1: 10,
      id2: 10,
      id3: 10,
      id4: 10,
    };

    expect(getErrorCountDiffMap(prevErrorMap, currErrorMap)).toEqual({});
  });
});

describe('getSourceOptions util', () => {
  test('should return  empty list when there are no sources', () => {
    expect(getSourceOptions()).toEqual([]);
    expect(getSourceOptions([])).toEqual([]);
  });
  test('should return sorted list with source names and ids', () => {
    const sampleSourceList = ['internal', 'resource', 'output_filter'];
    const result = [
      { _id: 'all', name: 'All sources'},
      { _id: 'internal', name: 'Internal' },
      { _id: 'output_filter', name: 'Output filter' },
      { _id: 'resource', name: 'Resource' },
    ];

    expect(getSourceOptions(sampleSourceList)).toEqual(result);
  });
  test('should return passed sourceId as name also if the passed id is not a valid one from the list ', () => {
    const sampleSourceList = ['internal', 'resource', 'invalidId'];
    const result = [
      { _id: 'all', name: 'All sources'},
      { _id: 'internal', name: 'Internal' },
      { _id: 'resource', name: 'Resource' },
      { _id: 'invalidId', name: 'invalidId' },
    ];

    expect(getSourceOptions(sampleSourceList)).toEqual(result);
  });
  test('should return list with passed application name or default to Application if the source has application as id ', () => {
    const sampleSourceList = ['internal', 'resource', 'application'];
    const applicationName = 'Zendesk';
    const result = [
      { _id: 'all', name: 'All sources'},
      { _id: 'internal', name: 'Internal' },
      { _id: 'resource', name: 'Resource' },
      { _id: 'application', name: applicationName},
    ];
    const resultWithoutApplicationName = [
      { _id: 'all', name: 'All sources'},
      { _id: 'application', name: 'Application'},
      { _id: 'internal', name: 'Internal' },
      { _id: 'resource', name: 'Resource' },
    ];

    expect(getSourceOptions(sampleSourceList, applicationName)).toEqual(result);
    expect(getSourceOptions(sampleSourceList)).toEqual(resultWithoutApplicationName);
  });
});

describe('getJobDuration util', () => {
  test('should return undefined incase of invalid job or job with no startedAt and endedAt', () => {
    expect(getJobDuration()).toBeUndefined();
    expect(getJobDuration({})).toBeUndefined();
    expect(getJobDuration({})).toBeUndefined();
    expect(getJobDuration({ endedAt: moment().toISOString() })).toBeUndefined();
    expect(getJobDuration({ startedAt: moment().toISOString() })).toBeUndefined();
  });
  test('should return the valid job duration when valid startedAt and endedAt properties exist on the passed job', () => {
    const job1 = {startedAt: moment().toISOString(), endedAt: moment().add(100, 'ms').toISOString() };
    const job2 = { startedAt: moment().toISOString(), endedAt: moment().add(1, 's').toISOString() };
    const job3 = {
      startedAt: moment().toISOString(),
      endedAt: moment()
        .add(2, 'd')
        .add(11, 'h')
        .add(59, 'm')
        .add(59, 's')
        .toISOString(),
    };

    expect(getJobDuration(job1)).toBe('00:00:00');
    expect(getJobDuration(job2)).toBe('00:00:01');
    expect(getJobDuration(job3)).toBe('59:59:59');
  });
});
describe('getJobStatus util', () => {
  test('should return undefined incase of invalid job or job with no status', () => {
    expect(getJobStatus()).toBeUndefined();
    expect(getJobStatus({})).toBeUndefined();
  });
  test('should return mapped status name if the status is valid else return the passed job status', () => {
    const jobWithValidStatus = { _id: 'job123', status: 'completed' };
    const jobWithInValidStatus = { _id: 'job123', status: 'INVALID' };

    expect(getJobStatus(jobWithValidStatus)).toBe('Completed');
    expect(getJobStatus(jobWithInValidStatus)).toBe('INVALID');
  });
});

