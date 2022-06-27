/* eslint-disable no-param-reassign */

import { cloneDeep, uniq, uniqBy } from 'lodash';
import jsonPatch from 'fast-json-patch';
import { BranchPathRegex, GRAPH_ELEMENTS_TYPE, PageProcessorPathRegex } from '../../constants';
import { generateId } from '../string';
import { setObjectValue } from '../json';

export const getAllRouterPaths = flow => {
  const { routers = [] } = flow || {};
  const paths = [];

  const pathToTerminal = (routerId, paths, path) => {
    const router = routers.find(r => r.id === routerId);

    if (!router) return;
    path.push(router.id);
    (router.branches || []).forEach(branch => {
      if (branch.nextRouterId) {
        pathToTerminal(branch.nextRouterId, paths, [...path]);
      } else {
        paths.push(path);
      }
    });
  };

  pathToTerminal(routers[0].id, paths, []);

  return uniqBy(paths, path => path.join(','));
};

export const addPageGenerators = flow => {
  if (!flow) return;
  if (!Array.isArray(flow.pageGenerators) || !flow.pageGenerators.length) {
    flow.pageGenerators = [{setupInProgress: true}];
  }
  flow.pageGenerators.push({setupInProgress: true});
};

export const addPageProcessor = (flow, insertAtIndex, branchPath) => {
  if (!flow) return;
  if (flow.routers?.length) {
    const pageProcessors = jsonPatch.getValueByPointer(flow, `${branchPath}/pageProcessors`);

    if (insertAtIndex === -1) {
      setObjectValue(flow, `${branchPath}/pageProcessors`, [...pageProcessors, {setupInProgress: true}]);
    } else {
      pageProcessors.splice(insertAtIndex, 0, {setupInProgress: true});
      setObjectValue(flow, `${branchPath}/pageProcessors`, pageProcessors);
    }
  } else {
    if (!flow.pageProcessors || !flow.pageProcessors.length) {
      flow.pageProcessors = [{setupInProgress: true}];
    }
    if (insertAtIndex === -1) {
      flow.pageProcessors.push({setupInProgress: true});
    } else {
      const pageProcessors = jsonPatch.getValueByPointer(flow, '/pageProcessors');

      pageProcessors.splice(insertAtIndex, 0, {setupInProgress: true});
      flow.pageProcessors = pageProcessors;
    }
  }
};

export const deletePGOrPPStepForOldSchema = (flow, path) => {
  if (PageProcessorPathRegex.test(path)) {
    const [, , , ppIndex] = PageProcessorPathRegex.exec(path);

    flow.pageProcessors.splice(ppIndex, 1);
  }
};

export const deletePGOrPPStepForRouters = (flow, originalFlow, stepId, elementsMap, path) => {
  const step = elementsMap[stepId];
  const isPageGenerator = step.type === GRAPH_ELEMENTS_TYPE.PG_STEP;

  if (isPageGenerator) {
    const pgIndex = flow.pageGenerators.findIndex(pg => pg.id === stepId);

    flow.pageGenerators.splice(pgIndex, 1);
    if (!flow.pageGenerators.length) {
      flow.pageGenerators = [{setupInProgress: true}];
    }
  } else if (originalFlow?.routers?.length) {
    // Typical page processor looks like /routers/:routerIndex/branches/:branchIndex/pageProcessors/:pageProcessorIndex
    if (PageProcessorPathRegex.test(path)) {
      const [, routerIndex, branchIndex, pageProcessorIndex] = PageProcessorPathRegex.exec(path);

      flow.routers[routerIndex].branches[branchIndex].pageProcessors.splice(pageProcessorIndex, 1);
    }
  }
};

export const getPreceedingRoutersMap = flow => {
  const { routers = [] } = flow || {};
  const routerPaths = getAllRouterPaths(flow);
  const map = {};

  routers.forEach(router => {
    const preceedingRouters = [];

    routerPaths.forEach(path => {
      const index = path.findIndex(p => p === router.id);

      if (index > -1) {
        preceedingRouters.push(...path.slice(0, index));
      }
    });
    map[router.id] = uniq(preceedingRouters);
  });

  return map;
};

