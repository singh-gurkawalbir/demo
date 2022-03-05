import React, { useEffect, useMemo, useReducer } from 'react';
import ReactFlow,
{ MiniMap,
  Controls,
  ReactFlowProvider} from 'react-flow-renderer';
import DefaultEdge from './CustomEdges/DefaultEdge';
import { layoutElements, terminalNodeInVicinity } from './lib';
import { FlowProvider } from './Context';
import PgNode from './CustomNodes/PgNode';
import PpNode from './CustomNodes/PpNode';
import TerminalNode from './CustomNodes/TerminalNode';
import RouterNode from './CustomNodes/RouterNode';
import MergeNode from './CustomNodes/MergeNode';
import reducer, { resourceDataSelector } from './reducer';
import { resourceState } from './metadata/simpleFlowSchema';
import { generateReactFlowGraph } from './translateSchema';
import { handleMergeNode } from './hooks';

const nodeTypes = {
  pg: PgNode,
  pp: PpNode,
  terminal: TerminalNode,
  router: RouterNode,
  merge: MergeNode,
};

const edgeTypes = {
  default: DefaultEdge,
};
const flowIdToTest = 'flow1';

const stateOrig = {data: {resources: resourceState}, session: {staged: {}}};

export default () => {
  const [state, setState] = useReducer(reducer, stateOrig);
  const mergedFlow = resourceDataSelector(state, 'flows', flowIdToTest)?.merged;
  const elements = useMemo(() => generateReactFlowGraph(state.data.resources, mergedFlow), [mergedFlow, state.data.resources]);

  // console.log('state ', mergedFlow, state);

  const updatedLayout = useMemo(() =>
    layoutElements(elements, 'LR'),
  [elements]);

  useEffect(() => {
    // eslint-disable-next-line no-console
    // console.log(elements);
  }, [elements]);

  const handleMerge = handleMergeNode(mergedFlow, elements, setState);
  const onNodeDragStop = (evt, source) => {
    const target = terminalNodeInVicinity(source, updatedLayout);

    if (!target) {
      return;
    }

    handleMerge(source.id, target);
    // sometimes the selection sticks
  };

  return (
    <ReactFlowProvider>
      {/* add flow to the context so it is accessible to flowGraph beneath ..this will be replaced by the resourceDataSelector */}
      <FlowProvider elements={elements} flow={mergedFlow} setState={setState}>
        <ReactFlow
          onNodeDragStop={onNodeDragStop}
          nodesDraggable={false}
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
