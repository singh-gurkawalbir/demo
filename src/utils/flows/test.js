/* global describe, test, expect */

import { getFlowResources, getFlowType, flowbuilderUrl, getFlowListWithMetadata, getImportsFromFlow, isRunnable, showScheduleIcon, hasBatchExport, isRealtimeFlow, isSimpleImportFlow, getExportIdsFromFlow, getImportIdsFromFlow, isDeltaFlow, isIntegrationApp, isPageGeneratorResource, isFlowUpdatedWithPgOrPP, convertOldFlowSchemaToNewOne, isOldFlowSchema, getAllConnectionIdsUsedInTheFlow, getFirstExportFromFlow, isRealtimeExport, getScriptsReferencedInFlow, isFreeFlowResource, isLookupResource, isActionUsed, isImportMappingAvailable, getPageProcessorImportsFromFlow, getFlowReferencesForResource, getFlowDetails, getUsedActionsMapForResource, getIAFlowSettings, flowSupportsSettings, getNextDataFlows, flowAllowsScheduling, getIAResources} from '.';
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
  _integrationId: 'i2',
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

const diyIntegration = {
  _id: 'i1',
  installSteps: [{something: 'something'}],
};

const integrationApp = {
  _id: 'i2',
  _connectorId: 'ia2',
  settings: {
    sections: [
      {
        title: 'order',
        flows: [
          {
            _id: 'f1',
            sections: [
              {
                title: 'flowSec',
                flows: [{_id: 'f4'}],
              },
            ],
            showSchedule: true,
            showMapping: true,
            showStartDateDialog: true,
            disableSlider: true,
            disableRunFlow: true,
            showUtilityMapping: true,
          },
          {_id: 'f2'},
        ],
      },
      {
        title: 'payment',
        flows: [{_id: 'f3'}],
      },
    ],
  },
};

const multiStoreApp = {
  _id: 'i3',
  _connectorId: 'ia3',
  settings: {
    supportsMultiStore: true,
    sections: [
      {
        id: 'c1',
        title: 'order',
        sections: [
          {
            title: 'order1',
            flows: [
              {
                _id: 'f5',
                sections: [{id: 'c3'}],
                pageGenerators: [{_exportId: 'e1', type: 'export'}],
                pageProcessors: [{_exportId: 'e2', type: 'export'}, {_importId: 'i1', type: 'import'}],
              },
              {
                _id: 'f6',
                _exportId: 'e3',
                _importId: 'i2',
              },
            ],
          },
          {
            title: 'order2',
            flows: [
              {
                _id: 'f7',
                pageGenerators: [{_exportId: 'e4', type: 'export'}],
              },
              {
                _id: 'f10',
                pageProcessors: [{_exportId: 'e5', type: 'export'}, {_importId: 'i3', type: 'import'}],
              },
            ],
          },
        ],
      },
      {
        id: 'c2',
        title: 'payment',
        sections: [
          {
            title: 'payment1',
            flows: [{_id: 'f8'}, {_id: 'f9'}],
          },
        ],
      },
    ],
  },
};

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
  test('should return false for an undefined flow', () => {
    expect(isRunnable(undefined, exports)).toEqual(false);
  });
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
        inputFilter: {
          type: 'script',
          script: {
            _scriptId: 's12',
            function: 'filter',
          },
        },
        responseTransform: {
          type: 'script',
          script: {
            _scriptId: 's13',
            function: 'transform',
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
        responseTransform: {
          type: 'script',
          script: {
            _scriptId: 's14',
            function: 'transform',
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
      {
        _id: 's12',
        name: 'ns12',
      },
      {
        _id: 's13',
        name: 'ns13',
      },
      {
        _id: 's14',
        name: 'ns14',
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
        {
          _id: 's12',
          name: 'ns12',
        },
        {
          _id: 's13',
          name: 'ns13',
        },
        {
          _id: 's14',
          name: 'ns14',
        },
      ]
    );
  });
});

describe('isFreeFlowResource', () => {
  const freeFlow = {
    free: true,
  };
  const nonFreeFlow = {
    free: false,
  };

  test('should return true for a free flow', () => {
    expect(isFreeFlowResource(freeFlow)).toEqual(true);
  });
  test('should return false for a non free flow', () => {
    expect(isFreeFlowResource(nonFreeFlow)).toEqual(false);
  });
  test('should return false for an undefined flow', () => {
    expect(isFreeFlowResource(undefined)).toEqual(false);
  });
});

describe('isLookupResource', () => {
  const resourceWithLookup = {
    isLookup: true,
  };
  const resourceWithoutLookup = {
    isLookup: false,
    _id: 'e1',
  };
  const resourceWithoutLookup2 = {
    isLookup: false,
    _id: 'e10',
  };

  test('should return true for a resoure with isLookup field true', () => {
    expect(isLookupResource(flowWithOnlyPPs, resourceWithLookup)).toEqual(true);
  });
  test('should return true when required resource is present in the flow', () => {
    expect(isLookupResource(flowWithOnlyPPs, resourceWithoutLookup)).toEqual(true);
  });
  test('should return false when required resource is not present in the flow', () => {
    expect(isLookupResource(flowWithOnlyPPs, resourceWithoutLookup2)).toEqual(false);
  });
  test('should return false when resource is undefined', () => {
    expect(isLookupResource(flowWithOnlyPPs, undefined)).toEqual(false);
  });
  test('should return false when flow is undefined', () => {
    expect(isLookupResource(undefined, resourceWithoutLookup)).toEqual(false);
  });
});

