import React, { useCallback } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { Tabs, Tab } from '@mui/material';

import makeStyles from '@mui/styles/makeStyles';

// TODO: Azhar check tab panels are working fine or not without these styles everywhere
const useStyles = makeStyles(theme => ({
  tabContainer: {
    padding: theme.spacing(0, 3),
  },
  tabPanel: {
    overflow: 'auto',
  },
  tab: {
    minWidth: 'auto',
  },
}));

export default function IntegrationTabs({ tabs, className }) {
  const classes = useStyles();
  const history = useHistory();
  const match = useRouteMatch();
  const { tab } = match.params;
  let currentTabIndex = tabs.findIndex(t => t.path === tab);

  // if you cant find tab index default it to zero
  currentTabIndex = currentTabIndex === -1 ? 0 : currentTabIndex;
  const handleTabChange = useCallback(
    (event, newTabIndex) => {
      const newTab = tabs[newTabIndex].path;
      const parts = match.url.split('/');

      parts[parts.length - 1] = newTab;

      const newUrl = parts.join('/');

      history.push(newUrl);
    },
    [history, match.url, tabs]
  );

  return (
    <div className={(classes.tabContainer, className)}>
      <Tabs
        value={currentTabIndex}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        variant="scrollable"
        scrollButtons="auto">
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
