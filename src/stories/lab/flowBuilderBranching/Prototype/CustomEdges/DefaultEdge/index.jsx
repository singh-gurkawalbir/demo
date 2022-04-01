import React, {useMemo} from 'react';
import { getSmoothStepPath } from 'react-flow-renderer';
import { makeStyles } from '@material-ui/core';
import { handleOffset, nodeSize, areMultipleEdgesConnectedToSameEdgeTarget, snapPointsToHandles, isDragNodeOnSameBranch, GRAPH_ELEMENTS_TYPE } from '../../lib';
import { useFlowContext } from '../../Context';
import AddNewButton from '../AddNewButton';
import UnlinkButton from '../UnlinkButton';
import ForeignObject from '../ForeignObject';
import DiamondIcon from '../../icons/DiamondIcon';
import actions from '../../reducer/actions';

const useStyles = makeStyles(theme => ({
  edgePath: {
    pointerEvents: 'all',
    strokeDasharray: 4,
    strokeWidth: 2,
    stroke: theme.palette.secondary.lightest, // celigo neutral 3
    fill: 'transparent',
    '&:hover': { // temporary rule to help trace overlapping paths.
      stroke: theme.palette.primary.lightest,
    },
  },
}));

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
  const { elements, elementsMap, dragNodeId, setState } = useFlowContext();
  const hasSiblingEdges = useMemo(() => areMultipleEdgesConnectedToSameEdgeTarget(id, elements), [id, elements]);
  const { sourceType, targetType, points: edgePoints } = data;
  const isDragging = !!dragNodeId;
  const isConnectedToMerge = targetType === GRAPH_ELEMENTS_TYPE.MERGE || sourceType === GRAPH_ELEMENTS_TYPE.MERGE;
  const isConnectedToGenerator = sourceType === GRAPH_ELEMENTS_TYPE.PG_STEP;
  const isTargetMerge = targetType === GRAPH_ELEMENTS_TYPE.MERGE;
  const isSourceRouter = sourceType === GRAPH_ELEMENTS_TYPE.ROUTER;
  const isSourceGenerator = sourceType === GRAPH_ELEMENTS_TYPE.PG_STEP;
  const isTerminal = targetType === GRAPH_ELEMENTS_TYPE.TERMINAL;
  const showLinkIcon = hasSiblingEdges && !isSourceGenerator;
  const showAddIcon = !isSourceGenerator;
  const isDragNodeAndEdgeOnSameBranch = isDragNodeOnSameBranch(dragNodeId, id, elementsMap);

  const isMergableEdge = !isTerminal && !isDragNodeAndEdgeOnSameBranch && !isConnectedToMerge && !isConnectedToGenerator;

  /*
  {"points":[{"x":1250,"y":494},{"x":1350,"y":555},{"x":1587.5,"y":555},{"x":1825,"y":555},{"x":1927,"y":421.5}]}

  Example path with hard corners
  M1250,494 L1350,555 L1588,555 L1825,555 L1928,422

  Example path with rounded corners.
  M529,306 L982,306 Q987,306 987,301 L987,92 Q987,87 992,87 L1446,87
  */

  const edgePath = useMemo(() => {
    if (isTerminal) {
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
  }, [edgePoints, isTargetMerge, isTerminal, sourcePosition, sourceX, sourceY, targetPosition, targetX, targetY]);

  const handleMouseOut = () => setState({type: actions.MERGE_TARGET_CLEAR});
  const handleMouseOver = () => setState({
    type: actions.MERGE_TARGET_SET,
    targetType: 'edge',
    targetId: id,
  });

  let position = 'center';
  let offset = 10;

  if (targetType === 'pp' && sourceType !== 'pp') {
    // we want the add button to be positioned close to the pp,
    // not close to the merge/router nodes.
    position = 'right';
    offset = 30;
  } else if (sourceType === 'pp' && targetType !== 'pp') {
    position = 'left';
    offset = 70;
  }

  // The link icon is always rendered in the center, so if it is
  // visible, then the add icon needs to be offset to prevent an overlap.
  if (showLinkIcon && position === 'center') {
    offset = -10;
  }

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
          <DiamondIcon isDroppable />
        </ForeignObject>
      )}

      {!isDragging && showAddIcon && (
        <ForeignObject edgePath={edgePath} position={position} offset={offset}>
          <AddNewButton edgeId={id} />
        </ForeignObject>
      )}

      {!isDragging && showLinkIcon && (
        <ForeignObject edgePath={edgePath} position={position} offset={offset + 30}>
          <UnlinkButton edgeId={id} />
        </ForeignObject>
      )}
    </>
  );
}
