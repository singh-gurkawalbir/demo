import { getRouter } from '.';

const getPageGeneratorPath = (pageGenerators, nodeId) => {
  if (!pageGenerators || !nodeId) {
    return null;
  }
  const index = pageGenerators.findIndex(ele => ele.id === nodeId);

  if (index > -1) {
    return `/pageGenerators/${index}`;
  }

  return null;
};

const getPageProcessorPath = (pageProcessors, nodeId) => {
  if (!pageProcessors || !nodeId) {
    return null;
  }
  const index = pageProcessors.findIndex(ele => ele.id === nodeId);

  if (index > -1) {
    return `/pageProcessors/${index}`;
  }

  return null;
};

const traverseGraph = (flow, routerId, nodeId, accPath) => {
  if (!routerId || !getRouter(routerId, flow)) {
    return null;
  }

  const {branches} = getRouter(routerId, flow);

  return branches.map((branch, index) => {
    const {pageProcessors, _nextRouterId} = branch;
    const extendedPath = `${accPath}/branches/${index}`;
    const pathWithinPP = getPageProcessorPath(pageProcessors, nodeId);

    if (pathWithinPP) {
      return extendedPath + pathWithinPP;
    }

    const routerIndex = flow.routers.findIndex(ele => ele._id === _nextRouterId);

    return traverseGraph(flow, _nextRouterId, nodeId, `/routers/${routerIndex}`);
  }).find(ele => !!ele);
};

export const getPathOfPGOrPPNode = (flow, nodeId, targetBranch) => {
  if (!nodeId) {
    return;
  }

  const {pageGenerators, pageProcessors, routers} = flow;

  if (getPageGeneratorPath(pageGenerators, nodeId)) {
    return getPageGeneratorPath(pageGenerators, nodeId);
  }

  if (getPageProcessorPath(pageProcessors, nodeId)) {
    return getPageProcessorPath(pageProcessors, nodeId);
  }

  if (!routers) {
    return null;
  }

  if (getRouter(nodeId, flow) && targetBranch) {
    const router = getRouter(nodeId, flow);
    const routerIndex = routers.findIndex(router => router._id === nodeId);
    const branchIndex = router.branches.findIndex(branch => branch._id === targetBranch?._id);

    return `/routers/${routerIndex}/branches/${branchIndex}/pageProcessors/0`;
  }

  return traverseGraph(flow, routers[0]._id, nodeId, '/routers/0');
};

const jsonFastPatchUpdateAddToEndOfArray = path => {
  const segments = path.split('/');

  segments[segments.length - 1] = '-';

  return segments.join('/');
};

export const isPageGenerator = path => {
  if (!path) {
    return false;
  }

  const segs = path.split('/');

  return segs[segs.length - 2] === 'pageGenerators';
};
export const getNodeInsertionPathForEdge = (flow, edge, elements) => {
  if (!edge) {
    return;
  }
  const {source, target} = edge;
  const targetBranch = elements.find(ele => ele.id === target)?.data;

  const targetPath = getPathOfPGOrPPNode(flow, target);

  if (targetPath) {
    return targetPath;
  }

  // if no target node path should be pointing to a router or a merge node
  const sourcePath = getPathOfPGOrPPNode(flow, source, targetBranch);
  // Since json fast patch can insert before a specific index, we should support pushing end of an array through "-"
  // then the sourcePath should be modified to add jsonPath towards the end PP or PG array

  return jsonFastPatchUpdateAddToEndOfArray(sourcePath);
};

const getBranchPathForEdge = (flow, edge) => {
  if (!edge) {
    return;
  }

  const {source} = edge;
  const sourcePathOfNode = getPathOfPGOrPPNode(flow, source);
  const segs = sourcePathOfNode.split('/');

  // removeNode information
  return segs.filter((_, index) => index < segs.length - 2).join('/');
};

export const getNextRouterPathForTerminalNode = (flow, edge) => `${getBranchPathForEdge(flow, edge)}/_nextRouterId`;