describe('isActionUsed', () => {
  const expressionWithRules = {
    type: 'expression',
    expression: {
      rules: ['someRule'],
    },
  };
  const expressionWithoutRules = {
    type: 'expression',
    expression: {
      rules: [],
    },
  };
  const scriptWithoutScriptId = {
    type: 'script',
    script: {},
  };

  describe('When action is schedule', () => {
    const action = 'schedule';
    const resource = {};
    const resourceType = 'something';

    test('should return true if flowNode.schedule is true', () => {
      expect(isActionUsed(resource, resourceType, { schedule: true }, action)).toEqual(true);
    });
    test('should return true if flowNode._keepDeltaBehindFlowId is true', () => {
      expect(isActionUsed(resource, resourceType, { _keepDeltaBehindFlowId: true }, action)).toEqual(true);
    });
    test('should return true if both schedule and _keepDeltaBehindFlowId of flowNode are true', () => {
      expect(isActionUsed(resource, resourceType, { schedule: true, _keepDeltaBehindFlowId: true }, action)).toEqual(true);
    });
    test('should return false if both schedule and _keepDeltaBehindFlowId of flowNode are false', () => {
      expect(isActionUsed(resource, resourceType, {}, action)).toEqual(false);
    });
  });

  describe('When the action is inputFilter', () => {
    const action = 'inputFilter';
    const importResourceType = 'imports';
    const nonImportResourceType = 'resourcesOtherThanImport';
    const scriptWithScriptId = {
      type: 'script',
      script: {
        _scriptId: 's4',
        function: 'filter',
      },
    };

    test('should return true if importResource has filter and is of expression type with rules', () => {
      expect(isActionUsed({ filter: expressionWithRules }, importResourceType, {}, action)).toEqual(true);
    });
    test('should return false if importResource has filter and is of expression type without rules', () => {
      expect(isActionUsed({ filter: expressionWithoutRules }, importResourceType, {}, action)).toEqual(false);
    });
    test('should return true if importresource has filter and is of script type with scriptId defined', () => {
      expect(isActionUsed({ filter: scriptWithScriptId }, importResourceType, {}, action)).toEqual(true);
    });
    test('should return false if importresource has filter and is of script type without scriptId defined', () => {
      expect(isActionUsed({ filter: scriptWithoutScriptId }, importResourceType, {}, action)).toEqual(false);
    });
    test('should return true if nonImportResource has inputFilter and is of expression type with rules', () => {
      expect(isActionUsed({ inputFilter: expressionWithRules }, nonImportResourceType, {}, action)).toEqual(true);
    });
    test('should return false if nonImportResource has inputFilter and is of expression type without rules', () => {
      expect(isActionUsed({ inputFilter: expressionWithoutRules }, nonImportResourceType, {}, action)).toEqual(false);
    });
    test('should return true if nonImportresource has inputFilter and is of script type with scriptId defined', () => {
      expect(isActionUsed({ inputFilter: scriptWithScriptId }, nonImportResourceType, {}, action)).toEqual(true);
    });
    test('should return false if nonImportresource has inputFilter and is of script type without scriptId defined', () => {
      expect(isActionUsed({ inputFilter: scriptWithoutScriptId }, nonImportResourceType, {}, action)).toEqual(false);
    });
  });

  describe('When the action is importMapping', () => {
    const action = 'importMapping';
    const resourceType = 'imports';
    const flowNode = {};
    const importNSDistributedMappingWithFieldsAndLists = {
      netsuite_da: {
        mapping: {
          fields: [
            {
              extract: 'someField',
              generate: 'newField',
              internalId: false,
            },
          ],
          lists: [{someField: 'someField'}],
        },
      },
      adaptorType: 'NetSuiteDistributedImport',
    };
    const importNSDistributedMappingWithFields = {
      netsuite_da: {
        mapping: {
          fields: [
            {
              extract: 'someField',
              generate: 'newField',
              internalId: false,
            },
          ],
        },
      },
      adaptorType: 'NetSuiteDistributedImport',
    };
    const importNSDistributedMappingWithLists = {
      netsuite_da: {
        mapping: {
          lists: [{someField: 'someField'}],
        },
      },
      adaptorType: 'NetSuiteDistributedImport',
    };
    const importNSDistributedMappingWithoutFieldsAndLists = {
      netsuite_da: {
        mapping: {},
      },
      adaptorType: 'NetSuiteDistributedImport',
    };

    test('should return true if resource is of type netsuite distributed with mapping containing both fields and lists', () => {
      expect(isActionUsed(importNSDistributedMappingWithFieldsAndLists, resourceType, flowNode, action)).toEqual(true);
    });
    test('should return true if resource is of type netsuite distributed with mapping containing fields', () => {
      expect(isActionUsed(importNSDistributedMappingWithFields, resourceType, flowNode, action)).toEqual(true);
    });
    test('should return true if resource is of type netsuite distributed with mapping containing lists', () => {
      expect(isActionUsed(importNSDistributedMappingWithLists, resourceType, flowNode, action)).toEqual(true);
    });
    test('should return false if resource is of type netsuite distributed without both fields and lists defined in mapping', () => {
      expect(isActionUsed(importNSDistributedMappingWithoutFieldsAndLists, resourceType, flowNode, action)).toEqual(false);
    });
  });

  describe('When the action is templateMapping', () => {
    const action = 'templateMapping';
    const resourceType = 'something';
    const flowNode = {};
    const stringHttp = {
      body: 'something',
    };
    const arrayHttp = {
      body: ['something'],
    };
    const emptyArrayHttp = {
      body: [],
    };
    const emptyHttp = {};

    test('should return true if resource has http and body field of http is of type string', () => {
      expect(isActionUsed({ http: stringHttp }, resourceType, flowNode, action)).toEqual(true);
    });
    test('should return true if resource has http and body field of http is of type array with values', () => {
      expect(isActionUsed({ http: arrayHttp }, resourceType, flowNode, action)).toEqual(true);
    });
    test('should return true if resource has http and body field of http is of type array without values', () => {
      expect(isActionUsed({ http: emptyArrayHttp }, resourceType, flowNode, action)).toEqual(false);
    });
    test('should return fasle if resource has empty http object', () => {
      expect(isActionUsed({ http: emptyHttp }, resourceType, flowNode, action)).toEqual(false);
    });
  });

  describe('When the action is transformation', () => {
    const action = 'transformation';
    const resourceType = 'something';
    const scriptWithScriptId = {
      type: 'script',
      script: {
        _scriptId: 's4',
        function: 'transform',
      },
    };

    test('should return true if resource has transform and is of expression type with rules', () => {
      expect(isActionUsed({ transform: expressionWithRules }, resourceType, {}, action)).toEqual(true);
    });
    test('should return false if resource has transform and is of expression type without rules', () => {
      expect(isActionUsed({ transform: expressionWithoutRules }, resourceType, {}, action)).toEqual(false);
    });
    test('should return true if resource has transform and is of script type with scriptId defined', () => {
      expect(isActionUsed({ transform: scriptWithScriptId }, resourceType, {}, action)).toEqual(true);
    });
    test('should return false if resource has transform and is of script type without scriptId defined', () => {
      expect(isActionUsed({ transform: scriptWithoutScriptId }, resourceType, {}, action)).toEqual(false);
    });
  });

  describe('When the action is responseTransformation', () => {
    const action = 'responseTransformation';
    const resourceType = 'something';
    const scriptWithScriptId = {
      type: 'script',
      script: {
        _scriptId: 's4',
        function: 'responseTransform',
      },
    };

    test('should return true if resource has responseTransform and is of expression type with rules', () => {
      expect(isActionUsed({ responseTransform: expressionWithRules }, resourceType, {}, action)).toEqual(true);
    });
    test('should return false if resource has responseTransform and is of expression type without rules', () => {
      expect(isActionUsed({ responseTransform: expressionWithoutRules }, resourceType, {}, action)).toEqual(false);
    });
    test('should return true if resource has responseTransform and is of script type with scriptId defined', () => {
      expect(isActionUsed({ responseTransform: scriptWithScriptId }, resourceType, {}, action)).toEqual(true);
    });
    test('should return false if resource has responseTransform and is of script type without scriptId defined', () => {
      expect(isActionUsed({ responseTransform: scriptWithoutScriptId }, resourceType, {}, action)).toEqual(false);
    });
  });

  describe('When the action is hooks', () => {
    const action = 'hooks';
    const resourceType = 'something';
    const flowNode = {};
    const resourceWithHooks = {
      hooks: {
        function: {
          _scriptId: 'f1',
          function: 'function',
        },
      },
    };
    const netsuiteResourceRestletSchemaWithPreSendFunc = {
      netsuite: {
        restlet: {
          hooks: {
            preSend: {
              _scriptId: 's1',
              function: 'preSend',
            },
          },
        },
      },
    };
    const netsuiteResourceRestletSchemaWithoutPreSendFunc = {
      netsuite: {
        restlet: {
          hooks: {
            someFunc: {
              _scriptId: 's3',
              function: 'someFunc',
            },
          },
        },
      },
    };
    const netsuiteResourceRestletSchemaWithoutHooks = {
      netsuite: {
        restlet: {},
      },
    };
    const netsuiteResourceDistributedSchemaWithPreSendFunc = {
      netsuite: {
        distributed: {
          hooks: {
            preSend: {
              _scriptId: 's2',
              function: 'preSend',
            },
          },
        },
      },
    };
    const netsuiteResourceDistributedSchemaWithoutPreSendFunc = {
      netsuite: {
        restlet: {
          hooks: {
            someFunc: {
              _scriptId: 's4',
              function: 'someFunc',
            },
          },
        },
      },
    };
    const netsuiteResourceDistributedSchemaWithoutHooks = {
      netsuite: {
        restlet: {},
      },
    };
    const netsuiteResoureWithoutSchema = {
      netsuite: {
        someFields: 'someFields',
      },
    };
    const netsuiteDistributedResourceWithHooks = {
      netsuite_da: {
        hooks: {
          someFunc: {
            _scriptId: 's5',
            function: 'someFunc',
          },
        },
      },
    };
    const netsuiteDistributedResourceWithoutHooks = {
      netsuite_da: {
        someFields: 'someFields',
      },
    };

    test('should return true if the resorce has hooks field', () => {
      expect(isActionUsed(resourceWithHooks, resourceType, flowNode, action)).toEqual(true);
    });
    test('should return true if the resource has hooks defined in netsuite restlet schema and the hook has preSend function defined', () => {
      expect(isActionUsed(netsuiteResourceRestletSchemaWithPreSendFunc, resourceType, flowNode, action)).toEqual(true);
    });
    test('should return false if the resource has hooks defined in netsuite restlet schema and the hook does not have preSend function defined', () => {
      expect(isActionUsed(netsuiteResourceRestletSchemaWithoutPreSendFunc, resourceType, flowNode, action)).toEqual(false);
    });
    test('should return false if the resource does not have hooks defined in netsuite restlet schema', () => {
      expect(isActionUsed(netsuiteResourceRestletSchemaWithoutHooks, resourceType, flowNode, action)).toEqual(false);
    });
    test('should return true if the resource has hooks defined in netsuite distributed schema and the hook has preSend function defined', () => {
      expect(isActionUsed(netsuiteResourceDistributedSchemaWithPreSendFunc, resourceType, flowNode, action)).toEqual(true);
    });
    test('should return false if the resource does not have hooks defined in netsuite distributed schema', () => {
      expect(isActionUsed(netsuiteResourceDistributedSchemaWithoutPreSendFunc, resourceType, flowNode, action)).toEqual(false);
    });
    test('should return false if the resource does not have hooks defined in netsuite distributed schema', () => {
      expect(isActionUsed(netsuiteResourceDistributedSchemaWithoutHooks, resourceType, flowNode, action)).toEqual(false);
    });
    test('should return false if the netsuite resource does not have schema defined', () => {
      expect(isActionUsed(netsuiteResoureWithoutSchema, resourceType, flowNode, action)).toEqual(false);
    });
    test('should return true if netsuite distributed resource has hooks defined', () => {
      expect(isActionUsed(netsuiteDistributedResourceWithHooks, resourceType, flowNode, action)).toEqual(true);
    });
    test('should return false if netsuite distributed resource does not have hooks defined', () => {
      expect(isActionUsed(netsuiteDistributedResourceWithoutHooks, resourceType, flowNode, action)).toEqual(false);
    });
    test('should return false if resource does not have any hooks', () => {
      expect(isActionUsed({}, resourceType, flowNode, action)).toEqual(false);
    });
  });

  describe('When the action is responseMapping', () => {
    const action = 'responseMapping';
    const flowNodeResponseMappingWithFields = {
      responseMapping: {
        fields: [{
          extract: 'someField',
          generate: 'newField',
          internalId: false,
        }],
      },
    };
    const flowNodeResponseMappingWithLists = {
      responseMapping: {
        lists: [{something: 'something'}],
      },
    };
    const flowNodeResponseMappingWithFieldsAndLists = {
      responseMapping: {
        fields: [{
          extract: 'someField',
          generate: 'newField',
          internalId: false,
        }],
        lists: [{something: 'something'}],
      },
    };
    const flowNodeResponseMappingWithoutFieldsAndLists = {
      responseMapping: {},
    };
    const resource = {id: 'r1'};
    const resourceType = 'exports';

    test('should return true if responseMapping has both fields and lists', () => {
      expect(isActionUsed(resource, resourceType, flowNodeResponseMappingWithFieldsAndLists, action)).toEqual(true);
    });
    test('should return true if responseMapping has only fields', () => {
      expect(isActionUsed(resource, resourceType, flowNodeResponseMappingWithFields, action)).toEqual(true);
    });
    test('should return true if responseMapping has only lists', () => {
      expect(isActionUsed(resource, resourceType, flowNodeResponseMappingWithLists, action)).toEqual(true);
    });
    test('should return false if responseMapping does not have both fields and lists', () => {
      expect(isActionUsed(resource, resourceType, flowNodeResponseMappingWithoutFieldsAndLists, action)).toEqual(false);
    });
  });

  describe('When the action is postResponseMap', () => {
    const action = 'postResponseMap';
    const flowNodeHooksWithScript = {
      hooks: {
        postResponseMap: {
          _scriptId: 's1',
          function: 'postResponsemap',
        },
      },
    };
    const flowNodeHooksWithoutScript = {
      hooks: {
        postResponseMap: {},
      },
    };
    const flowNodeHooksWithoutPostResponseMap = {
      hooks: {
        somehook: {},
      },
    };
    const flowNodeWithoutHooks = {
      something: 'something',
    };
    const resource = { _id: 'r1'};

    test('should return true if flowNode has postResponseMap hook of type script', () => {
      expect(isActionUsed(resource, 'exports', flowNodeHooksWithScript, action)).toEqual(true);
    });
    test('should return false if flowNode has postResponseMap hook without a script', () => {
      expect(isActionUsed(resource, 'exports', flowNodeHooksWithoutScript, action)).toEqual(false);
    });
    test('should return false if flowNode does not have postResponseMap', () => {
      expect(isActionUsed(resource, 'exports', flowNodeHooksWithoutPostResponseMap, action)).toEqual(false);
    });
    test('should return false if flowNode does not have hooks', () => {
      expect(isActionUsed(resource, 'exports', flowNodeWithoutHooks, action)).toEqual(false);
    });
  });

  describe('when the action is outputFilter', () => {
    const action = 'outputFilter';
    const resourceType = 'something';
    const scriptWithScriptId = {
      type: 'script',
      script: {
        _scriptId: 's4',
        function: 'filter',
      },
    };

    test('should return true if resource has filter and is of expression type with rules', () => {
      expect(isActionUsed({ filter: expressionWithRules }, resourceType, {}, action)).toEqual(true);
    });
    test('should return false if resource has filter and is of expression type without rules', () => {
      expect(isActionUsed({ filter: expressionWithoutRules }, resourceType, {}, action)).toEqual(false);
    });
    test('should return true if resource has filter and is of script type with scriptId defined', () => {
      expect(isActionUsed({ filter: scriptWithScriptId }, resourceType, {}, action)).toEqual(true);
    });
    test('should return false if resource has filter and is of script type without scriptId defined', () => {
      expect(isActionUsed({ filter: scriptWithoutScriptId }, resourceType, {}, action)).toEqual(false);
    });
  });

  describe('when the action is proceedOnFailure', () => {
    const action = 'proceedOnFailure';
    const resource = {id: 'r1'};
    const resourceType = 'something';
    const flowNodeWithProceedOnFailure = {
      proceedOnFailure: true,
    };

    test('should return true if flowNode has processedOnFailure as true', () => {
      expect(isActionUsed(resource, resourceType, flowNodeWithProceedOnFailure, action)).toEqual(true);
    });
    test('should return false if flowNode does not have processedOnFailure defined', () => {
      expect(isActionUsed(resource, resourceType, {}, action)).toEqual(false);
    });
  });
});

