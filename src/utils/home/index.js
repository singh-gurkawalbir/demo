import sortBy from 'lodash/sortBy';
import { TILE_STATUS } from '../constants';
import {applicationsList} from '../../constants/applications';

export const FILTER_KEY = 'homeTiles';
export const LIST_VIEW = 'list';
export const TILE_VIEW = 'tile';

export const getAllApplications = () => {
  let applications = applicationsList();
  const defaultFilter = [{ _id: 'all', name: 'All applications'}];

  applications = sortBy(applications, ['name']);

  const options = applications.map(a => ({_id: a.id, name: a.name}));

  return [...defaultFilter, ...options];
};

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
  const { status, numError } = tile || {};
  let label;
  let variant;

  switch (status) {
    case TILE_STATUS.IS_PENDING_SETUP:
      label = 'Continue setup >';
      variant = 'warning';
      break;
    case TILE_STATUS.UNINSTALL:
      label = 'Continue uninstall >';
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

export const getTileId = tile => {
  if (!tile) return '';

  return tile.ssLinkedConnectionId
    ? `${tile.ssLinkedConnectionId}_${tile._integrationId}`
    : tile._integrationId;
};

export const getStatusSortableProp = tile => {
  const { status, numError = 0, offlineConnections } = tile || {};
  let statusSortableProp = 0;

  if (offlineConnections?.length) {
    statusSortableProp = offlineConnections.length;
  }

  switch (status) {
    case TILE_STATUS.IS_PENDING_SETUP:
      statusSortableProp = -1;
      break;
    case TILE_STATUS.UNINSTALL:
      statusSortableProp = -2;
      break;
    case TILE_STATUS.HAS_ERRORS:
      statusSortableProp += numError;
      break;
    default:
  }

  return statusSortableProp;
};
