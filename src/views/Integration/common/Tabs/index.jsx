import React, { useCallback } from 'react';
import { useHistory, useRouteMatch, generatePath } from 'react-router-dom';
import {useSelector} from 'react-redux';
import { Tabs, Tab, Box } from '@mui/material';
import { selectors } from '../../../../reducers';

// TODO: Azhar check tab panels are working fine or not without these styles everywhere

export default function IntegrationTabs({ tabs, className }) {
  const history = useHistory();
  const match = useRouteMatch();
  const { dashboardTab, childId } = match.params;
  let {tab} = match.params;

  tab = dashboardTab ? 'dashboard' : tab;
  let currentTabIndex = tabs.findIndex(t => t.path === tab);
  const isUserInErrMgtTwoDotZero = useSelector(state =>
    selectors.isOwnerUserInErrMgtTwoDotZero(state)
  );

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
        if (path.includes('/dashboard')) {
          path = path.replace('dashboard', newTab);
        }
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
    <Box sx={{ p: theme => theme.spacing(0, 3) }} className={className}>
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
            data-test={label}
            id={`tab-${i}`}
            {...{ 'aria-controls': `tabpanel-${i}` }}
            icon={<Icon />}
            label={label}
            sx={{
              minWidth: 'auto',
              fontSize: 14,
              padding: '9px 12px 4px',
              lineHeight: 1.75,
              '&>.MuiTab-iconWrapper': {
                marginRight: theme => theme.spacing(0.5),
              },
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
          sx={{ overflow: 'visible' }}>
          <div>{currentTabIndex === i && <Panel {...match.params} childId={childId} />}</div>
        </Box>
      ))}
    </Box>
  );
}
