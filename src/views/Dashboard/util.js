import { sortBy } from 'lodash';

export default function sortTiles(tiles, tilesOrder = []) {
  let maxIndex = Math.max(tiles.length, tilesOrder.length);
  let tileId;
  let tileIndex;
  const tilesWithOrder = tiles.map(t => {
    tileId = t._ioConnectionId ? t._id : t._integrationId;
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

  return sortBy(tilesWithOrder, ['order']);
}
