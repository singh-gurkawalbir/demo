import { sortBy } from 'lodash';
import { TILE_STATUS } from '../../utils/constants';

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

export function suiteScriptTileName(tile) {
  let name;

  if (tile.name && tile.name.indexOf('Amazon') === 0) {
    name = `${tile.name} - NetSuite Connector`;
  } else {
    switch (tile.name) {
      case 'Salesforce Connector':
        name = 'Salesforce - NetSuite Connector';
        break;
      case 'SVB Connector':
        name = 'SVB - NetSuite Connector';
        break;
      case 'eBay':
      case 'Google Shopping':
      case 'Magento':
      case 'Newegg':
      case 'Nextag':
      case 'Rakuten':
      case 'Sears':
        name = `${tile.name} - NetSuite Connector`;
        break;
      default:
        ({ name } = tile);
    }
  }

  return name;
}

export const dragTileConfig = (index, onDrop) => ({
  item: { type: 'TILE', index },
  collect: monitor => ({
    isDragging: monitor.isDragging(),
  }),
  end: dropResult => {
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
