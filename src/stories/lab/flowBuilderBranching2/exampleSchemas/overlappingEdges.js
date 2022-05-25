import { getSomePg, getSomePpImport } from '../../../../utils/flows/flowbuilder';

const export1 = {_id: 'export1', name: 'The only export', connectorType: 'netsuite' };

const import1 = {_id: 'import1', name: 'import1', connectorType: 'ftp' };
const import2 = {_id: 'import2', name: 'import2', connectorType: 'http' };
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

const branchFive = {
  name: 'fifth branch',
  description: 'some description 5',
  inputFilter: {},
  pageProcessors: [getSomePpImport('import5')],
  _nextRouterId: 'fourthRouter',
  _id: 'branch-5',
};

const branchSix = {
  name: 'Sixth branch',
  description: 'some description 6',
  inputFilter: {},
  pageProcessors: [getSomePpImport('import6')],
  _id: 'branch-6',
};

const branchSeven = {
  name: 'Seventh branch',
  description: 'some description 7',
  inputFilter: {},
  pageProcessors: [getSomePpImport('import7')],
  _nextRouterId: 'fourthRouter',
  _id: 'branch-7',
};

const branchFour = {
  name: 'fourth branch',
  description: 'some description 4',
  inputFilter: {},
  pageProcessors: [],
  _nextRouterId: 'thirdRouter',
  _id: 'branch-1',
};

const branchThree = {
  name: 'third branch',
  description: 'some description 3',
  inputFilter: {},
  pageProcessors: [getSomePpImport('import3')],
  _nextRouterId: 'fourthRouter',
  _id: 'branch-2',
};

const branchOne = {
  name: 'First Branch',
  description: 'some description 1',
  // ignore filter config
  inputFilter: {},
  pageProcessors: [getSomePpImport('import1')],
  // what if we want to have a merge
  _nextRouterId: 'secondRouter',
  _id: 'branch-1',
};

const branchTwo = {
  name: 'Second Branch',
  description: 'some description',
  inputFilter: {},
  pageProcessors: [getSomePpImport('import2')],
  _nextRouterId: 'thirdRouter',
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
  branches: [branchOne, branchTwo],
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
  branches: [branchThree, branchFour, branchFive],
  script: {
    _scriptId: { type: 'something', ref: 'Script' },
    function: { type: 'something' },
  },
};

const thirdRouter = {
  _id: 'thirdRouter',
  branches: [branchSeven],
};

const fourthRouter = {
  _id: 'fourthRouter',
  branches: [branchSix],
};

const flowSchema = {
  _id: 'flow1',
  routers: [firstRouter, secondRouter, thirdRouter, fourthRouter],
  pageGenerators: [getSomePg('export1')],
};

export default {
  flows: [flowSchema],
  exports,
  imports,
};
