import { Fragment, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { makeStyles, Tabs, Tab } from '@material-ui/core';
import * as selectors from '../../reducers';
import actions from '../../actions';
import LoadResources from '../../components/LoadResources';
import TrashIcon from '../../components/icons/TrashIcon';
import CopyIcon from '../../components/icons/CopyIcon';
// TODO: Azhar, please update these next 3 icons, once provided by the product team.
import FlowsIcon from '../../components/icons/FlowBuilderIcon';
import AdminIcon from '../../components/icons/SettingsIcon';
import DashboardIcon from '../../components/icons/AdjustInventoryIcon';
import ConnectionsIcon from '../../components/icons/ConnectionsIcon';
import IconTextButton from '../../components/IconTextButton';
import CeligoPageBar from '../../components/CeligoPageBar';
import ResourceDrawer from '../../components/drawer/Resource';
import EditableText from '../../components/EditableText';
import AdminPanel from './panels/Admin';
import FlowsPanel from './panels/Flows';
import ConnectionsPanel from './panels/Connections';
import DashboardPanel from './panels/Dashboard';

const tabs = [
  { path: 'flows', label: 'Flows', Icon: FlowsIcon, Panel: FlowsPanel },
  {
    path: 'dashboard',
    label: 'Dashboard',
    Icon: DashboardIcon,
    Panel: DashboardPanel,
  },
  {
    path: 'connections',
    label: 'Connections',
    Icon: ConnectionsIcon,
    Panel: ConnectionsPanel,
  },
  { path: 'admin', label: 'Admin', Icon: AdminIcon, Panel: AdminPanel },
];
const useStyles = makeStyles(theme => ({
  tabContainer: {
    padding: theme.spacing(0, 3),
  },
  tabPanel: {
    border: 'solid 1px',
    borderColor: theme.palette.secondary.lightest,
  },
}));

export default function Integration({ match }) {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const { integrationId, tab } = match.params;
  const integration = useSelector(state =>
    selectors.resource(state, 'integrations', integrationId)
  );
  const currentTabIndex = tabs.findIndex(t => t.path === tab) || 0;

  function handleTabChange(event, newTabIndex) {
    const newTab = tabs[newTabIndex].path;
    const parts = match.url.split('/');

    parts[parts.length - 1] = newTab;

    const newUrl = parts.join('/');

    history.push(newUrl);
  }

  const patchIntegration = useCallback(
    (path, value) => {
      const patchSet = [{ op: 'replace', path, value }];

      dispatch(actions.resource.patchStaged(integrationId, patchSet, 'value'));
      dispatch(
        actions.resource.commitStaged('integrations', integrationId, 'value')
      );
    },
    [dispatch, integrationId]
  );

  function handleTitleChange(title) {
    patchIntegration('/name', title);
  }

  function handleDescriptionChange(description) {
    patchIntegration('/description', description);
  }

  // TODO: <ResourceDrawer> Can be further optimized to take advantage
  // of the 'useRouteMatch' hook now available in react-router-dom to break
  // the need for parent components passing any props at all.
  return (
    <Fragment>
      <ResourceDrawer match={match} />

      <LoadResources required resources="integrations">
        <CeligoPageBar
          title={
            integration ? (
              <EditableText onChange={handleTitleChange}>
                {integration.name}
              </EditableText>
            ) : (
              'Standalone integrations'
            )
          }
          infoText={
            integration ? (
              <EditableText onChange={handleDescriptionChange}>
                {integration.description}
              </EditableText>
            ) : (
              undefined
            )
          }>
          <IconTextButton
            component={Link}
            to={`${location.pathname}/clone`}
            variant="text">
            <CopyIcon /> Clone integration
          </IconTextButton>

          <IconTextButton variant="text">
            <TrashIcon /> Delete integration
          </IconTextButton>
        </CeligoPageBar>

        <div className={classes.tabContainer}>
          <Tabs
            value={currentTabIndex}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="auto"
            aria-label="scrollable auto tabs example">
            {tabs.map(({ label, Icon }, i) => (
              <Tab
                key={label}
                id={`tab-${i}`}
                {...{ 'aria-controls': `tabpanel-${i}` }}
                icon={<Icon />}
                label={label}
              />
            ))}
          </Tabs>

          {tabs.map(({ path, Panel }, i) => (
            <div
              key={path}
              role="tabpanel"
              hidden={currentTabIndex !== i}
              className={classes.tabPanel}
              id={`tabpanel-${i}`}
              aria-labelledby={`tab-${i}`}>
              <div>
                {currentTabIndex === i && (
                  <Panel integrationId={integrationId} />
                )}
              </div>
            </div>
          ))}
        </div>
      </LoadResources>
    </Fragment>
  );
}
