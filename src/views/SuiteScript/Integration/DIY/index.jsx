import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Chip } from '@material-ui/core';
import { selectors } from '../../../../reducers';
import LoadResources from '../../../../components/LoadResources';
import LoadSuiteScriptResources from '../../../../components/SuiteScript/LoadResources';
import FlowsIcon from '../../../../components/icons/FlowsIcon';
import DashboardIcon from '../../../../components/icons/DashboardIcon';
import ConnectionsIcon from '../../../../components/icons/ConnectionsIcon';
import CeligoPageBar from '../../../../components/CeligoPageBar';
import ResourceDrawer from '../../../../components/SuiteScript/drawer/Resource';
import EditableText from '../../../../components/EditableText';
import AdminPanel from './panels/Admin';
import FlowsPanel from './panels/Flows';
import ConnectionsPanel from './panels/Connections';
import DashboardPanel from './panels/Dashboard';
// import IntegrationTabs from '../common/Tabs';
import SettingsIcon from '../../../../components/icons/SingleUserIcon';
import IntegrationTabs from '../common/Tabs';
import actions from '../../../../actions';

const useStyles = makeStyles(theme => ({
  pageWrapper: {
    padding: theme.spacing(3),
    maxHeight: `calc(100vh - (${theme.appBarHeight}px + ${theme.pageBarHeight}px))`,
    overflowY: 'auto',
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
  const drawerOpened = useSelector(state => selectors.drawerOpened(state));
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
          'value',
        )
      );
      dispatch(
        actions.suiteScript.resource.commitStaged(
          ssLinkedConnectionId,
          null,
          'integrations',
          integrationId,
          'value',
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

          <IntegrationTabs
            tabs={tabs}
            match={match}
            className={classes.pageWrapper}
        />
        </LoadSuiteScriptResources>
      </LoadResources>
    </>
  );
}
