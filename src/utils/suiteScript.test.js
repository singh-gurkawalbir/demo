/* global describe, test, expect */
import each from 'jest-each';
import {
  flowTypeFromId,
  generateUniqueFlowId,
  getFlowIdAndTypeFromUniqueId,
  suiteScriptResourceKey,
  isJavaFlow,
  flowType,
  flowSupportsMapping,
  flowAllowsScheduling,
  isFlowRunnable,
} from './suiteScript';

describe('flowTypeFromId util method', () => {
  test('should return flow type as REALTIME_EXPORT for flow id re1234', () => {
    expect(flowTypeFromId('re1234')).toEqual('REALTIME_EXPORT');
  });
  test('should return flow type as REALTIME_IMPORT for flow id ri567', () => {
    expect(flowTypeFromId('ri567')).toEqual('REALTIME_IMPORT');
  });
  test('should return flow type as EXPORT for flow id e2', () => {
    expect(flowTypeFromId('e2')).toEqual('EXPORT');
  });
  test('should return flow type as IMPORT for flow id i1234', () => {
    expect(flowTypeFromId('i1234')).toEqual('IMPORT');
  });
  test('should return flow type as undefined for flow id 3456', () => {
    expect(flowTypeFromId('3456')).toEqual(undefined);
  });
});

describe('generateUniqueFlowId util method', () => {
  test('should return e3456 when flow type is export and id is 3456', () => {
    expect(generateUniqueFlowId('3456', 'EXPORT')).toEqual('e3456');
  });
  test('should return i345 when flow type is import and id is 345', () => {
    expect(generateUniqueFlowId('345', 'IMPORT')).toEqual('i345');
  });
  test('should return re345 when flow type is realtime export and id is 345', () => {
    expect(generateUniqueFlowId('345', 'REALTIME_EXPORT')).toEqual('re345');
  });
  test('should return ri345 when flow type is realtime import and id is 345', () => {
    expect(generateUniqueFlowId('345', 'REALTIME_IMPORT')).toEqual('ri345');
  });
  test('should return undefined345 when flow type is something and id is 345', () => {
    expect(generateUniqueFlowId('345', 'something')).toEqual('undefined345');
  });
});

describe('getFlowIdAndTypeFromUniqueId util method', () => {
  test('should return correct type and id for export flow', () => {
    expect(getFlowIdAndTypeFromUniqueId('e123')).toEqual({flowType: 'EXPORT', flowId: '123'});
  });
  test('should return correct type and id for import flow', () => {
    expect(getFlowIdAndTypeFromUniqueId('i456')).toEqual({flowType: 'IMPORT', flowId: '456'});
  });
  test('should return correct type and id for realtime export flow', () => {
    expect(getFlowIdAndTypeFromUniqueId('re123')).toEqual({flowType: 'REALTIME_EXPORT', flowId: '123'});
  });
  test('should return correct type and id for realtime import flow', () => {
    expect(getFlowIdAndTypeFromUniqueId('ri123')).toEqual({flowType: 'REALTIME_IMPORT', flowId: '123'});
  });
  test('should return correct type and id for other flow', () => {
    expect(getFlowIdAndTypeFromUniqueId('123')).toEqual({ flowId: '123'});
  });
});

describe('suiteScriptResourceKey util method', () => {
  const testCases = [
    [
      'c1-abc-123',
      { ssLinkedConnectionId: 'c1', resourceType: 'abc', resourceId: '123' },
    ],
    [
      'undefined-null-undefined',
      { resourceType: null },
    ],
    [
      'null-xyz-123',
      { ssLinkedConnectionId: null, resourceType: 'xyz', resourceId: '123' },
    ],
  ];

  each(testCases).test(
    'should return %s for %o',
    (expected, input) => {
      expect(suiteScriptResourceKey(input)).toEqual(expected);
    }
  );
});

describe('isJavaFlow util method', () => {
  const testCases = [
    [
      false,
      undefined,
    ],
    [
      false,
      {},
    ],
    [
      false,
      { locationQualifier: '' },
    ],
    [
      false,
      { locationQualifier: '    ' },
    ],
    [
      true,
      { locationQualifier: 'something' },
    ],
    [
      true,
      { locationQualifier: '  abcd   ' },
    ],
    [
      true,
      { type: 'REALTIME_EXPORT' },
    ],
    [
      true,
      { type: 'REALTIME_IMPORT' },
    ],
    [
      false,
      { type: 'REALTIME_EXPORT', hasConfiguration: true },
    ],
    [
      false,
      { type: 'REALTIME_IMPORT', hasConfiguration: true },
    ],
    [
      false,
      { type: 'something' },
    ],
    [
      false,
      { type: 'something', hasConfiguration: true },
    ],
  ];

  each(testCases).test(
    'should return %s for %o',
    (expected, input) => {
      expect(isJavaFlow(input)).toEqual(expected);
    }
  );
});

