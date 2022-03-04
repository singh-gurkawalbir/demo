import React, {useMemo} from 'react';
import { getSmoothStepPath, getMarkerEnd } from 'react-flow-renderer';
import { makeStyles } from '@material-ui/core';
import { handleOffset, areMultipleEdgesConnectedToSameEdgeTarget } from '../lib';
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
  const shouldShowLinkIcon = useMemo(() => areMultipleEdgesConnectedToSameEdgeTarget(id, elements), [id, elements]);

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

    const {points} = data;

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

      <BranchLabel id={id} branchName={data?.name} />

      <ForeignObject edgePath={edgePath} centerOffset={shouldShowLinkIcon ? -10 : 10}>
        <AddNewButton edgeId={id} />
      </ForeignObject>

      {shouldShowLinkIcon && (
      <ForeignObject edgePath={edgePath} centerOffset={30}>
        <UnlinkButton edgeId={id} />
      </ForeignObject>
      )}
    </>
  );
}
