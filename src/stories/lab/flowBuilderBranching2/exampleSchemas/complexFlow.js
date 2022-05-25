import { getSomePg, getSomePpImport } from '../../../../utils/flows/flowbuilder';

const export1 = {_id: 'export1', name: 'The only export', connectorType: 'netsuite' };

const import1 = {_id: 'import1', name: 'import1 with long name', connectorType: 'ftp' };
const import2 = {_id: 'import2', name: 'Import Two', connectorType: 'http' };
const import3 = {_id: 'import3', name: 'import3', isLookup: true, connectorType: 'http'};
const import4 = {_id: 'import4', name: 'import4', isLookup: true, connectorType: 'ftp'};
const import5 = {_id: 'import5', name: 'import5', isLookup: true, connectorType: 'netsuite'};
const import6 = {_id: 'import6', name: 'import6', connectorType: 'http' };
const import7 = {_id: 'import7', name: 'import7', isLookup: true, connectorType: 'http'};
const import8 = {_id: 'import8', name: 'import8', isLookup: true, connectorType: 'ftp'};
const import9 = {_id: 'import9', name: 'import9', isLookup: true, connectorType: 'netsuite'};

const imports = [
  import1,
  import2,
  import3,
  import4,
  import5,
  import6,
  import7,
  import8,
  import9,
];

const exports = [
  export1,
];

const firstBranch = {
  name: 'first branch',
  description: 'some description',
  // ignore filter config
  inputFilter: {},
  pageProcessors: [getSomePpImport('import2'), getSomePpImport('import3')],
  // what if we want to have a merge
  _nextRouterId: 'secondRouter',
  _id: 'branch-1',
};

const secondBranch = {
  name: 'second branch',
  description: 'some description',
  inputFilter: {},
  pageProcessors: [getSomePpImport('import4'), getSomePpImport('import5')],
  _id: 'branch-2',
};

const branchOne = {
  name: 'Branch 1 1',
  description: 'some description',
  // ignore filter config
  inputFilter: {},
  pageProcessors: [getSomePpImport('import6'), getSomePpImport('import7')],
  // what if we want to have a merge
  //   _nextRouterId: { type: Schema.Types.ObjectId },
  _id: 'branch-1',
};

const branchTwo = {
  name: 'Branch 1 2',
  description: 'some description',
  inputFilter: {},
  pageProcessors: [getSomePpImport('import8'), getSomePpImport('import9')],
  _id: 'branch-2',
};

const firstRouter = {
  _id: 'firstRouter',
  routeRecordsTo: {
    type: 'first_matching_branch',
    default: undefined,
  },
  routeRecordsUsing: {
    type: 'input_filters',
    default: undefined,
  },
  branches: [firstBranch, secondBranch],
  script: {
    _scriptId: { type: 'something', ref: 'Script' },
    function: { type: 'something' },
  },
};

const secondRouter = {
  _id: 'secondRouter',
  routeRecordsTo: {
    type: 'first_matching_branch',
    default: undefined,
  },
  routeRecordsUsing: {
    type: 'input_filters',
    default: undefined,
  },
  branches: [branchOne, branchTwo],
  script: {
    _scriptId: { type: 'something', ref: 'Script' },
    function: { type: 'something' },
  },
};

const virtualBranch = {
  name: 'second branch',
  description: 'some description',
  inputFilter: {},
  pageProcessors: [getSomePpImport('import1')],
  _id: 'firstVirtualBranch',
  _nextRouterId: 'firstRouter',
};

const virtualRouterForFirstPP = {
  _id: 'virtualRouter',
  branches: [virtualBranch],
};

const flowSchema = {
  _id: 'flow1',
  routers: [virtualRouterForFirstPP, firstRouter, secondRouter],
  pageGenerators: [getSomePg('export1')],
};

export default {
  flows: [flowSchema],
  exports,
  imports,
};
