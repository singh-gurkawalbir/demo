import React from 'react';
import ReactFlow,
{ MiniMap,
  Controls,
  ReactFlowProvider } from 'react-flow-renderer';
import flowSchema from './metadata/flowSchema';
import LinkedEdge from './LinkedEdge';
import StepNode from './StepNode';
import { layoutElements } from './lib';

const nodeTypes = {
  step: StepNode,
};

const edgeTypes = {
  linked: LinkedEdge,
};

const layedOutElements = layoutElements(flowSchema, 'LR');

export default () => (
  <ReactFlowProvider>
    <ReactFlow
      elements={layedOutElements}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
    />
    <MiniMap />
    <Controls />
  </ReactFlowProvider>
);
