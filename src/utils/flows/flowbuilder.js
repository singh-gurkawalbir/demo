/* eslint-disable no-param-reassign */

import { cloneDeep } from 'lodash';
import { GRAPH_ELEMENTS_TYPE } from '../../constants';
import { generateId } from '../string';

export function generateDefaultEdge(source, target, {routerIndex, branchIndex, hidden} = {}) {
  return {
    id: `${source}-${target}`,
    source,
    target,
    data: {
      path: `/routers/${routerIndex}/branches/${branchIndex}`,
    },
    hidden,
    type: 'default',
  };
}
export const shortId = () => generateId(6);
export const getSomeImport = _id => ({_id, connectorType: 'ftp', label: _id});
export const getSomeExport = _exportId => ({_id: _exportId, connectorType: 'ftp', label: _exportId});

export const getSomePg = _exportId => ({_exportId, skipRetries: true, id: _exportId});

export const getSomePpImport = _importId =>
  ({responseMapping: {fields: [], lists: []}, type: 'import', _importId});
export const isVirtualRouter = (router = {}) => !router.routeRecordsTo && !router.routeRecordsUsing && (!router.branches || router.branches.length <= 1);

export const generateRouterNode = (router, routerIndex) => ({
  id: router?.id || shortId(),
  type: isVirtualRouter(router) ? GRAPH_ELEMENTS_TYPE.MERGE : GRAPH_ELEMENTS_TYPE.ROUTER,
  data: {
    path: `/routers/${routerIndex}`,
    router,
  },
});
export const generateNewTerminal = ({branch = {}, branchIndex, routerIndex} = {}) => ({
  id: shortId(),
  type: GRAPH_ELEMENTS_TYPE.TERMINAL,
  draggable: true,
  data: {
    ...branch,
    path: `/routers/${routerIndex}/branches/${branchIndex}/pageProcessors/${branch.pageProcessors?.length || '-'}`,
  },
});

export const generateBranch = () => {
  const newId = shortId();

  return {
    name: newId,
    description: 'some description',
    inputFilter: {},
    pageProcessors: [],
  };
};
export const generateEmptyRouter = isVirtual => ({
  id: shortId(),
  ...(!isVirtual && { routeRecordsTo: 'first_matching_branch'}),
  ...(!isVirtual && { routeRecordsUsing: 'input_filters'}),
  branches: [{
    pageProcessors: [{application: `none-${shortId()}`}],
  }],
  ...(!isVirtual && { script: {
    _scriptId: undefined,
    function: undefined,
  } }),
});

export const initializeFlowForReactFlow = flowDoc => {
  if (!flowDoc) return flowDoc;
  const flow = cloneDeep(flowDoc);
  const { pageGenerators = [], pageProcessors = [], routers = [] } = flow;

  pageGenerators.forEach(pg => {
    pg.id = pg._exportId || pg._connectionId || pg.application || `none-${shortId()}`;
  });
  pageProcessors.forEach(pp => {
    pp.id = pp._importId || pp._exportId || pp._connectionId || pp.application || `none-${shortId()}`;
  });
  routers.forEach(({branches = []}) => {
    branches.forEach(branch => {
      const {pageProcessors = []} = branch;

      pageProcessors.forEach(pp => {
        pp.id = pp._importId || pp._exportId || pp._connectionId || pp.application || `none-${shortId()}`;
      });
    });
  });
  if (pageProcessors.length && !routers.length) {
    flow.routers = [{
      id: shortId(),
      branches: [{name: 'Branch 1.0', pageProcessors}],
    }];
    delete flow.pageProcessors;
  }

  return flow;
};

// Note 'targeId' can be either a page processor Id if the flow schema is linear (old schema)
// or it can be a router Id if the flow schema represents a branched flow.
const generatePageGeneratorNodesAndEdges = (pageGenerators, targetId) => {
  if (!pageGenerators || !pageGenerators.length || !targetId) {
    return [];
  }

  const nodes = pageGenerators.map((pg, index) => ({
    id: pg.id,
    type: 'pg',
    data: {...pg, path: `/pageGenerators/${index}`},
  }));

  const edges = nodes.map(node => generateDefaultEdge(node.id, targetId));

  return [...nodes, ...edges];
};

const generatePageProcessorNodesAndEdges = (pageProcessors, branchData = {}) => {
  const edges = [];
  const {branch, branchIndex, routerIndex} = branchData;
  const nodes = pageProcessors.map((pageProcessor, index, collection) => {
    if (index + 1 < collection.length) {
      edges.push(generateDefaultEdge(pageProcessor.id, collection[index + 1].id, branchData));
    }

    return {
      id: pageProcessor.id,
      type: GRAPH_ELEMENTS_TYPE.PP_STEP,
      data: {
        resource: {...pageProcessor},
        branch,
        isFirst: index === 0,
        path: `/routers/${routerIndex}/branches/${branchIndex}/pageProcessors/${index}`,
      },
    };
  });

  return [...edges, ...nodes];
};

