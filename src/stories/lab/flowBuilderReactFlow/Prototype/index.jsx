import React, { useState, useEffect, useMemo } from 'react';
import ReactFlow,
{ MiniMap,
  Controls,
  ReactFlowProvider } from 'react-flow-renderer';
import mockElements from './metadata/elements';
import LinkedEdge from './CustomEdges/LinkedEdge';
import DefaultEdge from './CustomEdges/DefaultEdge';
import { layoutElements } from './lib';
import { FlowProvider } from './Context';
import PgNode from './CustomNodes/PgNode';
import PpNode from './CustomNodes/PpNode';
import TerminalNode from './CustomNodes/TerminalNode';
import RouterNode from './CustomNodes/RouterNode';

const nodeTypes = {
  pg: PgNode,
  pp: PpNode,
  terminal: TerminalNode,
  router: RouterNode,
};

const edgeTypes = {
  default: DefaultEdge,
  linked: LinkedEdge, // not used now, possibly never.
};

export default () => {
  const [elements, setElements] = useState(mockElements);

  const updatedLayout = useMemo(() =>
    layoutElements(elements, 'LR'),
  [elements]);

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log(elements);
  }, [elements]);

  return (
    <ReactFlowProvider>
      <FlowProvider elements={elements} setElements={setElements}>
        <ReactFlow
          selectNodesOnDrag={false}
          elements={updatedLayout}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
        />
      </FlowProvider>
      <MiniMap />
      <Controls />
    </ReactFlowProvider>
  );
};
