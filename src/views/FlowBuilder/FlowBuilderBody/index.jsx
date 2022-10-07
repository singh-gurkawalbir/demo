import { makeStyles, useTheme } from '@material-ui/core';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import ReactFlow, { MiniMap, ReactFlowProvider } from 'react-flow-renderer';
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
import useMenuDrawerWidth from '../../../hooks/useMenuDrawerWidth';
// import { ExportFlowStateButton } from './ExportFlowStateButton';
import EmptyNode from './CustomNodes/EmptyNode';
import LoadingNotification from '../../../App/LoadingNotification';
import { GRAPH_ELEMENTS_TYPE } from '../../../constants';
import { CanvasControls } from './CanvasControls';

const useCalcCanvasStyle = fullscreen => {
  const theme = useTheme();
  const [bottomDrawerHeight] = useBottomDrawer();
  const height = fullscreen
    ? 0
    : bottomDrawerHeight + theme.appBarHeight + theme.pageBarHeight;
  const calcCanvasStyle = useMemo(
    () => ({
      height: `calc(100vh - ${height}px)`,
    }),
    [height]
  );

  return calcCanvasStyle;
};

// TODO: (AZHAR) suitescript and normal styles are repeating
const useStyles = makeStyles(theme => ({
  canvasContainer: drawerWidth => ({
    overflow: 'hidden',
    width: `calc(100vw - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'height'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
  canvas: {
    width: '100%',
    height: '100%',
    display: 'flex',
    overflow: 'auto',
    background: theme.palette.background.paper,
  },
  minimap: {
    display: 'none',
  },
  terminal: {
    fill: theme.palette.secondary.lightest,
    stroke: theme.palette.secondary.lightest,
    width: 275,
    height: 170,
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
  canPan: {
    cursor: 'grab',
  },
  isPanning: {
    cursor: 'grabbing',
  },
}));

const nodeTypes = {
  pg: PgNode,
  pp: PpNode,
  terminal: TerminalNode,
  router: RouterNode,
  merge: MergeNode,
  empty: EmptyNode,
};

const edgeTypes = {
  default: DefaultEdge,
};

export function Canvas({ flowId, fullscreen }) {
  const dispatch = useDispatch();
  const menuDrawerWidth = useMenuDrawerWidth();
  const drawerWidth = fullscreen ? 0 : menuDrawerWidth;
  const classes = useStyles(drawerWidth);
  const [showMiniMap, setShowMiniMap] = useState(true);
  const [isPanning, setIsPanning] = useState(false);
  const calcCanvasStyle = useCalcCanvasStyle(fullscreen);
  const mergedFlow = useSelectorMemo(
    selectors.makeFlowDataForFlowBuilder,
    flowId
  );

  const elements = useSelector(state =>
    selectors.fbGraphElements(state, flowId)
  );
  const dragStepId = useSelector(state =>
    selectors.fbDragStepId(state, flowId)
  );
  const dragStepIdInProgress = useSelector(state =>
    selectors.fbDragStepIdInProgress(state, flowId)
  );
  const elementsMap = useSelector(state =>
    selectors.fbGraphElementsMap(state, flowId)
  );
  const isViewMode = useSelector(state =>
    selectors.isFlowViewMode(state, mergedFlow._integrationId, flowId)
  );
  const isDataLoaderFlow = useSelector(state =>
    selectors.isDataLoaderFlow(state, flowId)
  );
  const isFlowSaveInProgress = useSelector(state =>
    selectors.isFlowSaveInProgress(state, flowId)
  );

  const updatedLayout = useMemo(() => layoutElements(elements, 'LR'), [
    elements,
  ]);

  useEffect(() => {
    dispatch(actions.flow.initializeFlowGraph(flowId, mergedFlow, isViewMode, isDataLoaderFlow));
  }, [mergedFlow, dispatch, flowId, isViewMode, isDataLoaderFlow]);

  const handleNodeDragStart = (evt, source) => {
    dispatch(actions.flow.dragStart(flowId, source.id));
  };

  const handleNodeDragStop = () => {
    dispatch(actions.flow.mergeBranch(flowId));
  };

  const handleNodeDrag = () => {
    if (dragStepIdInProgress) {
      dispatch(actions.flow.setDragInProgress(flowId));
    }
  };

  const handleAddNewSource = useCallback(() => {
    dispatch(actions.flow.addNewPGStep(flowId));
  }, [dispatch, flowId]);

  const handleMoveEnd = () => setIsPanning(false);
  const handleMove = () => {
    if (!isPanning) {
      setIsPanning(true);
    }
  };

  return (
    <div className={classes.canvasContainer} style={calcCanvasStyle}>
      <LoadingNotification
        message={isFlowSaveInProgress ? 'Saving flow' : ''}
      />
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
              className={isPanning ? classes.isPanning : classes.canPan}
              onNodeDragStart={handleNodeDragStart}
              onNodeDragStop={handleNodeDragStop}
              onNodeDrag={handleNodeDrag}
              onMoveEnd={handleMoveEnd}
              onMove={handleMove}
              nodesDraggable={false}
              minZoom={0.4}
              panOnScroll
              elements={updatedLayout}
              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}
              preventScrolling={false}
              onlyRenderVisibleElements
            >
              <SourceTitle onClick={handleAddNewSource} />
              <DestinationTitle />
              <BackgroundPanel />
              {showMiniMap && (
                <MiniMap
                  nodeClassName={node => {
                    switch (node.type) {
                      case GRAPH_ELEMENTS_TYPE.TERMINAL:
                      case GRAPH_ELEMENTS_TYPE.ROUTER:
                      case GRAPH_ELEMENTS_TYPE.MERGE:
                      case GRAPH_ELEMENTS_TYPE.EMPTY:
                        return classes.minimap;

                      default:
                        return classes.terminal;
                    }
                  }}
                  nodeBorderRadius={75}
                />
              )}
              {/* <ExportFlowStateButton flowId={flowId} /> */}
              <CanvasControls
                showMiniMap={showMiniMap}
                toggleMiniMap={() => setShowMiniMap(oldState => !oldState)}
              />
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

  useEffect(
    () => () => {
      dispatch(actions.bottomDrawer.clear());
    },
    [dispatch]
  );

  return (
    <>
      <PageBar flowId={flowId} integrationId={integrationId} />
      <Canvas flowId={flowId} integrationId={integrationId} />
    </>
  );
}
