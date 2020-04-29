/* global describe, test, expect */

import {
  getAllExportIdsUsedInTheFlow,
  getAllImportIdsUsedInTheFlow,
} from './flowsUtil';

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

describe('getAllExportIdsUsedInTheFlow tests', () => {
  test('empty flow', () => {
    const expected = getAllExportIdsUsedInTheFlow();

    expect(expected).toEqual([]);
  });
  test('old flow', () => {
    const expected = getAllExportIdsUsedInTheFlow(oldFlow);

    expect(expected).toEqual(['e1']);
  });
  test('flow with only pageGenerators', () => {
    const expected = getAllExportIdsUsedInTheFlow(flowWithOnlyPGs);

    expect(expected).toEqual(['e1', 'e2']);
  });
  test('flow with only pageProcessors', () => {
    const expected = getAllExportIdsUsedInTheFlow(flowWithOnlyPPs);

    expect(expected).toEqual(['e1', 'e2']);
  });
  test('flow with pageGenerators and pageProcessors', () => {
    const expected = getAllExportIdsUsedInTheFlow(flowWithPGsandPPs);

    expect(expected).toEqual(['e1', 'e2', 'e3', 'e4']);
  });
});

describe('getAllImportIdsUsedInTheFlow tests', () => {
  test('empty flow', () => {
    const expected = getAllImportIdsUsedInTheFlow();

    expect(expected).toEqual([]);
  });
  test('old flow', () => {
    const expected = getAllImportIdsUsedInTheFlow(oldFlow);

    expect(expected).toEqual(['i1']);
  });
  test('flow with only pageGenerators', () => {
    const expected = getAllImportIdsUsedInTheFlow(flowWithOnlyPGs);

    expect(expected).toEqual([]);
  });
  test('flow with only pageProcessors', () => {
    const expected = getAllImportIdsUsedInTheFlow(flowWithOnlyPPs);

    expect(expected).toEqual(['i1']);
  });
  test('flow with pageGenerators and pageProcessors', () => {
    const expected = getAllImportIdsUsedInTheFlow(flowWithPGsandPPs);

    expect(expected).toEqual(['i1', 'i2']);
  });
});
