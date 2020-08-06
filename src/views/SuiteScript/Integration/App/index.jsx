import { makeStyles } from '@material-ui/core/styles';
import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import actions from '../../../../actions';
import CeligoPageBar from '../../../../components/CeligoPageBar';
import EditableText from '../../../../components/EditableText';
import ConnectionsIcon from '../../../../components/icons/ConnectionsIcon';
import SettingsIcon from '../../../../components/icons/SettingsIcon';
import DashboardIcon from '../../../../components/icons/DashboardIcon';
import FlowsIcon from '../../../../components/icons/FlowsIcon';
import ResourceDrawer from '../../../../components/SuiteScript/drawer/Resource';
import LoadResources from '../../../../components/LoadResources';
import LoadSuiteScriptResources from '../../../../components/SuiteScript/LoadResources';
import * as selectors from '../../../../reducers';
import SuiteScriptMappingDrawer from '../../Mappings/Drawer';
import IntegrationTabs from '../common/Tabs';
import ConnectionsPanel from '../DIY/panels/Connections';
import DashboardPanel from '../DIY/panels/Dashboard';
import FlowsPanel from './panels/Flows';
import SettingsPanel from './panels/Settings';

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
  const drawerOpened = useSelector(state => selectors.drawerOpened(state));
  const integration = useSelector(state =>
    selectors.suiteScriptResource(state, {
      resourceType: 'integrations',
      id: integrationId,
      ssLinkedConnectionId,
    })
  );
  const canEdit = isManageLevelUser && integration && !integration.isNotEditable;

  const handleTitleChange = useCallback(
    title => {
      dispatch(
        actions.suiteScript.resource.patchStaged(
          integrationId,
          [{ op: 'replace', path: '/name', value: title }],
          'value',
          ssLinkedConnectionId,
          integrationId,
          'integrations'
        )
      );
      dispatch(
        actions.suiteScript.resource.commitStaged(
          integrationId,
          'value',
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
                inputClassName={
                  drawerOpened
                    ? classes.editableTextInputShift
                    : classes.editableTextInput
                }
              />
            )
          }
        />

          <IntegrationTabs
            tabs={tabs}
            match={match}
            className={classes.PageWrapper}
        />
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
