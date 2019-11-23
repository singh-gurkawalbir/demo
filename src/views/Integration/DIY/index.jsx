import { Fragment, useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import * as selectors from '../../../reducers';
import actions from '../../../actions';
import LoadResources from '../../../components/LoadResources';
import TrashIcon from '../../../components/icons/TrashIcon';
import CopyIcon from '../../../components/icons/CopyIcon';
import FlowsIcon from '../../../components/icons/FlowsIcon';
import AdminIcon from '../../../components/icons/AdminIcon';
import DashboardIcon from '../../../components/icons/DashboardIcon';
import ConnectionsIcon from '../../../components/icons/ConnectionsIcon';
import IconTextButton from '../../../components/IconTextButton';
import CeligoPageBar from '../../../components/CeligoPageBar';
import ResourceDrawer from '../../../components/drawer/Resource';
import EditableText from '../../../components/EditableText';
import AdminPanel from './panels/Admin';
import FlowsPanel from './panels/Flows';
import ConnectionsPanel from './panels/Connections';
import DashboardPanel from './panels/Dashboard';
import getRoutePath from '../../../utils/routePaths';
import IntegrationTabs from '../common/Tabs';
import { INTEGRATION_DELETE_VALIDATE } from '../../../utils/messageStore';
import { STANDALONE_INTEGRATION } from '../../../utils/constants';
import { confirmDialog } from '../../../components/ConfirmDialog';
import useEnqueueSnackbar from '../../../hooks/enqueueSnackbar';

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

export default function Integration({ history, match }) {
  const { integrationId } = match.params;
  const dispatch = useDispatch();
  const [enqueueSnackbar] = useEnqueueSnackbar();
  const integration = useSelector(state =>
    selectors.resource(state, 'integrations', integrationId)
  );
  const [isDeleting, setIsDeleting] = useState(false);
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
          {integration && (
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

          <IconTextButton
            variant="text"
            data-test="deleteIntegration"
            onClick={handleDelete}>
            <TrashIcon /> Delete integration
          </IconTextButton>
        </CeligoPageBar>

        <IntegrationTabs tabs={tabs} match={match} />
      </LoadResources>
    </Fragment>
  );
}