describe('getUsedActionsMapForResource', () => {
  test('should return correct used actions for a given export resource', () => {
    const exportResource = {
      inputFilter: {
        type: 'script',
        script: {
          _scriptId: 's4',
          function: 'filter',
        },
      },
      http: {
        body: 'something',
      },
      transform: {
        type: 'expression',
        expression: {
          rules: ['someRule'],
        },
      },
    };
    const flowNode = {
      schedule: true,
      proceedOnFailure: true,
    };
    const expectedActions = {
      hooks: false,
      inputFilter: true,
      outputFilter: false,
      postResponseMap: false,
      proceedOnFailure: true,
      responseMapping: false,
      schedule: true,
      transformation: true,
    };

    expect(getUsedActionsMapForResource(exportResource, 'exports', flowNode)).toEqual(expectedActions);
  });
  test('should return correct used actions for a given lookup resource', () => {
    const lookupResource = {
      isLookup: true,
      inputFilter: {
        type: 'script',
        script: {
          _scriptId: 's2',
          function: 'filter',
        },
      },
      http: {
        body: 'something',
      },
      adaptorType: 'HTTPExport',
    };
    const expectedActions = {
      hooks: false,
      inputFilter: true,
      outputFilter: false,
      postResponseMap: false,
      proceedOnFailure: false,
      responseMapping: false,
      schedule: false,
      transformation: false,
    };

    expect(getUsedActionsMapForResource(lookupResource, 'exports', {})).toEqual(expectedActions);
  });
  test('should return correct actions for a given netsuite distributed import resource', () => {
    const importResource = {
      filter: {
        type: 'script',
        script: {
          _scriptId: 's1',
          function: 'filter',
        },
      },
      responseTransform: {
        type: 'expression',
        expression: {
          rules: ['someRule'],
        },
      },
      netsuite_da: {
        mapping: {
          fields: [
            {
              extract: 'someField',
              generate: 'newField',
              internalId: false,
            },
          ],
        },
        hooks: {
          someFunc: {
            _scriptId: 's1',
            function: 'someFunc',
          },
        },
      },
      adaptorType: 'NetSuiteDistributedImport',
    };
    const expectedActions = {
      hooks: true,
      importMapping: true,
      inputFilter: true,
      outputFilter: true,
      postResponseMap: false,
      proceedOnFailure: false,
      responseMapping: false,
      responseTransformation: true,
      templateMapping: false,
    };

    expect(getUsedActionsMapForResource(importResource, 'imports', {})).toEqual(expectedActions);
  });
});

