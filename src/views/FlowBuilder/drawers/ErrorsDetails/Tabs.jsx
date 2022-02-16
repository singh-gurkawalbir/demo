import React, { useCallback } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { makeStyles, Tabs, Tab } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  tabContainer: {
    padding: theme.spacing(0, 3),
    borderBottom: `1px solid ${theme.palette.secondary.lightest}`,
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
    path: 'open',
    label: 'Open errors',
    dataTest: 'flow-builder-open-errors',
  },
  {
    path: 'resolved',
    label: 'Resolved errors',
    dataTest: 'flow-builder-resolved-errors',
  }];

export default function ErrorDetailsTabs({onChange}) {
  const classes = useStyles();
  const match = useRouteMatch();

  const { errorType } = match.params;

  let currentTabIndex = tabs.findIndex(t => t.path === errorType);

  currentTabIndex = currentTabIndex === -1 ? 0 : currentTabIndex;
  const handleTabChange = useCallback(
    (event, newTabIndex) => {
      const newTab = tabs[newTabIndex].path;

      onChange(newTab);
    },
    [onChange]
  );

  return (
    <div className={classes.tabContainer}>
      <Tabs
        value={currentTabIndex}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        variant="scrollable"
        scrollButtons="auto"
        aria-label="scrollable auto tabs example">
        {tabs.map(({ label, dataTest }, i) => (
          <Tab
            className={classes.tab}
            key={label}
            id={`tab-${i}`}
            {...{ 'aria-controls': `tabpanel-${i}` }}
            label={label}
            data-test={dataTest}
          />
        ))}
      </Tabs>
    </div>
  );
}
