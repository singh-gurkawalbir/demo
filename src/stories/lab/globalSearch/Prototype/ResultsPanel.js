import React, { useMemo, useState, useRef, useEffect } from 'react';
import { makeStyles, Tabs, Tab, Typography, IconButton } from '@material-ui/core';
import FloatingPaper from './FloatingPaper';
import MarketplaceIcon from '../../../../components/icons/MarketplaceIcon';
import CloseIcon from '../../../../components/icons/CloseIcon';
import { useGlobalSearchContext } from './GlobalSearchContext';
import Results from './Results';
import TextButton from '../../../../components/Buttons/TextButton';
import useKeyboardNavigation from './Results/useKeyboardNavigation';
import {getTabResults } from './utils';

const useStyles = makeStyles(theme => ({
  resultsPaper: {
    width: 550,
    padding: theme.spacing(0, 0, 1, 2),
  },
  tabPanel: {
  },
  resultContainer: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: 200,
    maxHeight: '50vh',
  },
  resultFooter: {
    paddingTop: theme.spacing(1),
    borderTop: 'solid 1px',
    borderColor: theme.palette.secondary.lightest,
  },
  resourceHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    borderBottom: `solid 1px ${theme.palette.secondary.lightest}`,
    padding: theme.spacing(1, 0),
  },
  lastUpdated: {
    marginRight: theme.spacing(2),
  },
  tabsContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: theme.spacing(1),
    borderBottom: `solid 1px ${theme.palette.secondary.lightest}`,

  },
}));

function TabPanel({ children, value, index}) {
  const classes = useStyles();

  return (
    <div role="tabpanel" className={classes.tabPanel} hidden={value !== index}>
      {value === index && (
      <div>{children}</div>
      )}
    </div>
  );
}

function ResultsPanel() {
  const classes = useStyles();
  const { results, setKeyword } = useGlobalSearchContext();
  const {resourceResults, marketplaceResults, resourceResultCount, marketplaceResultCount} = useMemo(() => getTabResults(results), [results]);
  const [activeTab, setActiveTab] = useState(0);
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  const containerRef = useRef();
  const currentResults = activeTab === 1 ? marketplaceResults : resourceResults;
  const listItemLength = currentResults?.reduce((oldState, action) => oldState + action?.results?.length, 0);
  const listItemRef = useRef();
  const {currentFocussed} = useKeyboardNavigation({listLength: listItemLength, containerRef, listItemRef});

  useEffect(() => {
    if (marketplaceResultCount > 0 && resourceResultCount === 0 && activeTab === 0) {
      setActiveTab(1);
    } else if (resourceResultCount > 0 && activeTab === 1) {
      setActiveTab(0);
    }
  // We do not want the 'activeTab' to be part of the dependencies... otherwise
  // every time we update it as above, this effect gets re-triggered and prevents
  // the user from switching tabs. We only want the tab to switch to marketplace
  // when the result counts change.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resourceResultCount, marketplaceResultCount]);

  return (
    <FloatingPaper className={classes.resultsPaper}>
      <div className={classes.tabsContainer}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="Global search results"
          indicatorColor="primary"
    >
          <Tab label={`Resources (${resourceResultCount})`} />
          <Tab label={`Marketplace: Apps & templates (${marketplaceResultCount})`} />
        </Tabs>
        <IconButton size="small" onClick={() => setKeyword('')}>
          <CloseIcon />
        </IconButton>
      </div>

      <TabPanel value={activeTab} index={0}>
        <div className={classes.resultContainer}>
          { results?.length && (
          <div className={classes.resourceHeader}>
            <Typography variant="h6">Name</Typography>
            <Typography variant="h6" className={classes.lastUpdated}>Last updated</Typography>
          </div>
        )}

          <Results results={resourceResults} currentFocussed={currentFocussed} ref={listItemRef} />

          {marketplaceResults?.length > 0 && (
          <div className={classes.resultFooter}>
            <TextButton
              onClick={e => handleTabChange(e, 1)}
              startIcon={<MarketplaceIcon />}
              color="primary">
              Checkout {marketplaceResultCount} result{marketplaceResultCount > 1 && 's'} in Marketplace
            </TextButton>
          </div>
        )}
        </div>
      </TabPanel>

      <TabPanel value={activeTab} index={1}>
        <div className={classes.resultContainer}>
          <Results results={marketplaceResults} currentFocussed={currentFocussed} ref={listItemRef} />
        </div>
      </TabPanel>
    </FloatingPaper>
  );
}
export default React.memo(ResultsPanel);
