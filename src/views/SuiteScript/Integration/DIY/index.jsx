import { Fragment, useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import * as selectors from '../../../../reducers';
import actions from '../../../../actions';
import LoadSuiteScriptResources from '../../../../components/SuiteScript/LoadResources';
import FlowsIcon from '../../../../components/icons/FlowsIcon';
import DashboardIcon from '../../../../components/icons/DashboardIcon';
import ConnectionsIcon from '../../../../components/icons/ConnectionsIcon';
import CeligoPageBar from '../../../../components/CeligoPageBar';
import ResourceDrawer from '../../../../components/SuiteScript/drawer/Resource';
import EditableText from '../../../../components/EditableText';
import SettingsPanel from './panels/Admin';
import FlowsPanel from './panels/Flows';
import ConnectionsPanel from './panels/Connections';
import DashboardPanel from './panels/Dashboard';
import getRoutePath from '../../../../utils/routePaths';
// import IntegrationTabs from '../common/Tabs';
import useConfirmDialog from '../../../../components/ConfirmDialog';
import useEnqueueSnackbar from '../../../../hooks/enqueueSnackbar';
import SettingsIcon from '../../../../components/icons/SettingsIcon';
import IntegrationTabs from '../common/Tabs';

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
    path: 'settings',
    label: 'Settings',
    Icon: SettingsIcon,
    Panel: SettingsPanel,
  },
];

export default function Integration({ match }) {
  const classes = useStyles();
  const { ssLinkedConnectionId, integrationId } = match.params;
  const drawerOpened = useSelector(state => selectors.drawerOpened(state));
  const integration = useSelector(state =>
    selectors.suiteScriptResource(state, {
      resourceType: 'integrations',
      id: integrationId,
      ssLinkedConnectionId,
    })
  );

  // TODO: <ResourceDrawer> Can be further optimized to take advantage
  // of the 'useRouteMatch' hook now available in react-router-dom to break
  // the need for parent components passing any props at all.
  return (
    <Fragment>
      <ResourceDrawer match={match} />

      <LoadSuiteScriptResources
        required
        ssLinkedConnectionId={ssLinkedConnectionId}
        integrationId={integrationId}
        resources="flows,connections">
        <CeligoPageBar
          title={
            integration && (
              <EditableText
                text={integration.name}
                // onChange={handleTitleChange}
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
      </LoadSuiteScriptResources>
    </Fragment>
  );
}
