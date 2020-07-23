import React, { useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Redirect, generatePath, Link, useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Select, MenuItem } from '@material-ui/core';
import * as selectors from '../../../reducers';
import actions from '../../../actions';
import LoadResources from '../../../components/LoadResources';
import AddIcon from '../../../components/icons/AddIcon';
import FlowsIcon from '../../../components/icons/FlowsIcon';
import CopyIcon from '../../../components/icons/CopyIcon';
import AuditLogIcon from '../../../components/icons/AuditLogIcon';
import DashboardIcon from '../../../components/icons/DashboardIcon';
import ConnectionsIcon from '../../../components/icons/ConnectionsIcon';
import NotificationsIcon from '../../../components/icons/NotificationsIcon';
import IconTextButton from '../../../components/IconTextButton';
import CeligoPageBar from '../../../components/CeligoPageBar';
import ResourceDrawer from '../../../components/drawer/Resource';
import ChipInput from '../../../components/ChipInput';
import ArrowDownIcon from '../../../components/icons/ArrowDownIcon';
import FlowsPanel from './panels/Flows';
import AuditLogPanel from './panels/AuditLog';
import NotificationsPanel from './panels/Notifications';
import AdminPanel from './panels/Admin';
import SettingsPanel from './panels/Settings';
import UsersPanel from '../../../components/ManageUsersPanel';
import ConnectionsPanel from './panels/Connections';
import DashboardPanel from './panels/Dashboard';
import AddOnsPanel from './panels/AddOns';
import IntegrationTabs from '../common/Tabs';
import getRoutePath from '../../../utils/routePaths';
import QueuedJobsDrawer from '../../../components/JobDashboard/QueuedJobs/QueuedJobsDrawer';
import integrationAppUtil, { getAdminLevelTabs, getIntegrationAppUrlName } from '../../../utils/integrationApps';
import SettingsIcon from '../../../components/icons/SettingsIcon';
import GroupOfUsersIcon from '../../../components/icons/GroupOfUsersIcon';
import SingleUserIcon from '../../../components/icons/SingleUserIcon';

const allTabs = [
  { path: 'settings', label: 'Settings', Icon: SettingsIcon, Panel: SettingsPanel},
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
  {
    path: 'notifications',
    label: 'Notifications',
    Icon: NotificationsIcon,
    Panel: NotificationsPanel,
  },
  {
    path: 'auditlog',
    label: 'Audit log',
    Icon: AuditLogIcon,
    Panel: AuditLogPanel,
  },
  {
    path: 'users',
    label: 'Users',
    Icon: GroupOfUsersIcon,
    Panel: UsersPanel,
  },
  {
    path: 'admin',
    label: 'Admin',
    Icon: SingleUserIcon,
    Panel: AdminPanel,
  },
  { path: 'addons', label: 'Add-ons', Icon: AddIcon, Panel: AddOnsPanel },
];
const useStyles = makeStyles(theme => ({
  tag: {
    marginLeft: theme.spacing(1),
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
  },
  storeSelect: {
    fontFamily: 'Roboto500',
    fontSize: 13,
    borderRadius: 4,
    backgroundColor: 'rgb(0,0,0,0)',
    transition: theme.transitions.create('background-color'),
    paddingLeft: theme.spacing(1),
    height: 'unset',
    '&:hover': {
      backgroundColor: 'rgb(0,0,0,0.05)',
    },
    '& > div': {
      paddingTop: theme.spacing(1),
    },
  },
  PageWrapper: {
    padding: theme.spacing(3),
    '& > [role = tabpanel]': {
      background: 'none',
      padding: 0,
      border: 'none',
    },
  },
}));

