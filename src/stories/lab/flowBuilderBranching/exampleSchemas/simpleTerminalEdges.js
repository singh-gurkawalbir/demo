import { getSomePg, getSomePpImport } from '../../../../utils/flows/flowbuilder';

const branchOne = {
  name: 'First Branch',
  description: 'some description 1',
  inputFilter: {},
  pageProcessors: [getSomePpImport('import1')],
};

const branchTwo = {
  name: 'Second Branch',
  description: 'some description',
  inputFilter: {},
  pageProcessors: [],
};

const firstRouter = {
  id: 'firstRouter',
  routeRecordsTo: 'first_matching_branch',
  routeRecordsUsing: 'input_filters',
  branches: [branchOne, branchTwo],
  script: {
    _scriptId: { type: 'something', ref: 'Script' },
    function: { type: 'something' },
  },
};

const flowSchema = {
  _id: 'flow1',
  routers: [firstRouter],
  pageGenerators: [getSomePg('export1')],
};

export default {
  flows: [flowSchema],
  exports: [{_id: 'export1', name: 'The only export', connectorType: 'netsuite' }],
  imports: [{_id: 'import1', name: 'import1 with long name', connectorType: 'ftp' }],
};
