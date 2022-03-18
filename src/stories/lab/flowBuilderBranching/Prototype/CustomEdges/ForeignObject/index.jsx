import React, {useMemo} from 'react';
import { getPositionInEdge } from '../../lib';

const foreignObjectSize = 22;

export default function ForeignObject({edgePath, position, offset, children}) {
  const [edgeX, edgeY] = useMemo(() =>
    getPositionInEdge(edgePath, position, offset) || [], [edgePath, position, offset]);

  return (
    <foreignObject
      width={foreignObjectSize}
      height={foreignObjectSize}
      x={edgeX - foreignObjectSize / 2}
      y={edgeY - foreignObjectSize / 2}
      requiredExtensions="http://www.w3.org/1999/xhtml">
      {children}
    </foreignObject>
  );
}
