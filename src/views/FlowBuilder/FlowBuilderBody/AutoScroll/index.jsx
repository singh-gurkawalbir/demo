/* eslint-disable react-hooks/exhaustive-deps */
import { forwardRef, useCallback, useEffect } from 'react';
import { throttle } from 'lodash';
import { useDragDropManager } from 'react-dnd';
import { useStoreState } from 'react-flow-renderer';

const SCROLL_ZONE_WIDTH = 30;
const getBoundsOfBoxes = (box1, box2) => ({
  x: Math.min(box1.x, box2.x),
  y: Math.min(box1.y, box2.y),
  x2: Math.max(box1.x2, box2.x2),
  y2: Math.max(box1.y2, box2.y2),
});

const rectToBox = ({ x, y, width, height }) => ({
  x,
  y,
  x2: x + width,
  y2: y + height,
});

const boxToRect = ({ x, y, x2, y2 }) => ({
  x,
  y,
  width: x2 - x,
  height: y2 - y,
});

const getBoundsofRects = (rect1, rect2) =>
  boxToRect(getBoundsOfBoxes(rectToBox(rect1), rectToBox(rect2)));

const getRectOfNodes = (nodes = []) => {
  const box = nodes.reduce(
    (currBox, { __rf: { position, width, height } = {} }) =>
      getBoundsOfBoxes(currBox, rectToBox({ ...position, width, height })),
    { x: Infinity, y: Infinity, x2: -Infinity, y2: -Infinity }
  );

  return boxToRect(box);
};

function AutoScroll({ rfInstance }, ref) {
  const dragDropManager = useDragDropManager();
  const item = dragDropManager.getMonitor().getItem();
  const containerWidth = useStoreState(s => s.width);
  const containerHeight = useStoreState(s => s.height);
  const [tX, tY, tScale] = useStoreState(s => s.transform);
  const viewBB = {
    x: -tX / tScale,
    y: -tY / tScale,
    width: containerWidth / tScale,
    height: containerHeight / tScale,
  };

  const nodes = useStoreState(s => s.nodes);
  const hasNodes = nodes && nodes.length;
  const bb = getRectOfNodes(nodes);
  const boundingRect = hasNodes ? getBoundsofRects(bb, viewBB) : viewBB;

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
    const { position, zoom } = rfInstance.toObject();

    if (Number.isNaN(position[0]) || Number.isNaN(position[1])) return;
    if (mouseX === 0 && mouseY === 0) return; // mouse is outside the view
    const {x: projectedX, y: projectedY} = rfInstance.project({x: mouseX, y: mouseY});

    if (projectedX < boundingRect.x) return;
    if (projectedX > boundingRect.x + boundingRect.width + 50) return;
    if (projectedY < boundingRect.y) return;
    if (projectedY > (boundingRect.y + boundingRect.height + 50)) return;

    if (mouseX > (leftX - SCROLL_ZONE_WIDTH) && mouseX < (leftX + SCROLL_ZONE_WIDTH)) {
      const newX = position[0] + 25;
      const newY = position[1];

      rfInstance.setTransform({x: newX, y: newY, zoom});
    } else if (mouseX > rightX - SCROLL_ZONE_WIDTH && mouseX < rightX) {
      const newX = position[0] - 25;
      const newY = position[1];

      rfInstance.setTransform({x: newX, y: newY, zoom});
    } else if (mouseY < topY + SCROLL_ZONE_WIDTH) {
      const newX = position[0];
      const newY = position[1] + 25;

      rfInstance.setTransform({x: newX, y: newY, zoom});
    } else if (mouseY > (bottomY - SCROLL_ZONE_WIDTH)) {
      const newX = position[0];
      const newY = position[1] - 25;

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

