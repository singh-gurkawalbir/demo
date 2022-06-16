import React, {useCallback, useMemo} from 'react';
import { getSmoothStepPath } from 'react-flow-renderer';
import { makeStyles } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { handleOffset, nodeSize, areMultipleEdgesConnectedToSameEdgeTarget, snapPointsToHandles, GRAPH_ELEMENTS_TYPE } from '../../lib';
import { useFlowContext } from '../../Context';
import AddNewButton from '../AddNewButton';
import UnlinkButton from '../UnlinkButton';
import ForeignObject from '../ForeignObject';
import { selectors } from '../../../../../reducers';
import DiamondMergeIcon from '../../DiamondMergeIcon';
import actions from '../../../../../actions';

const useStyles = makeStyles(theme => ({
  edgePath: {
    strokeDasharray: 4,
    strokeWidth: 2,
    stroke: theme.palette.secondary.lightest, // celigo neutral 3
    fill: 'transparent',
    '&:hover': { // temporary rule to help trace overlapping paths.
      stroke: theme.palette.primary.lightest,
    },
  },
}));

function getPositionAndOffset(targetType, sourceType, showLinkIcon, processorCount) {
  let position = 'center';
  let offset = 10;

  if (targetType === GRAPH_ELEMENTS_TYPE.PP_STEP && sourceType !== GRAPH_ELEMENTS_TYPE.PP_STEP) {
    // we want the add button to be positioned close to the pp,
    // not close to the merge/router nodes.
    position = 'right';
    offset = 30;
  } else if (sourceType === GRAPH_ELEMENTS_TYPE.PP_STEP && targetType !== GRAPH_ELEMENTS_TYPE.PP_STEP) {
    position = 'left';
    offset = 70;
  }

  if (processorCount > 0) {
    // The left and center positions are not valid if a step has processors since
    // they would overlap a left positioned edge button, or sometimes even a center position
    // edge button if the edge is short (shortest linear node -> node edge).
    // In this case, we will set the position to 'left', and hardcode an offset that will clear the
    // max processors. Later we can make this dynamic in case a user doesn't have the processors configured,
    // or has not expanded them via the shop-processor icon (+) in the step.
    if (position === 'left' || (position === 'center' && processorCount > 2)) {
      position = 'left';
      offset = processorCount * 44 + 28;
    }
  }

  return {position, offset};
}

