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

export function isTileStatusConnectionDown(tile) {
  // offlineConnections does not exist for suitescript tiles
  // This util is used for IO tiles
  return !!tile.offlineConnections?.length;
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
    case TILE_STATUS.HAS_ERRORS:
      label = `${numError} Error${numError > 1 ? 's' : ''}`;
      variant = 'error';
      break;
    default:
      label = 'Success';
      variant = 'success';
  }

  return { label, variant };
}

export const getTileId = tile =>
  tile.ssLinkedConnectionId
    ? `${tile.ssLinkedConnectionId}_${tile._integrationId}`
    : tile._integrationId;
