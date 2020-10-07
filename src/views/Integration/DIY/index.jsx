import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { makeStyles, MenuItem } from '@material-ui/core';
import { Link, Redirect, generatePath, useHistory, useRouteMatch } from 'react-router-dom';
import { selectors } from '../../../reducers';
import actions from '../../../actions';
import LoadResources from '../../../components/LoadResources';
import TrashIcon from '../../../components/icons/TrashIcon';
import AuditLogIcon from '../../../components/icons/AuditLogIcon';
import CopyIcon from '../../../components/icons/CopyIcon';
import FlowsIcon from '../../../components/icons/FlowsIcon';
import SettingsIcon from '../../../components/icons/SettingsIcon';
import DashboardIcon from '../../../components/icons/DashboardIcon';
import ConnectionsIcon from '../../../components/icons/ConnectionsIcon';
import IconTextButton from '../../../components/IconTextButton';
import CeligoPageBar from '../../../components/CeligoPageBar';
import ResourceDrawer from '../../../components/drawer/Resource';
import EditableText from '../../../components/EditableText';
import AuditLogPanel from './panels/AuditLog';
import NotificationsPanel from './panels/Notifications';
import SettingsPanel from './panels/Settings';
import AdminPanel from './panels/Admin';
import UsersPanel from '../../../components/ManageUsersPanel';
import FlowsPanel from './panels/Flows';
import ConnectionsPanel from './panels/Connections';
import DashboardPanel from './panels/Dashboard';
import getRoutePath from '../../../utils/routePaths';
import IntegrationTabs from '../common/Tabs';
import { INTEGRATION_DELETE_VALIDATE } from '../../../utils/messageStore';
import { STANDALONE_INTEGRATION } from '../../../utils/constants';
import useConfirmDialog from '../../../components/ConfirmDialog';
import useEnqueueSnackbar from '../../../hooks/enqueueSnackbar';
import SingleUserIcon from '../../../components/icons/SingleUserIcon';
import { getTemplateUrlName } from '../../../utils/template';
import QueuedJobsDrawer from '../../../components/JobDashboard/QueuedJobs/QueuedJobsDrawer';
import NotificationsIcon from '../../../components/icons/NotificationsIcon';
import useSelectorMemo from '../../../hooks/selectors/useSelectorMemo';
import { getIntegrationAppUrlName, getTopLevelTabs } from '../../../utils/integrationApps';
import ArrowDownIcon from '../../../components/icons/ArrowDownIcon';
import GroupOfUsersIcon from '../../../components/icons/GroupOfUsersIcon';
import ChipInput from '../../../components/ChipInput';
import AddIcon from '../../../components/icons/AddIcon';
import CeligoSelect from '../../../components/CeligoSelect';
import GraphIcon from '../../../components/icons/GraphIcon';

