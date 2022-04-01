/* eslint-disable no-param-reassign */
import { generateDefaultEdge, generateId } from '../lib';
import { generateNewTerminal, generateRouterNode } from '../nodeGeneration';

export const initialiseFlowForReactFlow = flow => {
  if (!flow) return flow;
  const { pageGenerators = [], pageProcessors = [], routers = [] } = flow;

  pageGenerators.forEach(pg => {
    pg.id = pg._exportId || pg._connectionId || pg.application || `none-${generateId()}`;
  });
  pageProcessors.forEach(pp => {
    pp.id = pp._importId || pp._exportId || pp._connectionId || pp.application || `none-${generateId()}`;
  });
  routers.forEach(({branches = []}) => {
    branches.forEach(branch => {
      const {pageProcessors = []} = branch;

      pageProcessors.forEach(pp => {
        pp.id = pp._importId || pp._exportId || pp._connectionId || pp.application || `none-${generateId()}`;
      });
    });
  });
};

const hydrateNodeData = (resourcesState, node) => {
  if (node._exportId) {
    return resourcesState?.exports?.find(ele => ele._id === node.id);
  }
  if (node._importId) {
    return resourcesState?.imports?.find(ele => ele._id === node.id);
  }
  if (node._connectionId) {
    return resourcesState?.connections?.find(ele => ele._id === node.id);
  }

  if (node.application) {
    return {
      application: node.application,
    };
  }

  return null;
};

// Note 'targeId' can be either a page processor Id if the flow schema is linear (old schema)
// or it can be a router Id if the flow schema represents a branched flow.
const generatePageGeneratorNodesAndEdges = (resourcesState, pageGenerators, targetId) => {
  if (!pageGenerators || !pageGenerators.length || !targetId) {
    return [];
  }

  const nodes = pageGenerators.map(pg => ({
    id: pg.id,
    type: 'pg',
    data: hydrateNodeData(resourcesState, pg),
  }));

  const edges = nodes.map(node => generateDefaultEdge(node.id, targetId));

  return [...nodes, ...edges];
};

const generatePageProcessorNodesAndEdges = (resourceState, pageProcessors, branchData = {}) => {
  const edges = [];
  const {branch, branchIndex, routerIndex} = branchData;
  const nodes = pageProcessors.map((pageProcessor, index, collection) => {
    if (index + 1 < collection.length) {
      edges.push(generateDefaultEdge(pageProcessor.id, collection[index + 1].id));
    }

    return {
      id: pageProcessor.id,
      type: 'pp',
      data: {
        resource: hydrateNodeData(resourceState, pageProcessor),
        branch,
        isFirst: index === 0,
        path: `/routers/${routerIndex}/branches/${branchIndex}/pageProcessors/${index}`,
      },
    };
  });

  return [...edges, ...nodes];
};

const generateNodesAndEdgesFromNonBranchedFlow = (resourceState, flow) => {
  const { _exportId, pageGenerators, pageProcessors = [], _importId } = flow;
  const virtualRouter = {_id: generateId(), branches: []};
  const pageGeneratorNodesAndEdges = generatePageGeneratorNodesAndEdges(resourceState, pageGenerators || [{_exportId, id: _exportId}], virtualRouter._id);
  const pageProcessorNodesAndEdges = generatePageProcessorNodesAndEdges(resourceState, _importId ? [{_importId, id: _importId}] : pageProcessors);
  const firstPPId = _importId || pageProcessors[0]?.id || _importId;
  const lastPPId = _importId || pageProcessors[pageProcessors.length - 1]?.id || _importId;

  const terminalNode = generateNewTerminal();

  return [
    ...pageGeneratorNodesAndEdges,
    generateDefaultEdge(virtualRouter._id, firstPPId),
    ...pageProcessorNodesAndEdges,
    generateDefaultEdge(lastPPId, terminalNode.id),
    terminalNode,
  ];
};

export const getRouter = (routerId, flow = {}) => flow.routers?.find(r => r._id === routerId);

export const generateNodesAndEdgesFromBranchedFlow = (resourceState, flow) => {
  const {pageGenerators = [], routers = []} = flow;
  const elements = [...generatePageGeneratorNodesAndEdges(resourceState, pageGenerators, routers[0]._id)];
  const routerVisited = {};
  const routersArr = [...routers];
  const populateRouterElements = router => {
    if (router && !routerVisited[router._id]) {
      const routerIndex = routersArr.findIndex(r => r._id === router._id);

      elements.push(generateRouterNode(router, routerIndex));
      router.branches.forEach((branch, branchIndex) => {
        if (branch.pageProcessors.length) {
          // draw an edge from router to first step of branch
          const pageProcessorNodes = generatePageProcessorNodesAndEdges(resourceState, branch.pageProcessors, {branch, branchIndex, routerIndex});
          const branchStartEdge = generateDefaultEdge(router._id, branch.pageProcessors[0].id, {routerIndex, branchIndex});

          elements.push(branchStartEdge);
          if (branch._nextRouterId) {
            elements.push(generateDefaultEdge(branch.pageProcessors[branch.pageProcessors.length - 1].id, branch._nextRouterId));
            if (branch._nextRouterId !== router._id) {
              // Safe check, branch should not point to its own router, causes a loop
              populateRouterElements(routers.find(r => r._id === branch._nextRouterId));
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
        if (branch._nextRouterId) {
          // join the router to the next router
          elements.push(generateDefaultEdge(router._id, branch._nextRouterId, {routerIndex, branchIndex}));
          if (branch._nextRouterId !== router._id) {
            // Safe check, branch should not point to its own router, causes a loop
            populateRouterElements(routers.find(r => r._id === branch._nextRouterId));
          }
        } else {
          // getnerate terminal edge
          const terminalNode = generateNewTerminal({branch, branchIndex, routerIndex});

          elements.push(terminalNode);
          const terminalEdge = generateDefaultEdge(router._id, terminalNode.id, {routerIndex, branchIndex});

          elements.push(terminalEdge);
        }
      });
      // mark router as visited
      routerVisited[router._id] = true;
    }
  };

  routersArr.forEach(populateRouterElements);

  return elements;
};

export const generateReactFlowGraph = (resourcesState, flow) => {
  if (!flow) {
    return;
  }

  const {routers} = flow;

  if (!routers || routers.length === 0) {
    return generateNodesAndEdgesFromNonBranchedFlow(resourcesState, flow);
  }

  return generateNodesAndEdgesFromBranchedFlow(resourcesState, flow);
};