export default function DefaultEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data,
}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { elements, dragNodeId, flow, flowId } = useFlowContext();
  const hasSiblingEdges = useMemo(() => areMultipleEdgesConnectedToSameEdgeTarget(id, elements), [id, elements]);
  const isViewMode = useSelector(state => selectors.isFlowViewMode(state, flow._integrationId, flowId));
  const isFlowSaveInProgress = useSelector(state => selectors.isFlowSaveInProgress(state, flowId));
  const isDataLoaderFlow = useSelector(state => selectors.isDataLoaderFlow(state, flowId));
  const { sourceType, targetType, points: edgePoints, processorCount, mergableTerminals = [] } = data;
  const isDragging = !!dragNodeId;
  const isTargetMerge = targetType === GRAPH_ELEMENTS_TYPE.MERGE;
  const isTargetTerminal = targetType === GRAPH_ELEMENTS_TYPE.TERMINAL;
  const isSourceRouter = sourceType === GRAPH_ELEMENTS_TYPE.ROUTER;
  const isTargetRouter = targetType === GRAPH_ELEMENTS_TYPE.ROUTER || targetType === GRAPH_ELEMENTS_TYPE.MERGE;
  const isSourceGenerator = sourceType === GRAPH_ELEMENTS_TYPE.PG_STEP;
  const showLinkIcon = hasSiblingEdges && !isSourceGenerator && !isFlowSaveInProgress;
  const showAddIcon = (!isSourceGenerator || (isSourceGenerator && !isTargetRouter)) && !flow._connectorId && !isViewMode && !isFlowSaveInProgress && !isDataLoaderFlow;
  const isMergableEdge = mergableTerminals.includes(dragNodeId);

  /*
  {"points":[{"x":1250,"y":494},{"x":1350,"y":555},{"x":1587.5,"y":555},{"x":1825,"y":555},{"x":1927,"y":421.5}]}

  Example path with hard corners
  M1250,494 L1350,555 L1588,555 L1825,555 L1928,422

  Example path with rounded corners.
  M529,306 L982,306 Q987,306 987,301 L987,92 Q987,87 992,87 L1446,87
  */

  const edgePath = useMemo(() => {
    if (isTargetTerminal && !isSourceRouter) {
      const sp = getSmoothStepPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
      });

      return sp;
    }

    const targetHandle = { x: targetX, y: targetY };

    if (isTargetMerge) {
      targetHandle.x += handleOffset + nodeSize.merge.width / 2;
    }

    const points = snapPointsToHandles(
      {x: sourceX, y: sourceY},
      targetHandle,
      edgePoints,
    );

    let path;
    const current = {x: points[0].x, y: points[0].y};

    const drawLine = (p, axis) => {
      if (p[axis] !== current[axis]) {
        current[axis] = p[axis];
        if (axis === 'x') {
          // eslint-disable-next-line no-param-reassign
          path += `L${p.x},${current.y} `;
        } else {
          // eslint-disable-next-line no-param-reassign
          path += `L${current.x},${p.y} `;
        }
      }
    };

    points.forEach((p, i) => {
      if (i === 0) {
        path = `M${points[0].x},${points[0].y} `;
      } else if (i === 1 && isSourceRouter) { // first line
        // When the source is a router, we want to draw the lines vertically first to branch off
        // the edges asap. Not only for better looks, but also this prevents unwanted overlapping
        // edges in some use-cases.
        drawLine(p, 'y');
        drawLine(p, 'x');
      } else if (i === points.length - 1 && !isTargetMerge) { // last point
        // for the last point (that defines an edge), we want to draw the vertical line first so that
        // a node always connects to a horizontal line since our diagram is L-> R,
        // while all other points should translate to horizontal first (leaving a node)

        // the problem with the above logic is with dotted lines. If the lines are
        // not all the same length, then the overlapping edges for a merge node will
        // render the dashes at different offsets and appear as a solid line. Not
        // sure how to fix this.

        // Also note that if an edge's target is a merge node, then we always want to render
        // the x line first, as we don't want overlapping lines when multiple edges share the
        // same final y position.

        drawLine(p, 'y');
        drawLine(p, 'x');
      } else {
        drawLine(p, 'x');
        drawLine(p, 'y');
      }
    });

    return path;
  }, [edgePoints,
    isSourceRouter,
    isTargetMerge,
    isTargetTerminal,
    sourcePosition,
    sourceX,
    sourceY,
    targetPosition,
    targetX,
    targetY]);

  const handleMouseOut = useCallback(() => {
    dispatch(actions.flow.mergeTargetClear(flow._id));
  }, [dispatch, flow._id]);

  const handleMouseOver = useCallback(() => {
    dispatch(actions.flow.mergeTargetSet(flow._id, 'edge', id));
  }, [dispatch, flow._id, id]);

  const { position, offset } =
    getPositionAndOffset(targetType, sourceType, showLinkIcon, processorCount);

  return (
    <>
      <path
        id={id}
        style={style}
        className={classes.edgePath}
        d={edgePath}
      />

      {isDragging && isMergableEdge && (
        <ForeignObject
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
          edgePath={edgePath}
          position="center"
          size={34}>
          <DiamondMergeIcon isDroppable />
        </ForeignObject>
      )}

      {!isDragging && showAddIcon && (
        <ForeignObject edgePath={edgePath} position={position} offset={offset}>
          <AddNewButton edgeId={id} />
        </ForeignObject>
      )}

      {!isDragging && showLinkIcon && (
        <ForeignObject edgePath={edgePath} position={position} offset={offset + 40}>
          <UnlinkButton edgeId={id} />
        </ForeignObject>
      )}
    </>
  );
}
