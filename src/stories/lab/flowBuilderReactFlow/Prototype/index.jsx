import React, { useState, useEffect } from 'react';
import ReactFlow,
{ MiniMap,
  Controls,
  ReactFlowProvider } from 'react-flow-renderer';
import mockElements from './metadata/elements';
import LinkedEdge from './CustomEdges/LinkedEdge';
import DefaultEdge from './CustomEdges/DefaultEdge';
import { layoutElements } from './lib';
import { FlowProvider } from './Context';
import PageGenerator from './CustomNodes/PG';
import PageProcessor from './CustomNodes/PP';
// import simpleFlowSchema from './metadata/simpleFlowSchema';

const nodeTypes = {
  pg: PageGenerator,
  pp: PageProcessor,
};

const edgeTypes = {
  default: DefaultEdge,
  linked: LinkedEdge,
};

export default () => {
  const [elements, setElements] = useState(layoutElements(mockElements));

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log(elements);
  }, [elements]);

  return (
    <ReactFlowProvider>
      <FlowProvider elements={elements} setElements={setElements}>
        <ReactFlow
          selectNodesOnDrag={false}
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