describe('isImportMappingAvailable', () => {
  const blobTypeResource = {
    type: 'blob',
  };
  const fileAdaptorResource = {
    adaptorType: 'FTPExport',
    file: {
      type: 'xml',
    },
  };
  const mongodbResource = {
    adaptorType: 'MongodbImport',
  };
  const rdbmsResource = {
    adaptorType: 'RDBMSImport',
    rdbms: {
      queryType: ['something'],
    },
  };

  test('should return false if the resource is not defined', () => {
    expect(isImportMappingAvailable(undefined)).toEqual(false);
  });
  test('should return false if the resource is of type blob', () => {
    expect(isImportMappingAvailable(blobTypeResource)).toEqual(false);
  });
  test('should return false if the resource is a file Adaptor of type xml', () => {
    expect(isImportMappingAvailable(fileAdaptorResource)).toEqual(false);
  });
  test('should return false if the resource is mongodb adaptor', () => {
    expect(isImportMappingAvailable(mongodbResource)).toEqual(false);
  });
  test('should return false if the resource is of type rdbms and the queryType does not consist BULK INSERT', () => {
    expect(isImportMappingAvailable(rdbmsResource)).toEqual(false);
  });
  test('should return true if the resource', () => {
    expect(isImportMappingAvailable({})).toEqual(true);
  });
});

