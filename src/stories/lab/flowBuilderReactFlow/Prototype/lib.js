/* eslint-disable no-param-reassign */
import { isEdge, isNode } from 'react-flow-renderer';
import dagre from 'dagre';

// In order to keep this example simple the node width and height are hardcoded.
// In a real world app you would use the correct width and height values of
// const nodes = useStoreState(state => state.nodes) and then node.__rf.width, node.__rf.height

const nodeWidth = 275;
const nodeHeight = 285;
const stepHeight = 25;
const stepWidth = 25;
const options = {
  ranksep: 225,
};
const applyNodeStyle = (dagreGraph, { height, width}) => el => {
  dagreGraph.setNode(el.id, { width, height });
};

export function layoutElements(elements) {
  const dagreGraph = new dagre.graphlib.Graph();

  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: 'LR', ...options });
  const appElements = elements.filter(el => ['pg', 'pp'].includes(el.type));
  const stepElements = elements.filter(el => ['step'].includes(el.type));

  appElements.forEach(applyNodeStyle(dagreGraph, {height: nodeHeight, width: nodeWidth}));
  stepElements.forEach(applyNodeStyle(dagreGraph, {height: stepHeight, width: stepWidth}));
  const edges = elements.filter(isEdge);

  edges.forEach(el => {
    dagreGraph.setEdge(el.source, el.target);
  });

  dagre.layout(dagreGraph);

  return elements.map(el => {
    if (isNode(el)) {
      const nodeWithPosition = dagreGraph.node(el.id);

      // unfortunately we need this little hack to pass a slightly different position
      // to notify react flow about the change. Moreover we are shifting the dagre node position
      // (anchor=center center) to the top left so it matches the react flow node anchor point (top left).
      return ({...el,
        position: {
          x: nodeWithPosition.x,
          y: nodeWithPosition.y,
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
