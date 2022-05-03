/* eslint-disable no-param-reassign */
import { nanoid } from 'nanoid';
import { isEdge, isNode } from 'react-flow-renderer';
import dagre from 'dagre';
import { isVirtualRouter } from '../../../utils/flows/flowbuilder';

// react-flow handles by default sit just outside of the node boundary.
// this offset is the number of pixels the left or right handle is offset from
// the edge of this node boundary frame.
export const handleOffset = 4;

export const RouterPathRegex = /\/routers\/(\d)/;
export const BranchPathRegex = /\/routers\/(\d)\/branches\/(\d)/;
export const PageProcessorPathRegex = /\/routers\/(\d)\/branches\/(\d)\/pageProcessors\/(\d)/;

export const GRAPH_ELEMENTS_TYPE = {
  ROUTER: 'router',
  MERGE: 'merge',
  EDGE: 'default',
  TERMINAL: 'terminal',
  PP_STEP: 'pp',
  PG_STEP: 'pg',
};

export const nodeSize = {
  pp: {
    width: 275,
    height: 295,
  },
  pg: {
    width: 275,
    height: 295,
  },
  router: {
    width: 34,
    height: 34,
  },
  terminal: {
    width: 20,
    height: 20,
  },
  merge: {
    width: 34,
    height: 34,
  },
};

const options = {
  // align: 'UL',
  // acyclicer: 'greedy',  // default is undefined, dont know what this does.
  // ranker: 'network-simplex', // default
  ranker: 'tight-tree',
  // ranker: 'longest-path', // seems worst
  ranksep: 200,
  nodesep: 50,
  marginx: 50,
  marginy: 50,
};

export function generateId() {
  return nanoid(6);
}

export function generateDefaultEdge(source, target, {routerIndex, branchIndex} = {}) {
  return {
    id: `${source}-${target}`,
    source,
    target,
    data: {
      path: `/routers/${routerIndex}/branches/${branchIndex}`,
    },
    type: 'default',
  };
}

export function generateNewNode() {
  const newId = generateId();

  return ({
    id: newId,
    type: GRAPH_ELEMENTS_TYPE.PP_STEP,
    data: { label: `New node: ${newId}`},
  });
}

export function layoutElements(elements = []) {
  const graph = new dagre.graphlib.Graph();

  graph.setDefaultEdgeLabel(() => ({}));
  graph.setGraph({ rankdir: 'LR', ...options });

  elements.forEach(el => {
    if (isNode(el)) {
      graph.setNode(el.id, {...nodeSize[el.type]});
    } else {
      graph.setEdge(el.source, el.target);
    }
  });

  dagre.layout(graph);

  const nodes = [];
  const edges = [];

  elements.forEach(el => {
    if (isNode(el)) {
      const node = graph.node(el.id);
      const size = nodeSize[el.type];
      const offsetY = 0;
      const offsetX = el.type === GRAPH_ELEMENTS_TYPE.TERMINAL ? nodeSize.pp.width / 2 - nodeSize[el.type].width / 2 : 0;

      // We are shifting the dagre node position that returns centerpoint (x,y)
      // to the top left so it matches the react-flow node anchor point (top left).
      // This maters when nodes are of various sizes.
      nodes.push({...el,
        position: {
          x: node.x - size.width / 2 - offsetX,
          y: node.y - size.height / 2 - offsetY,
        }});
    } else { // these are the edges...
      const edge = graph.edge({v: el.source, w: el.target});
      const source = elements.find(n => n.id === el.source);
      const target = elements.find(n => n.id === el.target);

      edges.push({
        ...el,
        data: {
          sourceType: source.type,
          targetType: target.type,
          sourceId: source.id,
          targetId: target.id,
          points: edge.points,
        },
      });
    }
  });

  return [...nodes, ...edges];
}

export function getAllFlowBranches(flow) {
  const branches = [];

  if (!flow) return branches;
  const { routers = [] } = flow;

  if (routers.length) {
    routers.forEach((router = {}, routerIndex) => {
      router.branches?.forEach((branch = {}, branchIndex) => {
        branches.push({
          id: branch._id,
          name: branch.name,
          path: `/routers/${routerIndex}/branches/${branchIndex}`,
        });
      });
    });
  }

  return branches;
}
export function getConnectedEdges(id, direction = 'left', elements) {
  const handle = direction === 'left' ? 'target' : 'source';
  const edges = elements.filter(e => isEdge(e));

  return edges.filter(edge => edge[handle] === id);
}

export function findNodeIndex(id, elements) {
  for (let i = 0; i < elements.length; i += 1) {
    if (elements[i].id === id) {
      return i;
    }
  }
}

const RANGE = 20;
const inRange = (coordinate, dropCoordinate) => (dropCoordinate - RANGE) <= coordinate && (dropCoordinate + RANGE) >= coordinate;
const isMergableNode = (node = {}) => {
  if (node.type === GRAPH_ELEMENTS_TYPE.TERMINAL || node.type === GRAPH_ELEMENTS_TYPE.MERGE) {
    return true;
  }
  // Is router node virtual?
  if (node.type === GRAPH_ELEMENTS_TYPE.ROUTER && node.data) {
    return isVirtualRouter(node.data);
  }

  return false;
};
export const terminalNodeInVicinity = (ele, elements) => {
  if (!ele) {
    return false;
  }
  const {x: xCoord, y: yCoord} = ele.position;

  return elements
    .filter(node => isMergableNode(node))
    .find(dropElement => {
      const {x, y} = dropElement.position;

      return inRange(xCoord, x) && inRange(yCoord, y);
    })?.id;
};

