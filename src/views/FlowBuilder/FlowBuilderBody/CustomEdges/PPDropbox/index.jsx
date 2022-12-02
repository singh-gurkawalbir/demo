import React from 'react';
import { useDrop } from 'react-dnd';
import itemTypes from '../../../itemTypes';
import { useFlowContext } from '../../Context';
import DropIcon from '../../DropIcon';

const isAdjacent = (sourceId, targetId, elementsMap, position) => {
  if (position === 'right') {
    return !!elementsMap[`${targetId}-${sourceId}`];
  }

  return !!elementsMap[`${sourceId}-${targetId}`];
};

function PPDropbox({ id, show, path, position, targetIndex }) {
  const {elementsMap} = useFlowContext();

  const [{ canDrop, isOver, isDragging, itemType, item }, drop] = useDrop(() => ({
    accept: itemTypes.PAGE_PROCESSOR,
    drop: item => ({
      sourceId: item.id,
      targetId: id,
      targetPath: path,
      sourcePath: item.path,
      sourceIndex: +item.pageProcessorIndex,
      targetIndex: +targetIndex,
      position,
    }),
    collect: monitor => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
      isDragging: monitor.getInitialClientOffset() !== null,
      itemType: monitor.getItemType(),
      item: monitor.getItem(),
    }),
  }), [targetIndex]);

  const isActive = canDrop && isOver;
  const shouldShowDropBox = !!isDragging && // should show hotspot only when dragging is in progress
    itemTypes.PAGE_PROCESSOR === itemType && // should match the drop itemType to drag itemType
    id !== item.id && // should not hotspot of own item
    show && // valid dropspot
    !isAdjacent(item.id, id, elementsMap, position); // should not drop to the left or right of itself

  return shouldShowDropBox ? <DropIcon data-test={`drop=${item.id}-${position}`} ref={drop} isActive={isActive} /> : null;
}
export default PPDropbox;
