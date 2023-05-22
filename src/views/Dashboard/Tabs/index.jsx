import React, { useCallback } from 'react';
import { useHistory, useRouteMatch, generatePath } from 'react-router-dom';
import makeStyles from '@mui/styles/makeStyles';
import { Tabs, Tab, Box } from '@mui/material';
import Completed from '../panels/Completed';
import Running from '../panels/Running';
import RunningIcon from '../../../components/icons/RunningFlowsIcon';
import CompletedIcon from '../../../components/icons/CompletedFlowsIcon';
import TabContent from '../../../components/TabContent';

// eslint-disable-next-line no-unused-vars
const useStyles = makeStyles(theme => ({
  tabContainer: {
    padding: theme.spacing(0, 3),
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
  }];

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
            key={label}
            id={`tab-${i}`}
            {...{ 'aria-controls': `tabpanel-${i}` }}
            icon={<Icon />}
            label={label}
            data-test={dataTest}
            sx={{
              minWidth: 'auto',
              color: theme => theme.palette.secondary.main,
              fontSize: 14,
            }}
          />
        ))}
      </Tabs>

      {tabs.map(({ path, Panel }, i) => (
        <Box
          key={path}
          role="tabpanel"
          hidden={currentTabIndex !== i}
          id={`tabpanel-${i}`}
          aria-labelledby={`tab-${i}`}
          sx={{
            background: theme => theme.palette.background.paper,
            border: '1px solid',
            borderColor: theme => theme.palette.secondary.lightest,
            padding: theme => theme.spacing(1, 0),
            overflow: 'visible',
          }}
        >
          <div>{currentTabIndex === i && <Panel {...match.params} />}</div>
        </Box>
      ))}
    </TabContent>
  );
}
