import React, { useCallback } from 'react';
import { useHistory, useRouteMatch, generatePath } from 'react-router-dom';
import { TabContext, TabList, TabPanel, Tab } from '@celigo/fuse-ui';
import Completed from '../panels/Completed';
import Running from '../panels/Running';
import AdminDashboardPanel from '../panels/AdminDashboard';
import RunningIcon from '../../../components/icons/RunningFlowsIcon';
import CompletedIcon from '../../../components/icons/CompletedFlowsIcon';
import ConnectionsIcon from '../../../components/icons/ConnectionsIcon';
import PageContent from '../../../components/PageContent';

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
    <TabContext value={currentTabIndex}>
      <PageContent>
        <TabList
          variant="scrollable"
          aria-label="scrollable auto tabs example"
          onChange={handleTabChange}
        >
          {tabs.map(({ label, Icon, dataTest }, i) => (
            <Tab
              sx={{ minWidth: 'auto !important' }}
              key={label}
              id={`tab-${i}`}
              aria-controls={`tabpanel-${i}`}
              icon={<Icon />}
              label={label}
              data-test={dataTest}
          />
          ))}
        </TabList>

        {tabs.map(({ path, Panel }, i) => (
          <TabPanel
            key={path}
            value={i}
            id={`tabpanel-${i}`}
            aria-labelledby={`tab-${i}`}
            >
            <Panel {...match.params} />
          </TabPanel>
        ))}
      </PageContent>
    </TabContext>
  );
}
