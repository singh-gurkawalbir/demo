/* global describe, test, expect */

import { getFlowListWithMetadata, getImportsFromFlow, isRunnable, showScheduleIcon, hasBatchExport, isRealtimeFlow, isSimpleImportFlow, getExportIdsFromFlow, getImportIdsFromFlow, isDeltaFlow, isIntegrationApp, isPageGeneratorResource, isFlowUpdatedWithPgOrPP, convertOldFlowSchemaToNewOne, isOldFlowSchema, getAllConnectionIdsUsedInTheFlow, getFirstExportFromFlow, isRealtimeExport} from '.';

const oldFlow = {
  _exportId: 'e1',
  _importId: 'i1',
  p1: 1,
  p2: 2,
};

const oldRealtimeFlow = {
  _exportId: 're1',
  _importId: 'i1',
  p1: 1,
  p2: 2,
};

const convertedFlow = {
  pageGenerators: [{
    _exportId: 'e1',
    type: 'export',
  }],
  pageProcessors: [{
    _importId: 'i1',
    type: 'import',
  }],
  p1: 1,
  p2: 2,
  flowConvertedToNewSchema: true,
};
const emptyFlow = {};
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

const dataLoaderFlow = {
  pageGenerators: [{ _exportId: 'se' }],
  pageProcessors: [
    { _importId: 'i1' },
  ],
};

const realtimeFlow = {
  pageGenerators: [{ _exportId: 're1' }],
  pageProcessors: [
    { _importId: 'i1' },
  ],
};
const invalidFlow = {
  pageGenerators: [{ _exportId: 'invalid' }],
  pageProcessors: [
    { _importId: 'invalid' },
  ],
};
const disabledFlow = {
  disabled: true,
};
const disabledIAFlow = {
  _connectorId: 'id',
  disabled: true,
};
const connections = [{
  _id: 'c1',
  name: 'c1',
}, {
  _id: 'c2',
  name: 'c2',
}, {
  _id: 'c3',
  name: 'c3',
  _borrowConcurrencyFromConnectionId: 'c5',
}, {
  _id: 'c4',
  name: 'c4',
  _borrowConcurrencyFromConnectionId: 'c6',
}, {
  _id: 'c5',
  name: 'c5',
}, {
  _id: 'c6',
  name: 'c6',
}];

const exports = [{
  _id: 'e1',
  name: 'e1',
  _connectionId: 'c1',
}, {
  _id: 'e2',
  name: 'e2',
  _connectionId: 'c2',
}, {
  _id: 'e3',
  name: 'e3',
  _connectionId: 'c3',
}, {
  _id: 'e5',
  name: 'e5',
  _connectionId: 'c5',
},
{
  _id: 'se',
  name: 'se',
  type: 'simple',
}];

const realtimeExports = [{
  _id: 're1',
  name: 're1',
  _connectionId: 'c1',
  type: 'distributed',
}, {
  _id: 're2',
  name: 're2',
  _connectionId: 'c2',
  type: 'webhook',
}, {
  _id: 're3',
  name: 're3',
  _connectionId: 'c3',
  adaptorType: 'AS2Export',
}];

const imports = [{
  _id: 'i1',
  name: 'i1',
  _connectionId: 'c1',
}, {
  _id: 'i2',
  name: 'i2',
  _connectionId: 'c4',
}, {
  _id: 'i3',
  name: 'i3',
  _connectionId: 'c3',
}, {
  _id: 'i5',
  name: 'i5',
  _connectionId: 'c5',
}];