const useStyles = makeStyles(theme => ({
  pageWrapper: {
    padding: theme.spacing(3),
    '& > [role = tabpanel]': {
      background: 'none',
      padding: 0,
      border: 'none',
    },
  },
  tag: {
    marginLeft: theme.spacing(1),
  },
  editableTextInput: {
    width: `calc(60vw - ${52 + 24}px)`,
  },
  editableTextInputShift: {
    width: `calc(60vw - ${theme.drawerWidth + 24}px)`,
  },
}));
const getAllTabs = isUserInErrMgtTwoDotZero => [
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
const integrationsFilterConfig = { type: 'integrations' };

export default function Integration() {
  const classes = useStyles();
  const history = useHistory();
  const match = useRouteMatch();
  const { integrationId, templateName, childId, tab} = match?.params;
  const dispatch = useDispatch();
  const [enqueueSnackbar] = useEnqueueSnackbar();
  const { confirmDialog } = useConfirmDialog();
  const hideSettingsTab = useSelector(state => {
    const canEditSettingsForm =
      selectors.canEditSettingsForm(state, 'integrations', integrationId, (childId || integrationId));
    const hasSettingsForm =
      selectors.hasSettingsForm(state, 'integrations', (childId || integrationId));

    return !canEditSettingsForm && !hasSettingsForm;
  });
  const {
    name,
    description,
    isIntegrationApp,
    sandbox,
    templateId,
    hasIntegration,
    supportsChild,
    installSteps,
    uninstallSteps,
    mode,
    tag,
  } = useSelector(state => {
    const integration = selectors.resource(
      state,
      'integrations',
      integrationId
    );

    if (integration) {
      return {
        hasIntegration: true,
        templateId: integration._templateId,
        mode: integration.mode,
        name: integration.name,
        isIntegrationApp: !!integration._connectorId,
        description: integration.description,
        sandbox: integration.sandbox,
        installSteps: integration.installSteps,
        uninstallSteps: integration.uninstallSteps,
        supportsChild: integration.initChild?.function,
        tag: integration.tag,
      };
    }

    return emptyObj;
  }, shallowEqual);

  const integrations = useSelectorMemo(
    selectors.makeResourceListSelector,
    integrationsFilterConfig
  ).resources;

  const pageTitle = name || 'Standalone flows';

  const childIntegration = useSelector(state => {
    const id = selectors.getChildIntegrationId(state, integrationId);

    return id && selectors.resource(state, 'integrations', id);
  });
  const integrationAppName = getIntegrationAppUrlName(name);
  const integrationChildAppName =
    childIntegration &&
    getIntegrationAppUrlName(childIntegration && childIntegration.name);
  const { canEdit, canClone, canDelete } = useSelector(state => {
    const permission = selectors.resourcePermissions(
      state,
      'integrations',
      integrationId
    );

    return {
      canEdit: permission.edit,
      canClone: permission.clone,
      canDelete: permission.delete,
    };
  }, shallowEqual);

  const children = useSelectorMemo(selectors.mkIntegrationChildren, integrationId);

  const currentChildMode = useSelector(state => {
    const integration = selectors.resource(state, 'integrations', childId);

    return integration?.mode;
  });

  const defaultChild = ((children.find(s => (s.value !== integrationId && s.mode === 'settings')) || {})
    .value) || integrationId;
  const drawerOpened = useSelector(state => selectors.drawerOpened(state));
  const currentEnvironment = useSelector(state =>
    selectors.currentEnvironment(state)
  );
  const isMonitorLevelUser = useSelector(state => selectors.isFormAMonitorLevelAccess(state, integrationId));
  const redirectTo = useSelector(state =>
    selectors.shouldRedirect(state, integrationId)
  );
  // Addons are currently not supported in 2.0.
  // This piece of code works when addon structure is introduced and may require minor changes.
  const {addOnStatus, hasAddOns} = useSelector(state => {
    const addOnState = selectors.integrationAppAddOnState(state, integrationId);

    return {addOnStatus: addOnState.status,
      hasAddOns: addOnState?.addOns?.addOnMetaData?.length > 0};
  }, shallowEqual);
  const integrationAppMetadata = useSelector(state =>
    selectors.integrationAppMappingMetadata(state, integrationId)
  );
  const isUserInErrMgtTwoDotZero = useSelector(state =>
    selectors.isOwnerUserInErrMgtTwoDotZero(state)
  );
  const isParent = childId === integrationId;
  const availableTabs = useMemo(() => getTopLevelTabs({
    tabs: getAllTabs(isUserInErrMgtTwoDotZero),
    isIntegrationApp,
    isParent,
    integrationId,
    hasAddOns,
    supportsChild,
    children,
    isMonitorLevelUser,
    hideSettingsTab,
  }), [children,
    hasAddOns,
    hideSettingsTab,
    integrationId,
    isIntegrationApp,
    isMonitorLevelUser,
    isParent,
    supportsChild,
    isUserInErrMgtTwoDotZero]);
  const [isDeleting, setIsDeleting] = useState(false);
  const templateUrlName = useSelector(state => {
    if (templateId) {
      const template = selectors.resource(
        state,
        'marketplacetemplates',
        templateId
      );

      return getTemplateUrlName(template?.applications);
    }

    return null;
  });
  const flowsFilterConfig = useMemo(
    () => ({
      type: 'flows',
      filter: {
        _integrationId:
          integrationId === STANDALONE_INTEGRATION.id
            ? undefined
            : integrationId,
      },
    }),
    [integrationId]
  );
  const flows = useSelectorMemo(
    selectors.makeResourceListSelector,
    flowsFilterConfig
  ).resources;
  const cantDelete = flows.length > 0;
  const patchIntegration = useCallback(
    (path, value) => {
      // TODO: need to revisit after IA2.0 behavior is clear.
      // Potential change to switch to PATCH call (instead of PUT)
      const patchSet = [{ op: 'replace', path, value }];

      dispatch(actions.resource.patchStaged(integrationId, patchSet, 'value'));
      dispatch(
        actions.resource.commitStaged('integrations', integrationId, 'value')
      );
    },
    [dispatch, integrationId]
  );
  const handleTitleChange = useCallback(
    title => {
      patchIntegration('/name', title);
    },
    [patchIntegration]
  );
  const handleAddNewStore = useCallback(() => {
    dispatch(actions.integrationApp.installer.initChild(integrationId));
  }, [integrationId, dispatch]);
  const handleDelete = useCallback(() => {
    if (cantDelete) {
      enqueueSnackbar({
        message: INTEGRATION_DELETE_VALIDATE,
        variant: 'info',
      });

      return;
    }
    confirmDialog({
      title: 'Confirm delete',
      message: 'Are you sure you want to delete this integration?',
      buttons: [
        {
          label: 'Delete',
          onClick: () => {
            dispatch(actions.resource.delete('integrations', integrationId));
            setIsDeleting(true);
          },
        },
        {
          label: 'Cancel',
          color: 'secondary',
        },
      ],
    });
  }, [
    cantDelete,
    confirmDialog,
    dispatch,
    enqueueSnackbar,
    integrationId,
  ]);
  const handleStoreChange = useCallback(
    e => {
      const newChildId = e.target.value;
      let newTab = tab;
      const childIntegration = integrations.find(i => i._id === newChildId);

      if (childIntegration) {
        if (childIntegration.mode === 'install') {
          return history.push(
            getRoutePath(
              `integrationapps/${getIntegrationAppUrlName(childIntegration.name)}/${childIntegration._id}/setup`
            )
          );
        } if (childIntegration.mode === 'uninstall') {
          return history.push(
            getRoutePath(
              `integrationapps/${getIntegrationAppUrlName(childIntegration.name)}/${childIntegration._id}/uninstall`
            )
          );
        }
      }

      if (!availableTabs.find(tab => tab.path === tab)) {
        newTab = availableTabs[0].path;
      }

      // Redirect to current tab of new store
      history.push(
        getRoutePath(
          `integrationapps/${getIntegrationAppUrlName(name)}/${integrationId}/child/${newChildId}/${newTab}`
        )
      );
    },
    [availableTabs, history, name, integrationId, tab, integrations]
  );
  const handleDescriptionChange = useCallback(
    description => {
      patchIntegration('/description', description);
    },
    [patchIntegration]
  );
  const handleTagChangeHandler = useCallback(
    tag => {
      patchIntegration('/tag', tag);
    },
    [patchIntegration]
  );

  if (!hasIntegration && isDeleting) {
    ['integrations', 'tiles', 'scripts'].forEach(resource =>
      dispatch(actions.resource.requestCollection(resource))
    );

    setIsDeleting(false);
    history.push(getRoutePath('dashboard'));
  }

  // If this integration does not belong to this environment, then switch the environment.
  if (hasIntegration && !!sandbox !== (currentEnvironment === 'sandbox')) {
    dispatch(
      actions.user.preferences.update({
        environment: sandbox ? 'sandbox' : 'production',
      })
    );
  }

  useEffect(() => {
    if (isIntegrationApp && !addOnStatus) {
      dispatch(
        actions.integrationApp.settings.requestAddOnLicenseMetadata(
          integrationId
        )
      );
    }
  }, [addOnStatus, isIntegrationApp, dispatch, integrationId]);

  useEffect(() => {
    if (isIntegrationApp && !integrationAppMetadata.status) {
      dispatch(
        actions.integrationApp.settings.requestMappingMetadata(integrationId)
      );
    }
  }, [dispatch, isIntegrationApp, integrationAppMetadata, integrationId]);

  useEffect(() => {
    if (redirectTo) {
      const path = generatePath(match.path, {
        integrationId,
        integrationAppName,
        childId,
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
    childId,
  ]);

  useEffect(() => {
    if (templateUrlName && !templateName) {
      history.push(
        getRoutePath(`templates/${templateUrlName}/${integrationId}/flows`)
      );
    }
  }, [history, integrationId, templateName, templateUrlName]);
  useEffect(() => {
    if (
      childIntegration?.mode === 'install'
    ) {
      history.push(
        getRoutePath(`/integrationapps/${integrationChildAppName}/${childIntegration._id}/setup`)
      );
      dispatch(
        actions.resource.clearChildIntegration()
      );
    }
  }, [dispatch, history, childIntegration, integrationChildAppName]);

  if (supportsChild && isIntegrationApp) {
    if (!childId) {
      return (
        <Redirect
          push={false}
          to={getRoutePath(`/integrationapps/${integrationAppName}/${integrationId}/child/${defaultChild}/${tab ||
            'settings'}`)}
        />
      );
    }
  }
  if (!tab && isIntegrationApp) {
    return (
      <Redirect
        push={false}
        to={`${match.url}/${childId === integrationId ? 'settings' : 'flows'}`}
      />
    );
  }
  let redirectToPage;

  if (currentChildMode === 'uninstall') {
    redirectToPage = getRoutePath(
      `integrationapps/${integrationAppName}/${integrationId}/uninstall/${childId}`
    );
  } else if (installSteps?.length && mode === 'install') {
    redirectToPage = getRoutePath(
      `integrationapps/${integrationAppName}/${integrationId}/setup`
    );
  } else if (uninstallSteps?.length && mode === 'uninstall') {
    redirectToPage = getRoutePath(
      `integrationapps/${integrationAppName}/${integrationId}/uninstall${
        childId ? `/${childId}` : ''
      }`
    );
  }

  if (redirectToPage) {
    return <Redirect push={false} to={redirectToPage} />;
  }

  // TODO: <ResourceDrawer> Can be further optimized to take advantage
  // of the 'useRouteMatch' hook now available in react-router-dom to break
  // the need for parent components passing any props at all.
  return (
    <>
      <ResourceDrawer match={match} />
      <QueuedJobsDrawer />
      <LoadResources required resources="integrations,marketplacetemplates">
        <CeligoPageBar
          title={
            (hasIntegration && !isIntegrationApp) ? (
              <EditableText
                text={name}
                disabled={!canEdit}
                defaultText="Unnamed integration: Click to add name"
                onChange={handleTitleChange}
                inputClassName={
                  drawerOpened
                    ? classes.editableTextInputShift
                    : classes.editableTextInput
                }
              />
            ) : (
              pageTitle
            )
          }
          titleTag={isIntegrationApp && (
            <ChipInput
              disabled={!canEdit}
              value={tag || 'tag'}
              className={classes.tag}
              variant="outlined"
              onChange={handleTagChangeHandler}
          />
          )}
          infoText={
            hasIntegration ? (
              <EditableText
                multiline
                allowOverflow
                text={description}
                defaultText="Click to add a description"
                onChange={handleDescriptionChange}
              />
            ) : (
              undefined
            )
          }>
          {canClone && hasIntegration && (
            <IconTextButton
              component={Link}
              to={getRoutePath(`/clone/integrations/${integrationId}/preview`)}
              variant="text"
              data-test="cloneIntegration">
              <CopyIcon /> Clone integration
            </IconTextButton>
          )}
          {/* Sravan needs to move add store functionality to integrationApps */}
          { supportsChild && (
            <>
              <IconTextButton
                onClick={handleAddNewStore}
                variant="text"
                data-test="addNewStore">
                <AddIcon /> Add new child
              </IconTextButton>
              <CeligoSelect
                displayEmpty
                data-test="select Child"
                className={classes.storeSelect}
                onChange={handleStoreChange}
                IconComponent={ArrowDownIcon}
                value={childId}>

                {children.map(s => (
                  <MenuItem key={s.value} value={s.value}>
                    {s.label}
                  </MenuItem>
                ))}
              </CeligoSelect>
            </>
          )}

          {canDelete && hasIntegration && !isIntegrationApp && (
            <IconTextButton
              variant="text"
              data-test="deleteIntegration"
              onClick={handleDelete}>
              <TrashIcon /> Delete integration
            </IconTextButton>
          )}
        </CeligoPageBar>

        <IntegrationTabs
          tabs={availableTabs}
          match={match}
          className={classes.pageWrapper}
        />
      </LoadResources>
    </>
  );
}
