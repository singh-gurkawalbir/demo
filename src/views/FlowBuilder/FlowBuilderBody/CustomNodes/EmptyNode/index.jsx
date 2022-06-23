import React from 'react';
import { Position } from 'react-flow-renderer';
import DefaultHandle from '../Handles/DefaultHandle';

export default function EmptyNode() {
  return (
    <div >
      <DefaultHandle type="target" position={Position.Left} />
      <div>.</div>
      <DefaultHandle type="source" position={Position.Right} />
    </div>
  );
}
