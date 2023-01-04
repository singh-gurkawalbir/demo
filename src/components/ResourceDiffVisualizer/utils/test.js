
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
  test('should return set of current and remote\'s serialized conflicts', () => {
    // Each conflict has both current and remote's conflict objects
    const conflicts = [
      [
        {
          path: [
            '/',
            'name',
          ],
          op: 'replace',
          value: 'Get Data from Mockable And Put to Http name',
        },
        {
          path: [
            '/',
            'name',
          ],
          op: 'replace',
          value: 'Get Data from Mockable And Put to Http updated',
        },
      ],
    ];
    const expectedConflicts = [
      {
        current: {
          path: '/name',
          op: 'replace',
          value: 'Get Data from Mockable And Put to Http name',
        },
        remote: {
          path: '/name',
          op: 'replace',
          value: 'Get Data from Mockable And Put to Http updated',
        },
      },
    ];

    expect(fetchConflictsOnBothBases(conflicts)).toEqual(expectedConflicts);
  });
  test('should return set of serialized conflicts incase of nested and multiple conflicts', () => {
    const conflicts = [
      [
        {
          path: ['/', 'name'],
          op: 'replace',
          value: 'Get Data from Mockable And Put to Http name',
        },
        {
          path: ['/', 'name'],
          op: 'replace',
          value: 'Get Data from Mockable And Put to Http updated',
        },
      ],
      [
        {
          path: ['/', 'pageGenerators'],
          ops: [{ path: [0], op: 'remove' }],
        },
        {
          path: ['/', 'pageGenerators'],
          ops: [
            { path: [0, '_exportId'], op: 'replace', value: '5fdb2e5f4b36fc1e15b27cf1' },
          ],
        },
      ],
      [
        {
          path: ['/', 'pageGenerators', '1', '_exportId'],
          op: 'replace',
          value: '5fdb2e5f4b36fc1e15b27cf1',
        },
        {
          path: ['/', 'pageGenerators', '1', '_exportId'],
          op: 'replace',
          value: '623c1ddba9ff053c3dbc63c4.new',
        },
      ],
    ];

    const expectedConflicts = [
      {
        current: {
          path: '/name',
          op: 'replace',
          value: 'Get Data from Mockable And Put to Http name',
        },
        remote: {
          path: '/name',
          op: 'replace',
          value: 'Get Data from Mockable And Put to Http updated',
        },
      },
      {
        current: { path: '/pageGenerators/0', op: 'remove'},
        remote: { path: '/pageGenerators/0/_exportId', op: 'replace', value: '5fdb2e5f4b36fc1e15b27cf1'},
      },
      {
        current: {path: '/pageGenerators/1/_exportId', op: 'replace', value: '5fdb2e5f4b36fc1e15b27cf1'},
        remote: {path: '/pageGenerators/1/_exportId', op: 'replace', value: '623c1ddba9ff053c3dbc63c4.new'},
      },
    ];

    expect(fetchConflictsOnBothBases(conflicts)).toEqual(expectedConflicts);
  });
});
