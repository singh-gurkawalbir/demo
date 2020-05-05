/* global describe, test, expect */

import { getExportIdsFromFlow, getImportIdsFromFlow, isDeltaFlow } from '.';

const oldFlow = {
  _exportId: 'e1',
  _importId: 'i1',
};
const flowWithOnlyPGs = {
  pageGenerators: [{ _exportId: 'e1' }, { _exportId: 'e2' }],
};
const flowWithOnlyPPs = {
  pageProcessors: [
    { _exportId: 'e1' },
    { _importId: 'i1' },
    { _exportId: 'e2' },
  ],
};
const flowWithPGsandPPs = {
  pageGenerators: [{ _exportId: 'e1' }, { _exportId: 'e2' }],
  pageProcessors: [
    { _exportId: 'e3' },
    { _importId: 'i1' },
    { _exportId: 'e4' },
    { _importId: 'i2' },
  ],
};

describe('isDeltaFlow', () => {
  const exportsWithDeltaType = [
    {
      _id: 'e1',
      type: 'delta',
    },
  ];
  const exportsWithDeltaLagoffset = [
    {
      _id: 'e1',
      type: 'delta',
      delta: {
        lagOffset: 15000,
      },
    },
  ];
  const exportsWithDeltaTypeDateFormat = [
    {
      _id: 'e1',
      type: 'delta',
      delta: {
        dateFormat: 'YYYY-MM-DDTHH:mm:ss',
      },
    },
  ];
  const exportsWithNotDeltaType = [
    {
      _id: 'e1',
      type: 'test',
    },
  ];

  test('should return false when flow is empty', () => {
    expect(isDeltaFlow()).toEqual(false);
  });
  test('should return true when flow has pageGenerators with type as delta', () => {
    expect(isDeltaFlow(flowWithOnlyPGs, exportsWithDeltaType)).toEqual(true);
  });
  test('should return false when flow has pageGenerators with type as delta and lagoffset', () => {
    expect(isDeltaFlow(flowWithOnlyPGs, exportsWithDeltaLagoffset)).toEqual(
      false
    );
  });
  test('should return true when flow has pageGenerators with type as delta and dateformat', () => {
    expect(
      isDeltaFlow(flowWithOnlyPGs, exportsWithDeltaTypeDateFormat)
    ).toEqual(true);
  });
  test('should return false when flow has pageGenerators with type is not a delta', () => {
    expect(isDeltaFlow(flowWithOnlyPGs, exportsWithNotDeltaType)).toEqual(
      false
    );
  });
});
describe('getExportIdsFromFlow', () => {
  test('should return empty set when flow is empty', () => {
    expect(getExportIdsFromFlow()).toEqual([]);
  });
  test('should return the correct exportId when the flow uses the old schema properties', () => {
    expect(getExportIdsFromFlow(oldFlow)).toEqual(['e1']);
  });
  test('should return correct export Ids when flow has only pageGenerators', () => {
    expect(getExportIdsFromFlow(flowWithOnlyPGs)).toEqual(['e1', 'e2']);
  });
  test('should return correct export Ids when flow has only pageProcessors', () => {
    expect(getExportIdsFromFlow(flowWithOnlyPPs)).toEqual(['e1', 'e2']);
  });
  test('should return correct export Ids when flow has both pageGenerators and pageProcessors', () => {
    expect(getExportIdsFromFlow(flowWithPGsandPPs)).toEqual([
      'e1',
      'e2',
      'e3',
      'e4',
    ]);
  });
});

describe('getImportIdsFromFlow', () => {
  test('should return empty set when flow is empty', () => {
    expect(getImportIdsFromFlow()).toEqual([]);
  });
  test('should return the correct importId when the flow uses the old schema properties', () => {
    expect(getImportIdsFromFlow(oldFlow)).toEqual(['i1']);
  });
  test('should return correct import Ids when flow has only pageGenerators', () => {
    expect(getImportIdsFromFlow(flowWithOnlyPGs)).toEqual([]);
  });
  test('should return correct import Ids when flow has only pageProcessors', () => {
    expect(getImportIdsFromFlow(flowWithOnlyPPs)).toEqual(['i1']);
  });
  test('should return correct import Ids when flow has both pageGenerators and pageProcessors', () => {
    expect(getImportIdsFromFlow(flowWithPGsandPPs)).toEqual(['i1', 'i2']);
  });
});
