/* eslint-disable no-param-reassign */
import { isEdge, isNode } from 'react-flow-renderer';
import dagre from 'dagre';

// In order to keep this example simple the node width and height are hardcoded.
// In a real world app you would use the correct width and height values of
// const nodes = useStoreState(state => state.nodes) and then node.__rf.width, node.__rf.height

const nodeSize = {
  pp: {
    width: 275,
    height: 285,
  },
  pg: {
    width: 275,
    height: 285,
  },
  router: {
    width: 50,
    height: 50,
  },
  leaf: {
    width: 50,
    height: 50,
  },
};

const options = {
  ranksep: 225,
  nodesep: 150,
};

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
      const nodeWithPosition = dagreGraph.node(el.id);

      // We are shifting the dagre node position that returns centerpoint (x,y)
      // to the top left so it matches the react-flow node anchor point (top left).
      // This maters when nodes are of various sizes.
      return ({...el,
        position: {
          x: nodeWithPosition.x - nodeSize[el.type].width / 2,
          y: nodeWithPosition.y - nodeSize[el.type].height / 2,
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
