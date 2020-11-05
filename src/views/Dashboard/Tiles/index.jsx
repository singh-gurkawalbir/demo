import React, { useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector } from 'react-redux';
import LoadResources from '../../../components/LoadResources';
import DashboardCard from '../DashboardCard';
import { sortTiles } from '../util';
import { selectors } from '../../../reducers';
import { useSelectorMemo } from '../../../hooks';

const useStyles = makeStyles(theme => ({
  container: {
    margin: theme.spacing(2),
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr));',
    gridGap: theme.spacing(2),
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
  const suiteScriptLinkedTiles = useSelector(state => selectors.suiteScriptLinkedTiles(state));
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
