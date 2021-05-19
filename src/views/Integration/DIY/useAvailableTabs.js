import { shallowEqual, useSelector } from 'react-redux';
import { useMemo } from 'react';
import { useRouteMatch } from 'react-router-dom';
import AuditLogIcon from '../../../components/icons/AuditLogIcon';
import FlowsIcon from '../../../components/icons/FlowsIcon';
import SettingsIcon from '../../../components/icons/SettingsIcon';
import DashboardIcon from '../../../components/icons/DashboardIcon';
import ConnectionsIcon from '../../../components/icons/ConnectionsIcon';
import SingleUserIcon from '../../../components/icons/SingleUserIcon';
import NotificationsIcon from '../../../components/icons/NotificationsIcon';
import AuditLogPanel from './panels/AuditLog';
import NotificationsPanel from './panels/Notifications';
import SettingsPanel from './panels/Settings';
import AdminPanel from './panels/Admin';
import UsersPanel from '../../../components/ManageUsersPanel';
import FlowsPanel from './panels/Flows';
import ConnectionsPanel from './panels/Connections';
import DashboardPanel from './panels/Dashboard';
import { selectors } from '../../../reducers';
import GroupOfUsersIcon from '../../../components/icons/GroupOfUsersIcon';
import GraphIcon from '../../../components/icons/GraphIcon';
import { getTopLevelTabs } from '../../../utils/integrationApps';
import useSelectorMemo from '../../../hooks/selectors/useSelectorMemo';

const getTabs = isUserInErrMgtTwoDotZero => [
  {
    path: 'settings',
    label: 'Settings',
    Icon: SettingsIcon,
    Panel: SettingsPanel,
  },
  { path: 'flows', label: 'Flows', Icon: FlowsIcon, Panel: FlowsPanel },
  {
    path: 'dashboard',
    label: 'Dashboard',
    Icon: isUserInErrMgtTwoDotZero ? GraphIcon : DashboardIcon,
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
];
const emptyObj = {};

export function useAvailableTabs() {
  const match = useRouteMatch();
  const { integrationId, childId } = match?.params;
  const children = useSelectorMemo(selectors.mkIntegrationChildren, integrationId);
  const isUserInErrMgtTwoDotZero = useSelector(state =>
    selectors.isOwnerUserInErrMgtTwoDotZero(state)
  );
  const hideSettingsTab = useSelector(state => {
    const canEditSettingsForm =
          selectors.canEditSettingsForm(state, 'integrations', integrationId, (childId || integrationId));
    const hasSettingsForm =
          selectors.hasSettingsForm(state, 'integrations', (childId || integrationId));

    return !canEditSettingsForm && !hasSettingsForm;
  });
  const {
    isIntegrationApp,
    supportsChild,
  } = useSelector(state => {
    const integration = selectors.resource(
      state,
      'integrations',
      integrationId
    );

    if (integration) {
      return {
        isIntegrationApp: !!integration._connectorId,
        supportsChild: integration.initChild?.function,
      };
    }

    return emptyObj;
  }, shallowEqual);
  // Addons are currently not supported in 2.0.
  // This piece of code works when addon structure is introduced and may require minor changes.
  const { hasAddOns} = useSelector(state => {
    const addOnState = selectors.integrationAppAddOnState(state, integrationId);

    return {addOnStatus: addOnState.status,
      hasAddOns: addOnState?.addOns?.addOnMetaData?.length > 0};
  }, shallowEqual);

  const isParent = childId === integrationId;

  const isMonitorLevelUser = useSelector(state => selectors.isFormAMonitorLevelAccess(state, integrationId));

  const availableTabs = useMemo(() => getTopLevelTabs({
    tabs: getTabs(isUserInErrMgtTwoDotZero),
    isIntegrationApp,
    isParent,
    integrationId,
    hasAddOns,
    supportsChild,
    children,
    isMonitorLevelUser,
    hideSettingsTab,
  }), [children, hasAddOns, hideSettingsTab, integrationId, isIntegrationApp, isUserInErrMgtTwoDotZero, isMonitorLevelUser, isParent, supportsChild]);

  return availableTabs;
}
