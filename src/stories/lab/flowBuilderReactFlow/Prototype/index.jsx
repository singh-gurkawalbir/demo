import React, { useState, useEffect, useMemo, useReducer } from 'react';
import ReactFlow,
{ MiniMap,
  Controls,
  ReactFlowProvider} from 'react-flow-renderer';
import mockElements from './metadata/elements';
import LinkedEdge from './CustomEdges/LinkedEdge';
import DefaultEdge from './CustomEdges/DefaultEdge';
import { layoutElements, terminalNodeInVicinity } from './lib';
import { FlowProvider } from './Context';
import PgNode from './CustomNodes/PgNode';
import PpNode from './CustomNodes/PpNode';
import TerminalNode from './CustomNodes/TerminalNode';
import RouterNode from './CustomNodes/RouterNode';
import MergeNode from './CustomNodes/MergeNode';
import reducer from './reducer';
import actions from './reducer/actions';

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
  const [elements, dispatchFlowUpdate] = useReducer(reducer, mockElements);
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
  const onNodeDragStop = (evt, source) => {
    const target = terminalNodeInVicinity(source, updatedLayout);

    if (!target) {
      return;
    }

    dispatchFlowUpdate({type: actions.MERGE_TERMINAL_NODES, source: source.id, target});
    // sometimes the selection sticks
  };

  return (
    <ReactFlowProvider>
      <FlowProvider elements={elements} mergeNodeId={mergeNodeId} dispatchFlowUpdate={dispatchFlowUpdate}>
        <ReactFlow
          // onConnect={handleConnect} // this is handled in the terminal node
          onConnectStart={handleConnectStart}
          onNodeDragStop={onNodeDragStop}
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
