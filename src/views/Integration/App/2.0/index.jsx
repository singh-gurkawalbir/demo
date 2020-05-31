import { Fragment, useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { Redirect, generatePath, Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Select, MenuItem } from '@material-ui/core';
import * as selectors from '../../../../reducers';
import actions from '../../../../actions';
import LoadResources from '../../../../components/LoadResources';
import AddIcon from '../../../../components/icons/AddIcon';
import FlowsIcon from '../../../../components/icons/FlowsIcon';
import CopyIcon from '../../../../components/icons/CopyIcon';
import AuditLogIcon from '../../../../components/icons/AuditLogIcon';
import DashboardIcon from '../../../../components/icons/DashboardIcon';
import ConnectionsIcon from '../../../../components/icons/ConnectionsIcon';
import NotificationsIcon from '../../../../components/icons/NotificationsIcon';
import IconTextButton from '../../../../components/IconTextButton';
import CeligoPageBar from '../../../../components/CeligoPageBar';
import ResourceDrawer from '../../../../components/drawer/Resource';
import ChipInput from '../../../../components/ChipInput';
import ArrowDownIcon from '../../../../components/icons/ArrowDownIcon';
import FlowsPanel from '../panels/Flows';
import AuditLogPanel from '../panels/AuditLog';
import NotificationsPanel from '../panels/Notifications';
import AdminPanel from '../panels/Admin';
import ConnectionsPanel from '../panels/Connections';
import DashboardPanel from '../panels/Dashboard';
import AddOnsPanel from '../panels/AddOns';
import IntegrationTabs from '../../common/Tabs';
import getRoutePath from '../../../../utils/routePaths';
import QueuedJobsDrawer from '../../../../components/JobDashboard/QueuedJobs/QueuedJobsDrawer';
import integrationAppUtil from '../../../../utils/integrationApps';
import SettingsIcon from '../../../../components/icons/SettingsIcon';
import useSelectorMemo from '../../../../hooks/selectors/useSelectorMemo';

const allTabs = [
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
  { path: 'addons', label: 'Add-ons', Icon: AddIcon, Panel: AddOnsPanel },
  {
    path: 'settings',
    label: 'Settings',
    Icon: SettingsIcon,
    Panel: AdminPanel,
  },
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
    backgroundColor: `rgb(0,0,0,0)`,
    transition: theme.transitions.create('background-color'),
    paddingLeft: theme.spacing(1),
    height: 'unset',
    '&:hover': {
      backgroundColor: `rgb(0,0,0,0.05)`,
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

export default function IntegrationApp({ match, history }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { integrationAppName, integrationId, storeId, tab } = match.params;
  const childIntegrationsFilterConfig = {
    type: 'integrations',
    filter: { _parentId: integrationId },
  };
  const { _id: _integrationId, _connectorId, name, mode, tag, description } =
    useSelector(state =>
      selectors.integrationAppSettings(state, integrationId)
    ) || {};
  const defaultStoreId = integrationId;
  const stores = useSelector(
    state => selectors.integrationAppChildren(state, integrationId),
    shallowEqual
  );
  const childIntegrations = useSelectorMemo(
    selectors.makeResourceListSelector,
    childIntegrationsFilterConfig
  ).resources;
  const supportsMultiStore = !!childIntegrations.length;
  const currentStoreMode = useSelector(state => {
    const integration = selectors.resource(state, 'integrations', storeId);

    return integration && integration.mode;
  });
  const redirectTo = useSelector(state =>
    selectors.shouldRedirect(state, integrationId)
  );
  // TODO: This selector isn't actually returning add on state.
  // it is returning ALL integration settings state.
  const addOnState = useSelector(state =>
    selectors.integrationAppAddOnState(state, integrationId)
  );
  const integrationAppMetadata = useSelector(state =>
    selectors.integrationAppMappingMetadata(state, integrationId)
  );
  const isParent = storeId === integrationId;
  const accessLevel = useSelector(
    state =>
      selectors.resourcePermissions(state, 'integrations', integrationId)
        .accessLevel
  );
  const isCloningSupported = integrationAppUtil.isCloningSupported(
    _connectorId,
    name
  );
  //
  //
  // TODO: All the code below should be moved into the data layer.
  // the addonState selector should return a status to indicted if there
  // is a pending request in progress. This would be used to dispatch
  // a request instead of all these useEffects and local state management.
  const [requestLicense, setRequestLicense] = useState(false);
  const [requestMappingMetadata, setRequestMappingMetadata] = useState(false);

  useEffect(() => {
    if (addOnState && !addOnState.addOns && !requestLicense) {
      dispatch(
        actions.integrationApp.settings.requestAddOnLicenseMetadata(
          integrationId
        )
      );
      setRequestLicense(true);
    }
  }, [addOnState, dispatch, integrationId, requestLicense]);

  useEffect(() => {
    if (
      integrationAppMetadata &&
      !integrationAppMetadata.mappingMetadata &&
      !requestMappingMetadata
    ) {
      dispatch(
        actions.integrationApp.settings.requestMappingMetadata(integrationId)
      );
      setRequestMappingMetadata(true);
    }
  }, [
    addOnState,
    dispatch,
    integrationAppMetadata,
    integrationId,
    requestMappingMetadata,
  ]);

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

  if (isParent) {
    filterTabs.push('flows');
    filterTabs.push('dashboard');
  }

  const availableTabs = allTabs.filter(tab => !filterTabs.includes(tab.id));
  const handleTagChangeHandler = useCallback(
    tag => {
      const patchSet = [{ op: 'replace', path: '/tag', value: tag }];

      dispatch(actions.resource.patchStaged(integrationId, patchSet, 'value'));
      dispatch(
        actions.resource.commitStaged('integrations', integrationId, 'value')
      );
    },
    [dispatch, integrationId]
  );
  const handleStoreChange = useCallback(
    e => {
      const newStoreId = e.target.value;

      // Redirect to current tab of new store
      history.push(
        getRoutePath(
          `integrationapps/v2/${integrationAppName}/${integrationId}/child/${newStoreId}/${tab}`
        )
      );
    },
    [history, integrationAppName, integrationId, tab]
  );
  const handleAddNewStoreClick = useCallback(() => {
    history.push(
      `/pg/integrationapps/v2/${integrationAppName}/${integrationId}/install/addNewStore`
    );
  }, [history, integrationAppName, integrationId]);

  // There is no need for further processing if no integration
  // is returned. Most likely case is that there is a pending IO
  // call for integrations.
  if (!_integrationId) {
    return <LoadResources required resources="integrations" />;
  }

  const storeLabel = 'Child';

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
          to={`/pg/integrationapps/v2/${integrationAppName}/${integrationId}/child/${defaultStoreId}/${tab ||
            'settings'}`}
        />
      );
    }
  } else if (!tab) {
    return (
      <Redirect
        push={false}
        to={`${match.url}/${storeId === integrationId ? 'settings' : 'flows'}`}
      />
    );
  }

  let redirectToPage;

  if (currentStoreMode === 'install') {
    redirectToPage = getRoutePath(
      `integrationapps/${integrationAppName}/${integrationId}/install/addNewStore`
    );
  } else if (currentStoreMode === 'uninstall') {
    redirectToPage = getRoutePath(
      `integrationapps/${integrationAppName}/${integrationId}/uninstall/${storeId}`
    );
  } else if (mode === 'install') {
    redirectToPage = getRoutePath(
      `integrationapps/${integrationAppName}/${integrationId}/setup`
    );
  } else if (mode === 'uninstall') {
    redirectToPage = getRoutePath(
      `integrationapps/${integrationAppName}/${integrationId}/uninstall${
        storeId ? `/${storeId}` : ''
      }`
    );
  }

  if (redirectToPage) {
    return <Redirect push={false} to={redirectToPage} />;
  }

  return (
    <Fragment>
      <ResourceDrawer />
      <QueuedJobsDrawer />
      <CeligoPageBar
        title={name}
        titleTag={
          <ChipInput
            disabled={!['owner', 'manage'].includes(accessLevel)}
            value={tag || 'tag'}
            className={classes.tag}
            variant="outlined"
            onChange={handleTagChangeHandler}
          />
        }
        infoText={description}>
        {isCloningSupported && !supportsMultiStore && (
          <IconTextButton
            component={Link}
            to={getRoutePath(`/clone/integrations/${_integrationId}/preview`)}
            variant="text"
            data-test="cloneIntegrationApp">
            <CopyIcon /> Clone integration
          </IconTextButton>
        )}
        {supportsMultiStore && (
          <div className={classes.actions}>
            {accessLevel === 'owner' && (
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

              {stores.map(s => (
                <MenuItem key={s.value} value={s.value}>
                  {s.label}
                </MenuItem>
              ))}
            </Select>
          </div>
        )}
      </CeligoPageBar>

      <IntegrationTabs tabs={availableTabs} className={classes.PageWrapper} />
    </Fragment>
  );
}
