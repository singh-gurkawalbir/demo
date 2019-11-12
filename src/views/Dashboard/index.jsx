import { useEffect, useState, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import shortid from 'shortid';
import { makeStyles } from '@material-ui/core/styles';
import { difference } from 'lodash';
import * as selectors from '../../reducers';
import Tile from './Tile';
import SuiteScriptTile from './SuiteScriptTile';
import LoadResources from '../../components/LoadResources';
import actions from '../../actions';
import { sortTiles } from './util';
import CeligoPageBar from '../../components/CeligoPageBar';
import ResourceDrawer from '../../components/drawer/Resource';
import AddIcon from '../../components/icons/AddIcon';
import IconTextButton from '../../components/IconTextButton';

const useStyles = makeStyles(theme => ({
  container: {
    margin: theme.spacing(2),
    display: 'grid',
    gridTemplateColumns: `repeat(auto-fill, minmax(300px, 1fr));`,
    gridGap: theme.spacing(2),
    '& > div': {
      maxWidth: '100%',
    },
    [theme.breakpoints.down('xs')]: {
      gridTemplateColumns: `repeat(1, minmax(100%, 1fr));`,
    },
    [theme.breakpoints.up('xs')]: {
      gridTemplateColumns: `repeat(auto-fill, minmax(290px, 1fr));`,
    },
  },
}));

function Dashboard(props) {
  const { location } = props;
  const classes = useStyles();
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
      <CeligoPageBar title="My integrations">
        <IconTextButton
          data-test="newIntegration"
          component={Link}
          to={`${location.pathname}/add/integrations/new-${shortid.generate()}`}
          variant="text"
          color="primary">
          <AddIcon />
          Create integration
        </IconTextButton>
      </CeligoPageBar>
      <LoadResources required resources="published,integrations,connections">
        <div className={classes.container}>
          {sortedTiles.map(t => (
            <div key={t._ioConnectionId ? t._id : t._integrationId}>
              {t._ioConnectionId ? (
                <SuiteScriptTile tile={t} />
              ) : (
                <Tile tile={t} />
              )}
            </div>
          ))}
        </div>
      </LoadResources>
    </Fragment>
  );
}

export default Dashboard;
