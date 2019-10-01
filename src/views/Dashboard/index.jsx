import { useEffect, useState, Fragment } from 'react';
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
import CeligoPageBar from '../../components/CeligoPageBar';
import ResourceDrawer from '../../components/drawer/Resource';

const styles = theme => ({
  root: {
    flexGrow: 1,
    padding: 12,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
});

function Dashboard(props) {
  const { classes } = props;
  const dispatch = useDispatch();
  const preferences = useSelector(state => selectors.userPreferences(state));
  const ssLinkedConnections = useSelector(state =>
    selectors.suiteScriptLinkedConnections(state)
  );
  const [suiteScriptResourcesToLoad, setSuiteScriptResourcesToLoad] = useState(
    []
  );

  useEffect(() => {
    const ssLinkedConnectionIds = ssLinkedConnections.map(c => c._id);
    const newSuiteScriptResourcesToLoad = difference(
      ssLinkedConnectionIds,
      suiteScriptResourcesToLoad
    );

    if (newSuiteScriptResourcesToLoad.length > 0) {
      setSuiteScriptResourcesToLoad(
        suiteScriptResourcesToLoad.concat(newSuiteScriptResourcesToLoad)
      );
    }
  }, [ssLinkedConnections, suiteScriptResourcesToLoad]);

  useEffect(() => {
    dispatch(actions.resource.requestCollection('tiles'));
  }, [dispatch]);

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
  const suiteScriptLinkedTiles = useSelector(state =>
    selectors.suiteScriptLinkedTiles(state)
  );
  const sortedTiles = sortTiles(
    tiles.concat(suiteScriptLinkedTiles),
    preferences.dashboard && preferences.dashboard.tilesOrder
  );

  return (
    <Fragment>
      <ResourceDrawer {...props} />

      <CeligoPageBar title="My integrations" />
      <LoadResources
        required
        resources="published,integrations,connections,iClients">
        <div className={classes.root}>
          <Grid container spacing={3}>
            {sortedTiles.map(t => (
              <Grid
                key={t._ioConnectionId ? t._id : t._integrationId}
                item
                lg={3}
                md={4}
                sm={6}
                xs={12}>
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
    </Fragment>
  );
}

export default withStyles(styles)(Dashboard);
