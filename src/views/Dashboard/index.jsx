import React, { useEffect, useState, useMemo } from 'react';
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
import { selectors } from '../../reducers';
import LoadResources from '../../components/LoadResources';
import actions from '../../actions';
import { sortTiles } from './util';
import CeligoPageBar from '../../components/CeligoPageBar';
import IconTextButton from '../../components/IconTextButton';
import ResourceDrawer from '../../components/drawer/Resource';
import DownloadIntegrationDrawer from '../../components/drawer/DownloadIntegration';
import InstallIntegrationDrawer from '../../components/drawer/Install/Integration';
import UploadFileDialog from '../InstallIntegration';
import AddIcon from '../../components/icons/AddIcon';
import ZipUpIcon from '../../components/icons/InstallIntegrationIcon';
import ZipDownIcon from '../../components/icons/DownloadIntegrationIcon';
import { generateNewId } from '../../utils/resource';
import OfflineConnectionDrawer from './OfflineConnectionDrawer';
import DashboardCard from './DashboardCard';

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

const IntegrationCeligoPageBar = () => {
  const location = useLocation();

  const permission = useSelector(state =>
    selectors.resourcePermissions(state, 'integrations')
  );

  return (
    <CeligoPageBar title="My integrations">
      {permission.create && (
      <IconTextButton
        data-test="newIntegration"
        component={Link}
        to={`${location.pathname}/add/integrations/${generateNewId()}`}
        variant="text"
        color="primary">
        <AddIcon />
        Create integration
      </IconTextButton>
      )}
      {permission.install && (
      <IconTextButton
        data-test="installZip"
        component={Link}
        to={`${location.pathname}/installIntegration`}
        variant="text"
        color="primary">
        <ZipUpIcon />
        Install integration
      </IconTextButton>
      )}
      {/* TODO: What condition to use for download Integration */}
      {permission.create && (
      <IconTextButton
        data-test="downloadIntegration"
        component={Link}
        to={`${location.pathname}/downloadIntegration`}
        variant="text"
        color="primary">
        <ZipDownIcon />
        Download integration
      </IconTextButton>
      )}
    </CeligoPageBar>
  );
};

const InstallZip = () => {
  const history = useHistory();

  const match = useRouteMatch();

  return (

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
  );
};

const DashboardTiles = () => {
  const classes = useStyles();
  const preferences = useSelector(state => selectors.userPreferences(state));

  const tiles = useSelector(state => selectors.tiles(state));
  const suiteScriptLinkedTiles = useSelector(state =>
    selectors.suiteScriptLinkedTiles(state)
  );
  const sortedTiles = useMemo(
    () =>
      sortTiles(
        tiles.concat(suiteScriptLinkedTiles),
        preferences.dashboard && preferences.dashboard.tilesOrder
      ),
    [preferences.dashboard, suiteScriptLinkedTiles, tiles]
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
};

// This component does not return a jsx ..it is sort of a hook
// is there any better pattern to this
const LoadTiles = () => {
  const dispatch = useDispatch();
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

  return null;
};

export default function Dashboard() {
  return (
    <>
      <LoadTiles />
      <InstallZip />
      <ResourceDrawer />
      <DownloadIntegrationDrawer />
      <InstallIntegrationDrawer />
      <OfflineConnectionDrawer />
      <IntegrationCeligoPageBar />
      <DashboardTiles />
    </>
  );
}
