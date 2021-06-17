import React, { useCallback } from 'react';
import { useHistory, useRouteMatch, generatePath } from 'react-router-dom';
import { makeStyles, Tabs, Tab } from '@material-ui/core';
import Completed from '../panels/Completed';
import Running from '../panels/Running';
import RunningIcon from '../../../components/icons/DashboardIcon';
import CompletedIcon from '../../../components/icons/ViewResolvedHistoryIcon';

const useStyles = makeStyles(theme => ({
  tabContainer: {
    padding: theme.spacing(0, 3),
  },
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

export default function DashboardTabs() {
  const classes = useStyles();
  const history = useHistory();
  const match = useRouteMatch();
  const tabs = [
    { path: 'runningFlows', label: 'Running flows', Icon: RunningIcon, Panel: Running },
    {
      path: 'completedFlows',
      label: 'Completed flows',
      Icon: CompletedIcon,
      Panel: Completed,
    }];
  const { tab } = match.params;
  let currentTabIndex = tabs.findIndex(t => t.path === tab);

  currentTabIndex = currentTabIndex === -1 ? 0 : currentTabIndex;
  const handleTabChange = useCallback(
    (event, newTabIndex) => {
      const newTab = tabs[newTabIndex].path;

      history.push(
        generatePath(match.path, {
          ...match.params,
          tab: newTab,
        })
      );
    },
    [history, match.params, match.path, tabs]
  );

  return (
    <div className={(classes.tabContainer, classes.pageWrapper)}>
      <Tabs
        value={currentTabIndex}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        variant="scrollable"
        scrollButtons="auto"
        aria-label="scrollable auto tabs example">
        {tabs.map(({ label, Icon }, i) => (
          <Tab
            className={classes.tab}
            key={label}
            id={`tab-${i}`}
            {...{ 'aria-controls': `tabpanel-${i}` }}
            icon={<Icon />}
            label={label}
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
    </div>
  );
}
