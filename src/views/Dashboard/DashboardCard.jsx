import React, { useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { isEqual, difference } from 'lodash';
import { makeStyles } from '@material-ui/core/styles';
import { selectors } from '../../reducers';
import actions from '../../actions';
import { getTileId } from './util';
import Tile from './Tile';
import SuiteScriptTile from './SuiteScriptTile';
import SortableList from '../../components/Sortable/SortableList';
import SortableItem from '../../components/Sortable/SortableItem';
import useSortableList from '../../hooks/useSortableList';

const useStyles = makeStyles(theme => ({
  container: {
    padding: theme.spacing(2),
    maxHeight: `calc(100vh - (${theme.appBarHeight}px + ${theme.spacing(2)}px + ${theme.pageBarHeight}px))`,
    overflowY: 'auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr));',
    gridGap: theme.spacing(2),
    position: 'relative',
    '& > div': {
      maxWidth: '100%',
    },
    [theme.breakpoints.down('xs')]: {
      gridTemplateColumns: 'repeat(1, minmax(100%, 1fr));',
    },
    [theme.breakpoints.up('xs')]: {
      gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr));',
    },
  },
}));

export default function DashboardCard({ sortedTiles }) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const preferences = useSelector(state => selectors.userPreferences(state));
  const tilesFromOtherEnvironment = useMemo(() => {
    const allSortedTileIds =
      (preferences.dashboard && preferences.dashboard.tilesOrder) || [];
    const tileIdsFromCurrEnvironment = sortedTiles.map(tile => getTileId(tile));

    return difference(allSortedTileIds, tileIdsFromCurrEnvironment);
  }, [preferences.dashboard, sortedTiles]);

  const onSortEnd = useCallback(({oldIndex, newIndex}) => {
    const updatedDashboardTiles = [...sortedTiles];
    const [removed] = updatedDashboardTiles.splice(oldIndex, 1);

    updatedDashboardTiles.splice(newIndex, 0, removed);
    if (isEqual(sortedTiles, updatedDashboardTiles)) return;
    // Updated Tiles order merged tiles from other environment and also existing tiles with updated order
    const updatedTilesOrder = updatedDashboardTiles.map(tile => getTileId(tile));
    const dashboard = {
      ...preferences.dashboard,
      tilesOrder: [...tilesFromOtherEnvironment, ...updatedTilesOrder],
    };

    dispatch(actions.user.preferences.update({ dashboard }));
    // setIsDragging(false);
  }, [dispatch, preferences.dashboard, sortedTiles, tilesFromOtherEnvironment]);

  const {dragItemIndex, handleSortStart, handleSortEnd} = useSortableList(onSortEnd);

  return (
    <>
      <SortableList
        className={classes.container}
        onSortEnd={handleSortEnd}
        updateBeforeSortStart={handleSortStart}
        axis="xy"
        useDragHandle>
        {sortedTiles.map((t, index) => (
          <SortableItem
            key={getTileId(t)}
            index={index}
            hideSortableGhost={false}
            value={(
              <div data-public>
                {t.ssLinkedConnectionId ? (
                  <SuiteScriptTile
                    tile={t}
                    index={index}
                    isDragInProgress={dragItemIndex !== undefined}
                    isTileDragged={dragItemIndex === index}
                  />
                ) : (
                  <Tile
                    tile={t}
                    index={index}
                    isDragInProgress={dragItemIndex !== undefined}
                    isTileDragged={dragItemIndex === index}
                  />
                )}
              </div>
            )}
          />
        ))}
      </SortableList>
    </>
  );
}

