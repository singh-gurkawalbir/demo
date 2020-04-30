/* global describe, test, expect */

import { getExportIdsFromFlow, getImportIdsFromFlow } from '.';

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

describe('getExportIdsFromFlow', () => {
  test('should return empty set when flow is empty', () => {
    const expected = getExportIdsFromFlow();

    expect(expected).toEqual([]);
  });
  test('should return the correct exportId when the flow uses the old schema properties', () => {
    const expected = getExportIdsFromFlow(oldFlow);

    expect(expected).toEqual(['e1']);
  });
  test('should return correct export Ids when flow has only pageGenerators', () => {
    const expected = getExportIdsFromFlow(flowWithOnlyPGs);

    expect(expected).toEqual(['e1', 'e2']);
  });
  test('should return correct export Ids when flow has only pageProcessors', () => {
    const expected = getExportIdsFromFlow(flowWithOnlyPPs);

    expect(expected).toEqual(['e1', 'e2']);
  });
  test('should return correct export Ids when flow has both pageGenerators and pageProcessors', () => {
    const expected = getExportIdsFromFlow(flowWithPGsandPPs);

    expect(expected).toEqual(['e1', 'e2', 'e3', 'e4']);
  });
});

describe('getImportIdsFromFlow', () => {
  test('should return empty set when flow is empty', () => {
    const expected = getImportIdsFromFlow();

    expect(expected).toEqual([]);
  });
  test('should return the correct importId when the flow uses the old schema properties', () => {
    const expected = getImportIdsFromFlow(oldFlow);

    expect(expected).toEqual(['i1']);
  });
  test('should return correct import Ids when flow has only pageGenerators', () => {
    const expected = getImportIdsFromFlow(flowWithOnlyPGs);

    expect(expected).toEqual([]);
  });
  test('should return correct import Ids when flow has only pageProcessors', () => {
    const expected = getImportIdsFromFlow(flowWithOnlyPPs);

    expect(expected).toEqual(['i1']);
  });
  test('should return correct import Ids when flow has both pageGenerators and pageProcessors', () => {
    const expected = getImportIdsFromFlow(flowWithPGsandPPs);

    expect(expected).toEqual(['i1', 'i2']);
  });
});
