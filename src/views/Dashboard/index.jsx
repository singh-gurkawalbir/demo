import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import { difference } from 'lodash';
import * as selectors from '../../reducers';
import Tile from './Tile';
import SuiteScriptTile from './SuiteScriptTile';
import LoadResources from '../../components/LoadResources';
import actions from '../../actions';
import sortTiles from './util';

const styles = theme => ({
  root: {
    flexGrow: 1,
    padding: 12,
  },
  paper: {
    padding: theme.spacing.unit * 2,
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
});

function Dashboard(props) {
  const { classes } = props;
  const dispatch = useDispatch();
  const preferences = useSelector(state => selectors.userPreferences(state));
  const ssLinkedConnectionIds = useSelector(state =>
    selectors.suiteScriptLinkedConnectionIds(state)
  );
  const [suiteScriptResourcesToLoad, setSuiteScriptResourcesToLoad] = useState(
    []
  );

  useEffect(() => {
    const newSuiteScriptResourcesToLoad = difference(
      ssLinkedConnectionIds,
      suiteScriptResourcesToLoad
    );

    if (newSuiteScriptResourcesToLoad.length > 0) {
      setSuiteScriptResourcesToLoad(
        suiteScriptResourcesToLoad.concat(newSuiteScriptResourcesToLoad)
      );
    }
  }, [ssLinkedConnectionIds, suiteScriptResourcesToLoad]);

  useEffect(() => {
    dispatch(actions.resource.requestCollection('tiles'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    suiteScriptResourcesToLoad.forEach(connectionId =>
      dispatch(
        actions.resource.requestCollection(
          `suitescript/connections/${connectionId}/tiles`
        )
      )
    );
  }, [dispatch, suiteScriptResourcesToLoad]);

  const tiles = useSelector(state => selectors.tiles(state));
  const sortedTiles = sortTiles(
    tiles,
    preferences.dashboard && preferences.dashboard.tilesOrder
  );

  return (
    <LoadResources required resources="published,integrations,connections">
      <div className={classes.root}>
        <Grid container spacing={24}>
          {sortedTiles.map(t => (
            <Grid
              key={t._ioConnectionId ? t._id : t._integrationId}
              item
              xs={3}>
              {t._ioConnectionId ? (
                <SuiteScriptTile tile={t} />
              ) : (
                <Tile tile={t} />
              )}
            </Grid>
          ))}
        </Grid>
      </div>
    </LoadResources>
  );
}

export default withStyles(styles)(Dashboard);
