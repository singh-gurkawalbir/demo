/* global describe, test, expect */

import { getFlowResources, getFlowType, flowbuilderUrl, getFlowListWithMetadata, getImportsFromFlow, isRunnable, showScheduleIcon, hasBatchExport, isRealtimeFlow, isSimpleImportFlow, getExportIdsFromFlow, getImportIdsFromFlow, isDeltaFlow, isIntegrationApp, isPageGeneratorResource, isFlowUpdatedWithPgOrPP, convertOldFlowSchemaToNewOne, isOldFlowSchema, getAllConnectionIdsUsedInTheFlow, getFirstExportFromFlow, isRealtimeExport, getScriptsReferencedInFlow} from '.';
import getRoutePath from '../routePaths';

const integration = {
  _id: 'i1',
  name: 'i1',
};
const oldFlow = {
  _id: 'f1',
  _exportId: 'e1',
  _importId: 'i1',
  p1: 1,
  p2: 2,
  _integrationId: integration._id,
};

const oldRealtimeFlow = {
  _id: 'f2',
  _exportId: 're1',
  _importId: 'i1',
  p1: 1,
  p2: 2,
};

const convertedFlow = {
  _id: 'f1',
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
  _integrationId: integration._id,
};
const emptyFlow = {};
const flowWithOnlyPGs = {
  _id: 'f4',
  pageGenerators: [{ _exportId: 'e1', type: 'export' }, { _exportId: 'e2', type: 'export' }],
  _integrationId: integration._id,
};
const flowWithOnlyPPs = {
  _id: 'f5',
  pageProcessors: [
    { _exportId: 'e1', type: 'export' },
    { _importId: 'i1', type: 'import' },
    { _exportId: 'e2', type: 'export' },
  ],
  _integrationId: integration._id,
};
const flowWithPGsandPPs = {
  _id: 'f6',
  pageGenerators: [{ _exportId: 'e1', type: 'export' }, { _exportId: 'e2', type: 'export' }],
  pageProcessors: [
    { _exportId: 'e3', type: 'export' },
    { _importId: 'i1', type: 'import' },
    { _exportId: 'e4', type: 'export' },
    { _importId: 'i2', type: 'import' },
  ],
  _integrationId: integration._id,
};

const dataLoaderFlow = {
  _id: 'f7',
  pageGenerators: [{ _exportId: 'se' }],
  pageProcessors: [
    { _importId: 'i1', type: 'import' },
  ],
  _integrationId: integration._id,
};

