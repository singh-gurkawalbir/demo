import { generateId, GRAPH_ELEMENTS_TYPE } from './lib';

export const getSomeImport = _id => ({_id, connectorType: 'ftp', label: _id});
export const getSomeExport = _exportId => ({_id: _exportId, connectorType: 'ftp', label: _exportId});

export const getSomePg = _exportId => ({_exportId, skipRetries: true, id: _exportId});

export const getSomePpImport = _importId =>
  ({responseMapping: {fields: [], lists: []}, type: 'import', _importId});
export const isVirtualRouter = (router = {}) => !router.routeRecordsTo && !router.routeRecordsUsing && (!router.branches || router.branches.length <= 1);

export const generateRouterNode = (router, routerIndex) => ({
  id: router?._id || generateId(),
  type: isVirtualRouter(router) ? GRAPH_ELEMENTS_TYPE.MERGE : GRAPH_ELEMENTS_TYPE.ROUTER,
  data: {
    path: `/routers/${routerIndex}`,
    router,
  },
});
export const generateNewTerminal = ({branch = {}, branchIndex, routerIndex} = {}) => ({
  id: generateId(),
  type: GRAPH_ELEMENTS_TYPE.TERMINAL,
  draggable: true,
  data: {
    ...branch,
    path: `/routers/${routerIndex}/branches/${branchIndex}/pageProcessors/${branch.pageProcessors?.length || '-'}`,
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
export const generateEmptyRouter = isVirtual => ({
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
