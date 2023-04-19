import React, { useCallback, useMemo } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { useDispatch, useSelector } from 'react-redux';
import { useDragDropManager } from 'react-dnd';
import {
  handleOffset,
  nodeSize,
  areMultipleEdgesConnectedToSameEdgeTarget,
  snapPointsToHandles,
  getEdgeStepPath,
} from '../../lib';
import { useFlowContext } from '../../Context';
import AddNewButton from '../AddNewButton';
import UnlinkButton from '../UnlinkButton';
import ForeignObject from '../ForeignObject';
import { selectors } from '../../../../../reducers';
import DiamondMergeIcon from '../../DiamondMergeIcon';
import actions from '../../../../../actions';
import { emptyObject, GRAPH_ELEMENTS_TYPE } from '../../../../../constants';
import { isVirtualRouter } from '../../../../../utils/flows/flowbuilder';
import { useIsDragInProgress } from '../../../hooks';
import PGDropbox from '../PGDropbox';
import itemTypes from '../../../itemTypes';

const useStyles = makeStyles(theme => ({
  edgePath: {
    strokeDasharray: 4,
    strokeWidth: 2,
    stroke: theme.palette.secondary.lightest, // celigo neutral 3
    fill: 'transparent',
    '&:hover': {
      // temporary rule to help trace overlapping paths.
      stroke: theme.palette.primary.lightest,
    },
  },
}));

