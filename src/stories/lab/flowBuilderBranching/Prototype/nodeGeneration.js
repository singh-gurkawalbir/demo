import { generateId } from './lib';

export const getSomeImport = _id => ({_id, connectorType: 'ftp', label: _id});
export const getSomeExport = _exportId => ({_id: _exportId, connectorType: 'ftp', label: _exportId});

export const getSomePg = _exportId => ({_exportId, skipRetries: true});

export const getSomePpImport = _importId =>
  ({responseMapping: {fields: [], lists: []}, type: 'import', _importId});
export const isVirtualRouter = (router = {}) => !router.routeRecordsTo && !router.routeRecordsUsing && (!router.branches || router.branches.length <= 1);

export const generateRouterNode = router => ({
  id: router?._id || generateId(),
  type: isVirtualRouter(router) ? 'merge' : 'router',
  data: router,
});
export const generateNewTerminal = branch => ({
  id: generateId(),
  type: branch?.pageProcessors?.length !== 0 ? 'terminalFree' : 'terminalBlocked',
  draggable: branch?.pageProcessors?.length !== 0,
  data: {
    ...branch,
  },
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
export const generateAnEmptyActualRouter = isVirtual => ({
  _id: generateId(),
  ...(!isVirtual && { routeRecordsTo: {
    type: 'first_matching_branch',
    default: undefined,
  }}),
  ...(!isVirtual && { routeRecordsUsing: {
    type: 'input_filters',
    default: undefined,
  }}),
  branches: [{
    pageProcessors: [{application: `none-${generateId()}`}],
  }],
  ...(!isVirtual && { script: {
    _scriptId: { type: 'something', ref: 'Script' },
    function: { type: 'something' },
  } }),
});
