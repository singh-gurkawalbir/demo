/* eslint-disable no-param-reassign */
import { isEdge, isNode } from 'react-flow-renderer';
import dagre from 'dagre';

const dagreGraph = new dagre.graphlib.Graph();

dagreGraph.setDefaultEdgeLabel(() => ({}));

// In order to keep this example simple the node width and height are hardcoded.
// In a real world app you would use the correct width and height values of
// const nodes = useStoreState(state => state.nodes) and then node.__rf.width, node.__rf.height

const nodeWidth = 250;
const nodeHeight = 50;
const options = {
  marginx: 50,
  marginy: 50,
};

export function layoutElements(elements) {
  dagreGraph.setGraph({ rankdir: 'LR', ...options });

  elements.forEach(el => {
    if (isNode(el)) {
      dagreGraph.setNode(el.id, { width: nodeWidth, height: nodeHeight });
    } else {
      dagreGraph.setEdge(el.source, el.target);
    }
  });

  dagre.layout(dagreGraph);

  return elements.map(el => {
    if (isNode(el)) {
      const nodeWithPosition = dagreGraph.node(el.id);

      // unfortunately we need this little hack to pass a slightly different position
      // to notify react flow about the change. Moreover we are shifting the dagre node position
      // (anchor=center center) to the top left so it matches the react flow node anchor point (top left).
      el.position = {
        x: nodeWithPosition.x - nodeWidth / 2 + Math.random() / 1000,
        y: nodeWithPosition.y - nodeHeight / 2,
      };
    }

    return el;
  });
}

export function getConnectedEdges(id, direction = 'left', elements) {
  const handle = direction === 'left' ? 'target' : 'source';
  const edges = elements.filter(e => isEdge(e));

  return edges.filter(edge => edge[handle] === id);
}