describe('getPageProcessorImportsFromFlow', () => {
  const pageProcessors = [
    { _exportId: 'e3', type: 'export' },
    { _importId: 'i1', type: 'import' },
    { _exportId: 'e4', type: 'export' },
    { _importId: 'i2', type: 'import' },
  ];

  test('should return imports if pageprocessors are undefined', () => {
    expect(getPageProcessorImportsFromFlow(imports, undefined)).toEqual(imports);
  });
  test('', () => {
    expect(getPageProcessorImportsFromFlow(imports, pageProcessors)).toEqual([
      {
        _id: 'i1',
        name: 'i1',
        _connectionId: 'c1',
      }, {
        _id: 'i2',
        name: 'i2',
        _connectionId: 'c4',
      },
    ]
    );
  });
});

describe('getNextDataFlows', () => {
  const flow = {
    _id: 'f1',
    _integrationId: 'i1',
  };
  const flows = [
    {
      _id: 'f1',
      _integrationId: 'i1',
    },
    {
      _id: 'f2',
      _integrationId: 'i1',
    },
    {
      _id: 'f3',
      _integrationId: 'i2',
    },
    {
      _id: 'f4',
      _integrationId: 'i1',
      isRealtime: true,
    },
    {
      _id: 'f5',
      _integrationId: 'i1',
      isSimpleImport: true,
    },
    {
      _id: 'f6',
      _integrationId: 'i1',
      disabled: true,
    },
  ];

  test('should return empty array if flows is empty', () => {
    expect(getNextDataFlows(undefined, flow)).toEqual([]);
  });
  test('should return empty array if flow is empty', () => {
    expect(getNextDataFlows(flows, undefined)).toEqual([]);
  });
  test('should return correct flows', () => {
    expect(getNextDataFlows(flows, flow)).toEqual([{_id: 'f2', _integrationId: 'i1'}]);
  });
});