describe('isDeltaFlow', () => {
  const exportsWithDeltaType = [
    {
      _id: 'e1',
      type: 'delta',
    },
  ];
  const exportsWithNonDeltaType = [
    {
      _id: 'e1',
      type: 'test',
    },
  ];

  test('should return false when flow is empty', () => {
    expect(isDeltaFlow()).toEqual(false);
  });
  test('should return false when exports are empty', () => {
    expect(isDeltaFlow(flowWithOnlyPGs)).toEqual(false);
  });
  test('should return true when flow has pageGenerators with type as delta', () => {
    expect(isDeltaFlow(flowWithOnlyPGs, exportsWithDeltaType)).toEqual(true);
  });
  test('should return true when flow is of old model type and with type as delta', () => {
    expect(isDeltaFlow(oldFlow, exportsWithDeltaType)).toEqual(true);
  });
  test('should return false when flow is of old model type and with type not as delta', () => {
    expect(isDeltaFlow(oldFlow, exportsWithNonDeltaType)).toEqual(false);
  });

  test('should return false when flow has pageGenerators with type is not a delta', () => {
    expect(isDeltaFlow(flowWithOnlyPGs, exportsWithNonDeltaType)).toEqual(
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

describe('isIntegrationApp', () => {
  const integrationAppResource = {
    _id: 'id',
    _connectorId: 'id',
  };
  const nonIntegrationAppResource = {
    _id: 'id',
  };

  test('should return true for integration app doc', () => {
    expect(isIntegrationApp(integrationAppResource)).toEqual(true);
  });
  test('should return false for non integration app doc', () => {
    expect(isIntegrationApp(nonIntegrationAppResource)).toEqual(false);
  });
  test('should return false for empty doc', () => {
    expect(isIntegrationApp(undefined)).toEqual(false);
  });
});

describe('isPageGeneratorResource', () => {
  test('should return true when flow has requested resource as PG', () => {
    expect(isPageGeneratorResource(flowWithOnlyPGs, 'e1')).toEqual(true);
  });
  test('should return false when flow does not have requested resource as PG', () => {
    expect(isPageGeneratorResource(flowWithOnlyPGs, 'e3')).toEqual(false);
  });
  test('should return false for empty docs', () => {
    expect(isPageGeneratorResource(undefined, undefined)).toEqual(false);
  });
});

describe('isFlowUpdatedWithPgOrPP', () => {
  test('should return true when flow has requested resource as PG', () => {
    expect(isFlowUpdatedWithPgOrPP(flowWithPGsandPPs, 'e1')).toEqual(true);
  });
  test('should return true when flow has requested export resource as PP', () => {
    expect(isFlowUpdatedWithPgOrPP(flowWithPGsandPPs, 'e3')).toEqual(true);
  });
  test('should return true when flow has requested import resource as PP', () => {
    expect(isFlowUpdatedWithPgOrPP(flowWithPGsandPPs, 'i1')).toEqual(true);
  });
  test('should return false when flow does not have requested resource as PG', () => {
    expect(isFlowUpdatedWithPgOrPP(flowWithOnlyPGs, 'e5')).toEqual(false);
  });
  test('should return false when flow does not have requested export resource as PP', () => {
    expect(isFlowUpdatedWithPgOrPP(flowWithOnlyPGs, 'e6')).toEqual(false);
  });
  test('should return false when flow does not have requested import resource as PP', () => {
    expect(isFlowUpdatedWithPgOrPP(flowWithOnlyPGs, 'i5')).toEqual(false);
  });
  test('should return false for empty docs', () => {
    expect(isFlowUpdatedWithPgOrPP(undefined, undefined)).toEqual(false);
  });
});

describe('convertOldFlowSchemaToNewOne', () => {
  test('should return new flow when old flow is passed', () => {
    expect(convertOldFlowSchemaToNewOne(oldFlow)).toEqual(convertedFlow);
  });
  test('should return new flow when new flow is passed', () => {
    expect(convertOldFlowSchemaToNewOne(flowWithPGsandPPs)).toEqual(flowWithPGsandPPs);
  });
  test('should return empty object for empty flow', () => {
    expect(convertOldFlowSchemaToNewOne(emptyFlow)).toEqual(emptyFlow);
  });
});

describe('isOldFlowSchema', () => {
  test('should return true when old flow is passed', () => {
    expect(isOldFlowSchema(oldFlow)).toEqual(true);
  });
  test('should return false when new flow is passed', () => {
    expect(isOldFlowSchema(flowWithOnlyPGs)).toEqual(false);
  });
  test('should return false when converted flow is passed', () => {
    expect(isOldFlowSchema(convertedFlow)).toEqual(false);
  });
  test('should return false for empty flow', () => {
    expect(isOldFlowSchema(emptyFlow)).toEqual(false);
  });
});

describe('getAllConnectionIdsUsedInTheFlow', () => {
  const connectionIds = ['c1', 'c2', 'c3', 'c4'];
  const connectionIdsIncludingBorrowed = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6'];

  test('should return connectionIds with borrowed concurrency connectionswhen proper flow is passed', () => {
    expect(getAllConnectionIdsUsedInTheFlow(flowWithPGsandPPs, connections, exports, imports)).toEqual(connectionIdsIncludingBorrowed);
  });
  test('should return connectionIds without borrowed concurrency connections when proper flow is passed', () => {
    expect(getAllConnectionIdsUsedInTheFlow(flowWithPGsandPPs, connections, exports, imports, {ignoreBorrowedConnections: true})).toEqual(connectionIds);
  });
  test('should return empty array when invalid flow is passed', () => {
    expect(getAllConnectionIdsUsedInTheFlow(emptyFlow, connections, exports, imports)).toEqual([]);
  });
});

describe('getFirstExportFromFlow', () => {
  test('should return first export when flow has a PG with export', () => {
    expect(getFirstExportFromFlow(flowWithPGsandPPs, exports)).toEqual(exports[0]);
  });
  test('should return first export when old flow has an export', () => {
    expect(getFirstExportFromFlow(oldFlow, exports)).toEqual(exports[0]);
  });
  test('should return undefined for empty docs', () => {
    expect(getFirstExportFromFlow(undefined, undefined)).toEqual(undefined);
  });
});

describe('isRealtimeExport', () => {
  test('should return true for distributed export', () => {
    expect(isRealtimeExport(realtimeExports[0])).toEqual(true);
  });
  test('should return true for webhook export', () => {
    expect(isRealtimeExport(realtimeExports[1])).toEqual(true);
  });
  test('should return true for AS2 export', () => {
    expect(isRealtimeExport(realtimeExports[2])).toEqual(true);
  });
  test('should return false for non realtime export', () => {
    expect(isRealtimeExport(exports[0])).toEqual(false);
  });
  test('should return false for empty export', () => {
    expect(isRealtimeExport(undefined)).toEqual(false);
  });
});

describe('isSimpleImportFlow', () => {
  test('should return true for data loader flow', () => {
    expect(isSimpleImportFlow(dataLoaderFlow, exports)).toEqual(true);
  });
  test('should return false for non data loader flow', () => {
    expect(isSimpleImportFlow(flowWithPGsandPPs, exports)).toEqual(false);
  });
  test('should return false for invalid flow', () => {
    expect(isSimpleImportFlow(invalidFlow, exports)).toEqual(false);
  });
});

describe('isRealtimeFlow', () => {
  test('should return true for old realtime flow', () => {
    expect(isRealtimeFlow(oldRealtimeFlow, realtimeExports)).toEqual(true);
  });
  test('should return true for realtime flow', () => {
    expect(isRealtimeFlow(realtimeFlow, realtimeExports)).toEqual(true);
  });
  test('should return false for non realtime flow', () => {
    expect(isRealtimeFlow(flowWithPGsandPPs, exports)).toEqual(false);
  });
  test('should return false for invalid flow', () => {
    expect(isRealtimeFlow(invalidFlow, exports)).toEqual(false);
  });
});

describe('hasBatchExport', () => {
  test('should return true for old batch flow', () => {
    expect(hasBatchExport(oldFlow, exports)).toEqual(true);
  });
  test('should return true for batch flow', () => {
    expect(hasBatchExport(flowWithPGsandPPs, exports)).toEqual(true);
  });
  test('should return false for old realtime flow', () => {
    expect(hasBatchExport(oldRealtimeFlow, realtimeExports)).toEqual(false);
  });
  test('should return false for  realtime flow', () => {
    expect(hasBatchExport(realtimeFlow, realtimeExports)).toEqual(false);
  });
});

describe('showScheduleIcon', () => {
  test('should return true for batch flow', () => {
    expect(showScheduleIcon(flowWithPGsandPPs, exports)).toEqual(true);
  });
  test('should return false for realtime flow', () => {
    expect(showScheduleIcon(realtimeFlow, realtimeExports)).toEqual(false);
  });
  test('should return false for data loader flow', () => {
    expect(showScheduleIcon(dataLoaderFlow, exports)).toEqual(false);
  });
});

describe('isRunnable', () => {
  test('should return true for data loader flow', () => {
    expect(isRunnable(dataLoaderFlow, exports)).toEqual(true);
  });
  test('should return true for disabled data loader flow', () => {
    expect(isRunnable({...dataLoaderFlow, disabled: true}, exports)).toEqual(true);
  });
  test('should return true for enabled flow', () => {
    expect(isRunnable(flowWithPGsandPPs, exports)).toEqual(true);
  });
  test('should return false for flow with only PGs', () => {
    expect(isRunnable(flowWithOnlyPGs, exports)).toEqual(false);
  });
  test('should return false for flow with only PPs', () => {
    expect(isRunnable(flowWithOnlyPPs, exports)).toEqual(false);
  });
  test('should return false for realtime flow', () => {
    expect(isRunnable(realtimeFlow, realtimeExports)).toEqual(false);
  });
  test('should return false for disabled integration app flow', () => {
    expect(isRunnable(disabledIAFlow, exports)).toEqual(false);
  });
  test('should return false for disabled flow', () => {
    expect(isRunnable(disabledFlow, exports)).toEqual(false);
  });
  test('should return false for empty flow', () => {
    expect(isRunnable(emptyFlow, exports)).toEqual(false);
  });
});

describe('getImportsFromFlow', () => {
  const filteredImports = [{
    _id: 'i1',
    name: 'i1',
    _connectionId: 'c1',
  }, {
    _id: 'i2',
    name: 'i2',
    _connectionId: 'c4',
  }];
  const filteredOldFlowImports = [{
    _id: 'i1',
    name: 'i1',
    _connectionId: 'c1',
  }];

  test('should return imports for flow', () => {
    expect(getImportsFromFlow(flowWithPGsandPPs, imports)).toEqual(filteredImports);
  });
  test('should return imports for old flow', () => {
    expect(getImportsFromFlow(oldFlow, imports)).toEqual(filteredOldFlowImports);
  });
  test('should return imports for empty flow', () => {
    expect(getImportsFromFlow(emptyFlow, imports)).toEqual([]);
  });
  test('should return imports for invalid flow', () => {
    expect(getImportsFromFlow(invalidFlow, imports)).toEqual([]);
  });
  test('should return imports for valid flow when imports are empty', () => {
    expect(getImportsFromFlow(oldFlow, [])).toEqual([]);
  });
});

describe.only('getFlowListWithMetadata', () => {
  const dataLoaderFlowWithMetadata = {resources: [{...dataLoaderFlow,
    isSimpleImport: true,
    isRunnable: true,
  }]};
  const realtimeFlowWithMetadata = {resources: [{...realtimeFlow,
    isRealtime: true,
  }]};
  const batchFlowWithMetadata = {resources: [{...flowWithPGsandPPs,
    isRunnable: true,
    showScheduleIcon: true,
  }]};

  test('should return valid metadata for data loader flow', () => {
    expect(getFlowListWithMetadata([dataLoaderFlow], exports)).toEqual(dataLoaderFlowWithMetadata);
  });
  test('should return valid metadata for realtime flow', () => {
    expect(getFlowListWithMetadata([realtimeFlow], realtimeExports)).toEqual(realtimeFlowWithMetadata);
  });
  test('should return valid metadata for batch flow', () => {
    expect(getFlowListWithMetadata([flowWithPGsandPPs], exports)).toEqual(batchFlowWithMetadata);
  });
});
