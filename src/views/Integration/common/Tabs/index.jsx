import React, { useCallback } from 'react';
import { useHistory, useRouteMatch, generatePath } from 'react-router-dom';
import { makeStyles, Tabs, Tab } from '@material-ui/core';

// TODO: Azhar check tab panels are working fine or not without these styles everywhere
const useStyles = makeStyles(theme => ({
  tabContainer: {
    padding: theme.spacing(0, 3),
  },
  tabPanel: {
    background: theme.palette.background.paper,
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    padding: theme.spacing(3),
    overflow: 'visible',
  },
  tab: {
    minWidth: theme.spacing(13.75),
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
          <div>{currentTabIndex === i && <Panel {...match.params} />}</div>
        </div>
      ))}
    </div>
  );
}
