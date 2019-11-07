import { useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { makeStyles, Tabs, Tab } from '@material-ui/core';
import * as selectors from '../../reducers';
import LoadResources from '../../components/LoadResources';
import TrashIcon from '../../components/icons/TrashIcon';
import CopyIcon from '../../components/icons/CopyIcon';
// TODO: Azhar, please update these next 3 icons, once provided by the product team.
import FlowIcon from '../../components/icons/FlowBuilderIcon';
import AdminIcon from '../../components/icons/SettingsIcon';
import DashboardIcon from '../../components/icons/AdjustInventoryIcon';
import ConnectionsIcon from '../../components/icons/ConnectionsIcon';
import IconTextButton from '../../components/IconTextButton';
import CeligoPageBar from '../../components/CeligoPageBar';
import AdminPanel from './panels/Admin';
import FlowsPanel from './panels/Flows';
import ConnectionsPanel from './panels/Connections';
import DashboardPanel from './panels/Dashboard';

const tabs = ['flows', 'dashboard', 'connections', 'admin'];
const useStyles = makeStyles(theme => ({
  tabContainer: {
    padding: theme.spacing(0, 3),
  },
  tabPanel: {
    border: 'solid 1px',
    borderColor: theme.palette.secondary.lightest,
  },
}));

function TabPanel({ children, currentTab, index, classes }) {
  return (
    <div
      role="tabpanel"
      hidden={currentTab !== index}
      className={classes.tabPanel}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}>
      <div>{children}</div>
    </div>
  );
}

export default function Integration({ match }) {
  const classes = useStyles();
  const history = useHistory();
  const { integrationId, tab } = match.params;
  const integration = useSelector(state =>
    selectors.resource(state, 'integrations', integrationId)
  );
  const currentTabIndex = tabs.findIndex(t => t === tab);

  function handleTabChange(event, newTabIndex) {
    const newTab = tabs[newTabIndex];
    const parts = match.url.split('/');

    parts[parts.length - 1] = newTab;

    const newUrl = parts.join('/');

    console.log('new tab:', newUrl);

    history.push(newUrl);
  }

  function tabProps(index) {
    return {
      classes: {
        root: classes.muiTabRoot,
        wrapper: classes.muiTabWrapper,
      },
      id: `tab-${index}`,
      'aria-controls': `tabpanel-${index}`,
    };
  }

  return (
    <LoadResources required resources="integrations">
      <CeligoPageBar
        title={integration ? integration.name : 'Standalone integrations'}>
        <IconTextButton component={Link} to="clone" variant="text">
          <CopyIcon /> Clone integration
        </IconTextButton>

        <IconTextButton variant="text">
          <TrashIcon /> Delete integration
        </IconTextButton>
      </CeligoPageBar>

      <div className={classes.tabContainer}>
        <Tabs
          value={currentTabIndex}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
          aria-label="scrollable auto tabs example">
          <Tab {...tabProps(1)} icon={<FlowIcon />} label="Flows" />
          <Tab {...tabProps(2)} icon={<DashboardIcon />} label="Dashboard" />
          <Tab
            {...tabProps(3)}
            icon={<ConnectionsIcon />}
            label="Connections"
          />
          <Tab {...tabProps(4)} icon={<AdminIcon />} label="Admin" />
        </Tabs>

        <TabPanel currentTab={currentTabIndex} index={0} classes={classes}>
          <FlowsPanel integrationId={integrationId} />
        </TabPanel>
        <TabPanel currentTab={currentTabIndex} index={1} classes={classes}>
          <DashboardPanel integrationId={integrationId} />
        </TabPanel>
        <TabPanel currentTab={currentTabIndex} index={2} classes={classes}>
          <ConnectionsPanel integrationId={integrationId} />
        </TabPanel>
        <TabPanel currentTab={currentTabIndex} index={3} classes={classes}>
          <AdminPanel integrationId={integrationId} />
        </TabPanel>
      </div>
    </LoadResources>
  );
}
