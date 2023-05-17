import React, { useCallback } from 'react';
import { useHistory, useRouteMatch, generatePath } from 'react-router-dom';
import { Tabs, Tab } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import Completed from '../panels/Completed';
import Running from '../panels/Running';
import AdminDashboardPanel from '../panels/AdminDashboard';
import RunningIcon from '../../../components/icons/RunningFlowsIcon';
import CompletedIcon from '../../../components/icons/CompletedFlowsIcon';
import ConnectionsIcon from '../../../components/icons/ConnectionsIcon';
import TabContent from '../../../components/TabContent';

const useStyles = makeStyles(theme => ({
  tabContainer: {
    padding: theme.spacing(0, 3),
  },
  tabPanel: {
    background: theme.palette.background.paper,
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    padding: theme.spacing(1, 2),
    overflow: 'visible',
  },
  tab: {
    minWidth: 'auto',
    color: theme.palette.secondary.main,
    fontSize: 14,
  },
}));
const tabs = [
  {
    path: 'runningFlows',
    label: 'Running flows',
    Icon: RunningIcon,
    Panel: Running,
    dataTest: 'account-dashboard-running-flows',
  },
  {
    path: 'completedFlows',
    label: 'Completed flows',
    Icon: CompletedIcon,
    Panel: Completed,
    dataTest: 'account-dashboard-completed-flows',
  },
  {
    path: 'adminDashboard',
    label: 'Admin Dashboard',
    Icon: ConnectionsIcon,
    Panel: AdminDashboardPanel,
    dataTest: 'account-dashboard-completed-flows',
  },
];
export default function DashboardTabs() {
  const classes = useStyles();
  const history = useHistory();
  const match = useRouteMatch();

  const { dashboardTab } = match.params;

  let currentTabIndex = tabs.findIndex(t => t.path === dashboardTab);

  currentTabIndex = currentTabIndex === -1 ? 0 : currentTabIndex;
  const handleTabChange = useCallback(
    (event, newTabIndex) => {
      const newTab = tabs[newTabIndex].path;

      history.push(
        generatePath(match.path, {
          ...match.params,
          dashboardTab: newTab,
        })
      );
    },
    [history, match.params, match.path]
  );

  // props.func(match.params.dashboardTab);

  return (
    <TabContent>
      <Tabs
        value={currentTabIndex}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        variant="scrollable"
        scrollButtons="auto"
        aria-label="scrollable auto tabs example">
        {tabs.map(({ label, Icon, dataTest }, i) => (
          <Tab
            className={classes.tab}
            key={label}
            id={`tab-${i}`}
            {...{ 'aria-controls': `tabpanel-${i}` }}
            icon={<Icon />}
            label={label}
            data-test={dataTest}
          />
        ))}
      </Tabs>

      {tabs.map(({ path, Panel }, i) => (
        <div
          key={path}
          role="tabpanel"
          hidden={currentTabIndex !== i}
          className={classes.tabPanel}
          id={`tabpanel-${i}`}
          aria-labelledby={`tab-${i}`}>
          <div>{currentTabIndex === i && <Panel {...match.params} />}</div>
        </div>
      ))}
    </TabContent>
  );
}
