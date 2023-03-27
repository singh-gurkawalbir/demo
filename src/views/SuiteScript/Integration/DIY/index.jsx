import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import makeStyles from '@mui/styles/makeStyles';
import { Chip } from '@mui/material';
import {EditableText} from '@celigo/fuse-ui';
import { selectors } from '../../../../reducers';
import LoadResources from '../../../../components/LoadResources';
import LoadSuiteScriptResources from '../../../../components/SuiteScript/LoadResources';
import FlowsIcon from '../../../../components/icons/FlowsIcon';
import DashboardIcon from '../../../../components/icons/DashboardIcon';
import ConnectionsIcon from '../../../../components/icons/ConnectionsIcon';
import CeligoPageBar from '../../../../components/CeligoPageBar';
import ResourceDrawer from '../../../../components/SuiteScript/drawer/Resource';
import AdminPanel from './panels/Admin';
import FlowsPanel from './panels/Flows';
import ConnectionsPanel from './panels/Connections';
import DashboardPanel from './panels/Dashboard';
// import IntegrationTabs from '../common/Tabs';
import SettingsIcon from '../../../../components/icons/SingleUserIcon';
import IntegrationTabs from '../common/Tabs';
import actions from '../../../../actions';
import TabContent from '../../../../components/TabContent';

const useStyles = makeStyles(theme => ({
  // Todo (Azhar) Styles are repeating in suitescript
  tag: {
    marginLeft: theme.spacing(1),
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
    path: 'admin',
    label: 'Admin',
    Icon: SettingsIcon,
    Panel: AdminPanel,
  },
];

export default function Integration({ match }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { ssLinkedConnectionId, integrationId } = match.params;
  const isManageLevelUser = useSelector(state => selectors.userHasManageAccessOnSuiteScriptAccount(state, ssLinkedConnectionId));
  const integration = useSelector(state =>
    selectors.suiteScriptResource(state, {
      resourceType: 'integrations',
      id: integrationId,
      ssLinkedConnectionId,
    })
  );
  const ssLinkedConnection = useSelector(state => selectors.resource(state, 'connections', ssLinkedConnectionId));
  const canEdit = isManageLevelUser && integration && !integration.isNotEditable;

  const handleTitleChange = useCallback(
    title => {
      dispatch(
        actions.suiteScript.resource.patchStaged(
          ssLinkedConnectionId,
          'integrations',
          integrationId,
          [{ op: 'replace', path: '/name', value: title }],
        )
      );
      dispatch(
        actions.suiteScript.resource.commitStaged(
          ssLinkedConnectionId,
          null,
          'integrations',
          integrationId,
        )
      );
    },
    [dispatch, integrationId, ssLinkedConnectionId]
  );

  // TODO: <ResourceDrawer> Can be further optimized to take advantage
  // of the 'useRouteMatch' hook now available in react-router-dom to break
  // the need for parent components passing any props at all.
  return (
    <>
      <ResourceDrawer match={match} />
      <LoadResources required resources="integrations">
        <LoadSuiteScriptResources
          required
          ssLinkedConnectionId={ssLinkedConnectionId}
          integrationId={integrationId}
          resources="tiles,flows,connections">
          <CeligoPageBar
            title={
            integration && (
              <EditableText
                disabled={!canEdit}
                text={integration.displayName}
                onChange={handleTitleChange}
              />
            )
          }
            titleTag={
            ssLinkedConnection?.netsuite?.account && (
            <Chip
              disabled
              className={classes.tag}
              variant="outlined"
              label={`V2 ${ssLinkedConnection.netsuite.account}`}
              size="small"
            />
            )
            }
        />
          <TabContent>
            <IntegrationTabs tabs={tabs} match={match} />
          </TabContent>

        </LoadSuiteScriptResources>
      </LoadResources>
    </>
  );
}
