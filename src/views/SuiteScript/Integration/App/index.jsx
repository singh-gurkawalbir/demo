import makeStyles from '@mui/styles/makeStyles';
import { Chip } from '@mui/material';
import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {EditableText} from '@celigo/fuse-ui';
import actions from '../../../../actions';
import CeligoPageBar from '../../../../components/CeligoPageBar';
import ConnectionsIcon from '../../../../components/icons/ConnectionsIcon';
import SettingsIcon from '../../../../components/icons/SettingsIcon';
import DashboardIcon from '../../../../components/icons/DashboardIcon';
import FlowsIcon from '../../../../components/icons/FlowsIcon';
import ResourceDrawer from '../../../../components/SuiteScript/drawer/Resource';
import LoadResources from '../../../../components/LoadResources';
import LoadSuiteScriptResources from '../../../../components/SuiteScript/LoadResources';
import { selectors } from '../../../../reducers';
import SuiteScriptMappingDrawer from '../../Mappings/Drawer';
import IntegrationTabs from '../common/Tabs';
import ConnectionsPanel from '../DIY/panels/Connections';
import DashboardPanel from '../DIY/panels/Dashboard';
import FlowsPanel from './panels/Flows';
import SettingsPanel from './panels/Settings';
import TabContent from '../../../../components/TabContent';

const useStyles = makeStyles(theme => ({
  tag: {
    marginLeft: theme.spacing(1),
  },
}));
const tabs = [
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
          integrationId,
          [{ op: 'replace', path: '/name', value: title }],
          ssLinkedConnectionId,
          integrationId,
          'integrations'
        )
      );
      dispatch(
        actions.suiteScript.resource.commitStaged(
          integrationId,
          ssLinkedConnectionId,
          integrationId,
          'integrations'
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
      <ResourceDrawer />
      <LoadResources required resources="integrations, connections">
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
          {/* Add Suitescript flow related component */}
          <SuiteScriptMappingDrawer
            ssLinkedConnectionId={ssLinkedConnectionId}
            integrationId={integrationId}
        />
        </LoadSuiteScriptResources>
      </LoadResources>
    </>
  );
}
