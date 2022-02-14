/* eslint-disable no-param-reassign */
import { v4 } from 'uuid';
import { isEdge, isNode } from 'react-flow-renderer';
import dagre from 'dagre';

export const handleOffset = 30;

const nodeSize = {
  pp: {
    width: 275,
    height: 265,
  },
  pg: {
    width: 275,
    height: 265,
  },
  router: {
    width: 26,
    height: 26,
  },
  terminal: {
    width: 26,
    height: 26,
  },
  merge: {
    width: 26,
    height: 26,
  } };

const options = {
  ranksep: 250,
  nodesep: 50,
};

export function generateId() {
  return v4().replace(/-/g, '').substring(0, 4);
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
  const dagreGraph = new dagre.graphlib.Graph();

  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: 'LR', ...options });

  elements.forEach(el => {
    if (isNode(el)) {
      dagreGraph.setNode(el.id, {...nodeSize[el.type]});
    } else {
      dagreGraph.setEdge(el.source, el.target);
    }
  });

  dagre.layout(dagreGraph);

  return elements.map(el => {
    if (isNode(el)) {
      const layoutPos = dagreGraph.node(el.id);
      const size = nodeSize[el.type];
      const offset = ['pp', 'pg'].includes(el.type) ? 0 : handleOffset;

      // We are shifting the dagre node position that returns centerpoint (x,y)
      // to the top left so it matches the react-flow node anchor point (top left).
      // This maters when nodes are of various sizes.
      return ({...el,
        position: {
          x: layoutPos.x - size.width / 2,
          y: layoutPos.y - size.height / 2 - offset,
        }});
    }

    return el;
  });
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

  return elements.filter(node => node.type === 'terminal' || node.type === 'merge').find(dropElement => {
    const {x, y} = dropElement.position;

    return inRange(xCoord, x) && inRange(yCoord, y);
  })?.id;
};
