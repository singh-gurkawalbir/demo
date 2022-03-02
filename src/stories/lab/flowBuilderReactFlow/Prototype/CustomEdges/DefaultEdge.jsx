import React, {useMemo} from 'react';
import { getSmoothStepPath, getMarkerEnd } from 'react-flow-renderer';
import { makeStyles } from '@material-ui/core';
import AddNewButton from './AddNewButton';
import { getPositionInEdge, handleOffset } from '../lib';
import UnlinkButton from './UnlinkButton';

const foreignObjectSize = 22;
const useStyles = makeStyles(theme => ({
  edgePath: {
    strokeDasharray: 4,
    strokeWidth: 2,
    stroke: theme.palette.secondary.lightest, // celigo neutral 3
    fill: 'none',
  },
}));

const ForeignObject = ({edgePath, offset, children}) => {
  const [edgeCenterX, edgeCenterY] = useMemo(() =>
    getPositionInEdge(edgePath, offset) || [], [edgePath, offset]);

  return (
    <foreignObject
      width={foreignObjectSize}
      height={foreignObjectSize}
      x={edgeCenterX - foreignObjectSize / 2}
      y={edgeCenterY - foreignObjectSize / 2}
      requiredExtensions="http://www.w3.org/1999/xhtml">
      {children}
    </foreignObject>
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

  /*
  {"points":[{"x":1250,"y":494},{"x":1350,"y":555},{"x":1587.5,"y":555},{"x":1825,"y":555},{"x":1927,"y":421.5}]}

  Example path with hard corners
  M1250,494 L1350,555 L1588,555 L1825,555 L1928,422

  Example path with rounded corners.
  M529,306 L982,306 Q987,306 987,301 L987,92 Q987,87 992,87 L1446,87
  */

  const edgePath = useMemo(() => {
    if (data.isTerminal) {
      const sp = getSmoothStepPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
      });

      // console.log(sp);

      return sp;
    }

    // lets skip that and just proof the dagre layout with hard corners.
    const points = [
      // {x: sourceX, y: targetY}, // sourceHandle?
      ...data.points,
      // {x: targetX, y: targetY}, // target handle?
    ];

    // console.log('points including s,t:', points);

    let path;
    let currentX = points[0].x;
    let currentY = points[0].y;

    points.forEach((p, i) => {
      if (i === 0) {
        path = `M${points[0].x},${points[0].y - handleOffset} `;
      } else {
        if (p.x !== currentX) {
          path += `L${p.x},${currentY - handleOffset} `;
          currentX = p.x;
        }
        if (p.y !== currentY) {
          path += `L${currentX},${p.y - handleOffset} `;
          currentY = p.y;
        }
      }
    });

    return path;

    // remove this after debug code is removed.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, sourcePosition, sourceX, sourceY, targetPosition, targetX, targetY]);
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

      <ForeignObject edgePath={edgePath} offset={0.45}>
        <AddNewButton edgeId={id} />
      </ForeignObject>

      <ForeignObject edgePath={edgePath} offset={0.55}>
        <UnlinkButton edgeId={id} />
      </ForeignObject>
    </>
  );
}
