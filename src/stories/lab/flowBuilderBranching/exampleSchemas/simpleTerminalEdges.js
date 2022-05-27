import { getSomePg, getSomePpImport } from '../../../../utils/flows/flowbuilder';

const branchOne = {
  name: 'First Branch',
  description: 'some description 1',
  inputFilter: {},
  pageProcessors: [getSomePpImport('import1')],
  id: 'branch-1',
};

const branchTwo = {
  name: 'Second Branch',
  description: 'some description',
  inputFilter: {},
  pageProcessors: [],
  id: 'branch-2',
};

const firstRouter = {
  id: 'firstRouter',
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

export default {
  flows: [{
    id: 'flow1',
    routers: [firstRouter],
    pageGenerators: [getSomePg('export1')],
  }],
  exports: [{id: 'export1', name: 'The only export', connectorType: 'netsuite' }],
  imports: [{id: 'import1', name: 'import1 with long name', connectorType: 'ftp' }],
};
