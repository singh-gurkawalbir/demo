import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';
import { selectors } from '../../../../reducers';
import IntegrationTabs from '../../common/Tabs';
import AuditLogIcon from '../../../../components/icons/AuditLogIcon';
import GraphIcon from '../../../../components/icons/GraphIcon';
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
import AnalyticsPanel from '../panels/Analytics';
import SettingsIcon from '../../../../components/icons/SettingsIcon';
import AliasesPanel from '../../common/AliasesPanel';
import AddIcon from '../../../../components/icons/AddIcon';
import FlowsIcon from '../../../../components/icons/FlowsIcon';
import GroupOfUsersIcon from '../../../../components/icons/GroupOfUsersIcon';
import SingleUserIcon from '../../../../components/icons/SingleUserIcon';
import useSelectorMemo from '../../../../hooks/selectors/useSelectorMemo';
import { getAdminLevelTabs } from '../../../../utils/integrationApps';
import InstallationGuideIcon from '../../../../components/icons/InstallationGuideIcon';
import TabContent from '../../../../components/TabContent';

const getAllTabs = isUserInErrMgtTwoDotZero => [
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
  ...(isUserInErrMgtTwoDotZero
    ? [{ path: 'analytics',
      label: 'Analytics',
      Icon: GraphIcon,
      Panel: AnalyticsPanel }]
    : []),
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
  { path: 'aliases', label: 'Aliases', Icon: InstallationGuideIcon, Panel: AliasesPanel},
];

export default function IntegrationTabsComponent() {
  const match = useRouteMatch();
  const {integrationId} = match.params;

  const integration = useSelectorMemo(selectors.mkIntegrationAppSettings, integrationId);

  // TODO: This selector isn't actually returning add on state.
  // it is returning ALL integration settings state.
  const hasAddOns = useSelector(state => {
    const addOnState = selectors.integrationAppAddOnState(state, integrationId);

    return addOnState?.addOns?.addOnMetaData?.length > 0;
  }
  );
  const isUserInErrMgtTwoDotZero = useSelector(state =>
    selectors.isOwnerUserInErrMgtTwoDotZero(state)
  );

  const accessLevel = useSelector(
    state =>
      selectors.resourcePermissions(state, 'integrations', integrationId)?.accessLevel
  );
  const showAdminTab = getAdminLevelTabs({
    integrationId,
    isIntegrationApp: true,
    isParent: true,
    supportsChild: !!(integration && integration.settings && integration.settings.supportsMultiStore),
    isMonitorLevelUser: accessLevel === 'monitor',
  }).length;

  const availableTabs = useMemo(() => {
    const filterTabs = [];

    if (!hasAddOns) {
      filterTabs.push('addons');
    }
    if (!showAdminTab) {
      filterTabs.push('admin');
    }

    return getAllTabs(isUserInErrMgtTwoDotZero).filter(tab => !filterTabs.includes(tab.path));
  }, [hasAddOns, isUserInErrMgtTwoDotZero, showAdminTab]);

  return (
    <TabContent >
      <IntegrationTabs tabs={availableTabs} />
    </TabContent>

  );
}
