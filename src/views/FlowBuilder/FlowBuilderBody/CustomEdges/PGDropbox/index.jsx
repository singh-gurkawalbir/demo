import React from 'react';
import { useDrop } from 'react-dnd';
import itemTypes from '../../../itemTypes';
import DropIcon from '../../DropIcon';

const isAdjacent = (sourceIndex, targetIndex, position) => {
  if (position === 'middle') {
    return sourceIndex === targetIndex || sourceIndex === targetIndex - 1;
  }

  return false;
};

function PGDropbox({ id, show, position, targetIndex }) {
  const [{ canDrop, isOver, isDragging, itemType, item }, drop] = useDrop(() => ({
    accept: itemTypes.PAGE_GENERATOR,
    drop: item => {
      let tIndex = targetIndex;

      if (position === 'top') {
        tIndex = 0;
      } else if (position === 'middle') {
        tIndex = targetIndex - 1;
        if (item.index > targetIndex) {
          tIndex = targetIndex;
        }
      }

      return ({
        sourceId: item.id,
        targetIndex: tIndex,
        itemType: itemTypes.PAGE_GENERATOR,
        sourceIndex: item.index,
        position,
      });
    },
    collect: monitor => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
      canDropOnTarget: true,
      isDragging: monitor.getInitialClientOffset() !== null,
      itemType: monitor.getItemType(),
      item: monitor.getItem(),
    }),
  }), [id, show, position, targetIndex]);

  const isActive = canDrop && isOver;

  const shouldShowDropBox = !!isDragging && // should show hotspot only when dragging is in progress
    itemTypes.PAGE_GENERATOR === itemType && // should match the drop itemType to drag itemType
    id !== item.id && // should not drop the item in to its own hotspot
    show && // valid dropspot
   !isAdjacent(item?.index, targetIndex, position); // should not drop to the left or right of itself

  return shouldShowDropBox ? <DropIcon data-test={`drop=${item.id}-pg`} ref={drop} isActive={isActive} /> : null;
}
export default React.memo(PGDropbox);
