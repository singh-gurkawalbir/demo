import React from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { useRouteMatch } from 'react-router-dom';
import { selectors } from '../../../../reducers';
import IntegrationTabs from '../../common/Tabs';
import AuditLogIcon from '../../../../components/icons/AuditLogIcon';
import DashboardIcon from '../../../../components/icons/DashboardIcon';
import ConnectionsIcon from '../../../../components/icons/ConnectionsIcon';
import NotificationsIcon from '../../../../components/icons/NotificationsIcon';
import FlowsPanel from '../panels/Flows';
import AuditLogPanel from '../panels/AuditLog';
import NotificationsPanel from '../panels/Notifications';
import AdminPanel from '../panels/Admin';
import SettingsPanel from '../panels/Settings';
import UsersPanel from '../../../../components/ManageUsersPanel';
import ConnectionsPanel from '../panels/Connections';
import DashboardPanel from '../panels/Dashboard';
import AddOnsPanel from '../panels/AddOns';
import SettingsIcon from '../../../../components/icons/SettingsIcon';
import AddIcon from '../../../../components/icons/AddIcon';
import FlowsIcon from '../../../../components/icons/FlowsIcon';
import GroupOfUsersIcon from '../../../../components/icons/GroupOfUsersIcon';
import SingleUserIcon from '../../../../components/icons/SingleUserIcon';
import useSelectorMemo from '../../../../hooks/selectors/useSelectorMemo';
import { getAdminLevelTabs } from '../../../../utils/integrationApps';

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
  PageWrapper: {
    padding: theme.spacing(3),
    '& > [role = tabpanel]': {
      background: 'none',
      padding: 0,
      border: 'none',
    },
  },
}));
export default function IntegrationTabsComponent() {
  const match = useRouteMatch();
  const {integrationId} = match.params;
  const classes = useStyles();

  const integration = useSelectorMemo(selectors.mkIntegrationAppSettings, integrationId);

  const filterTabs = [];
  // TODO: This selector isn't actually returning add on state.
  // it is returning ALL integration settings state.
  const addOnState = useSelector(state =>
    selectors.integrationAppAddOnState(state, integrationId)
  );

  const hasAddOns =
    addOnState &&
    addOnState.addOns &&
    addOnState.addOns.addOnMetaData &&
    addOnState.addOns.addOnMetaData.length > 0;

  if (!hasAddOns) {
    filterTabs.push('addons');
  }
  const accessLevel = useSelector(
    state =>
      selectors.resourcePermissions(state, 'integrations', integrationId)
        .accessLevel
  );
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

  return (

    <IntegrationTabs tabs={availableTabs} className={classes.PageWrapper} />

  );
}
