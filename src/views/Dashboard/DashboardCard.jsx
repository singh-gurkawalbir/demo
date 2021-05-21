import React, { useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { isEqual, difference } from 'lodash';
import {SortableContainer, SortableElement} from 'react-sortable-hoc';
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

const SortableItem = SortableElement(({ value }) => (
  <li>
    {/* <DragHandle className={dragHandleClassName} /> */}
    {value}
  </li>
));
const SortableList = SortableContainer(({ dashboardTiles, dragHandleClassName,
  // , disabled
}) => {
  const classes = useStyles();

  return (
    <ul className={classes.container}>
      {dashboardTiles.map((t, index) => (
        <SortableItem
          key={getTileId(t)}
          dragHandleClassName={dragHandleClassName}
          index={index}
          hideSortableGhost={false}
          value={

          (
            <div data-public key={getTileId(t)}>
              {t.ssLinkedConnectionId ? (
                <SuiteScriptTile
                  tile={t}
                  index={index}
            />
              ) : (
                <Tile
                  tile={t}
                  index={index}
            />
              )}
            </div>
          )
        }

        />

      ))}
    </ul>
  );
});
export default function DashboardCard({ sortedTiles }) {
  const dispatch = useDispatch();
  // const [isDragging, setIsDragging] = useState(false);
  const preferences = useSelector(state => selectors.userPreferences(state));
  const tilesFromOtherEnvironment = useMemo(() => {
    const allSortedTileIds =
      (preferences.dashboard && preferences.dashboard.tilesOrder) || [];
    const tileIdsFromCurrEnvironment = sortedTiles.map(tile => getTileId(tile));

    return difference(allSortedTileIds, tileIdsFromCurrEnvironment);
  }, [preferences.dashboard, sortedTiles]);

  const handleSortEnd = useCallback(({oldIndex, newIndex}) => {
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

  const handleSortStart = () => {
    // setIsDragging(true);
  };

  return (
    <>
      <SortableList
        // helperClass={classes.sortableHelper}
        dashboardTiles={sortedTiles}
        // onSortStart={handleSortEnd}
        onSortEnd={handleSortEnd}
        onSortStart={handleSortStart}
        axis="xy"
        // dragHandleClassName={clsx({[classes.showDragOnHover]: !isDragging})}
        useDragHandle
        />

    </>
  );
}

