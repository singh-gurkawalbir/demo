import { getSomePg, getSomePpImport } from './nodeGeneration';

const export1 = {_id: 'export1', label: 'export1', connectorType: 'netsuite' };

const import1 = {_id: 'import1', label: 'import1', connectorType: 'ftp' };
const import2 = {_id: 'import2', label: 'import2', connectorType: 'http' };
const import3 = {_id: 'import3', label: 'import3', isLookup: true, connectorType: 'http'};
const import4 = {_id: 'import4', label: 'import4', isLookup: true, connectorType: 'ftp'};
const import5 = {_id: 'import5', label: 'import5', isLookup: true, connectorType: 'netsuite'};

export const imports = [
  import1,
  import2,
  import3,
  import4,
  import5,
];

export const exports = [
  export1,
];

const firstBranch = {
  name: 'first branch',
  description: 'some description',
  // ignore filter config
  inputFilter: {},
  pageProcessors: [getSomePpImport('import2'), getSomePpImport('import3')],
  // what if we want to have a merge
  //   _nextRouterId: { type: Schema.Types.ObjectId },
  _id: 'branch-1',
};

const secondBranch = {
  name: 'second branch',
  description: 'some description',
  inputFilter: {},
  pageProcessors: [getSomePpImport('import4'), getSomePpImport('import5')],
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
  routeRecordsTo: {
    type: 'first_matching_branch',
    default: undefined,
  },
  routeRecordsUsing: {
    type: 'input_filters',
    default: undefined,
  },
  branches: [virtualBranch],
  script: {
    _scriptId: { type: 'something', ref: 'Script' },
    function: { type: 'something' },
  },
};

export const flowSchema = {
  _id: 'flow1',
  routers: [virtualRouterForFirstPP, firstRouter],
  pageGenerators: [getSomePg('export1')],
};

export const resourceState = {
  flows: [flowSchema],
  exports,
  imports,
};