const realtimeFlow = {
  _id: 'f8',
  pageGenerators: [{ _exportId: 're1', type: 'export' }],
  pageProcessors: [
    { _importId: 'i1', type: 'import' },
  ],
  _integrationId: integration._id,
};
const invalidFlow = {
  _id: 'f9',
  pageGenerators: [{ _exportId: 'invalid', type: 'export' }],
  pageProcessors: [
    { _importId: 'invalid', type: 'import' },
  ],
};
const disabledFlow = {
  _id: 'f10',
  disabled: true,
  _integrationId: integration._id,
};
const disabledIAFlow = {
  _id: 'f11',
  _connectorId: 'ia1',
  disabled: true,
  _integrationId: 'id2',
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

describe('getFlowListWithMetadata', () => {
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

describe('flowbuilderUrl', () => {
  const integrationId = 'i1';
  const flowId = 'f1';
  const dataLoaderURL = getRoutePath('/integrations/i1/dataLoader/f1');
  const flowURL = getRoutePath('/integrations/i1/flowBuilder/f1');
  const standAloneIntegrationFlowURL = getRoutePath('/integrations/none/flowBuilder/f1');
  const integrationAppParentFlowURL = getRoutePath('/integrationapps/a1/i1/flowBuilder/f1');
  const integrationAppChildFlowURL = getRoutePath('/integrationapps/a1/i1/child/c1/flowBuilder/f1');
  const args = {
    childId: false,
    isIntegrationApp: false,
    isDataLoader: true,
    appName: null,
  };

  test('should return valid flowBuilder URL for data loader flow', () => {
    expect(flowbuilderUrl(flowId, integrationId, args)).toEqual(dataLoaderURL);
  });
  test('should return valid flowBuilder URL for flow', () => {
    args.isDataLoader = false;
    expect(flowbuilderUrl(flowId, integrationId, args)).toEqual(flowURL);
  });
  test('should return valid flowBuilder URL for stand alone integration flow', () => {
    args.isDataLoader = false;
    expect(flowbuilderUrl(flowId, null, args)).toEqual(standAloneIntegrationFlowURL);
  });
  test('should return valid flowBuilder URL for integration app parent flow', () => {
    args.isIntegrationApp = true;
    args.appName = 'a1';
    expect(flowbuilderUrl(flowId, integrationId, args)).toEqual(integrationAppParentFlowURL);
  });
  test('should return valid flowBuilder URL for integration app child flow', () => {
    args.isIntegrationApp = true;
    args.appName = 'a1';
    args.childId = 'c1';
    expect(flowbuilderUrl(flowId, integrationId, args)).toEqual(integrationAppChildFlowURL);
  });
});

describe('getFlowType', () => {
  test('should return correct flow type for data loader flow', () => {
    expect(getFlowType(dataLoaderFlow, exports)).toEqual('Data Loader');
  });
  test('should return correct flow type for normal flow', () => {
    expect(getFlowType(flowWithPGsandPPs, exports)).toEqual('Scheduled');
  });
  test('should return correct flow type for realtime flow', () => {
    expect(getFlowType(realtimeFlow, realtimeExports)).toEqual('Realtime');
  });
  test('should return correct empty for empty flow', () => {
    expect(getFlowType(undefined, exports)).toEqual('');
  });
  test('should return correct empty for empty export docs', () => {
    expect(getFlowType(flowWithPGsandPPs, undefined)).toEqual('');
  });
});

describe('getFlowResources', () => {
  const flows = [oldFlow, flowWithOnlyPGs, flowWithOnlyPPs, flowWithPGsandPPs, dataLoaderFlow, realtimeFlow, disabledFlow, disabledIAFlow];

  test('should return correct flow resources for old flow', () => {
    const expectedResources = [{ _id: oldFlow._id, name: 'Flow-level' },
      { _id: 'e1', name: 'e1', type: 'exports' },
      { _id: 'i1', name: 'i1', type: 'imports' }];

    expect(getFlowResources(flows, exports, imports, oldFlow._id)).toEqual(expectedResources);
  });
  test('should return correct flow resources for flow with only PGs', () => {
    const expectedResources = [{ _id: flowWithOnlyPGs._id, name: 'Flow-level' },
      { _id: 'e1', name: 'e1', type: 'exports' },
      { _id: 'e2', name: 'e2', type: 'exports' }];

    expect(getFlowResources(flows, exports, imports, flowWithOnlyPGs._id)).toEqual(expectedResources);
  });
  test('should return correct flow resources for flow with only PPs', () => {
    const expectedResources = [{ _id: flowWithOnlyPPs._id, name: 'Flow-level' },
      { _id: 'e1', name: 'e1', type: 'exports', isLookup: true },
      { _id: 'i1', name: 'i1', type: 'imports' },
      { _id: 'e2', name: 'e2', type: 'exports', isLookup: true },
    ];

    expect(getFlowResources(flows, exports, imports, flowWithOnlyPPs._id)).toEqual(expectedResources);
  });
  test('should return correct flow resources for flow with PGs/PPs', () => {
    const expectedResources = [{ _id: flowWithPGsandPPs._id, name: 'Flow-level' },
      { _id: 'e1', name: 'e1', type: 'exports' },
      { _id: 'e2', name: 'e2', type: 'exports' },
      { _id: 'e3', name: 'e3', type: 'exports', isLookup: true },
      { _id: 'i1', name: 'i1', type: 'imports' },
      { _id: 'i2', name: 'i2', type: 'imports' }];

    expect(getFlowResources(flows, exports, imports, flowWithPGsandPPs._id)).toEqual(expectedResources);
  });
  test('should return correct default resources for empty flow', () => {
    const expectedResources = [{ _id: emptyFlow._id, name: 'Flow-level' }];

    expect(getFlowResources(flows, exports, imports, emptyFlow._id)).toEqual(expectedResources);
  });
});

describe('getScriptsReferencedInFlow', () => {
  test('', () => {
    const flow = {
      _id: 'f1',
      pageProcessors: [
        {
          _importId: 'i1',
          type: 'import',
        },
        {
          _exportId: 'e1',
          type: 'export',
          hooks: {
            postResponseMap: {
              _scriptId: 's1',
              function: 'abc',
            },
          },
        },
      ],
      pageGenerators: [{_exportId: 'e2'}],
    };
    const imports = [
      {
        _id: 'i1',
        responseTransform: {
          type: 'script',
          script: {
            _scriptId: 's2',
            function: 'transform',
          },
        },
        hooks: {
          preMap: {
            _scriptId: 's3',
            function: 'preMap',
          },
        },
        filter: {
          type: 'script',
          script: {
            _scriptId: 's4',
            function: 'filter',
          },
        },

      },
    ];
    const exports = [
      {
        _id: 'e2',
        hooks: {
          preSavePage: {
            _scriptId: 's5',
            function: 'preSavePage',
          },
        },
        transform: {
          type: 'script',
          script: {
            _scriptId: 's6',
            function: 'transform',
          },
        },
        filter: {
          type: 'script',
          script: {
            _scriptId: 's7',
            function: 'filter',
          },
        },
      },
      {
        _id: 'e1',
        transform: {
          type: 'script',
          script: {
            _scriptId: 's8',
            function: 'transform',
          },
        },
        filter: {
          type: 'script',
          script: {
            _scriptId: 's9',
            function: 'filter',
          },
        },
        inputFilter: {
          type: 'script',
          script: {
            _scriptId: 's10',
            function: 'filter',
          },
        },
      },
    ];
    const scripts = [
      {
        _id: 's1',
        name: 'ns1',
      },
      {
        _id: 's2',
        name: 'ns2',
      },
      {
        _id: 's3',
        name: 'ns3',
      },
      {
        _id: 's4',
        name: 'ns4',
      },
      {
        _id: 's5',
        name: 'ns5',
      },
      {
        _id: 's6',
        name: 'ns6',
      },
      {
        _id: 's7',
        name: 'ns7',
      },
      {
        _id: 's8',
        name: 'ns8',
      },
      {
        _id: 's9',
        name: 'ns9',
      },
      {
        _id: 's10',
        name: 'ns10',
      },
      {
        _id: 's11',
        name: 'ns11',
      },
    ];

    expect(getScriptsReferencedInFlow({flow, exports, imports, scripts})).toEqual(
      [
        {
          _id: 's1',
          name: 'ns1',
        },
        {
          _id: 's2',
          name: 'ns2',
        },
        {
          _id: 's3',
          name: 'ns3',
        },
        {
          _id: 's4',
          name: 'ns4',
        },
        {
          _id: 's5',
          name: 'ns5',
        },
        {
          _id: 's6',
          name: 'ns6',
        },
        {
          _id: 's7',
          name: 'ns7',
        },
        {
          _id: 's8',
          name: 'ns8',
        },
        {
          _id: 's9',
          name: 'ns9',
        },
        {
          _id: 's10',
          name: 'ns10',
        },
      ]
    );
  });
});