describe('getIAResources', () => {
  const flows = [
    {
      _id: 'f',
      _integrationId: 'i1',
    },
    {
      _id: 'f1',
      pageGenerators: [{ _exportId: 'e1', type: 'export' }],
      pageProcessors: [
        { _exportId: 'e3', type: 'export' },
        { _importId: 'i1', type: 'import' },
      ],
      _integrationId: 'i2',
    },
    {
      _id: 'f2',
      pageGenerators: [{ _exportId: 'e1', type: 'export' }, { _exportId: 'e2', type: 'export' }],
      pageProcessors: [
        { _exportId: 'e3', type: 'export' },
        { _importId: 'i1', type: 'import' },
        { _exportId: 'e4', type: 'export' },
        { _importId: 'i2', type: 'import' },
      ],
      _integrationId: 'i2',
    },
    {
      _id: 'f5',
      pageGenerators: [{ _exportId: 'e1', type: 'export' }, { _exportId: 'e2', type: 'export' }],
      pageProcessors: [
        { _exportId: 'e3', type: 'export' },
        { _importId: 'i1', type: 'import' },
        { _exportId: 'e4', type: 'export' },
        { _importId: 'i2', type: 'import' },
      ],
      _integrationId: 'i3',
    },
  ];
  const connections = [{
    _id: 'c1',
    name: 'c1',
    _integrationId: 'i1',
  }, {
    _id: 'c2',
    name: 'c2',
    _integrationId: 'i2',
  }, {
    _id: 'c3',
    name: 'c3',
    _borrowConcurrencyFromConnectionId: 'c5',
    _integrationId: 'i3',
  }, {
    _id: 'c4',
    name: 'c4',
    _borrowConcurrencyFromConnectionId: 'c6',
  }, {
    _id: 'c5',
    name: 'c5',
    _integrationId: 'i2',
  }, {
    _id: 'c6',
    name: 'c6',
  }];
  const options1 = {
    integrationId: 'i1',
  };
  const options2 = {
    integrationId: 'i2',
  };
  const options3 = {
    integrationId: 'i3',
    storeId: 'c1',
  };
  const options4 = {
    integrationId: 'i4',
    storeId: 'c4',
  };

  test('should return correct object for a DIY Integration', () => {
    expect(getIAResources(diyIntegration, flows, connections, exports, imports, options1)).toEqual(
      {
        connections: [{
          _id: 'c1',
          name: 'c1',
          _integrationId: 'i1',
        }],
        flows: [
          {
            _id: 'f',
            _integrationId: 'i1',
          },
        ],
      },
    );
  });

  test('should return correct object for an integration app', () => {
    expect(getIAResources(integrationApp, flows, connections, exports, imports, options2)).toEqual({
      connections: [
        {
          _id: 'c2',
          name: 'c2',
          _integrationId: 'i2',
        }, {
          _id: 'c5',
          name: 'c5',
          _integrationId: 'i2',
        },
      ],
      flows: [
        {
          _id: 'f1',
          pageGenerators: [{ _exportId: 'e1', type: 'export' }],
          pageProcessors: [
            { _exportId: 'e3', type: 'export' },
            { _importId: 'i1', type: 'import' },
          ],
          _integrationId: 'i2',
        }, {
          _id: 'f2',
          pageGenerators: [{ _exportId: 'e1', type: 'export' }, { _exportId: 'e2', type: 'export' }],
          pageProcessors: [
            { _exportId: 'e3', type: 'export' },
            { _importId: 'i1', type: 'import' },
            { _exportId: 'e4', type: 'export' },
            { _importId: 'i2', type: 'import' },
          ],
          _integrationId: 'i2',
        },
      ],
    });
  });

  test('should return correct object for a multistore app', () => {
    expect(getIAResources(multiStoreApp, flows, connections, exports, imports, options3)).toEqual({
      connections: [{
        _id: 'c3',
        name: 'c3',
        _borrowConcurrencyFromConnectionId: 'c5',
        _integrationId: 'i3',
      }],
      exports: ['e1', 'e2', 'e3', 'e4'],
      flows: [{
        _id: 'f5',
        name: undefined,
      }],
      imports: ['i1', 'i2'],
    });
  });

  test('should return empty resources for a multistore app without the required store', () => {
    expect(getIAResources(multiStoreApp, flows, connections, exports, imports, options4)).toEqual({
      connections: [],
      exports: [],
      flows: [],
      imports: [],
    });
  });
});

