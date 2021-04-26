import React, { useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import LoadResources from '../../../components/LoadResources';
import DashboardCard from '../DashboardCard';
import { sortTiles } from '../util';
import { selectors } from '../../../reducers';
import { useSelectorMemo } from '../../../hooks';
import { TILE_STATUS } from '../../../utils/constants';

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

export default function DashboardTiles() {
  const classes = useStyles();
  const tilesOrder = useSelector(
    state => selectors.userPreferences(state)?.dashboard?.tilesOrder);

  const tiles = useSelectorMemo(selectors.mkTiles);
  const ssTiles = useSelector(state => selectors.suiteScriptLinkedTiles(state));
  const suiteScriptLinkedTiles = useMemo(() => ssTiles.filter(t => {
    // only fully configured svb tile should be shown on dashboard
    const isPendingSVB = t._connectorId === 'suitescript-svb-netsuite' && (t.status === TILE_STATUS.IS_PENDING_SETUP || t.status === TILE_STATUS.UNINSTALL);

    return !isPendingSVB;
  }), [ssTiles]);
  const sortedTiles = useMemo(
    () =>
      sortTiles(
        tiles.concat(suiteScriptLinkedTiles),
        tilesOrder
      ),
    [tilesOrder, suiteScriptLinkedTiles, tiles]
  );

  return (

    <LoadResources
      required
      resources="published,integrations,connections,marketplacetemplates">
      <div className={classes.container}>
        <DashboardCard sortedTiles={sortedTiles} />
      </div>
    </LoadResources>
  );
}