export default function IntegrationApp(props) {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const { integrationId, storeId, tab, match } = props;
  // TODO: Note this selector should return undefined/null if no
  // integration exists. not a stubbed out complex object.
  const integration = useSelector(state =>
    selectors.integrationAppSettings(state, integrationId)
  );
  const defaultStoreId = useSelector(state =>
    selectors.defaultStoreId(state, integrationId, storeId)
  );
  const currentStore = useSelector(state =>
    selectors.integrationAppStore(state, integrationId, storeId)
  );
  const redirectTo = useSelector(state =>
    selectors.shouldRedirect(state, integrationId)
  );
  const integrationAppName = getIntegrationAppUrlName(integration.name);

  // TODO: This selector isn't actually returning add on state.
  // it is returning ALL integration settings state.
  const addOnState = useSelector(state =>
    selectors.integrationAppAddOnState(state, integrationId)
  );
  const integrationAppMetadata = useSelector(state =>
    selectors.integrationAppMappingMetadata(state, integrationId)
  );
  const accessLevel = useSelector(
    state =>
      selectors.resourcePermissions(state, 'integrations', integrationId)
        .accessLevel
  );
  const isCloningSupported =
    integration &&
    integrationAppUtil.isCloningSupported(
      integration._connectorId,
      integration.name
    ) && accessLevel !== 'monitor';

  useEffect(() => {
    if (!addOnState || !addOnState.status) {
      dispatch(
        actions.integrationApp.settings.requestAddOnLicenseMetadata(
          integrationId
        )
      );
    }
  }, [addOnState, dispatch, integrationId]);

  useEffect(() => {
    if (!integrationAppMetadata.status) {
      dispatch(
        actions.integrationApp.settings.requestMappingMetadata(integrationId)
      );
    }
  }, [dispatch, integrationAppMetadata, integrationId]);

  useEffect(() => {
    if (redirectTo) {
      const path = generatePath(match.path, {
        integrationId,
        integrationAppName,
        storeId,
        tab: redirectTo,
      });

      dispatch(actions.integrationApp.settings.clearRedirect(integrationId));
      history.push(path);
    }
  }, [
    dispatch,
    history,
    integrationAppName,
    integrationId,
    match.path,
    redirectTo,
    storeId,
  ]);

  const hasAddOns =
    addOnState &&
    addOnState.addOns &&
    addOnState.addOns.addOnMetaData &&
    addOnState.addOns.addOnMetaData.length > 0;
  // All the code ABOVE this comment should be moved from this component to the data-layer.
  //
  //
  const filterTabs = [];

  if (!hasAddOns) {
    filterTabs.push('addons');
  }
  const showAdminTab = getAdminLevelTabs({
    integrationId,
    isIntegrationApp: true,
    isParent: true,
    supportsChild: !!(integration && integration.settings && integration.settings.supportsMultiStore),
    isMonitorLevelUser: accessLevel === 'monitor',
  }).length;
  if (!showAdminTab) {
    filterTabs.push('admin');
  }
  const availableTabs = allTabs.filter(tab => !filterTabs.includes(tab.path));
  const handleTagChangeHandler = useCallback(
    tag => {
      const patchSet = tag ? [{ op: 'replace', path: '/tag', value: tag }] : [{ op: 'remove', path: '/tag'}];

      dispatch(actions.resource.patch('integrations', integrationId, patchSet));
    },
    [dispatch, integrationId]
  );
  const handleStoreChange = useCallback(
    e => {
      const newStoreId = e.target.value;

      // Redirect to current tab of new store
      history.push(
        getRoutePath(
          `integrationapps/${integrationAppName}/${integrationId}/child/${newStoreId}/${tab}`
        )
      );
    },
    [history, integrationAppName, integrationId, tab]
  );
  const handleAddNewStoreClick = useCallback(() => {
    history.push(
      getRoutePath(`/integrationapps/${integrationAppName}/${integrationId}/install/addNewStore`)
    );
  }, [history, integrationAppName, integrationId]);

  // There is no need for further processing if no integration
  // is returned. Most likely case is that there is a pending IO
  // call for integrations.
  if (!integration || !integration._id) {
    return <LoadResources required resources="integrations" />;
  }

  const { supportsMultiStore, storeLabel } = integration.settings || {};

  // To support breadcrumbs, and also to have a more robust url interface,
  // we want to "self-heal" partial urls hitting this page.  If an integration app
  // is routed to this component without a storeId (if it supports multi-store),
  // or if no tab is selected, we rewrite the current url in the history to carry
  // this state information forward.
  if (supportsMultiStore) {
    if (!storeId) {
      return (
        <Redirect
          push={false}
          to={getRoutePath(`/integrationapps/${integrationAppName}/${integrationId}/child/${defaultStoreId}/${tab ||
            'flows'}`)}
        />
      );
    }
  } else if (!tab) {
    return <Redirect push={false} to={`${match.url}/flows`} />;
  }

  let redirectToPage;

  if (currentStore.mode === 'install') {
    redirectToPage = getRoutePath(
      `integrationapps/${integrationAppName}/${integrationId}/install/addNewStore`
    );
  } else if (currentStore.mode === 'uninstall') {
    redirectToPage = getRoutePath(
      `integrationapps/${integrationAppName}/${integrationId}/uninstall/${storeId}`
    );
  } else if (integration.mode === 'install') {
    redirectToPage = getRoutePath(
      `integrationapps/${integrationAppName}/${integrationId}/setup`
    );
  } else if (integration.mode === 'uninstall') {
    redirectToPage = getRoutePath(
      `integrationapps/${integrationAppName}/${integrationId}/uninstall${
        storeId ? `/${storeId}` : ''
      }`
    );
  }

  if (redirectToPage) {
    return <Redirect push={false} to={redirectToPage} />;
  }

  // console.log('render: <IntegrationApp>');

  return (
    <>
      <ResourceDrawer />
      <QueuedJobsDrawer />
      <CeligoPageBar
        title={integration.name}
        titleTag={
          <ChipInput
            disabled={!['owner', 'manage'].includes(accessLevel)}
            value={integration.tag || 'tag'}
            className={classes.tag}
            variant="outlined"
            onChange={handleTagChangeHandler}
          />
        }
        infoText={integration.description}>
        {isCloningSupported && integration && !supportsMultiStore && (
          <IconTextButton
            component={Link}
            to={getRoutePath(`/clone/integrations/${integration._id}/preview`)}
            variant="text"
            data-test="cloneIntegrationApp">
            <CopyIcon /> Clone integration
          </IconTextButton>
        )}
        {supportsMultiStore && (
          <div className={classes.actions}>
            {(accessLevel === 'owner' || accessLevel === 'manage') && (
              <IconTextButton
                variant="text"
                data-test={`add${storeLabel}`}
                onClick={handleAddNewStoreClick}>
                <AddIcon /> Add {storeLabel}
              </IconTextButton>
            )}
            <Select
              displayEmpty
              data-test={`select${storeLabel}`}
              className={classes.storeSelect}
              onChange={handleStoreChange}
              IconComponent={ArrowDownIcon}
              value={storeId}>
              <MenuItem disabled value="">
                Select {storeLabel}
              </MenuItem>

              {integration.stores.map(s => (
                <MenuItem key={s.value} value={s.value}>
                  {s.label}
                </MenuItem>
              ))}
            </Select>
          </div>
        )}
      </CeligoPageBar>

      <IntegrationTabs tabs={availableTabs} className={classes.PageWrapper} />
    </>
  );
}
