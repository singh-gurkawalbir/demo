import { sortBy } from 'lodash';

export default function sortTiles(tiles, tilesOrder = []) {
  let maxIndex = Math.max(tiles.length, tilesOrder.length);
  let tileId;
  let tileIndex;
  let tilesWithOrder = tiles.map(t => {
    tileId = t._id || t._integrationId;
    tileIndex = tilesOrder.indexOf(tileId);

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
