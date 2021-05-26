import React, { useCallback, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { isEqual, difference } from 'lodash';
import { SortableContainer, SortableElement } from 'react-sortable-hoc';
import { makeStyles } from '@material-ui/core/styles';
import { selectors } from '../../reducers';
import actions from '../../actions';
import { getTileId } from './util';
import Tile from './Tile';
import SuiteScriptTile from './SuiteScriptTile';

const useStyles = makeStyles(theme => ({
  container: {
    padding: theme.spacing(2),
    maxHeight: `calc(100vh - (${theme.appBarHeight}px + ${theme.spacing(2)}px + ${theme.pageBarHeight}px))`,
    overflowY: 'auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr));',
    gridGap: theme.spacing(2),
    position: 'relative',
    marginInlineStart: 0,
    marginBlockStart: 0,
    marginBlockEnd: 0,
    listStyleType: 'none',
    '& > li': {
      listStyle: 'none',
    },
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
  helperClass: {
    listStyleType: 'none',
    zIndex: '999999',
  },
}));

const SortableItem = SortableElement(({value}) => (<li>{value}</li>));
const SortableList = SortableContainer(({children, className}) => <ul className={className}>{children}</ul>);
export default function DashboardCard({ sortedTiles }) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [dragState, setDragState] = useState({
    isDragging: false,
    itemIndex: undefined,
  });
  const preferences = useSelector(state => selectors.userPreferences(state));
  const tilesFromOtherEnvironment = useMemo(() => {
    const allSortedTileIds =
      (preferences.dashboard && preferences.dashboard.tilesOrder) || [];
    const tileIdsFromCurrEnvironment = sortedTiles.map(tile => getTileId(tile));

    return difference(allSortedTileIds, tileIdsFromCurrEnvironment);
  }, [preferences.dashboard, sortedTiles]);

  const handleSortEnd = useCallback(({oldIndex, newIndex}) => {
    setDragState({isDragging: false, itemIndex: undefined});
    if (oldIndex !== newIndex) {
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
    }
    // setIsDragging(false);
  }, [dispatch, preferences.dashboard, sortedTiles, tilesFromOtherEnvironment]);

  const handleSortStart = ({ index }) => {
    setDragState({isDragging: true, itemIndex: index});
  };

  return (
    <>
      <SortableList
        className={classes.container}
        onSortEnd={handleSortEnd}
        updateBeforeSortStart={handleSortStart}
        axis="xy"
        helperClass={classes.helperClass}
        useDragHandle
      >
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
                    isDragInProgress={dragState.isDragging}
                    isTileDragged={dragState.itemIndex === index}
                  />
                ) : (
                  <Tile
                    tile={t}
                    index={index}
                    isDragInProgress={dragState.isDragging}
                    isTileDragged={dragState.itemIndex === index}
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

