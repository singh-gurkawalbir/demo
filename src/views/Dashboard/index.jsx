import { useEffect, useState, Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Route,
  Switch,
  Link,
  useLocation,
  useHistory,
  useRouteMatch,
} from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { difference } from 'lodash';
import * as selectors from '../../reducers';
import Tile from './Tile';
import SuiteScriptTile from './SuiteScriptTile';
import LoadResources from '../../components/LoadResources';
import actions from '../../actions';
import { sortTiles } from './util';
import CeligoPageBar from '../../components/CeligoPageBar';
import IconTextButton from '../../components/IconTextButton';
import ResourceDrawer from '../../components/drawer/Resource';
import DownloadIntegrationDrawer from '../../components/drawer/DownloadIntegration';
import UploadFileDialog from '../../views/InstallIntegration';
import AddIcon from '../../components/icons/AddIcon';
import ZipUpIcon from '../../components/icons/InstallIntegrationIcon';
import ZipDownIcon from '../../components/icons/DownloadIntegrationIcon';
import { generateNewId } from '../../utils/resource';

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

function Dashboard() {
  const location = useLocation();
  const history = useHistory();
  const classes = useStyles();
  const match = useRouteMatch();
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
      <Switch>
        <Route path={`${match.url}/installZip`}>
          <UploadFileDialog
            data-test="closeGenerateTemplateZipDialog"
            fileType="application/zip"
            history={history}
            // eslint-disable-next-line react/jsx-handler-names
            onClose={history.goBack}
          />
        </Route>
      </Switch>

      <ResourceDrawer />
      <DownloadIntegrationDrawer />

      <CeligoPageBar title="My integrations">
        <IconTextButton
          data-test="newIntegration"
          component={Link}
          to={`${location.pathname}/add/integrations/${generateNewId()}`}
          variant="text"
          color="primary">
          <AddIcon />
          Create integration
        </IconTextButton>
        <IconTextButton
          data-test="installZip"
          component={Link}
          to={`${location.pathname}/installZip`}
          // to={getRoutePath('/templates/generate-or-install')}
          variant="text"
          color="primary">
          <ZipUpIcon />
          Install integration
        </IconTextButton>
        <IconTextButton
          data-test="downloadIntegration"
          component={Link}
          to={`${location.pathname}/downloadIntegration`}
          // to={getRoutePath('/templates/generate-or-install')}
          variant="text"
          color="primary">
          <ZipDownIcon />
          Download integration
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
