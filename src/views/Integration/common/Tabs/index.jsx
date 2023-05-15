import React, { useCallback } from 'react';
import { useHistory, useRouteMatch, generatePath } from 'react-router-dom';
import {useSelector} from 'react-redux';
import { Box, TabContext, TabList, TabPanel, Tab } from '@celigo/fuse-ui';
import { selectors } from '../../../../reducers';

// TODO: Azhar check tab panels are working fine or not without these styles everywhere

export default function IntegrationTabs({ tabs, sx = [] }) {
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
    <TabContext value={currentTabIndex}>
      <Box
        sx={[
          { p: theme => theme.spacing(0, 3) },
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}>
        <TabList
          onChange={handleTabChange}
          variant="scrollable"
          aria-label="scrollable auto tabs example"
          >
          {tabs.map(({ label, Icon }, i) => (
            <Tab
              key={label}
              data-test={label}
              id={`tab-${i}`}
              aria-controls={`tabpanel-${i}`}
              icon={<Icon />}
              label={label}
              sx={{
                minWidth: 'auto !important',
                padding: '9px 12px 4px',
                lineHeight: 1.75,
                '&>.MuiTab-iconWrapper': {
                  marginRight: theme => theme.spacing(0.5),
                },
              }}
              />
          ))}
        </TabList>

        {tabs.map(({ path, Panel }, i) => (
          <TabPanel
            value={i}
            key={path}
            id={`tabpanel-${i}`}
            aria-labelledby={`tab-${i}`}
            >
            <Box sx={{ overflow: 'visible' }}>
              <Panel {...match.params} childId={childId} />
            </Box>
          </TabPanel>
        ))}
      </Box>
    </TabContext>
  );
}
