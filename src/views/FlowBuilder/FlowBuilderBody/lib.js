import { isEdge, isNode, getSmoothStepPath } from 'reactflow';
import dagre from 'dagre';
import { isVirtualRouter } from '../../../utils/flows/flowbuilder';
import { GRAPH_ELEMENTS_TYPE } from '../../../constants';
import { generateId } from '../../../utils/string';
import { stringCompare } from '../../../utils/sort';

// react-flow handles by default sit just outside of the node boundary.
// this offset is the number of pixels the left or right handle is offset from
// the edge of this node boundary frame.
export const handleOffset = 4;

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
  empty: {
    width: 4,
    height: 2,
  },
  merge: {
    width: 34,
    height: 34,
  },
};

const options = {
  align: 'DL',
  // acyclicer: 'greedy',  // default is undefined, dont know what this does.
  // ranker: 'network-simplex', // default
  ranker: 'tight-tree',
  // ranker: 'longest-path', // seems worst
  ranksep: 200,
  nodesep: 50,
  marginx: 50,
  marginy: 50,
};

export function generateNewNode() {
  const newId = generateId();

  return {
    id: newId,
    type: GRAPH_ELEMENTS_TYPE.PP_STEP,
    data: { label: `New node: ${newId}` },
  };
}

export function rectifyPageGeneratorOrder(nodes = [], flow) {
  const pgs = nodes.filter(node => node.type === GRAPH_ELEMENTS_TYPE.PG_STEP);
  const positions = pgs.map(node => ({id: node.id, position: node.position}));

  positions.sort(stringCompare('position.y'));

  flow.pageGenerators?.forEach((pg, index) => {
    const pgNode = pgs.find(node => node.id === pg.id);

    if (pgNode && !!positions[index]) {
      pgNode.position = positions[index].position;
    }
  });
}

export function layoutElements(elements = [], flow) {
  const graph = new dagre.graphlib.Graph();

  graph.setDefaultEdgeLabel(() => ({}));
  graph.setGraph({ rankdir: 'LR', ...options });

  elements.forEach(el => {
    if (isNode(el)) {
      graph.setNode(el.id, { ...nodeSize[el.type] });
    } else {
      graph.setEdge(el.source, el.target);
    }
  });

  dagre.layout(graph);

  const nodes = [];
  const edges = [];
  let highestX = -Infinity;
  let highestY = -Infinity;

  elements.forEach(el => {
    if (isNode(el)) {
      const node = graph.node(el.id);
      const size = nodeSize[el.type];
      const offsetY = 0;

      if (node.x > highestX) {
        highestX = node.x + size.width / 2;
      }
      if (node.y > highestY) {
        highestY = node.y + size.height / 2;
      }
      // We override the x position of terminal nodes so that they render a shorter edge path.
      // most times a terminal node will only require a short horizontal edge and it looks better
      // if this edge is shorted, which is accomplished by shifting th terminal node left by 1/2 the
      // size of a step. This way, nodes visually line-up when branching.
      const offsetX =
        el.type === GRAPH_ELEMENTS_TYPE.TERMINAL
          ? Math.min(nodeSize.pp.width / 2 - nodeSize[el.type].width / 2, 50)
          : 0;

      // We are shifting the dagre node position that returns centerpoint (x,y)
      // to the top left so it matches the react-flow node anchor point (top left).
      // This maters when nodes are of various sizes.
      nodes.push({
        ...el,
        position: {
          x: node.x - size.width / 2 - offsetX,
          y: node.y - size.height / 2 - offsetY,
        },
      });
    } else {
      // these are the edges...
      const { points } = graph.edge({ v: el.source, w: el.target });
      const source = elements.find(n => n.id === el.source);
      const target = elements.find(n => n.id === el.target);
      const edge = elements.find(n => n.id === `${el.source}-${el.target}`);

      edges.push({
        ...el,
        data: {
          ...edge.data,
          sourceType: source.type,
          targetType: target.type,
          sourceId: source.id,
          targetId: target.id,
          points,
        },
      });
    }
  });
  rectifyPageGeneratorOrder(nodes, flow);

  return { nodes, edges, x: highestX, y: highestY };
}

export function getAllFlowBranches(flow) {
  const branches = [];

  if (!flow) return branches;
  const { routers = [] } = flow;

  if (routers.length) {
    routers.forEach((router = {}, routerIndex) => {
      if (!isVirtualRouter(router)) {
        router.branches?.forEach((branch = {}, branchIndex) => {
          branches.push({
            id: generateId(),
            name: branch.name,
            path: `/routers/${routerIndex}/branches/${branchIndex}`,
          });
        });
      }
    });
  }

  return branches;
}

