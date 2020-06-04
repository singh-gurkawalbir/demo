import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { isEqual, difference } from 'lodash';
import { userPreferences } from '../../reducers';
import actions from '../../actions';
import { getTileId } from './util';
import Tile from './Tile';
import SuiteScriptTile from './SuiteScriptTile';

export default function DashboardCard({ sortedTiles }) {
  const dispatch = useDispatch();
  const preferences = useSelector(state => userPreferences(state));
  const tilesFromOtherEnvironment = useMemo(() => {
    const allSortedTileIds =
      (preferences.dashboard && preferences.dashboard.tilesOrder) || [];
    const tileIdsFromCurrEnvironment = sortedTiles.map(tile => getTileId(tile));

    return difference(allSortedTileIds, tileIdsFromCurrEnvironment);
  }, [preferences.dashboard, sortedTiles]);
  const [dashboardTiles, setDashboardTiles] = useState(sortedTiles);

  useEffect(() => {
    setDashboardTiles(sortedTiles);
  }, [sortedTiles]);

  // Updated tiles list on each move of tile, so that user can see the list getting updated

  const handleMove = useCallback(
    (dragIndex, hoverIndex) => {
      const updatedDashboardTiles = [...dashboardTiles];
      const dragItem = updatedDashboardTiles[dragIndex];

      updatedDashboardTiles.splice(dragIndex, 1);
      updatedDashboardTiles.splice(hoverIndex, 0, dragItem);

      setDashboardTiles(updatedDashboardTiles);
    },
    [dashboardTiles]
  );
  // On Drop of tile, update the preferences with the updatedTilesOrder
  const handleDrop = useCallback(() => {
    if (isEqual(sortedTiles, dashboardTiles)) return;
    // Updated Tiles order merged tiles from other environment and also existing tiles with updated order
    const updatedTilesOrder = dashboardTiles.map(tile => getTileId(tile));
    const dashboard = {
      ...preferences.dashboard,
      tilesOrder: [...tilesFromOtherEnvironment, ...updatedTilesOrder],
    };

    dispatch(actions.user.preferences.update({ dashboard }));
  }, [
    dashboardTiles,
    dispatch,
    preferences,
    sortedTiles,
    tilesFromOtherEnvironment,
  ]);

  return (
    <>
      {dashboardTiles.map((t, index) => (
        <div key={getTileId(t)}>
          {t._ioConnectionId ? (
            <SuiteScriptTile
              tile={t}
              index={index}
              onMove={handleMove}
              onDrop={handleDrop}
            />
          ) : (
            <Tile
              tile={t}
              index={index}
              onMove={handleMove}
              onDrop={handleDrop}
            />
          )}
        </div>
      ))}
    </>
  );
}