describe('getIAFlowSettings', () => {
  const flowIdIA = 'f1';
  const flowIDMultiStore = 'f5';
  const multiStoreAppWithChildNotHavingSections = {
    _id: 'i4',
    _connectorId: 'c3',
    settings: {
      supportsMultiStore: true,
      sections: [
        {
          id: 'c1',
          title: 'order',
          flows: [{_id: 'f1'}],
        },
      ],
    },
  };

  test('should return empty object for DIY integrations', () => {
    expect(getIAFlowSettings(diyIntegration, flowIdIA, undefined)).toEqual({});
  });
  test('should return the flow if the integration app has the required flow in its sections', () => {
    expect(getIAFlowSettings(integrationApp, flowIdIA, undefined)).toEqual({
      _id: 'f1',
      sections: [
        {
          title: 'flowSec',
          flows: [{_id: 'f4'}],
        },
      ],
      showSchedule: true,
      showMapping: true,
      showStartDateDialog: true,
      disableSlider: true,
      disableRunFlow: true,
      showUtilityMapping: true,
    });
  });
  test('should return empty object if the integration app does not have the required flow in its sections', () => {
    expect(getIAFlowSettings(integrationApp, 'f10', undefined)).toEqual({});
  });
  test('should return the flow if the integration app supports multistore and has a child with its id equal to childId', () => {
    expect(getIAFlowSettings(multiStoreApp, flowIDMultiStore, 'c1')).toEqual({
      _id: 'f5',
      pageGenerators: [
        {
          _exportId: 'e1',
          type: 'export',
        },
      ],
      pageProcessors: [
        {
          _exportId: 'e2',
          type: 'export',
        },
        {
          _importId: 'i1',
          type: 'import',
        },
      ],
      sections: [{id: 'c3'},
      ]});
  });
  test('should return empty object if the integration app supports multistore with the reuired child but the required flow is not present in child', () => {
    expect(getIAFlowSettings(multiStoreApp, flowIDMultiStore, 'c2')).toEqual({});
  });
  test('should return undefined if the IA supports multistore but it does not have the required child', () => {
    expect(getIAFlowSettings(multiStoreApp, flowIDMultiStore, 'c3')).toEqual(undefined);
  });
  test('should return undefined if the IA supports multistore but the required child does not have sections defined', () => {
    expect(getIAFlowSettings(multiStoreAppWithChildNotHavingSections, flowIDMultiStore, 'c1')).toEqual(undefined);
  });
  test('should return undefined if the IA supports multistore and sections is not defined for any of the child', () => {
    expect(getIAFlowSettings(multiStoreAppWithChildNotHavingSections, flowIDMultiStore, undefined)).toEqual({});
  });
  test('should return the flow if the integration app supports multistore and the flow is present in one of the child of IA', () => {
    expect(getIAFlowSettings(multiStoreApp, 'f6', undefined)).toEqual({_id: 'f6', _exportId: 'e3', _importId: 'i2'});
  });
  test('should return empty object if the integration app supports multistore but the flow is not present in any of the child of IA', () => {
    expect(getIAFlowSettings(multiStoreApp, 'f15', undefined)).toEqual({});
  });
});

describe('getFlowReferencesForResource', () => {
  const flows = [oldFlow, flowWithOnlyPGs, flowWithOnlyPPs, flowWithPGsandPPs, dataLoaderFlow, realtimeFlow, disabledFlow, disabledIAFlow];

  test('should return correct flow references for selected export resource', () => {
    const resourceId = 'e1';
    const expectedResources = [{flowId: '1', resourceId: 'e1'}, {flowId: '2', resourceId: 'e1'}, {flowId: '3', resourceId: 'e1'}];

    expect(getFlowReferencesForResource(flows, exports, imports, 'exports', resourceId)).toEqual(expectedResources);
  });
  test('should return correct flow references for selected import resource', () => {
    const resorceId = 'i2';
    const expectedResources = [{flowId: '3', resourceId: 'i2'}];

    expect(getFlowReferencesForResource(flows, exports, imports, 'imports', resorceId)).toEqual(expectedResources);
  });
  test('should return correct flow references for selected script resource', () => {
    const resorceId = 's2';
    const expectedResources = [];

    expect(getFlowReferencesForResource(flows, exports, imports, 'scripts', resorceId)).toEqual(expectedResources);
  });
});

describe('flowAllowsScheduling', () => {
  const appVersionTwoDotZero = true;
  const integrationAppV2 = {
    _id: 'i1',
    twoDotZero: true,
  };
  const batchFlow = {
    _id: 'f1',
    pageGenerators: [{ _exportId: 'e1', type: 'export' }, { _exportId: 'e2', type: 'export' }],
    pageProcessors: [
      { _exportId: 'e3', type: 'export' },
      { _importId: 'i1', type: 'import' },
      { _exportId: 'e4', type: 'export' },
      { _importId: 'i2', type: 'import' },
    ],
    _integrationId: integration._id,
    _connectorId: 'ia1',
  };
  const realTimeFlow = {
    _id: 'f1',
    pageGenerators: [{ _exportId: 're1', type: 'export' }],
    pageProcessors: [
      { _importId: 'i1', type: 'import' },
    ],
    _integrationId: integration._id,
    _connnectorId: 'ia2',
  };
  const IAWithFlowAllowsSchedule = {
    _id: 'i2',
    _connectorId: 'ia1',
    settings: {
      sections: [
        {
          title: 'order',
          flows: [{_id: 'f1', showSchedule: true}, {_id: 'f2'}],
        },
      ],
    },
  };
  const IAWithFlowNotAllowsSchedule = {
    _id: 'i2',
    _connectorId: 'ia1',
    settings: {
      sections: [
        {
          title: 'order',
          flows: [{_id: 'f1', showSchedule: false}, {_id: 'f2'}],
        },
      ],
    },
  };

  test('should return false if flow is not defined', () => {
    expect(flowAllowsScheduling(undefined, integration, exports, false)).toEqual(false);
  });
  test('should return true for a batch flow and integration is not an IA', () => {
    expect(flowAllowsScheduling(flowWithPGsandPPs, integration, exports, false)).toEqual(true);
  });
  test('should return false if flow is not a batch flow and integration is not an IA', () => {
    expect(flowAllowsScheduling(realtimeFlow, integration, realtimeExports, false)).toEqual(false);
  });
  test('should return true if flow a batch flow and integration is IA of version2', () => {
    expect(flowAllowsScheduling(flowWithPGsandPPs, integrationAppV2, exports, appVersionTwoDotZero)).toEqual(true);
  });
  test('should return false if flow is not a batch flow and integration is IA of version2', () => {
    expect(flowAllowsScheduling(realtimeFlow, integrationAppV2, realtimeExports, appVersionTwoDotZero)).toEqual(false);
  });
  test('should return true if flow is a batch flow and integration is IA not of version2 and flowSettings has showSchedule', () => {
    expect(flowAllowsScheduling(batchFlow, IAWithFlowAllowsSchedule, exports, false)).toEqual(true);
  });
  test('should return fasle if flow is a batch flow and integration is IA not of version2 and flowSettings has showSchedule as fasle', () => {
    expect(flowAllowsScheduling(batchFlow, IAWithFlowNotAllowsSchedule, exports, false)).toEqual(false);
  });
  test('should return fasle if flow is not a batch flow and integration is IA not of version2', () => {
    expect(flowAllowsScheduling(realTimeFlow, IAWithFlowNotAllowsSchedule, realtimeExports, false)).toEqual(false);
  });
});

