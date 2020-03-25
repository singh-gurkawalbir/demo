import { useCallback, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DndProvider } from 'react-dnd-cjs';
import HTML5Backend from 'react-dnd-html5-backend-cjs';
import { isEqual } from 'lodash';
import { userPreferences } from '../../reducers';
import actions from '../../actions';
import Tile from './Tile';
import SuiteScriptTile from './SuiteScriptTile';

export default function DashboardCard({ sortedTiles }) {
  const dispatch = useDispatch();
  const preferences = useSelector(state => userPreferences(state));
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
    const updatedTilesOrder = dashboardTiles.map(tile =>
      tile._ioConnectionId ? tile._id : tile._integrationId
    );
    const dashboard = {
      ...preferences.dashboard,
      tilesOrder: updatedTilesOrder,
    };

    dispatch(
      actions.user.preferences.update({
        ...preferences,
        dashboard,
      })
    );
  }, [dashboardTiles, dispatch, preferences, sortedTiles]);

  return (
    <DndProvider backend={HTML5Backend}>
      {dashboardTiles.map((t, index) => (
        <div key={t._ioConnectionId ? t._id : t._integrationId}>
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
    </DndProvider>
  );
}
