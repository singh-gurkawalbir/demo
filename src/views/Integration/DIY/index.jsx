import { Fragment, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import * as selectors from '../../../reducers';
import actions from '../../../actions';
import LoadResources from '../../../components/LoadResources';
import TrashIcon from '../../../components/icons/TrashIcon';
import CopyIcon from '../../../components/icons/CopyIcon';
// TODO: Azhar, please update these next 3 icons, once provided by the product team.
import FlowsIcon from '../../../components/icons/FlowBuilderIcon';
import AdminIcon from '../../../components/icons/SettingsIcon';
import DashboardIcon from '../../../components/icons/AdjustInventoryIcon';
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

export default function Integration({ match }) {
  const dispatch = useDispatch();
  const { integrationId } = match.params;
  const integration = useSelector(state =>
    selectors.resource(state, 'integrations', integrationId)
  );
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

          <IconTextButton variant="text" data-test="deleteIntegration">
            <TrashIcon /> Delete integration
          </IconTextButton>
        </CeligoPageBar>

        <IntegrationTabs tabs={tabs} match={match} />
      </LoadResources>
    </Fragment>
  );
}