describe('flowSupportsSettings', () => {
  test('should return false if flow is undefined', () => {
    expect(flowSupportsSettings(undefined, diyIntegration, undefined)).toEqual(false);
  });
  test('should return false if integration is not an integration app', () => {
    expect(flowSupportsSettings({_id: 'f1'}, diyIntegration, undefined)).toEqual(false);
  });
  test('should return false if integration is an integration app but the flow does not have either settings or sections defined', () => {
    expect(flowSupportsSettings({_id: 'f2'}, integrationApp, undefined)).toEqual(false);
  });
  test('should return true if integration is an integration app and the flow has settings defined', () => {
    expect(flowSupportsSettings({_id: 'f1', _connectorId: 'ia2'}, integrationApp, undefined)).toEqual(true);
  });
  test('should return true if integration is an multistore app and the flow has sections defined', () => {
    expect(flowSupportsSettings({_id: 'f5', _connectorId: 'ia3'}, multiStoreApp, 'c1')).toEqual(true);
  });
});

describe('getFlowDetails', () => {
  const childId = 'c1';
  const flow = {
    _id: 'f1',
    _connectorId: 'c1',
    pageGenerators: [{ _exportId: 'e1', type: 'export' }, { _exportId: 'e2', type: 'export' }],
    _integrationId: integration._id,
  };
  const exportsWithDeltaType = [
    {
      _id: 'e1',
      type: 'delta',
    },
  ];

  test('should return empty object when flow is undefined', () => {
    expect(getFlowDetails(undefined, integration, exports, childId)).toEqual({});
  });
  test('should return correct object', () => {
    expect(getFlowDetails(realtimeFlow, integration, realtimeExports)).toEqual({
      _id: 'f8',
      _integrationId: 'i1',
      pageGenerators: [{ _exportId: 're1', type: 'export' }],
      pageProcessors: [
        { _importId: 'i1', type: 'import' },
      ],
      isRealtime: true,
      isSimpleImport: false,
      isRunnable: false,
      canSchedule: false,
      disableSlider: false,
      isDeltaFlow: false,
      hasSettings: false,
      showMapping: false,
      showSchedule: false,
      showStartDateDialog: false,
      showUtilityMapping: false,
      disableRunFlow: false,
    });
  });
  test('should return correct object', () => {
    expect(getFlowDetails(dataLoaderFlow, integration, exports)).toEqual({
      _id: 'f7',
      _integrationId: 'i1',
      pageGenerators: [{ _exportId: 'se' }],
      pageProcessors: [
        { _importId: 'i1', type: 'import' },
      ],
      isRealtime: false,
      isSimpleImport: true,
      isRunnable: true,
      canSchedule: false,
      disableSlider: false,
      isDeltaFlow: false,
      hasSettings: false,
      showMapping: false,
      showSchedule: false,
      showStartDateDialog: false,
      showUtilityMapping: false,
      disableRunFlow: false,
    });
  });
  test('should return correct object', () => {
    expect(getFlowDetails(flowWithOnlyPGs, integration, exportsWithDeltaType)).toEqual({
      _id: 'f4',
      _integrationId: 'i1',
      pageGenerators: [
        { _exportId: 'e1', type: 'export' },
        { _exportId: 'e2', type: 'export' },
      ],
      isRealtime: false,
      isSimpleImport: false,
      isRunnable: false,
      canSchedule: true,
      disableSlider: false,
      isDeltaFlow: true,
      hasSettings: false,
      showMapping: false,
      showSchedule: true,
      showStartDateDialog: false,
      showUtilityMapping: false,
      disableRunFlow: false,
    });
  });
  test('', () => {
    expect(getFlowDetails(flow, integrationApp, exports)).toEqual({
      _id: 'f1',
      _integrationId: 'i1',
      _connectorId: 'c1',
      pageGenerators: [{ _exportId: 'e1', type: 'export' }, { _exportId: 'e2', type: 'export'}],
      isRealtime: false,
      isSimpleImport: false,
      isRunnable: false,
      canSchedule: true,
      disableSlider: true,
      isDeltaFlow: false,
      hasSettings: true,
      showMapping: true,
      showSchedule: true,
      showStartDateDialog: true,
      showUtilityMapping: true,
      disableRunFlow: true,
    });
  });
});
