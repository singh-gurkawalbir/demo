import { sortBy } from 'lodash';
import { TILE_STATUS } from '../../utils/constants';
import {addEventListenerForSidebar, removeEventListenerForSidebar} from '../../utils/dndScrollbarHelper';

export function sortTiles(tiles = [], tilesOrder = []) {
  let maxIndex = Math.max(tiles.length, tilesOrder.length);
  let tilesWithOrder = tiles.map(t => {
    const tileId = t._id || t._integrationId;
    let tileIndex = tilesOrder.indexOf(tileId);

    if (tileIndex === -1) {
      maxIndex += 1;
      tileIndex = maxIndex;
    }

    return {
      ...t,
      order: tileIndex,
    };
  });

  tilesWithOrder = sortBy(tilesWithOrder, ['order']).map(t => {
    const { order, ...rest } = t;

    return rest;
  });

  return tilesWithOrder;
}

export function tileStatus(tile) {
  const { status, numError } = tile;
  let label;
  let variant;

  switch (status) {
    case TILE_STATUS.IS_PENDING_SETUP:
      label = 'Continue setup';
      variant = 'warning';
      break;
    case TILE_STATUS.UNINSTALL:
      label = 'Continue uninstall';
      variant = 'warning';
      break;
    case TILE_STATUS.HAS_OFFLINE_CONNECTIONS:
      label = 'Connection down';
      variant = 'error';
      break;
    case TILE_STATUS.HAS_ERRORS:
      label = `${numError} Error${numError > 0 ? 's' : ''}`;
      variant = 'error';
      break;
    default:
      label = 'Success';
      variant = 'success';
  }

  return { label, variant };
}

/*
 * The below utils dragTileConfig and dropTileConfig are used for Tile, SuiteScript Tile Components
 * It supplies required config to support drag and drop functionality among tiles
 */

export const dragTileConfig = (index, onDrop, containerRef) => ({
  item: { type: 'TILE', index },
  collect: monitor => ({
    isDragging: monitor.isDragging(),
  }),
  begin: monitor => {
    // for scrollbar element, need to go three levels up and send element as argument
    addEventListenerForSidebar(containerRef.current?.parentElement?.parentElement?.parentElement);
    return monitor.getItem();
  },
  end: dropResult => {
    removeEventListenerForSidebar();
    if (dropResult) {
      onDrop();
    }
  },

  canDrag: true,
});

export const dropTileConfig = (ref, index, onMove) => ({
  accept: 'TILE',
  hover(item) {
    if (!ref.current) {
      return;
    }

    const dragIndex = item.index;
    const hoverIndex = index;

    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return;
    }

    onMove(dragIndex, hoverIndex);
    // eslint-disable-next-line no-param-reassign
    item.index = hoverIndex;
  },
  collect: monitor => ({
    isOver: monitor.isOver(),
  }),
});

export const getTileId = tile =>
  tile.ssLinkedConnectionId
    ? `${tile.ssLinkedConnectionId}_${tile._integrationId}`
    : tile._integrationId;
