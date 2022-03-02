import React, {useMemo} from 'react';
import { getSmoothStepPath, getEdgeCenter, getMarkerEnd } from 'react-flow-renderer';
import { makeStyles } from '@material-ui/core';
import AddNewButton from './AddNewButton';
import { getPositionInEdge, handleOffset } from '../lib';
import UnlinkButton from './UnlinkButton';

const foreignObjectSize = 22;
const UNLINK_POSITION_FRACTION_OF_EDGE_START = 0.6;
const useStyles = makeStyles(theme => ({
  edgePath: {
    strokeDasharray: 4,
    strokeWidth: 2,
    stroke: theme.palette.secondary.lightest, // celigo neutral 3
    fill: 'none',
  },
}));

const AddNewButtonForeignObj = ({
  sourceX,
  sourceY,
  targetX,
  targetY,
  edgeId,
}) => {
  const [edgeCenterX, edgeCenterY] = useMemo(() => getEdgeCenter({
    sourceX,
    sourceY,
    targetX,
    targetY,
  }), [sourceX, sourceY, targetX, targetY]);

  return (
    <foreignObject
      width={foreignObjectSize}
      height={foreignObjectSize}
      x={edgeCenterX - foreignObjectSize / 2}
      y={edgeCenterY - foreignObjectSize / 2}
      requiredExtensions="http://www.w3.org/1999/xhtml"
>
      <AddNewButton edgeId={edgeId} />
    </foreignObject>
  );
};

const UnlinkButtonForeignObj = (
  {edgePath, edgeId}

) => {
  const [unlinkBtnX, unlinkBtnY] = useMemo(() =>
    getPositionInEdge(edgePath, UNLINK_POSITION_FRACTION_OF_EDGE_START) || [], [edgePath]);

  return (

    <foreignObject
      width={foreignObjectSize}
      height={foreignObjectSize}
      x={unlinkBtnX - foreignObjectSize / 2}
      y={unlinkBtnY - foreignObjectSize / 2}
      requiredExtensions="http://www.w3.org/1999/xhtml"
>

      <UnlinkButton edgeId={edgeId} />
    </foreignObject>
  );
};
export default function StepEdge({
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
      <AddNewButtonForeignObj
        sourceX={sourceX}
        sourceY={sourceY}
        targetX={targetX}
        targetY={targetY}
        edgeId={id}
      />
      <UnlinkButtonForeignObj
        edgePath={edgePath}
        edgeId={id}
      />
    </>
  );
}
