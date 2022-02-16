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
import MergeNode from './CustomNodes/MergeNode';

const nodeTypes = {
  pg: PgNode,
  pp: PpNode,
  terminal: TerminalNode,
  router: RouterNode,
  merge: MergeNode,
};

const edgeTypes = {
  default: DefaultEdge,
  linked: LinkedEdge, // not used now, possibly never.
};

export default () => {
  const [elements, setElements] = useState(mockElements);
  const [mergeNodeId, setMergeNodeId] = useState();

  const updatedLayout = useMemo(() =>
    layoutElements(elements, 'LR'),
  [elements]);

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log(elements);
  }, [elements]);

  const handleConnectStart = (event, { nodeId }) => {
    setMergeNodeId(nodeId);
  };

  const handleConnectEnd = () => {
    setMergeNodeId();
  };

  return (
    <ReactFlowProvider>
      <FlowProvider elements={elements} mergeNodeId={mergeNodeId} setElements={setElements}>
        <ReactFlow
          // onConnect={handleConnect} // this is handled in the terminal node
          onConnectStart={handleConnectStart}
          onConnectEnd={handleConnectEnd}
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
