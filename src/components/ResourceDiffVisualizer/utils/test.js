/* global describe, test, expect */

import { fetchConflictsOnBothBases, _serializeConflicts } from '.';

describe('serializeConflicts util test cases', () => {
  test('should return empty array incase of no conflicts', () => {
    expect(_serializeConflicts()).toEqual([]);
    expect(_serializeConflicts([])).toEqual([]);
    expect(_serializeConflicts(null)).toEqual([]);
  });
  test('should return expected conflicts list with path, op and value incase of linear conflicts', () => {
    const conflicts = [
      {
        path: ['/', 'name'],
        op: 'replace',
        value: 'Get Data from Mockable And Put to Http name'},
    ];
    const serializedConflicts = [{
      path: '/name',
      op: 'replace',
      value: 'Get Data from Mockable And Put to Http name',
    }];

    expect(_serializeConflicts(conflicts)).toEqual(serializedConflicts);
  });
  test('should return the expected conflicts incase of nested conflicts', () => {
    const nestedConflicts = [
      {
        path: ['/', 'name'],
        op: 'replace',
        value: 'Get Data from Mockable And Put to Http name',
      },
      {
        path: ['/', 'pageGenerators'],
        ops: [
          {
            path: [0],
            op: 'remove',
          },
        ],
      },
      {
        path: ['/', 'pageGenerators', '1', '_exportId'],
        op: 'replace',
        value: '5fdb2e5f4b36fc1e15b27cf1',
      },
    ];
    const serializedConflicts = [
      {
        path: '/name',
        op: 'replace',
        value: 'Get Data from Mockable And Put to Http name',
      },
      {
        path: '/pageGenerators/0',
        op: 'remove',
      },
      {
        path: '/pageGenerators/1/_exportId',
        op: 'replace',
        value: '5fdb2e5f4b36fc1e15b27cf1',
      },
    ];

    expect(_serializeConflicts(nestedConflicts)).toEqual(serializedConflicts);
  });
});

describe('fetchConflictsOnBothBases util test cases', () => {
  test('should return empty array incase of no conflicts', () => {
    expect(fetchConflictsOnBothBases()).toEqual([]);
    expect(fetchConflictsOnBothBases([])).toEqual([]);
    expect(fetchConflictsOnBothBases(null)).toEqual([]);
  });
});
