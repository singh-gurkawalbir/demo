import { generateDefaultEdge } from '../lib';
import { generateNewTerminal, generateNewRouter} from '../metadata/nodeGeneration';

const hydrateNodeData = (resourcesState, nodeType, nodeId) => {
  if (nodeType === 'pg') {
    return resourcesState?.exports?.find(ele => ele._id === nodeId);
  }

  if (nodeType === 'pp') {
    return resourcesState?.imports?.find(ele => ele._id === nodeId) || resourcesState?.exports?.find(ele => ele._id === nodeId);
  }

  return null;
};

const generatePGNodesAndEdges = (resourcesState, pageGenerators, targetPageProcessorId) => {
  if (!pageGenerators || !pageGenerators.length || !targetPageProcessorId) {
    return {nodes: [], edges: []};
  }

  const nodes = pageGenerators.map(({_exportId}) => ({
    id: _exportId,
    type: 'pg',
    data: hydrateNodeData(resourcesState, 'pg', _exportId),
  }));

  const edges = nodes.map(node => generateDefaultEdge(node.id, targetPageProcessorId));

  return {nodes, edges};
};

const generatePPNodesAndEdges = (resourcesState, pageProcessors) => {
  if (!pageProcessors || !pageProcessors.length) {
    return {nodes: [], edges: []};
  }

  const nodes = pageProcessors.map(({ _importId}) => ({
    id: _importId,
    type: 'pp',
    data: hydrateNodeData(resourcesState, 'pp', _importId),
  }));

  const edges = nodes.slice(0, nodes.length - 1).map((node, index) =>
    // connect to the node ahead
    generateDefaultEdge(node.id, nodes[index + 1].id));

  return {nodes, edges};
};

const clubNodesAndEdges = metadatas => metadatas.reduce((acc, curr) => ({
  nodes: [...acc?.nodes || [], ...curr?.nodes || []],
  edges: [...acc?.edges || [], ...curr?.edges || []],
}), {nodes: [], edges: []});

const generateMetadataFromNonBranchedFlow = (resourceState, flow) => {
  const {pageGenerators, pageProcessors} = flow;
  const pgMetadata = generatePPNodesAndEdges(resourceState, pageProcessors);
  const firstPPId = pgMetadata.nodes[0].id;
  const ppMetadata = generatePGNodesAndEdges(resourceState, pageGenerators, firstPPId);

  return clubNodesAndEdges([pgMetadata, ppMetadata]);
};

export const getRouter = (routerId, flow) => flow.routers.find(r => r._id === routerId);
const getLastNodeId = nodes => nodes?.[nodes?.length - 1]?.id;
const generateMergeEdge = (sourceNodes, targetNodes) => {
  const source = getLastNodeId(sourceNodes);
  const target = targetNodes?.[0]?.id;

  if (!source || !target) {
    return [];
  }

  return [generateDefaultEdge(source, target)];
};

const mergeNodesAndEdges = metadatas => metadatas.reduce((acc, curr) => ({
  nodes: [...acc.nodes, ...curr.nodes],
  edges: [...acc.edges, ...generateMergeEdge(acc.nodes, curr.nodes), ...curr.edges],
}), {nodes: [], edges: []});

const isAMergeNode = (edges, routerId) => edges.find(e => e.target === routerId);

const getGraphsMetadata = (resourceState, flow, routerId) => {
  if (!routerId || !getRouter(routerId, flow)) {
    return {nodes: [generateNewTerminal()], edges: []};
  }
  const router = getRouter(routerId, flow);
  const newRouter = generateNewRouter(routerId);

  return router.branches.reduce((acc, branch) => {
    const {pageProcessors, _nextRouterId, name} = branch;
    // this is the branches metadata
    const branchMeta = generatePPNodesAndEdges(resourceState, pageProcessors);

    const isRouterAlreadyConnected = isAMergeNode(acc.edges, _nextRouterId);

    if (isRouterAlreadyConnected) {
      const branchMetaMergedWithAncesstor = clubNodesAndEdges([branchMeta, {
        nodes: [],
        edges: [generateDefaultEdge(getLastNodeId(branchMeta.nodes), _nextRouterId)],
      }]);

      // connecting router to every branch
      const branchEdge = {...generateDefaultEdge(routerId, branchMetaMergedWithAncesstor.nodes[0].id), data: {name}};

      return clubNodesAndEdges([acc, {edges: [branchEdge]}, branchMetaMergedWithAncesstor]);
    }

    // this refers to the next routers metadata which can lead to another graph

    const ancesstorMeta = getGraphsMetadata(resourceState, flow, _nextRouterId);
    const branchMetaMergedWithAncesstor = mergeNodesAndEdges([branchMeta, ancesstorMeta]);

    // connecting router to every branch
    const branchEdge = {...generateDefaultEdge(routerId, branchMetaMergedWithAncesstor.nodes[0].id), data: {name}};

    return clubNodesAndEdges([acc, {edges: [branchEdge]}, branchMetaMergedWithAncesstor]);
  }, {nodes: [newRouter], edges: []});
};

const getMetadataFromBranchedFlow = (resourceState, flow) => {
  const {pageGenerators, pageProcessors, routers} = flow;

  if (pageProcessors && pageProcessors.length) {
    throw new Error('Invalid schema branched flow should not have pageProcessors');
  }
  const firstRouterId = routers[0]._id;
  const pgMetadata = generatePGNodesAndEdges(resourceState, pageGenerators, firstRouterId);

  const graphMeta = getGraphsMetadata(resourceState, flow, firstRouterId);

  return Object.values(clubNodesAndEdges([pgMetadata, graphMeta])).flat();
};

export const generateReactFlowGraph = (resourcesState, flow) => {
  if (!flow) {
    return;
  }

  const {routers} = flow;

  if (!routers || routers.length === 0) {
    return generateMetadataFromNonBranchedFlow(resourcesState, flow);
  }

  return getMetadataFromBranchedFlow(resourcesState, flow);
};
