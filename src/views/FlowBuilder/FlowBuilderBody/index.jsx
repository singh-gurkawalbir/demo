import { makeStyles, useTheme } from '@material-ui/core';
import clsx from 'clsx';
import React, { useCallback, useEffect, useMemo } from 'react';
import ReactFlow, { MiniMap, Controls, ReactFlowProvider} from 'react-flow-renderer';
import { useDispatch, useSelector } from 'react-redux';
import actions from '../../../actions';
import { selectors } from '../../../reducers';
import useBottomDrawer from '../drawers/BottomDrawer/useBottomDrawer';
import PageBar from './PageBar';
import DefaultEdge from './CustomEdges/DefaultEdge';
import { layoutElements } from './lib';
import { FlowProvider } from './Context';
import PgNode from './CustomNodes/PgNode';
import PpNode from './CustomNodes/PpNode';
import TerminalNode from './CustomNodes/TerminalNode';
import RouterNode from './CustomNodes/RouterNode';
import MergeNode from './CustomNodes/MergeNode';
import BackgroundPanel from './Background';
import SourceTitle from './titles/SourceTitle';
import DestinationTitle from './titles/DestinationTitle';
import { useSelectorMemo } from '../../../hooks';

const useCalcCanvasStyle = () => {
  const theme = useTheme();
  const [bottomDrawerHeight] = useBottomDrawer();

  const calcCanvasStyle = useMemo(() => ({
    height: `calc(100vh - ${bottomDrawerHeight + theme.appBarHeight + theme.pageBarHeight}px)`,
  }), [bottomDrawerHeight, theme.appBarHeight, theme.pageBarHeight]);

  return calcCanvasStyle;
};

// TODO: (AZHAR) suitescript and normal styles are repeating
const useStyles = makeStyles(theme => ({
  canvasContainer: {
    // border: 'solid 1px black',
    overflow: 'hidden',
    width: `calc(100vw - ${theme.drawerWidthMinimized}px)`,
    transition: theme.transitions.create(['width', 'height'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  canvasShift: {
    width: `calc(100vw - ${theme.drawerWidth}px)`,
  },
  canvas: {
    width: '100%',
    height: '100%',
    display: 'flex',
    overflow: 'auto',
    background: theme.palette.background.paper,
  },
  title: {
    display: 'flex',
    padding: theme.spacing(4, 0, 6, 0),
    marginBottom: theme.spacing(0.5),
    justifyContent: 'center',
    color: theme.palette.secondary.light,
    fontFamily: 'Roboto400',
  },
  destinationTitle: {
    marginLeft: 100,
    justifyContent: 'flex-start',
  },
  generatorRoot: {
    backgroundColor: theme.palette.background.default,
    minWidth: 460,
  },
  processorRoot: {
    padding: theme.spacing(0, 3, 3, 0),
  },
  roundBtn: {
    borderRadius: '50%',
    background: theme.palette.background.paper,
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    padding: 0,
    marginLeft: theme.spacing(2),
  },
  sourceTitle: {
    marginLeft: -100,
  },
}));

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

function Canvas({flowId, integrationId}) {
  const dispatch = useDispatch();
  const classes = useStyles();

  console.log('integrationId', integrationId);
  // const isDataLoaderFlow = useSelector(state => selectors.isDataLoaderFlow(state, flowId));
  // const isFreeFlow = useSelector(state => selectors.isFreeFlowResource(state, flowId));
  const drawerOpened = useSelector(state => selectors.drawerOpened(state));
  const calcCanvasStyle = useCalcCanvasStyle();
  const mergedFlow = useSelectorMemo(selectors.makeFlowDataForFlowBuilder, flowId);

  const elements = useSelector(state => selectors.fbGraphElements(state, flowId));
  const dragStepId = useSelector(state => selectors.fbDragStepId(state, flowId));
  const elementsMap = useSelector(state => selectors.fbGraphElementsMap(state, flowId));

  const updatedLayout = useMemo(() =>
    layoutElements(elements, 'LR'),
  [elements]);

  useEffect(() => {
    dispatch(actions.flow.initializeFlowGraph(flowId, mergedFlow));
  }, [mergedFlow, dispatch]);

  const handleNodeDragStart = (evt, source) => {
    dispatch(actions.flow.dragStart(flowId, source.id));
  };

  const handleNodeDragStop = () => {
    dispatch(actions.flow.mergeBranch(flowId));
  };

  const handleAddNewSource = useCallback(() => {
    dispatch(actions.flow.addNewPGStep(flowId));
  }, [dispatch, flowId]);

  return (
    <div
      className={clsx(classes.canvasContainer, {
        [classes.canvasShift]: drawerOpened,
      })}
      style={calcCanvasStyle}>
      <div className={classes.canvas}>
        {/* CANVAS START */}
        <ReactFlowProvider>
          {/* add flow to the context so it is accessible to flowGraph beneath
          //...this will be replaced by the resourceDataSelector */}
          <FlowProvider
            elements={elements}
            elementsMap={elementsMap}
            flow={mergedFlow}
            flowId={flowId}
            dragNodeId={dragStepId}
          >

            <ReactFlow
              onNodeDragStart={handleNodeDragStart}
              onNodeDragStop={handleNodeDragStop}
              nodesDraggable={false}
              elements={updatedLayout}
              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}
        >
              <SourceTitle onClick={handleAddNewSource} />
              <DestinationTitle />
              <BackgroundPanel />
              <MiniMap />
              <Controls showInteractive={false} />
            </ReactFlow>
          </FlowProvider>
        </ReactFlowProvider>
        {/* CANVAS END */}
      </div>
    </div>
  );
}
export default function FlowBuilderBody({ flowId, integrationId }) {
  const dispatch = useDispatch();

  useEffect(() => (() => {
    dispatch(actions.bottomDrawer.clear());
  }), [dispatch]);

  return (
    <>
      <PageBar flowId={flowId} integrationId={integrationId} />
      <Canvas flowId={flowId} integrationId={integrationId} />
    </>
  );
}
