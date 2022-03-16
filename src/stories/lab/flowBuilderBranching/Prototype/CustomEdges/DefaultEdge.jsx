import React, {useMemo} from 'react';
import { getSmoothStepPath, getMarkerEnd } from 'react-flow-renderer';
import { makeStyles } from '@material-ui/core';
import { handleOffset, nodeSize, areMultipleEdgesConnectedToSameEdgeTarget, snapPointsToHandles } from '../lib';
import { useFlowContext } from '../Context';
import AddNewButton from './AddNewButton';
import UnlinkButton from './UnlinkButton';
import ForeignObject from './ForeignObject';

const useStyles = makeStyles(theme => ({
  edgePath: {
    strokeDasharray: 4,
    strokeWidth: 2,
    stroke: theme.palette.secondary.lightest, // celigo neutral 3
    fill: 'none',
  },
}));

const BranchLabel = (
  {id, branchName}

) => {
  if (!branchName) {
    return null;
  }

  return (
    <text>
      <textPath href={`#${id}`} startOffset="25%">
        {branchName}
      </textPath>
    </text>
  );
};

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
  arrowHeadType,
  markerEndId,
}) {
  const classes = useStyles();
  const { elements } = useFlowContext();
  const hasSiblingEdges = useMemo(() => areMultipleEdgesConnectedToSameEdgeTarget(id, elements), [id, elements]);
  const { sourceType, targetType, points: edgePoints } = data;
  const isMerge = targetType === 'merge';
  const isSource = sourceType === 'pg';
  const isTerminal = targetType.includes('terminal');
  const showLinkIcon = hasSiblingEdges && !isSource;
  const showAddIcon = !isSource;

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

    if (isMerge) {
      targetHandle.x += handleOffset + nodeSize.merge.width / 2;

      console.log({
        source: { sourceX, sourceY },
        target: { targetX, targetY },
        targetHandle,
      });
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
      } else
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
      if (i === points.length - 1 && !isMerge) { // last point
        drawLine(p, 'y');
        drawLine(p, 'x');
      } else {
        drawLine(p, 'x');
        drawLine(p, 'y');
      }
    });

    return path;
  }, [edgePoints, isMerge, isTerminal, sourcePosition, sourceX, sourceY, targetPosition, targetX, targetY]);

  const markerEnd = useMemo(() =>
    getMarkerEnd(arrowHeadType, markerEndId), [arrowHeadType, markerEndId]);

  return (
    <>
      <path
        id={id}
        style={style}
        className={classes.edgePath}
        d={edgePath}
        markerEnd={markerEnd}
      />

      <BranchLabel id={id} branchName={data?.branch} />
      {showAddIcon && (
        <ForeignObject edgePath={edgePath} centerOffset={showLinkIcon ? -10 : 10}>
          <AddNewButton edgeId={id} />
        </ForeignObject>
      )}

      {showLinkIcon && (
        <ForeignObject edgePath={edgePath} centerOffset={30}>
          <UnlinkButton edgeId={id} />
        </ForeignObject>
      )}
    </>
  );
}