const generateNodesAndEdgesFromNonBranchedFlow = flow => {
  const { _exportId, pageGenerators = [], pageProcessors = [], _importId } = flow;
  const virtualRouter = {id: `none-${shortId()}`, branches: []};

  const pageGeneratorNodesAndEdges = generatePageGeneratorNodesAndEdges(_exportId ? [{_exportId, id: _exportId}] : pageGenerators, virtualRouter.id);
  const pageProcessorNodesAndEdges = generatePageProcessorNodesAndEdges(_importId ? [{_importId, id: _importId}] : pageProcessors);
  const firstPPId = _importId || pageProcessors[0]?.id || _importId;
  const lastPPId = _importId || pageProcessors[pageProcessors.length - 1]?.id || _importId;

  const terminalNode = generateNewTerminal();
  const dummyPGId = `none-${shortId()}`;
  const dummyPPId = `none-${shortId()}`;

  if (!_exportId && !pageGenerators.length) {
    return [{
      id: dummyPGId,
      type: GRAPH_ELEMENTS_TYPE.PG_STEP,
      data: {application: dummyPGId, id: dummyPGId, path: '/pageGenerators/0'},
    },
    generateDefaultEdge(dummyPGId, dummyPPId, {routerIndex: 0, branchIndex: 0, hidden: true}),
    {
      id: dummyPPId,
      type: GRAPH_ELEMENTS_TYPE.PP_STEP,
      data: {
        resource: {application: dummyPPId, id: dummyPGId},
        isFirst: true,
        path: '/pageProcessors/0',
      },
    },
    ];
  }
  if (!firstPPId) {
    return [
      ...pageGeneratorNodesAndEdges,
      {
        id: virtualRouter.id,
        type: GRAPH_ELEMENTS_TYPE.PP_STEP,
        data: {
          resource: {application: virtualRouter.id, id: virtualRouter.id},
          isFirst: true,
          path: '/pageProcessors/0',
        },
      },
    ];
  }

  return [
    ...pageGeneratorNodesAndEdges,
    generateRouterNode(virtualRouter, 0),
    generateDefaultEdge(virtualRouter.id, firstPPId, {routerIndex: 0, branchIndex: 0}),
    ...pageProcessorNodesAndEdges,
    generateDefaultEdge(lastPPId, terminalNode.id, {routerIndex: 0, branchIndex: 0}),
    terminalNode,
  ];
};

export const getRouter = (routerId, flow = {}) => flow.routers?.find(r => r.id === routerId);

export const generateNodesAndEdgesFromBranchedFlow = flow => {
  const {pageGenerators = [], routers = []} = flow;

  const elements = [...generatePageGeneratorNodesAndEdges(pageGenerators, routers[0].id)];
  const routerVisited = {};
  const routersArr = [...routers];
  const populateRouterElements = router => {
    if (router && !routerVisited[router.id]) {
      const routerIndex = routersArr.findIndex(r => r.id === router.id);

      elements.push(generateRouterNode(router, routerIndex));
      router.branches.forEach((branch, branchIndex) => {
        if (branch.pageProcessors.length) {
          // draw an edge from router to first step of branch
          const pageProcessorNodes = generatePageProcessorNodesAndEdges(branch.pageProcessors, {branch, branchIndex, routerIndex});
          const branchStartEdge = generateDefaultEdge(router.id, branch.pageProcessors[0].id, {routerIndex, branchIndex});

          elements.push(branchStartEdge);
          if (branch.nextRouterId) {
            elements.push(generateDefaultEdge(branch.pageProcessors[branch.pageProcessors.length - 1].id, branch.nextRouterId, {routerIndex, branchIndex}));
            if (branch.nextRouterId !== router.id) {
              // Safe check, branch should not point to its own router, causes a loop
              populateRouterElements(routers.find(r => r.id === branch.nextRouterId));
            }
          } else {
            const terminalNode = generateNewTerminal({branch, branchIndex, routerIndex});

            elements.push(terminalNode);
            const terminalEdge = generateDefaultEdge(branch.pageProcessors[branch.pageProcessors.length - 1].id, terminalNode.id, {routerIndex, branchIndex});

            elements.push(terminalEdge);
          }
          elements.push(...pageProcessorNodes);
        } else
        // its an empty branch without any steps
        if (branch.nextRouterId) {
          // join the router to the next router
          elements.push(generateDefaultEdge(router.id, branch.nextRouterId, {routerIndex, branchIndex}));
          if (branch.nextRouterId !== router.id) {
            // Safe check, branch should not point to its own router, causes a loop
            populateRouterElements(routers.find(r => r.id === branch.nextRouterId));
          }
        } else {
          // getnerate terminal edge
          const terminalNode = generateNewTerminal({branch, branchIndex, routerIndex});

          elements.push(terminalNode);
          const terminalEdge = generateDefaultEdge(router.id, terminalNode.id, {routerIndex, branchIndex});

          elements.push(terminalEdge);
        }
      });
      // mark router as visited
      routerVisited[router.id] = true;
    }
  };

  routersArr.forEach(populateRouterElements);

  return elements;
};

export const generateReactFlowGraph = flow => {
  if (!flow) {
    return;
  }

  const {routers} = flow;

  if (!routers || routers.length === 0) {
    return generateNodesAndEdgesFromNonBranchedFlow(flow);
  }

  return generateNodesAndEdgesFromBranchedFlow(flow);
};

