import React, { useState } from 'react';
import { Tab, Tabs } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import PanelGridItem from '../PanelGridItem';
import isLoggableAttr from '../../../../../utils/isLoggableAttr';
import IsLoggableContextProvider from '../../../../IsLoggableContextProvider';

const useStyles = makeStyles(theme => ({
  flexContainer: {
    display: 'flex',
    height: '100%',
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  tabContainer: { flex: '0 0 auto' },
  panel: { flex: '1 1 100px', minHeight: 50, position: 'relative' },

  tabPanel: {
    height: '100%',
  },
  tabs: {
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function TabbedPanelGridItem({ editorId, area, panelGroup }) {
  const classes = useStyles();
  const [tabValue, setTabValue] = useState(0);

  function handleTabChange(event, newValue) {
    setTabValue(newValue);
  }

  const {
    key: activeKey,
    Panel: ActivePanel,
    isLoggable,
    props: activePanelProps,
  } = panelGroup.panels[tabValue];

  return (
    <PanelGridItem gridArea={area}>
      <div className={classes.flexContainer}>
        <div className={classes.tabContainer}>
          <Tabs
            className={classes.tabs}
            value={tabValue} onChange={handleTabChange}
            variant="fullWidth"
            textColor="primary"
            indicatorColor="primary"
    >
            {panelGroup.panels.map((p, i) => (
              <Tab
                label={p.name}
                value={i}
                id={`tab-${p.key}`} key={p.key}
                aria-controls={`tabpanel-${p.key}`}
    />
            ))}
          </Tabs>
        </div>
        <div className={classes.panel}>
          <div
            {...isLoggableAttr(isLoggable)}
            role="tabpanel"
            id={`tabpanel-${activeKey}`}
            aria-labelledby={`tab-${tabValue}`}
            className={classes.tabPanel}>
            <IsLoggableContextProvider isLoggable={isLoggable}>

              <ActivePanel
                editorId={editorId}
                {...activePanelProps}
      />

            </IsLoggableContextProvider>

          </div>
        </div>
      </div>
    </PanelGridItem>
  );
}