export function generateDefaultEdge(source, target, {routerIndex = 0, branchIndex = 0, hidden, processorCount, index} = {}) {
  return {
    id: `${source}-${target}`,
    source,
    target,
    data: {
      path: `/routers/${routerIndex}/branches/${branchIndex}`,
      processorCount,
      processorIndex: index || 0,
    },
    hidden,
    type: 'default',
  };
}
export const shortId = () => generateId(6);

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

export const generateNewEmptyNode = ({branch = {}, branchIndex, routerIndex} = {}) => ({
  id: shortId(),
  type: GRAPH_ELEMENTS_TYPE.EMPTY,
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
    pageProcessors: [{setupInProgress: true}],
  }],
  ...(!isVirtual && { script: {
    _scriptId: undefined,
    function: undefined,
  } }),
});

export const initializeFlowForReactFlow = flowDoc => {
  if (!flowDoc) return flowDoc;
  const flow = cloneDeep(flowDoc);

  if (!flow.pageGenerators?.length) {
    flow.pageGenerators = [{setupInProgress: true}];
  }
  if (!flow.pageProcessors?.length && !flow.routers?.length) {
    flow.pageProcessors = [{setupInProgress: true}];
  }
  flow.pageGenerators.forEach(pg => {
    pg.id = pg._exportId || `none-${shortId()}`;
  });
  if (flow.pageProcessors?.length && !flow.routers?.length) {
    flow.routers = [{
      id: shortId(),
      branches: [{name: 'Branch 1.0', pageProcessors: flow.pageProcessors}],
    }];
    delete flow.pageProcessors;
  }
  flow.routers.forEach(({branches = []}) => {
    branches.forEach(branch => {
      const {pageProcessors = []} = branch;

      pageProcessors.forEach(pp => {
        pp.id = pp._importId || pp._exportId || `none-${shortId()}`;
      });
    });
  });

  return flow;
};

// Note 'targeId' can be either a page processor Id if the flow schema is linear (old schema)
// or it can be a router Id if the flow schema represents a branched flow.
const generatePageGeneratorNodesAndEdges = (pageGenerators, targetId, isReadOnlyMode) => {
  if (!pageGenerators || !pageGenerators.length || !targetId) {
    return [];
  }
  const hideDelete = (pageGenerators.length === 1 && pageGenerators[0].setupInProgress) || isReadOnlyMode;
  const nodes = pageGenerators.map((pg, index) => ({
    id: pg.id,
    type: GRAPH_ELEMENTS_TYPE.PG_STEP,
    data: {...pg, path: `/pageGenerators/${index}`, hideDelete },
  }));

  const edges = nodes.map(node => generateDefaultEdge(node.id, targetId));

  return [...nodes, ...edges];
};

const generatePageProcessorNodesAndEdges = (pageProcessors, branchData = {}, isReadOnlyMode) => {
  const edges = [];
  const {branch, branchIndex, routerIndex, isVirtual} = branchData;
  const nodes = pageProcessors.map((pageProcessor, index, collection) => {
    let hideDelete = false;

    if (index + 1 < collection.length) {
      const processorCount = pageProcessor._exportId || pageProcessor._importId ? 3 : 0;

      edges.push(generateDefaultEdge(pageProcessor.id, collection[index + 1].id, {...branchData, processorCount, index: index + 1 }));
    }
    // hide delete option if only one unconfigured pageProcessor present
    if ((routerIndex === 0 && pageProcessor.setupInProgress && collection.length === 1 && !branch.nextRouterId) || isReadOnlyMode) {
      hideDelete = true;
    }

    return {
      id: pageProcessor.id,
      type: GRAPH_ELEMENTS_TYPE.PP_STEP,
      data: {
        resource: {...pageProcessor},
        branch,
        hideDelete,
        isVirtual,
        isFirst: index === 0,
        isLast: index === collection.length - 1 && !branch.nextRouterId,
        path: `/routers/${routerIndex}/branches/${branchIndex}/pageProcessors/${index}`,
      },
    };
  });

  return [...edges, ...nodes];
};

