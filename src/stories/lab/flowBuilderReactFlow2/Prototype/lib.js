/* eslint-disable no-param-reassign */
import { nanoid } from 'nanoid';
import { isEdge, isNode } from 'react-flow-renderer';
import dagre from 'dagre';

export const handleOffset = 0;

const nodeSize = {
  pp: {
    width: 275,
    height: 295,
  },
  pg: {
    width: 275,
    height: 295,
  },
  router: {
    width: 50,
    height: 50,
  },
  terminal: {
    width: 34,
    height: 34,
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
};

export function generateId() {
  return nanoid(6);
}

export function generateDefaultEdge(source, target) {
  return {
    id: `${source}-${target}`,
    source,
    target,
    type: 'default',
  };
}

export function generateNewNode() {
  const newId = generateId();

  return ({
    id: newId,
    type: 'pp',
    data: { label: `New node: ${newId}`},
  });
}

export function layoutElements(elements) {
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
      const offsetY = ['pp', 'pg'].includes(el.type) ? 0 : handleOffset;
      const offsetX = el.type === 'terminal' ? nodeSize.pp.width / 2 - nodeSize.terminal.width / 2 : 0;

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
      const target = nodes.find(n => n.id === el.target);

      const isTerminal = target.type === 'terminal';

      edges.push({
        ...el,
        data: {
          isTerminal,
          points: edge.points,
        },
      });
    }
  });

  return [...nodes, ...edges];
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

export const terminalNodeInVicinity = (ele, elements) => {
  if (!ele) {
    return false;
  }
  const {x: xCoord, y: yCoord} = ele.position;

  return elements
    .filter(node => node.type === 'terminal' || node.type === 'merge')
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
// const SEPERATION_SPACE = 50;
// // use same forgein object space for unlink icon
// const SPACE_FROM_ADDICON = foreignObjectSize + SEPERATION_SPACE;

export const getPositionInEdge = (edgeCommands, centerOffset) => {
  const linePlotsCoordinates = edgeCommands.substr(1).split(/[LQ]/).map(cmd => cmd.trim()).map(cmd => {
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

  let lengthFromStart = Math.floor(lengthOFEdges / 2 + centerOffset);

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
  const edge = elements.find(ele => ele.id === edgeId);

  if (!edge) {
    return false;
  }
  const {target} = edge;

  return elements.filter(isEdge).filter(e => e.target === target).length > 1;
};

export const isNodeConnectedToRouterOrTerminal = (nodeId, elements) => {
  if (!nodeId || !elements) {
    return false;
  }
  const node = elements.find(ele => ele.id === nodeId);

  if (!node) {
    return false;
  }
  const {source, target} = node;

  return elements.filter(e => [source, target].includes(e.id)).some(node => ['router', 'terminal'].includes(node?.type));
};
