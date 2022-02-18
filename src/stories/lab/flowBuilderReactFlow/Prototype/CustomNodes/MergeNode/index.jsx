import React from 'react';
import { Position } from 'react-flow-renderer';
import Icon from './DiamondIcon';
import DefaultHandle from '../Handles/DefaultHandle';
import { useIsTerminalOrMergeNodeDroppable } from '../TerminalNode';

export default function MergeNode({id}) {
  const isDroppable = useIsTerminalOrMergeNodeDroppable(id);

  return (
    <div>
      <DefaultHandle type="target" position={Position.Left} />

      <Icon isDroppable={isDroppable} />

      <DefaultHandle type="source" position={Position.Right} />

    </div>
  );
}
