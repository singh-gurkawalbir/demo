import { useTheme } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ReactFlow, { MiniMap, useNodesState, useEdgesState, getOutgoers, isEdge, getIncomers } from 'reactflow';
import { useDispatch, useSelector } from 'react-redux';
import actions from '../../../actions';
import { selectors } from '../../../reducers';
import useBottomDrawer from '../drawers/BottomDrawer/useBottomDrawer';
import PageBar from './PageBar';
import DefaultEdge from './CustomEdges/DefaultEdge';
import IconLayoutEdge from './CustomEdges/IconLayoutEdge';
import { layoutElements } from './lib';
import {newlayoutElements} from './newlib';
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
import EmptyNode from './CustomNodes/EmptyNode';
import LoadingNotification from '../../../App/LoadingNotification';
import { GRAPH_ELEMENTS_TYPE } from '../../../constants';
import { CanvasControls } from './CanvasControls';
import AutoScroll from './AutoScroll';
import CustomDragLayer from './DragPreview';
import 'reactflow/dist/style.css';

const defaultViewport = { x: 0, y: 0, zoom: 1 };

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
  subppterminal: {
    fill: theme.palette.secondary.lightest,
    stroke: theme.palette.secondary.lightest,
    width: 137,
    height: 86,
  },
  iconterminal: {
    fill: theme.palette.secondary.lightest,
    stroke: theme.palette.secondary.lightest,
    width: 75,
    height: 70,
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
  iconpp: PpNode,
  iconpg: PgNode,
  subflowpp: PpNode,
  subflowpg: PgNode,
  pp: PpNode,
  terminal: TerminalNode,
  router: RouterNode,
  merge: MergeNode,
  empty: EmptyNode,
};

const edgeTypes = {
  default: DefaultEdge,
  iconEdge: IconLayoutEdge,
};
const BUFFER_SIZE = 100;