const generateNodesAndEdgesFromNonBranchedFlow = (flow, isViewMode) => {
  const { _exportId, pageGenerators = [], pageProcessors = [], _importId, _connectorId } = flow;
  const isReadOnly = !!_connectorId || isViewMode;
  const firstPPId = _importId || pageProcessors[0]?.id;
  const lastPPId = _importId || pageProcessors[pageProcessors.length - 1]?.id;
  const pageGeneratorNodesAndEdges = generatePageGeneratorNodesAndEdges(_exportId ? [{_exportId, id: _exportId}] : pageGenerators, firstPPId, isReadOnly);
  const pageProcessorNodesAndEdges = generatePageProcessorNodesAndEdges(_importId ? [{_importId, id: _importId}] : pageProcessors, {}, isReadOnly);

  const terminalNode = generateNewTerminal();

  return [
    ...pageGeneratorNodesAndEdges,
    ...pageProcessorNodesAndEdges,
    generateDefaultEdge(lastPPId, terminalNode.id, { routerIndex: 0, branchIndex: 0, index: pageProcessors.length }),
    terminalNode,
  ];
};

export const getRouter = (routerId, flow = {}) => flow.routers?.find(r => r.id === routerId);

const populateMergeData = (flow, elements) => {
  const terminalNodes = elements.filter(el => el.type === GRAPH_ELEMENTS_TYPE.TERMINAL);
  const { routers = [] } = flow;

  const preceedingRoutersMap = getPreceedingRoutersMap(flow);

  elements.forEach(element => {
    if (element.type === GRAPH_ELEMENTS_TYPE.EDGE) {
      const targetElement = elements.find(el => el.id === element.target);
      const sourceElement = elements.find(el => el.id === element.source);

      if (sourceElement && targetElement && (
        sourceElement.type === GRAPH_ELEMENTS_TYPE.PG_STEP || // is connected to Page generator => cant merge to page generators
        sourceElement.type === GRAPH_ELEMENTS_TYPE.MERGE || // is edge emerging out of merge router => same as merging to the router
        targetElement.type === GRAPH_ELEMENTS_TYPE.MERGE || // is an edge to a merge router => same as merging to the router
        targetElement.type === GRAPH_ELEMENTS_TYPE.TERMINAL // is an edge to a terminal node => will create a merge router when terminal nodes merge anyway
      )) {
        return;
      }

      terminalNodes.forEach(terminalNode => {
        if (BranchPathRegex.test(terminalNode.data.path)) {
          const [, terminalRouterIndex, terminalBranchIndex] = BranchPathRegex.exec(terminalNode.data.path);
          const terminalRouterId = routers[terminalRouterIndex]?.id;

          const [, edgeRouterIndex, edgeBranchIndex] = BranchPathRegex.exec(element.data.path);
          const edgeRouterId = routers[edgeRouterIndex]?.id;

          if (edgeRouterId === terminalRouterId) {
            if (terminalBranchIndex !== edgeBranchIndex) {
              if (!element.data.mergableTerminals) {
                element.data.mergableTerminals = [];
              }
              element.data.mergableTerminals.push(terminalNode.id);
            }
          } else {
            const preceedingRouters = preceedingRoutersMap[terminalRouterId];

            if (!preceedingRouters.includes(edgeRouterId)) {
              if (!element.data.mergableTerminals) {
                element.data.mergableTerminals = [];
              }
              element.data.mergableTerminals.push(terminalNode.id);
            }
          }
        }
      });
    }
  });
};

