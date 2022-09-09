import sortBy from 'lodash/sortBy';
import { CONNECTORS_TO_IGNORE, TILE_STATUS } from '../../constants';
import {applicationsList} from '../../constants/applications';
import { getTextAfterCount } from '../string';
import { stringCompare } from '../sort';

export const FILTER_KEY = 'homeTiles';
export const LIST_VIEW = 'list';
export const TILE_VIEW = 'tile';

export const getAllApplications = () => {
  // some connectors are not shown in the UI because they are temporarily
  // created in UI session to handle single assistant, multiple metadata use case. ref: IO-16839
  let applications = applicationsList()
    .filter(app => !CONNECTORS_TO_IGNORE.includes(app.id));

  const defaultFilter = [{ _id: 'all', name: 'All applications'}];

  applications = sortBy(applications, app => app.name.toLowerCase());

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
      label = getTextAfterCount('error', numError);
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

export const tileCompare = (sortProperty, isDescending) => (tileA, tileB) => {
  // comparer function used for sorting tiles
  // tile should have properties: status, numError, offlineConnections which will be used for comparing
  // returns +ve value if tileA should be given higher priority else -ve value is returned

  // only applicable when sorting by status
  if (sortProperty !== 'status') {
    return stringCompare(sortProperty, isDescending)(tileA, tileB);
  }

  const { status: statusA, numError: numErrorA = 0, offlineConnections: offlineConnectionsA } = tileA || {};
  const { status: statusB, numError: numErrorB = 0, offlineConnections: offlineConnectionsB } = tileB || {};

  const numOfflineConnectionsA = offlineConnectionsA?.length || 0;
  const numOfflineConnectionsB = offlineConnectionsB?.length || 0;

  const totalErrorCountA = numOfflineConnectionsA + numErrorA;
  const totalErrorCountB = numOfflineConnectionsB + numErrorB;
  let compareValue = totalErrorCountA - totalErrorCountB;

  // connection errors should be given higher priority
  if (compareValue === 0) {
    compareValue = numOfflineConnectionsA - numOfflineConnectionsB;
  }

  // should give high priority to tile with more error count
  // tiles with same status with 0 error count cannot be compared
  if (compareValue !== 0 || statusA === statusB) return isDescending ? -compareValue : compareValue;

  // successful tiles should be given higher priority than pending setup/uninstall tiles
  if (statusA === TILE_STATUS.SUCCESS) {
    return isDescending ? -1 : 1;
  }
  if (statusB === TILE_STATUS.SUCCESS) {
    return isDescending ? 1 : -1;
  }

  // pending setup tiles should be given higher priority than pending uninstall tiles
  if (statusA === TILE_STATUS.IS_PENDING_SETUP) {
    return isDescending ? -1 : 1;
  }
  if (statusB === TILE_STATUS.IS_PENDING_SETUP) {
    return isDescending ? 1 : -1;
  }

  // default: should give high priority to tile with more error count
  return isDescending ? -compareValue : compareValue;
};