const getModulusVal = val => val > 0 ? val : -val;
const getLengthBtwCoordinates = (x1, y1, x2, y2) => {
  if (x1 === x2) {
    return getModulusVal(y2 - y1);
  }

  return getModulusVal(x2 - x1);
};

export const getPositionInEdge = (edgeCommands, position = 'center', offset = 0) => {
  const linePlotsCoordinates = edgeCommands
    .substr(1)
    .split(/[LQ]/)
    .map(cmd => cmd.trim())
    .map(cmd => {
    // Quadratic command...currently that is supported...if its a cubic command it can have
    //  3 coordinates to describe the curve,we don't support it... So this function support M,L,C commands.
      const commandSplit = cmd.split(' ');

      if (commandSplit.length >= 3) {
        throw new Error('Cubic command encountered please change the path generation logic to support quadratic');
      }

      const isQuadratic = !!commandSplit[1];

      if (isQuadratic) {
        return commandSplit[1];
      }

      return cmd;
    })
    .map(coordinates => coordinates.split(',').map(e => parseInt(e, 10)));

  if (linePlotsCoordinates.length <= 1) {
    return null;
  }

  const lengthOFEdges = linePlotsCoordinates.reduce((acc, curr, i) => {
    if (i >= (linePlotsCoordinates.length - 1)) {
      return acc;
    }
    const nextCoord = linePlotsCoordinates[i + 1];

    return acc + getLengthBtwCoordinates(...curr, ...nextCoord);
  }, 0);

  let lengthFromStart;

  if (position === 'center') {
    lengthFromStart = Math.floor(lengthOFEdges / 2 + offset);
  } else if (position === 'left') {
    lengthFromStart = offset;
  } else { // right
    lengthFromStart = lengthOFEdges - offset;
  }

  // console.log(lengthOFEdges, lengthFromStart, position, offset);

  for (let i = 0; i < linePlotsCoordinates.length - 1; i += 1) {
    const coord1 = linePlotsCoordinates[i];
    const coord2 = linePlotsCoordinates[i + 1];
    const edgeLen = getLengthBtwCoordinates(...coord1, ...coord2);

    if (lengthFromStart - edgeLen < 0) {
      const [x1, y1] = coord1;
      const [x2, y2] = coord2;

      if (x1 === x2) {
        if (y2 > y1) {
          return [x2, y1 + lengthFromStart];
        }

        return [x2, y1 - lengthFromStart];
      }

      if (x2 > x1) {
        return [x1 + lengthFromStart, y1];
      }

      return [x1 - lengthFromStart, y1];
    }

    lengthFromStart -= edgeLen;
  }
};

export const areMultipleEdgesConnectedToSameEdgeTarget = (edgeId, elements) => {
  if (!edgeId || !elements) {
    return false;
  }
  const edge = elements.find(el => el.id === edgeId);

  if (!edge) {
    return false;
  }
  const {target} = edge;

  return elements.filter(isEdge).filter(e => e.target === target).length > 1;
};

export const isDragNodeOnSameBranch = (dragNodeId, edgeId, elements) => {
  if (!dragNodeId || !edgeId || !elements) {
    return false;
  }
  const dragNodeElement = elements[dragNodeId];
  const edgeElement = elements[edgeId];

  if (!edgeElement || edgeElement.type !== 'default') {
    return false;
  }
  const edgePathElement = elements[edgeElement.source]?.type === GRAPH_ELEMENTS_TYPE.ROUTER ? elements[edgeElement.target] : elements[edgeElement.source];

  if (dragNodeElement && edgePathElement && BranchPathRegex.test(dragNodeElement.data.path) && BranchPathRegex.test(edgePathElement.data.path)) {
    const [dragNodeBranch] = BranchPathRegex.exec(dragNodeElement.data.path);
    const [edgeElementBranch] = BranchPathRegex.exec(edgePathElement.data.path);

    return dragNodeBranch === edgeElementBranch;
  }

  return false;
};

export const isNodeConnectedToRouter = (nodeId, elements) => {
  if (!nodeId || !elements) {
    return false;
  }
  const node = elements.find(ele => ele.id === nodeId);

  if (!node) {
    return false;
  }
  const {source, target} = node;

  return elements.filter(e => [source, target].includes(e.id)).some(node => [GRAPH_ELEMENTS_TYPE.ROUTER].includes(node?.type));
};

export function snapPointsToHandles(source, target, points) {
  const snappedPoints = [...points];
  const {x: startX, y: startY} = points[0];
  const {x: endX, y: endY} = points[points.length - 1];

  // lets process the start points of the edge first.
  let i = 0;
  const complete = { x: false, y: false };

  for (; i < points.length - 1; i += 1) {
    const { x, y } = points[i];

    if (!complete.y && y === startY && y !== source.y) {
      snappedPoints[i].y = source.y;
    } else {
      complete.y = true;
    }

    if (!complete.x && x === startX && x !== source.x) {
      snappedPoints[i].x = source.x;
    } else {
      complete.x = true;
    }

    if (complete.y && complete.x) break;
  }

  // now iterate over the remaining edge points, but in reverse order
  // as we only need to snap the start/end points that have the incorrect
  // handle positions. Make sure to skip the first point in case its a full
  // traversal, as the first point should only snap to the source, not target.
  complete.x = false;
  complete.y = false;

  for (let j = points.length - 1; j > i; j -= 1) {
    const { x, y } = points[j];

    if (!complete.y && y === endY && y !== target.y) {
      snappedPoints[j].y = target.y;
    } else {
      complete.y = true;
    }

    if (!complete.x && x === endX && x !== target.x) {
      snappedPoints[j].x = target.x;
    } else {
      complete.x = true;
    }

    if (complete.y && complete.x) break;
  }

  return snappedPoints;
}
