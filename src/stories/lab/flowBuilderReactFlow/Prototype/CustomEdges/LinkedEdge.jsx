import React from 'react';
import { getSmoothStepPath, getEdgeCenter, getMarkerEnd} from 'react-flow-renderer';
import { makeStyles, IconButton } from '@material-ui/core';
import UnLinkIcon from '../../../../../components/icons/unLinkedIcon';

const foreignObjectSize = 32;

const useStyles = makeStyles(theme => ({
  edgePath: {
    stroke: '#b1b1b7',
    fill: 'none',
  },
  linkButton: {
    backgroundColor: theme.palette.common.white,
    border: `solid 1px ${theme.palette.secondary.light}`,
  },
}));

const onEdgeClick = (evt, id) => {
  evt.stopPropagation();

  // eslint-disable-next-line no-alert
  alert(`Remove node ${id}`);
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

  const edgePath = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });
  const markerEnd = getMarkerEnd(arrowHeadType, markerEndId);
  const [edgeCenterX, edgeCenterY] = getEdgeCenter({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  return (
    <>
      <path
        id={id}
        style={style}
        className={classes.edgePath}
        d={edgePath}
        markerEnd={markerEnd}
      />
      <foreignObject
        width={foreignObjectSize}
        height={foreignObjectSize}
        x={edgeCenterX - foreignObjectSize / 2}
        y={edgeCenterY - foreignObjectSize / 2}
        requiredExtensions="http://www.w3.org/1999/xhtml"
      >
        <IconButton
          size="small"
          className={classes.linkButton}
          onClick={event => onEdgeClick(event, id)}
          >
          <UnLinkIcon />
        </IconButton>
      </foreignObject>
    </>
  );
}
