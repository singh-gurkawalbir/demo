import React, { useEffect } from 'react';
import { Tabs, Tab, IconButton } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import FloatingPaper from '../ResourceFilter/FloatingPaper';
import CloseIcon from '../../icons/CloseIcon';
import ResourceResults from './ResourceResults';
import MarketPlaceResults from './MarketPlaceResults';
import useResults from '../hooks/useResults';
import { useGlobalSearchState } from '../GlobalSearchContext/createGlobalSearchState';
import { useActiveTab } from '../GlobalSearchContext/createActiveTab';

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

function ResultsPanel() {
  const classes = useStyles();
  const clearSearchInput = useGlobalSearchState(state => state?.clearSearch);
  const {resourceResultCount, marketplaceResultCount} = useResults();
  const [activeTab, setActiveTab] = useActiveTab();
  const handleTabChange = (_, newValue) => {
    setActiveTab(newValue);
  };

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
        <IconButton aria-label="Close Resultspanel" size="small" onClick={clearSearchInput}>
          <CloseIcon />
        </IconButton>
      </div>
      <TabContent>
        <ResourceResults />
        <MarketPlaceResults />
      </TabContent>
    </FloatingPaper>
  );
}
export default ResultsPanel;

function TabContent({ children }) {
  const classes = useStyles();
  const [activeTab] = useActiveTab();

  return (
    <div role="tabpanel" className={classes.tabPanel}>
      {children && children[activeTab]}
    </div>
  );
}
