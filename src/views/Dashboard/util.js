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
