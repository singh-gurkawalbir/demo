import React, {useMemo} from 'react';
import { getPositionInEdge } from '../../lib';

export default function ForeignObject({edgePath, position, offset = 0, size = 28, children, ...rest}) {
  const [edgeX, edgeY] = useMemo(() =>
    getPositionInEdge(edgePath, position, offset) || [], [edgePath, position, offset]);

  return (
    <foreignObject
      {...rest}
      style={{zIndex: 9999, position: 'absolute'}}
      width={size}
      height={size}
      x={edgeX - size / 2}
      y={edgeY - size / 2}
      requiredExtensions="http://www.w3.org/1999/xhtml">
      {children}
    </foreignObject>
  );
}
