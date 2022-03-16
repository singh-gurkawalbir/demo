import React, { useEffect, useMemo, useReducer } from 'react';
import { makeStyles } from '@material-ui/core';
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
import { generateReactFlowGraph } from './translateSchema';
import { handleMergeNode } from './hooks';
import TextButton from '../../../../components/Buttons/TextButton';
import { Background } from './Background';

const nodeTypes = {
  pg: PgNode,
  pp: PpNode,
  terminalFree: TerminalNode,
  terminalBlocked: TerminalNode, // create new component
  router: RouterNode,
  merge: MergeNode,
};

const edgeTypes = {
  default: DefaultEdge,
};
const flowIdToTest = 'flow1';

const useStyles = makeStyles({
  copyButton: {
    bottom: 10,
    left: 60,
    position: 'absolute',
    zIndex: 5,
  },
});

export default ({resourceState}) => {
  const classes = useStyles();
  const [state, setState] = useReducer(reducer, {
    data: {resources: resourceState},
    session: {
      staged: {},
    },
  });
  const mergedFlow = resourceDataSelector(state, 'flows', flowIdToTest);
  const elements = useMemo(() => generateReactFlowGraph(state.data.resources, mergedFlow), [mergedFlow, state.data.resources]);

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

  const handleCopySchema = () => {
    const resourceState = {
      // remove exports that are not in the flow.
      exports: state.data.resources.exports
        .filter(e => mergedFlow.pageGenerators
          .map(g => g._exportId)
          .includes(e._id)),
      // for now copy all imports. later we can traverse the
      // flow to collect importIds and then filter our the imports
      // that are no longer referenced by the flow
      imports: state.data.resources.imports,
      // our stories only have 1 flow, so we can always rebuild the
      // flows collection from the single merged flow...
      flows: [mergedFlow],
    };

    // eslint-disable-next-line no-console
    console.log(resourceState);
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
        >
          <Background />
        </ReactFlow>
      </FlowProvider>

      <MiniMap />
      <Controls />

      <TextButton className={classes.copyButton} onClick={handleCopySchema}>
        Log schema to console
      </TextButton>
    </ReactFlowProvider>
  );
};