describe('flowType util method', () => {
  const testCases = [
    [
      null,
      undefined,
    ],
    [
      null,
      { type: 'REALTIME_EXPORT' },
    ],
    [
      null,
      { type: 'REALTIME_IMPORT' },
    ],
    [
      'Scheduled',
      { type: 'EXPORT' },
    ],
    [
      'Scheduled',
      { type: 'IMPORT' },
    ],
    [
      'Realtime',
      { type: 'REALTIME_EXPORT', hasConfiguration: true },
    ],
    [
      'Realtime',
      { type: 'REALTIME_IMPORT', hasConfiguration: true },
    ],
  ];

  each(testCases).test(
    'should return %s for %o',
    (expected, input) => {
      expect(flowType(input)).toEqual(expected);
    }
  );
});

describe('flowSupportsMapping util method', () => {
  const testCases = [
    [
      false,
      undefined,
    ],
    [
      false,
      { },
    ],
    [
      false,
      { editable: false },
    ],
    [
      true,
      { editable: true },
    ],
    [
      true,
      { editable: true, import: {} },
    ],
    [
      true,
      { editable: true, export: {} },
    ],
    [
      false,
      { editable: true, export: { type: 'MY_COMPUTER' } },
    ],
    [
      false,
      { editable: true, import: { type: 'ACTIVITY_STREAM' } },
    ],
    [
      false,
      { editable: true, import: { type: 'ftp' } },
    ],
    [
      false,
      { editable: true, import: { type: 'magento' } },
    ],
    [
      false,
      { editable: true, import: { type: 'ebay' }, export: {} },
    ],
    [
      true,
      { editable: true, import: { type: 'abcd' }, export: {} },
    ],
    [
      true,
      { editable: true, import: { type: 'abcd' }, export: { type: 'something' } },
    ],
  ];

  each(testCases).test(
    'should return %s for %o',
    (expected, input) => {
      expect(flowSupportsMapping(input)).toEqual(expected);
    }
  );
});

describe('flowAllowsScheduling util method', () => {
  const testCases = [
    [
      false,
      undefined,
    ],
    [
      false,
      { },
    ],
    [
      false,
      { editable: false },
    ],
    [
      true,
      { editable: true },
    ],
    [
      false,
      { editable: true, type: 'REALTIME_EXPORT' },
    ],
    [
      false,
      { editable: true, type: 'REALTIME_IMPORT' },
    ],
    [
      true,
      { editable: true, export: {} },
    ],
    [
      false,
      { editable: true, export: { type: 'MY_COMPUTER' } },
    ],
  ];

  each(testCases).test(
    'should return %s for %o',
    (expected, input) => {
      expect(flowAllowsScheduling(input)).toEqual(expected);
    }
  );
});

describe('isFlowRunnable util method', () => {
  const testCases = [
    [
      false,
      undefined,
    ],
    [
      false,
      {},
    ],
    [
      false,
      { disabled: true },
    ],
    [
      false,
      { type: 'REALTIME_EXPORT' },
    ],
    [
      false,
      { type: 'REALTIME_IMPORT' },
    ],
    [
      false,
      { export: { type: 'MY_COMPUTER'} },
    ],
    [
      false,
      { version: 'something' },
    ],
    [
      false,
      { type: 'abcd', version: 'something' },
    ],
    [
      true,
      { version: 'something', hasConfiguration: true },
    ],
    [
      true,
      { type: 'something', version: 'something', hasConfiguration: true },
    ],
    [
      false,
      { hasConfiguration: true },
    ],
    [
      true,
      { locationQualifier: 'abcd' },
    ],
    [
      true,
      { locationQualifier: 'abcd', hasConfiguration: true },
    ],
    [
      false,
      { locationQualifier: '    ' },
    ],
  ];

  each(testCases).test(
    'should return %s for %o',
    (expected, input) => {
      expect(isFlowRunnable(input)).toEqual(expected);
    }
  );
});