function getPositionAndOffset(
  targetType,
  sourceType,
  showLinkIcon,
  processorCount
) {
  let position = 'center';
  let offset = 10;

  if (
    targetType === GRAPH_ELEMENTS_TYPE.PP_STEP &&
    sourceType !== GRAPH_ELEMENTS_TYPE.PP_STEP
  ) {
    // we want the add button to be positioned close to the pp,
    // not close to the merge/router nodes.
    position = 'right';
    offset = 30;
  } else if (
    targetType === GRAPH_ELEMENTS_TYPE.ROUTER &&
    sourceType === GRAPH_ELEMENTS_TYPE.PG_STEP
  ) {
    position = 'right';
    offset = 50;
  } else if (targetType === GRAPH_ELEMENTS_TYPE.TERMINAL &&
    sourceType === GRAPH_ELEMENTS_TYPE.PP_STEP
  ) {
    offset = 40;
  } else if (
    targetType !== GRAPH_ELEMENTS_TYPE.PP_STEP &&
    sourceType === GRAPH_ELEMENTS_TYPE.PP_STEP
  ) {
    position = 'left';
    offset = 70;
  } else if (targetType === GRAPH_ELEMENTS_TYPE.EMPTY) {
    position = 'right';
    offset = 10;
  } else if (sourceType === GRAPH_ELEMENTS_TYPE.EMPTY) {
    position = 'left';
    offset = -20;
  } else if (
    targetType === GRAPH_ELEMENTS_TYPE.TERMINAL &&
    sourceType === GRAPH_ELEMENTS_TYPE.ROUTER
  ) {
    position = 'right';
    offset = 105;
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

  return { position, offset };
}

function DefaultEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = emptyObject,
  data,
}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { elements, dragNodeId, flow, flowId } = useFlowContext();
  const hasSiblingEdges = useMemo(
    () => areMultipleEdgesConnectedToSameEdgeTarget(id, elements),
    [id, elements]
  );

  const isDraggingInProgress = useIsDragInProgress();
  const dragDropManager = useDragDropManager();
  const itemType = dragDropManager?.getMonitor()?.getItemType();
  const item = dragDropManager?.getMonitor()?.getItem();
  const hasMultiplePGs = flow.pageGenerators?.length > 1;
  const showDropBox = hasMultiplePGs && itemType === itemTypes.PAGE_GENERATOR && item?.id !== data.sourceId;
  const firstPGId = flow.pageGenerators?.[0]?.id;
  const targetIndex = flow.pageGenerators.findIndex(pg => pg.id === data.sourceId);
  const lastPGId = flow.pageGenerators[flow.pageGenerators?.length - 1].id;
  const isFirstPGEdge = data.sourceId === firstPGId;
  const isLastPGEdge = data.sourceId === lastPGId;
  const showDropSpot = (isFirstPGEdge && item?.id !== firstPGId) || (isLastPGEdge && item?.id !== lastPGId);

  const isViewMode = useSelector(state =>
    selectors.isFlowViewMode(state, flow._integrationId, flowId)
  );
  const isFlowSaveInProgress = useSelector(state =>
    selectors.isFlowSaveInProgress(state, flowId)
  );
  const isDataLoaderFlow = useSelector(state =>
    selectors.isDataLoaderFlow(state, flowId)
  );

  const {
    sourceType,
    targetType,
    points: edgePoints,
    processorCount,
    mergableTerminals = [],
  } = data;
  const isDragging = !!dragNodeId;
  const isTargetMerge = targetType === GRAPH_ELEMENTS_TYPE.MERGE;
  const isTargetTerminal = targetType === GRAPH_ELEMENTS_TYPE.TERMINAL;
  const isSourceRouter = sourceType === GRAPH_ELEMENTS_TYPE.ROUTER;
  const isTargetRouter = targetType === GRAPH_ELEMENTS_TYPE.MERGE;
  const isSourceGenerator = sourceType === GRAPH_ELEMENTS_TYPE.PG_STEP;

  const isSourceEmptyNode = sourceType === GRAPH_ELEMENTS_TYPE.EMPTY;
  const showLinkIcon =
    hasSiblingEdges && !isSourceGenerator && !isFlowSaveInProgress && !isViewMode;
  const showAddIcon =
    (!isSourceGenerator || (isSourceGenerator && !isTargetRouter)) &&
    !flow._connectorId &&
    !isViewMode &&
    !isFlowSaveInProgress &&
    !isDataLoaderFlow &&
    (targetIndex <= 1) &&
    !isSourceEmptyNode;
  const isMergableEdge =
    mergableTerminals.includes(dragNodeId) && !isFlowSaveInProgress;
  const maxRoutersLimitReached = flow.routers.filter(r => !isVirtualRouter(r)).length >= 25;

  /*
  {"points":[{"x":1250,"y":494},{"x":1350,"y":555},{"x":1587.5,"y":555},{"x":1825,"y":555},{"x":1927,"y":421.5}]}
  Example path with hard corners
  M1250,494 L1350,555 L1588,555 L1825,555 L1928,422
  Example path with rounded corners.
  M529,306 L982,306 Q987,306 987,301 L987,92 Q987,87 992,87 L1446,87
  */
  const edgePath = useMemo(() => {
    if (isTargetTerminal && !isSourceRouter) {
      return getEdgeStepPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
      });
    }

    const targetHandle = { x: targetX, y: targetY };

    if (isTargetMerge) {
      targetHandle.x += handleOffset + nodeSize.merge.width / 2;
    }

    const points = snapPointsToHandles(
      { x: sourceX, y: sourceY },
      targetHandle,
      edgePoints
    );

    let path;
    const current = { x: points[0].x, y: points[0].y };

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
      } else if (i === 1 && isFirstPGEdge && isDraggingInProgress && showDropBox) {
        drawLine(p, 'x');
        drawLine(p, 'y');
        drawLine({x: current.x, y: current.y - 100}, 'y');
      } else if (i === 1 && isSourceRouter) {
        // first line
        // When the source is a router, we want to draw the lines vertically first to branch off
        // the edges asap. Not only for better looks, but also this prevents unwanted overlapping
        // edges in some use-cases.
        drawLine(p, 'y');
        drawLine(p, 'x');
      } else if (i === 1 && isLastPGEdge && isDraggingInProgress && showDropBox) {
        drawLine(p, 'x');
        drawLine(p, 'y');
        drawLine({x: current.x, y: current.y + 100}, 'y');
      } else if (i === points.length - 1 && !isTargetMerge) {
        // last point
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

        // For pg edges (i.e. targetIndex > 1), the vertical line of the edge will be drawn upto the previous step,
        // and the horizontal line of the edge will be skipped, so that the line will not overlap the pg-dropbox
        if (targetIndex > 1) {
          drawLine({x: p.x, y: p.y + (346 * (targetIndex - 1))}, 'y');
        } else {
          drawLine(p, 'y');
          drawLine(p, 'x');
        }
      } else {
        drawLine(p, 'x');
        drawLine(p, 'y');
      }
    });

    return path;
  }, [isTargetTerminal, isSourceRouter, targetX, targetY, isTargetMerge, sourceX, sourceY, edgePoints, sourcePosition, targetPosition, isFirstPGEdge, isDraggingInProgress, showDropBox, isLastPGEdge, targetIndex]);

  const handleMouseOut = useCallback(() => {
    dispatch(actions.flow.mergeTargetClear(flow._id));
  }, [dispatch, flow._id]);

  const handleMouseOver = useCallback(() => {
    dispatch(actions.flow.mergeTargetSet(flow._id, 'edge', id));
  }, [dispatch, flow._id, id]);

  const { position, offset } = getPositionAndOffset(
    targetType,
    sourceType,
    showLinkIcon,
    processorCount
  );

  return (
    <>
      <path id={id} style={style} className={classes.edgePath} d={edgePath} />
      {isDragging && isMergableEdge && (
        <ForeignObject
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
          edgePath={edgePath}
          position={position}
          offset={offset}
          size={34}
        >
          <DiamondMergeIcon isDroppable />
        </ForeignObject>
      )}
      {
        (
          <foreignObject
            style={{zIndex: 9999, position: 'absolute'}}
            width={34}
            height={35}
            x={edgePoints[1].x - 17}
            y={isFirstPGEdge ? (sourceY - 100 - 17) : sourceY + 100 - 17}
            requiredExtensions="http://www.w3.org/1999/xhtml">
            <PGDropbox
              show={showDropSpot}
              position={isFirstPGEdge ? 'top' : 'bottom'}
              id={data.sourceId}
              targetIndex={targetIndex}
            />
          </foreignObject>
        )
      }
      {
        isSourceGenerator && !isFirstPGEdge && (
          <ForeignObject
            edgePath={edgePath}
            position="left"
            offset={isLastPGEdge ? 400 : 200}
            size={34}
          >
            <PGDropbox
              position="middle"
              show
              targetIndex={targetIndex}
              id={data.sourceId}
              path={data.path}
            />
          </ForeignObject>
        )
      }

      {!isDragging && showAddIcon && (
        <ForeignObject edgePath={edgePath} position={position} offset={offset}>
          <AddNewButton edgeId={id} disabled={maxRoutersLimitReached} />
        </ForeignObject>
      )}

      {!isDragging && showLinkIcon && (
        <ForeignObject
          edgePath={edgePath}
          position={position}
          offset={offset + 40}
        >
          <UnlinkButton edgeId={id} />
        </ForeignObject>
      )}
    </>
  );
}
export default React.memo(DefaultEdge);