export function Canvas({ flowId, fullscreen, iconView}) {
  const dispatch = useDispatch();
  const menuDrawerWidth = useMenuDrawerWidth();
  const drawerWidth = fullscreen ? 0 : menuDrawerWidth;
  const classes = useStyles(drawerWidth);
  const [subFlowElements, setSubFlowElements] = useState([]);
  const [rfInstance, setRFInstance] = useState(null);
  const [showMiniMap, setShowMiniMap] = useState(true);
  const [isPanning, setIsPanning] = useState(false);
  const calcCanvasStyle = useCalcCanvasStyle(fullscreen);
  const mergedFlow = useSelectorMemo(
    selectors.makeFlowDataForFlowBuilder,
    flowId
  );
  const parentDiv = useRef(null);
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
  const isSubFlowView = useSelector(state =>
    selectors.fbSubFlowView(state, flowId)
  );

  const iconViewElements = isSubFlowView ? subFlowElements : elements;
  const {nodes: initialNodes, edges: initialEdges, x, y } = useMemo(() => iconView !== 'icon' ? layoutElements(elements, mergedFlow) : newlayoutElements(iconViewElements, mergedFlow, isSubFlowView), [elements, iconView, iconViewElements, isSubFlowView, mergedFlow]);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    setNodes(initialNodes);
  }, [initialNodes, setNodes]);
  useEffect(() => {
    setEdges(initialEdges);
  }, [initialEdges, setEdges]);
  // const graphNodes = elements.filter(ele => isNode(ele));

  const translateExtent = [[-BUFFER_SIZE, -BUFFER_SIZE], [Math.max(x + BUFFER_SIZE, 1500), Math.max(y + 2 * BUFFER_SIZE, 700)]];

  useEffect(() => {
    dispatch(actions.flow.initializeFlowGraph(flowId, mergedFlow, isViewMode, isDataLoaderFlow));
    if (iconView !== 'icon') {
      dispatch(actions.flow.iconView(flowId, 'bubble'));
    }
  }, [mergedFlow, dispatch, flowId, isViewMode, isDataLoaderFlow, iconView]);

  const getAllOutgoingNodes = (node, nodes, edges) => getOutgoers(node, nodes, edges).reduce(
    (memo, outgoer) => [...memo, outgoer, ...getAllOutgoingNodes(outgoer, nodes, edges)],
    []
  );

  const getAllIncomingNodes = (node, nodes, edges) => getIncomers(node, nodes, edges).reduce(
    (memo, incomer) => [...memo, incomer, ...getAllIncomingNodes(incomer, nodes, edges)],
    []
  );

  const downstreamHighlighter = id => {
    dispatch(actions.flow.toggleSubFlowView(flowId, true, {nodeId: id, buttonPosition: 'left'}));
    const node = elements.find(ele => ele.id === id);
    const subFlow = getAllOutgoingNodes(node, nodes, edges).map(node => node.id);

    const newElements = elements.map(ele => {
      if (subFlow.length && (subFlow.includes(ele.id) || ele.id === id)) {
        return {...ele, isSubFlow: true};
      }

      return ele;
    });

    setSubFlowElements(newElements);
  };
  const upstreamHighlighter = id => {
    dispatch(actions.flow.toggleSubFlowView(flowId, true, {nodeId: id, buttonPosition: 'right'}));
    const node = elements.find(ele => ele.id === id);
    const subFlow = getAllIncomingNodes(node, nodes, edges).map(node => node.id);

    const newElements = elements.map(ele => {
      if (subFlow.length && (subFlow.includes(ele.id) || ele.id === id)) {
        return {...ele, isSubFlow: true};
      }

      return ele;
    });

    setSubFlowElements(newElements);
  };

  const handleNodeDragStart = useCallback((evt, source) => {
    dispatch(actions.flow.dragStart(flowId, source.id));
  }, [dispatch, flowId]);

  const handleNodeDragStop = useCallback(() => {
    dispatch(actions.flow.mergeBranch(flowId));
  }, [dispatch, flowId]);

  const handleNodeDrag = useCallback(() => {
    if (dragStepIdInProgress) {
      dispatch(actions.flow.setDragInProgress(flowId));
    }
  }, [dispatch, dragStepIdInProgress, flowId]);

  const handleAddNewSource = useCallback(() => {
    dispatch(actions.flow.addNewPGStep(flowId));
  }, [dispatch, flowId]);

  const onLoad = useCallback(reactFlowInstance => {
    setRFInstance(reactFlowInstance);
  }, []);

  const handleMoveEnd = useCallback(() => setIsPanning(false), []);
  const handleMove = useCallback(() => {
    if (!isPanning) {
      setIsPanning(true);
    }
  }, [isPanning]);

  const handleIconEdgeMouseHover = useCallback((evt, edge) => {
    const {id} = edge;

    const targetNodes = id.split('-');

    const targetNodeId = targetNodes.length === 2 ? targetNodes[1] : targetNodes[2];

    const targetNode = elements.find(e => e?.id === targetNodeId);

    const getAllOutgoingNodes = (node, nodes, edges) => getOutgoers(node, nodes, edges).reduce(
      (memo, outgoer) => [...memo, outgoer, ...getAllOutgoingNodes(outgoer, nodes, edges)],
      []
    );

    const subsequentNodes = targetNode ? getAllOutgoingNodes(targetNode, nodes, edges).map(node => node.id) : [];

    const includedEdges = elements.filter(ele => {
      if (!isEdge(ele)) return false;

      const nodes = ele.id.split('-');

      return targetNodes.length === 2 ? (subsequentNodes.includes(nodes[0]) || subsequentNodes.includes(nodes[1]))
        : (subsequentNodes.includes(nodes[0]) || subsequentNodes.includes(nodes[1]) || subsequentNodes.includes(nodes[2]));
    }
    ).map(ele => ele.id);

    includedEdges.push(id);
    dispatch(actions.flow.edgeHovered(flowId, includedEdges));

    // setSelectedEdge(edge);
  }, [dispatch, edges, elements, flowId, nodes]);

  const handleIconEdgeMouseLeave = useCallback(() => {
    dispatch(actions.flow.edgeUnhover(flowId));
  }, [dispatch, flowId]);

  return (
    <div className={classes.canvasContainer} style={calcCanvasStyle}>
      <LoadingNotification
        message={isFlowSaveInProgress ? 'Saving flow' : ''}
      />
      <div ref={parentDiv} className={classes.canvas}>
        {/* CANVAS START */}

        <FlowProvider
          elements={elements}
          elementsMap={elementsMap}
          iconView={iconView}
          downstreamHighlighter={downstreamHighlighter}
          upstreamHighlighter={upstreamHighlighter}
          flow={mergedFlow}
          // setSelectedEdge={setSelectedEdge}
          // selectedEdge={selectedEdge}
          flowId={flowId}
          translateExtent={translateExtent}
          dragNodeId={dragStepId}
            >
          <CustomDragLayer />
          <ReactFlow
            className={isPanning ? classes.isPanning : classes.canPan}
            onNodeDragStart={handleNodeDragStart}
            onNodeDragStop={handleNodeDragStop}
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onEdgeMouseEnter={handleIconEdgeMouseHover}
            onEdgeMouseLeave={handleIconEdgeMouseLeave}
            onNodeDrag={handleNodeDrag}
            onMoveEnd={handleMoveEnd}
            onMove={handleMove}
            nodesConnectable={false}
            minZoom={0.4}
            maxZoom={1.25}
            panOnScroll
            nodesDraggable={false}
            translateExtent={translateExtent}
            onInit={onLoad}
            defaultViewport={defaultViewport}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            preventScrolling={false}
            attributionPosition="top-right"
            onlyRenderVisibleElements
            >
            <SourceTitle onClick={handleAddNewSource} />
            <DestinationTitle />
            <BackgroundPanel />
            <AutoScroll ref={parentDiv} rfInstance={rfInstance} />
            {showMiniMap && (
            <MiniMap
              nodeClassName={node => {
                switch (node.type) {
                  // Hide these elements in mini map
                  case GRAPH_ELEMENTS_TYPE.TERMINAL:
                  case GRAPH_ELEMENTS_TYPE.ROUTER:
                  case GRAPH_ELEMENTS_TYPE.MERGE:
                  case GRAPH_ELEMENTS_TYPE.EMPTY:
                    return classes.minimap;
                  case GRAPH_ELEMENTS_TYPE.SUBFLOW_PP:
                    return classes.subppterminal;
                  case GRAPH_ELEMENTS_TYPE.SUBFLOW_PG:
                    return classes.subppterminal;
                  case GRAPH_ELEMENTS_TYPE.ICON_PP:
                    return classes.iconterminal;
                  case GRAPH_ELEMENTS_TYPE.ICON_PG:
                    return classes.iconterminal;

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
        {/* CANVAS END */}
      </div>
    </div>
  );
}

export default function FlowBuilderBody({ flowId, integrationId}) {
  const dispatch = useDispatch();
  const iconView = useSelector(state =>
    selectors.fbIconview(state, flowId)
  );

  useEffect(
    () => () => {
      dispatch(actions.bottomDrawer.clear());
      dispatch(actions.flow.clear(flowId));
    },
    [dispatch, flowId]
  );

  return (
    <>
      <PageBar flowId={flowId} integrationId={integrationId} iconView={iconView} />
      <Canvas flowId={flowId} integrationId={integrationId} iconView={iconView} />
    </>
  );
}
