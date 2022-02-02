import React, { useState, useEffect } from 'react';
import ReactFlow,
{ MiniMap,
  Controls,
  ReactFlowProvider } from 'react-flow-renderer';
import flowSchema from './metadata/flowSchema';
import LinkedEdge from './CustomEdges/LinkedEdge';
import StepNode from './CustomNodes/StepNode';
import { layoutElements } from './lib';
import { FlowProvider } from './Context';
import PageGenerator from './CustomNodes/PG';
import PageProcessor from './CustomNodes/PP';
// import simpleFlowSchema from './metadata/simpleFlowSchema';

const nodeTypes = {
  step: StepNode,
  pg: PageGenerator,
  pp: PageProcessor,
};

const edgeTypes = {
  linked: LinkedEdge,
};

export default () => {
  const [elements, setElements] = useState(layoutElements(flowSchema));

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log(elements);
  }, [elements]);

  return (
    <ReactFlowProvider>
      <FlowProvider elements={elements} setElements={setElements}>
        <ReactFlow
          elements={elements}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
        />
      </FlowProvider>
      <MiniMap />
      <Controls />
    </ReactFlowProvider>
  );
};
