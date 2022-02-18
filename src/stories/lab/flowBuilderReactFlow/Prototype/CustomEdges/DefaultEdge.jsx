import React, {useMemo} from 'react';
import { getSmoothStepPath, getEdgeCenter, getMarkerEnd } from 'react-flow-renderer';
import { makeStyles } from '@material-ui/core';
import AddNewButton from './AddNewButton';
import { getPositionInEdge } from '../lib';
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
export default function LinkedEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  // data,
  arrowHeadType,
  markerEndId,
}) {
  const classes = useStyles();

  const edgePath = useMemo(() => getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  }), [sourcePosition, sourceX, sourceY, targetPosition, targetX, targetY]);
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