export const generateNodesAndEdgesFromBranchedFlow = (flow, isViewMode) => {
  const {pageGenerators = [], routers = [], _connectorId} = flow;
  const isReadOnlyMode = !!_connectorId || isViewMode;
  let firstPPId = routers[0].id;

  if (isVirtualRouter(routers[0])) {
    if (routers[0].branches[0].pageProcessors.length) {
      firstPPId = routers[0].branches[0].pageProcessors[0].id;
    } else if (routers[0].branches[0].nextRouterId) {
      firstPPId = routers[0].branches[0].nextRouterId;
    }
  }
  const elements = [...generatePageGeneratorNodesAndEdges(pageGenerators, firstPPId, isReadOnlyMode)];
  const routerVisited = {};
  const routersArr = [...routers];
  const populateRouterElements = router => {
    if (router && !routerVisited[router.id]) {
      const routerIndex = routersArr.findIndex(r => r.id === router.id);

      if (routerIndex !== 0 || !isVirtualRouter(router)) {
        elements.push(generateRouterNode(router, routerIndex));
      }
      router.branches.forEach((branch, branchIndex) => {
        if (branch.pageProcessors.length) {
          // draw an edge from router to first step of branch
          const pageProcessorNodes = generatePageProcessorNodesAndEdges(
            branch.pageProcessors,
            {branch, branchIndex, routerIndex, isVirtual: isVirtualRouter(router)},
            isReadOnlyMode
          );

          if (routerIndex !== 0 || !isVirtualRouter(router)) {
            elements.push(generateDefaultEdge(router.id, branch.pageProcessors[0].id, {routerIndex, branchIndex}));
          }

          if (branch.nextRouterId) {
            const pageProcessor = branch.pageProcessors[branch.pageProcessors.length - 1];
            const processorCount = pageProcessor._exportId || pageProcessor._importId ? 3 : 0;

            elements.push(generateDefaultEdge(pageProcessor.id, branch.nextRouterId, {routerIndex, branchIndex, index: branch.pageProcessors.length, processorCount}));
            if (branch.nextRouterId !== router.id) {
              // Safe check, branch should not point to its own router, causes a loop
              populateRouterElements(routers.find(r => r.id === branch.nextRouterId));
            }
          } else if (!isReadOnlyMode) {
            const terminalNode = generateNewTerminal({branch, branchIndex, routerIndex});

            elements.push(terminalNode);
            const terminalEdge = generateDefaultEdge(branch.pageProcessors[branch.pageProcessors.length - 1].id, terminalNode.id, {routerIndex, branchIndex, index: branch.pageProcessors.length});

            elements.push(terminalEdge);
          }
          elements.push(...pageProcessorNodes);
        } else
        // its an empty branch without any steps
        if (branch.nextRouterId) {
          // join the router to the next router
          if (routerIndex !== 0 || !isVirtualRouter(router)) {
            const emptyNode = generateNewEmptyNode({branch, branchIndex, routerIndex});

            elements.push(emptyNode);
            elements.push(generateDefaultEdge(router.id, emptyNode.id, {routerIndex, branchIndex, index: branch.pageProcessors?.length}));
            elements.push(generateDefaultEdge(emptyNode.id, branch.nextRouterId, {routerIndex, branchIndex, index: branch.pageProcessors?.length}));
          }
          if (branch.nextRouterId !== router.id) {
            // Safe check, branch should not point to its own router, causes a loop
            populateRouterElements(routers.find(r => r.id === branch.nextRouterId));
          }
        } else if (!isReadOnlyMode) {
          // generate terminal edge
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
  populateMergeData(flow, elements);

  return elements;
};

export const generateReactFlowGraph = (flow, isViewMode) => {
  if (!flow) {
    return;
  }

  const {routers} = flow;

  if (!routers || routers.length === 0) {
    return generateNodesAndEdgesFromNonBranchedFlow(flow, isViewMode);
  }

  return generateNodesAndEdgesFromBranchedFlow(flow, isViewMode);
};

const mergeBetweenPPAndRouter = ({edgeSource, patchSet, sourceElement, edgeTarget}) => {
  const [, sourceRouterIndex, sourceBranchIndex] = BranchPathRegex.exec(sourceElement.data.path);
  const [, edgeSourceRouterIndex, edgeSourceBranchIndex] = BranchPathRegex.exec(edgeSource.data.path);

  const newVirtualRouter = generateEmptyRouter(true);

  newVirtualRouter.branches = [{pageProcessors: [], nextRouterId: edgeTarget.id}];

  patchSet.push(...[
    {
      op: 'add',
      path: '/routers/-',
      value: newVirtualRouter,
    },
    {
      op: 'replace',
      path: `/routers/${edgeSourceRouterIndex}/branches/${edgeSourceBranchIndex}/nextRouterId`,
      value: newVirtualRouter.id,
    },
    {
      op: 'replace',
      path: `/routers/${sourceRouterIndex}/branches/${sourceBranchIndex}/nextRouterId`,
      value: newVirtualRouter.id,
    },
  ]);
};

const mergeTerminalNodes = ({ patchSet, sourceElement, targetElement }) => {
  const [, sourceRouterIndex, sourceBranchIndex] = BranchPathRegex.exec(sourceElement.data.path);
  // merging two terminal nodes
  const [, targetRouterIndex, targetBranchIndex] = BranchPathRegex.exec(targetElement.data.path);
  const router = generateEmptyRouter(true);

  patchSet.push(...[
    {
      op: 'add',
      path: `/routers/${sourceRouterIndex}/branches/${sourceBranchIndex}/nextRouterId`,
      value: router.id,
    },
    {
      op: 'add',
      path: `/routers/${targetRouterIndex}/branches/${targetBranchIndex}/nextRouterId`,
      value: router.id,
    },
    {
      op: 'add',
      path: '/routers/-',
      value: router,
    }]);
};

const mergeBetweenRouterAndPP = ({flowDoc, edgeTarget, patchSet, sourceElement}) => {
  const [, sourceRouterIndex, sourceBranchIndex] = BranchPathRegex.exec(sourceElement.data.path);

  const [, targetRouterIndex, targetBranchIndex] = BranchPathRegex.exec(edgeTarget.data.path);
  const pageProcessors = jsonPatch.getValueByPointer(flowDoc, `/routers/${targetRouterIndex}/branches/${targetBranchIndex}/pageProcessors`);

  const initialTargetNextRouterId = jsonPatch.getValueByPointer(flowDoc, `/routers/${targetRouterIndex}/branches/${targetBranchIndex}/nextRouterId`);

  const newVirtualRouter = generateEmptyRouter(true);

  newVirtualRouter.branches = [{pageProcessors, nextRouterId: initialTargetNextRouterId}];

  patchSet.push(...[
    {
      op: 'add',
      path: '/routers/-',
      value: newVirtualRouter,
    },
    {
      op: 'replace',
      path: `/routers/${sourceRouterIndex}/branches/${sourceBranchIndex}/nextRouterId`,
      value: newVirtualRouter.id,
    },
    {
      op: 'replace',
      path: `/routers/${targetRouterIndex}/branches/${targetBranchIndex}/pageProcessors`,
      value: [],
    },
    {
      op: 'replace',
      path: `/routers/${targetRouterIndex}/branches/${targetBranchIndex}/nextRouterId`,
      value: newVirtualRouter.id,
    },
  ]);
};
const splitPPArray = (ar, index) => {
  const firstHalf = ar.slice(0, index);
  const secondHalf = ar.slice(index, ar.length);

  return [firstHalf, secondHalf];
};
const mergeBetweenTwoPPSteps = ({flowDoc, targetElement, sourceElement, patchSet}) => {
  const [, sourceRouterIndex, sourceBranchIndex] = BranchPathRegex.exec(sourceElement.data.path);
  const [, edgeRouterIndex, edgeBranchIndex] = BranchPathRegex.exec(targetElement.data.path);
  const newVirtualRouter = generateEmptyRouter(true);
  const {pageProcessors = [], nextRouterId: originalNextRouterId} = flowDoc.routers[edgeRouterIndex].branches[edgeBranchIndex];
  const insertionIndex = pageProcessors.findIndex(pp => pp.id === targetElement.target);
  const [firstHalf, secondHalf] = splitPPArray(pageProcessors, insertionIndex);

  newVirtualRouter.branches = [{pageProcessors: secondHalf, nextRouterId: originalNextRouterId }];
  patchSet.push(...[
    {
      op: 'add',
      path: `/routers/${sourceRouterIndex}/branches/${sourceBranchIndex}/nextRouterId`,
      value: newVirtualRouter.id,
    },
    {
      op: 'add',
      path: `/routers/${edgeRouterIndex}/branches/${edgeBranchIndex}/nextRouterId`,
      value: newVirtualRouter.id,
    },
    {
      op: 'add',
      path: `/routers/${edgeRouterIndex}/branches/${edgeBranchIndex}/pageProcessors`,
      value: firstHalf,
    },
    {
      op: 'add',
      path: '/routers/-',
      value: newVirtualRouter,
    },
  ]);
};

const mergeTerminalToAnEdge = ({ flowDoc, elements, patchSet, sourceElement, targetElement }) => {
  // Merging terminal node to an edge

  const edgeSource = elements[targetElement.source];
  const edgeTarget = elements[targetElement.target];

  if (edgeSource.type === GRAPH_ELEMENTS_TYPE.ROUTER && edgeTarget.type === GRAPH_ELEMENTS_TYPE.PP_STEP) {
    // Merging between a router and a PP step

    mergeBetweenRouterAndPP({flowDoc, patchSet, sourceElement, edgeTarget});
  } else if (edgeSource.type === GRAPH_ELEMENTS_TYPE.PP_STEP && edgeTarget.type === GRAPH_ELEMENTS_TYPE.ROUTER) {
    // Merging between a PP and a router step

    mergeBetweenPPAndRouter({flowDoc, edgeSource, patchSet, sourceElement, edgeTarget});
  } else if (edgeSource.type === GRAPH_ELEMENTS_TYPE.PP_STEP && edgeTarget.type === GRAPH_ELEMENTS_TYPE.PP_STEP) {
    mergeBetweenTwoPPSteps({flowDoc, targetElement, sourceElement, patchSet});
  }
};

export const mergeDragSourceWithTarget = (flowDoc, elements, dragNodeId, targetId, patchSet) => {
  const sourceElement = elements[dragNodeId];
  const targetElement = elements[targetId];

  if (!sourceElement || !targetElement) {
    return;
  }
  const [, sourceRouterIndex, sourceBranchIndex] = BranchPathRegex.exec(sourceElement.data.path);

  if (sourceElement.type === GRAPH_ELEMENTS_TYPE.TERMINAL && targetElement.type === GRAPH_ELEMENTS_TYPE.TERMINAL) {
    // merging two terminal nodes
    mergeTerminalNodes({sourceElement, targetElement, patchSet});
  } else if (targetElement.type === GRAPH_ELEMENTS_TYPE.MERGE) {
    // merging terminal node to a merge node
    patchSet.push({
      op: 'add',
      path: `/routers/${sourceRouterIndex}/branches/${sourceBranchIndex}/nextRouterId`,
      value: targetElement.data.router.id,
    });
  } else if (targetElement.type === GRAPH_ELEMENTS_TYPE.EDGE) {
    mergeTerminalToAnEdge({flowDoc, elements, sourceElement, targetElement, patchSet});
  }
};
export const getIncomingRoutersMap = flow => {
  const map = {};

  if (!flow || !flow.routers || !flow.routers.length) return map;
  flow.routers.forEach((router, routerIndex) => {
    (router.branches || []).forEach((branch, branchIndex) => {
      if (branch.nextRouterId) {
        if (map[branch.nextRouterId]) {
          map[branch.nextRouterId].push({routerIndex, branchIndex});
        } else {
          map[branch.nextRouterId] = [{routerIndex, branchIndex}];
        }
      }
    });
  });

  return map;
};

const isUnUsedRouter = (flow, router, incomingRoutersMap) => {
  if (!flow || !flow.routers?.length || !router) return false;
  const firstRouterId = flow.routers?.[0]?.id;

  if (isVirtualRouter(router) && incomingRoutersMap[router.id]?.length === 1) return true;
  if (router.id === firstRouterId && isVirtualRouter(router) && !router.branches[0].pageProcessors?.length) return true;
  if (router.id !== firstRouterId && !incomingRoutersMap[router.id]?.length) return true;

  return false;
};

const unUsedMergeRouterExists = (flow, incomingRoutersMap) => {
  const unUsedRouterIndex = flow.routers.findIndex(router => isUnUsedRouter(flow, router, incomingRoutersMap));

  if (unUsedRouterIndex > -1) {
    const router = flow.routers[unUsedRouterIndex];
    const {pageProcessors, nextRouterId} = router.branches[0];

    if (incomingRoutersMap[router.id]) {
      const {routerIndex, branchIndex } = incomingRoutersMap[router.id][0];
      const branch = flow.routers[routerIndex].branches[branchIndex];

      branch.pageProcessors = [...branch.pageProcessors, ...pageProcessors];
      branch.nextRouterId = nextRouterId;
    }
    flow.routers.splice(unUsedRouterIndex, 1);

    return 1;
  }

  return 0;
};

export const deleteUnUsedRouters = flow => {
  if (!flow) return;
  if (flow.routers && flow.routers.length) {
    let incomingRoutersMap = getIncomingRoutersMap(flow);

    while (unUsedMergeRouterExists(flow, incomingRoutersMap)) {
      incomingRoutersMap = getIncomingRoutersMap(flow);
    }
  }
  if (flow.routers?.length === 1 && flow.routers[0].branches?.length === 1 && isVirtualRouter(flow.routers[0])) {
    flow.pageProcessors = flow.routers[0].branches[0].pageProcessors || [];
    delete flow.routers;
  }
};

export const getNewRouterPatchSet = ({elementsMap, flow, router, edgeId, originalFlow}) => {
  const edge = elementsMap[edgeId];
  const isInsertingFirstRouter = elementsMap[edge.source]?.type === GRAPH_ELEMENTS_TYPE.PG_STEP && elementsMap[edge.target]?.type === GRAPH_ELEMENTS_TYPE.ROUTER;
  const branchPath = edge.data.path;
  const processorArray = cloneDeep(jsonPatch.getValueByPointer(flow, `${branchPath}/pageProcessors`));
  const nextRouterId = jsonPatch.getValueByPointer(flow, `${branchPath}/nextRouterId`);
  const flowClone = cloneDeep(originalFlow);
  const insertionIndex = processorArray.findIndex(pp => pp.id === edge.target);

  let firstHalf;
  let secondHalf;

  if (insertionIndex !== -1) {
    [firstHalf, secondHalf] = splitPPArray(processorArray, insertionIndex);
  } else {
    firstHalf = processorArray;
    secondHalf = [{setupInProgress: true}];
  }
  const observer = jsonPatch.observe(flowClone);
  const isVirtual = flow.routers?.length === 1 && isVirtualRouter(flow.routers[0]);

  if (!flowClone.routers) {
    if (!isVirtual) {
      flowClone.routers = flow.routers;
    }
    delete flowClone.pageProcessors;
  }

  router.branches[0].pageProcessors = secondHalf;
  router.branches[0].nextRouterId = isInsertingFirstRouter ? flow.routers[0].id : nextRouterId;
  if (isInsertingFirstRouter) {
    flowClone.routers = [router, ...flowClone.routers];
  } else {
    if (!isVirtual) {
      setObjectValue(flowClone, `${branchPath}/pageProcessors`, firstHalf);
      setObjectValue(flowClone, `${branchPath}/nextRouterId`, router.id);
    }
    if (Array.isArray(flowClone.routers)) {
      flowClone.routers.push(router);
    } else {
      flowClone.routers = [router];
    }
  }

  return jsonPatch.generate(observer);
};