const RANGE = 20;
const inRange = (coordinate, dropCoordinate) =>
  dropCoordinate - RANGE <= coordinate && dropCoordinate + RANGE >= coordinate;
const isMergableNode = (node = {}) => {
  if (
    node.type === GRAPH_ELEMENTS_TYPE.TERMINAL ||
    node.type === GRAPH_ELEMENTS_TYPE.MERGE
  ) {
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
  const { x: xCoord, y: yCoord } = ele.position;

  return elements
    .filter(node => isMergableNode(node))
    .find(dropElement => {
      const { x, y } = dropElement.position;

      return inRange(xCoord, x) && inRange(yCoord, y);
    })?.id;
};

const getModulusVal = val => (val > 0 ? val : -val);
const getLengthBtwCoordinates = (x1, y1, x2, y2) => {
  if (x1 === x2) {
    return getModulusVal(y2 - y1);
  }

  return getModulusVal(x2 - x1);
};

export const getEdgeStepPath = (data = {}) => {
  const sp = getSmoothStepPath(data);
  let points = sp;

  if (Array.isArray(sp)) {
    [points] = sp;

    points = points.substr(0, 1) + points
      .substr(1)
      .split(/[LQ]/)
      .map(cmd => cmd.trim())
      .map(cmd => cmd.split(' ').join(','))
      .join(' L');
  }

  return points;
};

export const getPositionInEdge = (
  edgeCommands,
  position = 'center',
  offset = 0
) => {
  let edge = edgeCommands;

  if (Array.isArray(edgeCommands)) {
    [edge] = edgeCommands;
  }
  const linePlotsCoordinates = edge
    .substr(1)
    .split(/[LQ]/)
    .map(cmd => cmd.trim())
    .map(cmd => {
      // Quadratic command...currently that is supported...if its a cubic command it can have
      //  3 coordinates to describe the curve,we don't support it... So this function support M,L,C commands.
      const commandSplit = cmd.split(' ');

      if (commandSplit.length >= 3) {
        throw new Error(
          'Cubic command encountered please change the path generation logic to support quadratic'
        );
      }

      const isQuadratic = !!commandSplit[1] && cmd.includes(',');

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
    if (i >= linePlotsCoordinates.length - 1) {
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
  } else {
    // right
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
  const { target } = edge;

  return elements.filter(isEdge).filter(e => e.target === target).length > 1;
};

export const isNodeConnectedToRouter = (stepId, elementsMap) => {
  if (!stepId || !elementsMap || !elementsMap[stepId]) {
    return false;
  }
  const step = elementsMap[stepId];
  const source = elementsMap[step.source];
  const target = elementsMap[step.target];

  if (
    source.type === GRAPH_ELEMENTS_TYPE.PG_STEP &&
    target.type === GRAPH_ELEMENTS_TYPE.ROUTER
  ) {
    return false;
  }

  return (
    source?.type === GRAPH_ELEMENTS_TYPE.ROUTER ||
    target?.type === GRAPH_ELEMENTS_TYPE.ROUTER
  );
};

export function snapPointsToHandles(source, target, points) {
  // clone points
  const snappedPoints = points.map(p => ({ ...p }));
  const { x: startX, y: startY } = points[0];
  const { x: endX, y: endY } = points[points.length - 1];

  // lets process the start points of the edge first.
  let i = 0;
  const complete = { x: false, y: false };

  for (; i < points.length - 1; i += 1) {
    const { x, y } = points[i];

    // console.log(`inspect point ${i}`);
    if (!complete.y && y === startY && y !== source.y) {
      snappedPoints[i].y = source.y;
      // console.log(i, 'snapped start y');
    } else {
      complete.y = true;
    }

    if (!complete.x && x === startX && x !== source.x) {
      snappedPoints[i].x = source.x;
      // console.log(i, 'snapped start x');
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

  for (let j = points.length - 1; j >= i; j -= 1) {
    const { x, y } = points[j];

    // console.log(`inspect point ${j} of ${points.length - 1}`);

    if (!complete.y && y === endY && y !== target.y) {
      snappedPoints[j].y = target.y;
      // console.log(j, 'snapped end y');
    } else {
      complete.y = true;
    }

    if (!complete.x && x === endX && x !== target.x) {
      snappedPoints[j].x = target.x;
      // console.log(j, 'snapped end x');
    } else {
      complete.x = true;
    }

    if (complete.y && complete.x) break;
  }

  return snappedPoints;
}
