/* eslint-disable react-hooks/exhaustive-deps */
import { forwardRef, useCallback, useEffect } from 'react';
import { throttle } from 'lodash';
import { useDragDropManager } from 'react-dnd';
import { useFlowContext } from '../Context';

const SCROLL_ZONE_WIDTH = 30;

function AutoScroll({ rfInstance }, ref) {
  const dragDropManager = useDragDropManager();
  const item = dragDropManager.getMonitor().getItem();
  const {translateExtent} = useFlowContext();

  const eventHandler = useCallback(throttle(e => {
    const rect = ref.current?.getBoundingClientRect();
    const {x, y, width, height} = rect;
    const leftX = x;
    const rightX = x + width;
    const topY = y;
    const bottomY = y + height;
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    if (!rfInstance) return;
    const { viewport } = rfInstance.toObject();
    const { zoom } = viewport;

    if (Number.isNaN(viewport?.x) || Number.isNaN(viewport?.y)) return;
    if (mouseX === 0 && mouseY === 0) return; // mouse is outside the view
    if (!Array.isArray(translateExtent) || translateExtent.length !== 2) return;
    const {x: projectedX, y: projectedY} = rfInstance.project({x: mouseX, y: mouseY});

    if (projectedX < translateExtent[0][0]) return;
    if (projectedX > (translateExtent[1][0] + 100)) return;
    if (projectedY < translateExtent[0][1]) return;
    if (projectedY > translateExtent[1][1]) return;

    if (mouseX > (leftX - SCROLL_ZONE_WIDTH) && mouseX < (leftX + SCROLL_ZONE_WIDTH)) {
      const newX = viewport?.x + 25;
      const newY = viewport?.y;

      rfInstance.setTransform({x: newX, y: newY, zoom});
    } else if (mouseX > rightX - SCROLL_ZONE_WIDTH && mouseX < rightX) {
      const newX = viewport?.x - 25;
      const newY = viewport?.y;

      rfInstance.setTransform({x: newX, y: newY, zoom});
    } else if (mouseY < topY + SCROLL_ZONE_WIDTH) {
      const newX = viewport?.x;
      const newY = viewport?.y + 25;

      rfInstance.setTransform({x: newX, y: newY, zoom});
    } else if (mouseY > (bottomY - SCROLL_ZONE_WIDTH)) {
      const newX = viewport?.x;
      const newY = viewport?.y - 25;

      rfInstance.setTransform({x: newX, y: newY, zoom});
    }
  }, 100), [rfInstance, ref, item]);

  useEffect(() => {
    const parentDiv = ref.current;

    if (parentDiv) {
      parentDiv.addEventListener('dragover', eventHandler);
    }

    return () => {
      parentDiv.removeEventListener('dragover', eventHandler);
    };
  }, [rfInstance, ref]);

  return null;
}
export default forwardRef(AutoScroll);

