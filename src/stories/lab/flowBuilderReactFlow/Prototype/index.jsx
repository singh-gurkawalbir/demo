import React, { useState, useEffect } from 'react';
import ReactFlow,
{ MiniMap,
  Controls,
  ReactFlowProvider } from 'react-flow-renderer';
import flowSchema from './metadata/flowSchema';
import LinkedEdge from './LinkedEdge';
import StepNode from './StepNode';
import { layoutElements } from './lib';
import { FlowProvider } from './Context';

const nodeTypes = {
  step: StepNode,
};

const edgeTypes = {
  linked: LinkedEdge,
};

const layedOutElements = layoutElements(flowSchema);

export default () => {
  const [elements, setElements] = useState(layedOutElements);

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log(elements);
  }, [elements]);

  return (
    <ReactFlowProvider>
      <FlowProvider elements={elements} setElements={setElements}>
        <ReactFlow
          elements={layedOutElements}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
        />
      </FlowProvider>
      <MiniMap />
      <Controls />
    </ReactFlowProvider>
  );
};
