import { generateId } from '../lib';

export const getSomeImport = _id => ({_id, connectorType: 'ftp', label: _id});
export const getSomeExport = _exportId => ({_id: _exportId, connectorType: 'ftp', label: _exportId});

export const getSomePg = _exportId => ({_exportId, skipRetries: true});

export const getSomePpImport = _importId =>
  ({responseMapping: {fields: [], lists: []}, type: 'import', _importId});
export const generateNewRouter = id => ({
  id: id || generateId(),
  type: 'router',
});
export const generateNewTerminal = () => ({
  id: generateId(),
  type: 'terminal',
  draggable: true,
});

export const generateBranch = () => {
  const newId = generateId();

  return {
    name: newId,
    description: 'some description',
    inputFilter: {},
    pageProcessors: [],
    _id: newId,
  };
};
export const generateAnEmptyActualRouter = () => ({
  _id: generateId(),
  routeRecordsTo: {
    type: 'first_matching_branch',
    default: undefined,
  },
  routeRecordsUsing: {
    type: 'input_filters',
    default: undefined,
  },
  branches: [],
  script: {
    _scriptId: { type: 'something', ref: 'Script' },
    function: { type: 'something' },
  },

});
