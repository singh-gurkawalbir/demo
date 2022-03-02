import React, {useMemo} from 'react';
import { getPositionInEdge } from '../../lib';

const foreignObjectSize = 22;

export default function ForeignObject({edgePath, offset, children}) {
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
}
