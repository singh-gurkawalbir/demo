import { useCallback } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { makeStyles, Tabs, Tab } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  tabContainer: {
    padding: theme.spacing(0, 3),
  },
}));

export default function IntegrationTabs({ tabs }) {
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
    <div className={classes.tabContainer}>
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
