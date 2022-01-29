/* eslint-disable no-param-reassign */
import React from 'react';
import ReactFlow,
{ MiniMap,
  Controls,
  ReactFlowProvider,
  isNode } from 'react-flow-renderer';
import dagre from 'dagre';
import flowSchema from './metadata/flowSchema';
import LinkedEdge from './LinkedEdge';
import StepNode from './StepNode';

const nodeTypes = {
  step: StepNode,
};

const edgeTypes = {
  linked: LinkedEdge,
};

const dagreGraph = new dagre.graphlib.Graph();

dagreGraph.setDefaultEdgeLabel(() => ({}));

// In order to keep this example simple the node width and height are hardcoded.
// In a real world app you would use the correct width and height values of
// const nodes = useStoreState(state => state.nodes) and then node.__rf.width, node.__rf.height

const nodeWidth = 250;
const nodeHeight = 50;

const getLayoutedElements = (elements, direction = 'TB') => {
  const isHorizontal = direction === 'LR';

  dagreGraph.setGraph({ rankdir: direction });

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

      el.targetPosition = isHorizontal ? 'left' : 'top';
      el.sourcePosition = isHorizontal ? 'right' : 'bottom';

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
};

const layoutedElements = getLayoutedElements(flowSchema, 'LR');

export default () => (
  <ReactFlowProvider>
    <ReactFlow
      elements={layoutedElements}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
    />
    <MiniMap />
    <Controls />
  </ReactFlowProvider>
);
