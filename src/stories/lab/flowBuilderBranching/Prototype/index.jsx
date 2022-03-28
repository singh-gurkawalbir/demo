import React, { useCallback, useEffect, useMemo, useReducer } from 'react';
import { makeStyles } from '@material-ui/core';
import ReactFlow,
{ MiniMap,
  Controls,
  ReactFlowProvider} from 'react-flow-renderer';
import actions from './reducer/actions';
import { getSomeExport, getSomePg } from './nodeGeneration';
import TextButton from '../../../../components/Buttons/TextButton';
import DefaultEdge from './CustomEdges/DefaultEdge';
import { generateId, layoutElements } from './lib';
import { FlowProvider } from './Context';
import PgNode from './CustomNodes/PgNode';
import PpNode from './CustomNodes/PpNode';
import TerminalFreeNode from './CustomNodes/terminalNodes/Free';
import TerminalBlockedNode from './CustomNodes/terminalNodes/Blocked';
import RouterNode from './CustomNodes/RouterNode';
import MergeNode from './CustomNodes/MergeNode';
import reducer, { resourceDataSelector, elementsSelector } from './reducer';
import { Background } from './Background';
import SourceTitle from './titles/SourceTitle';
import DestinationTitle from './titles/DestinationTitle';

const nodeTypes = {
  pg: PgNode,
  pp: PpNode,
  terminalFree: TerminalFreeNode,
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
      fb: {},
      staged: {},
    },
  });
  const mergedFlow = resourceDataSelector(state, 'flows', flowIdToTest);
  const elements = elementsSelector(state);

  const updatedLayout = useMemo(() =>
    layoutElements(elements, 'LR'),
  [elements]);

  useEffect(() => {
    setState({type: actions.SET_GRAPH_ELEMENTS, flow: mergedFlow});
  }, [mergedFlow]);

  // const handleMerge = handleMergeNode(mergedFlow, elements, setState);

  const handleNodeDragStart = (evt, source) => {
    setState({type: actions.DRAG_START, nodeId: source.id});
  };

  const handleNodeDragStop = () => {
    setState({type: actions.MERGE_BRANCH_NEW, flowId: mergedFlow._id});
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

  const handleAddSource = useCallback(() => {
    const id = `new-${generateId()}`;
    const flowNode = getSomePg(id);
    const resourceNode = getSomeExport(id);

    setState({
      type: actions.ADD_NEW_STEP,
      resourceType: 'exports',
      path: '/pageGenerators/-',
      flowNode,
      resourceNode,
      flowId: mergedFlow?._id});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // eslint-disable-next-line no-alert
  const handleAddDestination = () => alert('add new destination');

  return (
    <ReactFlowProvider>
      {/* add flow to the context so it is accessible to flowGraph beneath ..this will be replaced by the resourceDataSelector */}
      <FlowProvider
        elements={elements}
        flow={mergedFlow}
        dragNodeId={state.session.fb.dragNodeId}
        setState={setState}>

        <SourceTitle onClick={handleAddSource} />
        <DestinationTitle onClick={handleAddDestination} />

        <ReactFlow
          onNodeDragStart={handleNodeDragStart}
          onNodeDragStop={handleNodeDragStop}
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
