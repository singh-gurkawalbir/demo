import React, { useEffect, useMemo, useReducer } from 'react';
import { makeStyles } from '@material-ui/core';
import ReactFlow,
{ MiniMap,
  Controls,
  ReactFlowProvider} from 'react-flow-renderer';
import TextButton from '../../../../components/Buttons/TextButton';
import DefaultEdge from './CustomEdges/DefaultEdge';
import { layoutElements, terminalNodeInVicinity } from './lib';
import { FlowProvider } from './Context';
import PgNode from './CustomNodes/PgNode';
import PpNode from './CustomNodes/PpNode';
import TerminalFreeNode from './CustomNodes/terminalNodes/Free';
import TerminalBlockedNode from './CustomNodes/terminalNodes/Blocked';
import RouterNode from './CustomNodes/RouterNode';
import MergeNode from './CustomNodes/MergeNode';
import reducer, { resourceDataSelector } from './reducer';
import { generateReactFlowGraph } from './translateSchema';
import { handleMergeNode } from './hooks';
import { Background } from './Background';
import SourceTitle from './titles/SourceTitle';
import DestinationTitle from './titles/DestinationTitle';

const nodeTypes = {
  pg: PgNode,
  pp: PpNode,
  terminalFree: TerminalFreeNode, // TerminalFreeNode,
  terminalBlocked: TerminalBlockedNode,
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
    zIndex: 4,
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

  // eslint-disable-next-line no-alert
  const handleAddSource = () => alert('add new source');
  // eslint-disable-next-line no-alert
  const handleAddDestination = () => alert('add new destination');

  return (
    <ReactFlowProvider>
      {/* add flow to the context so it is accessible to flowGraph beneath ..this will be replaced by the resourceDataSelector */}
      <FlowProvider elements={elements} flow={mergedFlow} setState={setState}>
        <SourceTitle onClick={handleAddSource} />
        <DestinationTitle onClick={handleAddDestination} />

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
