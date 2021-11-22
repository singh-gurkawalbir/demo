import React, { useCallback } from 'react';
import { useHistory, useRouteMatch, generatePath } from 'react-router-dom';
import {useSelector} from 'react-redux';
import { makeStyles, Tabs, Tab } from '@material-ui/core';
import { selectors } from '../../../../reducers';

// TODO: Azhar check tab panels are working fine or not without these styles everywhere
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

export default function IntegrationTabs({ tabs, className }) {
  const classes = useStyles();
  const history = useHistory();
  const match = useRouteMatch();
  const { tab, childId } = match.params;
  let currentTabIndex = tabs.findIndex(t => t.path === tab);
  const isUserInErrMgtTwoDotZero = useSelector(state =>
    selectors.isOwnerUserInErrMgtTwoDotZero(state)
  );
  // dashboardTab: isUserInErrMgtTwoDotZero && newTab === 'dashboard' && 'runningFlows',

  // if you cant find tab index default it to zero
  currentTabIndex = currentTabIndex === -1 ? 0 : currentTabIndex;
  const handleTabChange = useCallback(
    (event, newTabIndex) => {
      const newTab = tabs[newTabIndex].path;
      let path = generatePath(match.path, {
        ...match.params,
        tab: newTab,
      });

      if (isUserInErrMgtTwoDotZero && newTab !== 'dashboard') {
        if (path.includes('/runningFlows')) {
          path = path.replace('/runningFlows', '');
        } else {
          path = path.replace('/completedFlows', '');
        }
      }
      history.push(path);
    },
    [history, isUserInErrMgtTwoDotZero, match.params, match.path, tabs]
  );

  return (
    <div className={(classes.tabContainer, className)}>
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
          <div>{currentTabIndex === i && <Panel {...match.params} childId={childId} />}</div>
        </div>
      ))}
    </div>
  );
}
