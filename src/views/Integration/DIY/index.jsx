import { Fragment, useCallback, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import * as selectors from '../../../reducers';
import actions from '../../../actions';
import LoadResources from '../../../components/LoadResources';
import TrashIcon from '../../../components/icons/TrashIcon';
import AuditLogIcon from '../../../components/icons/AuditLogIcon';
import CopyIcon from '../../../components/icons/CopyIcon';
import FlowsIcon from '../../../components/icons/FlowsIcon';
import UsersIcon from '../../../components/icons/InviteUsersIcon';
import DashboardIcon from '../../../components/icons/DashboardIcon';
import ConnectionsIcon from '../../../components/icons/ConnectionsIcon';
import IconTextButton from '../../../components/IconTextButton';
import CeligoPageBar from '../../../components/CeligoPageBar';
import ResourceDrawer from '../../../components/drawer/Resource';
import EditableText from '../../../components/EditableText';
import AuditLogPanel from './panels/AuditLog';
import SettingsPanel from './panels/Admin';
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
import SettingsIcon from '../../../components/icons/SettingsIcon';
import { getTemplateUrlName } from '../../../utils/template';
import QueuedJobsDrawer from '../../../components/JobDashboard/QueuedJobs/QueuedJobsDrawer';

const useStyles = makeStyles(theme => ({
  PageWrapper: {
    padding: theme.spacing(3),
    '& > [role = tabpanel]': {
      background: 'none',
      padding: 0,
      border: 'none',
    },
  },
  editableTextInput: {
    width: `calc(60vw - ${52 + 24}px)`,
  },
  editableTextInputShift: {
    width: `calc(60vw - ${theme.drawerWidth + 24}px)`,
  },
}));
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
  {
    path: 'users',
    label: 'Users',
    Icon: UsersIcon,
    Panel: UsersPanel,
  },
  {
    path: 'auditlog',
    label: 'Audit Log',
    Icon: AuditLogIcon,
    Panel: AuditLogPanel,
  },

  {
    path: 'settings',
    label: 'Settings',
    Icon: SettingsIcon,
    Panel: SettingsPanel,
  },
];

export default function Integration({ history, match }) {
  const classes = useStyles();
  const { integrationId, templateName } = match.params;
  const dispatch = useDispatch();
  const [enqueueSnackbar] = useEnqueueSnackbar();
  const { confirmDialog } = useConfirmDialog();
  const integration = useSelector(state =>
    selectors.resource(state, 'integrations', integrationId)
  );
  const permission = useSelector(state =>
    selectors.resourcePermissions(state, 'integrations', integrationId)
  );
  const drawerOpened = useSelector(state => selectors.drawerOpened(state));
  const currentEnvironment = useSelector(state =>
    selectors.currentEnvironment(state)
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const templateUrlName = useSelector(state => {
    if (integration && integration._templateId) {
      const template = selectors.resource(
        state,
        'marketplacetemplates',
        integration._templateId
      );

      return getTemplateUrlName(template && template.applications);
    }

    return null;
  });
  const cantDelete = useSelector(state => {
    const flows = selectors.resourceList(state, {
      type: 'flows',
      filter: {
        _integrationId:
          integrationId === STANDALONE_INTEGRATION.id
            ? undefined
            : integrationId,
      },
    }).resources;

    return flows.length > 0;
  });
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

  function handleDelete() {
    if (cantDelete) {
      enqueueSnackbar({
        message: INTEGRATION_DELETE_VALIDATE,
        variant: 'info',
      });

      return;
    }

    const name = integration ? integration.name : integrationId;

    confirmDialog({
      title: 'Confirm',
      message: `Are you sure you want to delete ${name} integration?`,
      buttons: [
        {
          label: 'Cancel',
        },
        {
          label: 'Yes',
          onClick: () => {
            dispatch(actions.resource.delete('integrations', integrationId));
            setIsDeleting(true);
          },
        },
      ],
    });
  }

  function handleDescriptionChange(description) {
    patchIntegration('/description', description);
  }

  if (!integration && isDeleting) {
    ['integrations', 'tiles', 'scripts'].forEach(resource =>
      dispatch(actions.resource.requestCollection(resource))
    );

    setIsDeleting(false);
    history.push(getRoutePath('dashboard'));
  }

  // If this integration does not belong to this environment, then switch the environment.
  if (
    integration &&
    !!integration.sandbox !== (currentEnvironment === 'sandbox')
  ) {
    dispatch(
      actions.user.preferences.update({
        environment: integration.sandbox ? 'sandbox' : 'production',
      })
    );
  }

  useEffect(() => {
    if (templateUrlName && !templateName) {
      history.push(
        getRoutePath(`templates/${templateUrlName}/${integrationId}/flows`)
      );
    }
  }, [history, integrationId, templateName, templateUrlName]);

  // TODO: <ResourceDrawer> Can be further optimized to take advantage
  // of the 'useRouteMatch' hook now available in react-router-dom to break
  // the need for parent components passing any props at all.
  return (
    <Fragment>
      <ResourceDrawer match={match} />
      <QueuedJobsDrawer />
      <LoadResources required resources="integrations,marketplacetemplates">
        <CeligoPageBar
          title={
            integration ? (
              <EditableText
                text={integration.name}
                disabled={!permission.edit}
                defaultText={`Unnamed: (${integration}) Click to add name`}
                onChange={handleTitleChange}
                inputClassName={
                  drawerOpened
                    ? classes.editableTextInputShift
                    : classes.editableTextInput
                }
              />
            ) : (
              'Standalone integrations'
            )
          }
          infoText={
            integration ? (
              <EditableText
                multiline
                allowOverflow
                text={integration.description}
                defaultText="Click to add a description"
                onChange={handleDescriptionChange}
              />
            ) : (
              undefined
            )
          }>
          {permission.clone && integration && (
            <IconTextButton
              component={Link}
              to={getRoutePath(
                `/clone/integrations/${integration._id}/preview`
              )}
              variant="text"
              data-test="cloneIntegration">
              <CopyIcon /> Clone integration
            </IconTextButton>
          )}

          {permission.delete && integration && (
            <IconTextButton
              variant="text"
              data-test="deleteIntegration"
              onClick={handleDelete}>
              <TrashIcon /> Delete integration
            </IconTextButton>
          )}
        </CeligoPageBar>

        <IntegrationTabs
          tabs={tabs}
          match={match}
          className={classes.PageWrapper}
        />
      </LoadResources>
    </Fragment>
  );
}
