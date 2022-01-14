import React, { useEffect, useMemo, useState, useRef } from 'react';
import { makeStyles, Tabs, Tab, Typography, IconButton } from '@material-ui/core';
import { isEqual } from 'lodash';
import FloatingPaper from './FloatingPaper';
import MarketplaceIcon from '../../../../components/icons/MarketplaceIcon';
import CloseIcon from '../../../../components/icons/CloseIcon';
import { useGlobalSearchContext } from './GlobalSearchContext';
import Results from './Results';
import TextButton from '../../../../components/Buttons/TextButton';
import useKeyboardNavigation from './Results/useKeyboardNavigation';
import MemoizedSearchInput from './SearchInput';
import { buildSearchString, getFilters, getKeyword, getTabResults } from './utils';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
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

export default function SearchBox() {
  const classes = useStyles();
  const [skip, setSkip] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [searchString, setSearchString] = useState('');
  const [resultsOpen, setResultsOpen] = useState(false);
  const inputRef = useRef();
  const { results, keyword, setKeyword, filters, setFilters, onKeywordChange, onFiltersChange } = useGlobalSearchContext();

  const {resourceResults, marketplaceResults, resourceResultCount, marketplaceResultCount} = useMemo(() => getTabResults(results), [results]);
  const containerRef = useRef();
  const currentResults = activeTab === 1 ? marketplaceResults : resourceResults;
  const listItemLength = currentResults?.reduce((oldState, action) => oldState + action?.results?.length, 0);
  const listItemRef = useRef();
  const {currentFocussed, resetKeyboardFocus} = useKeyboardNavigation({listLength: listItemLength, containerRef, listItemRef});

  const handleSearchStringChange = e => {
    const newSearchString = e.target.value;

    setSkip(true);
    setSearchString(newSearchString);

    const newKeyword = getKeyword(newSearchString);
    const newFilters = getFilters(newSearchString);

    if (keyword !== newKeyword) {
      setKeyword(newKeyword);
      onKeywordChange?.(newKeyword);
    }

    if (!isEqual(filters, newFilters)) {
      setFilters(newFilters);
      onFiltersChange?.(newFilters);
    }

    if (newKeyword.length > 1 && !resultsOpen) {
      setResultsOpen(true);
    } else if (newKeyword.length < 2 && resultsOpen) {
      setResultsOpen(false);
    }
  };
  const handleTabChange = (event, newValue) => {
    resetKeyboardFocus();
    setActiveTab(newValue);
  };

  useEffect(() => {
    if (skip) return setSkip(false);

    // we only want to rebuild the search string IFF it already has
    // the filter shorthand. The filter syntax is advanced feature,
    // and may confuse non-developer or first time users.
    if (searchString.includes(':')) {
      setSearchString(buildSearchString(filters, keyword));
    }

    // The ref of <InputBase> is actually a div wrapper.
    // We want the first child, which is the input element.
    const input = inputRef.current?.children?.[0];

    input?.focus();
  // we do not want this effect to fire on anything BUT filter changes...
  // This effect is used to update the search string if a user interacts with
  // the filter list component...
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

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
    <div ref={containerRef} className={classes.root}>
      <MemoizedSearchInput value={searchString} onChange={handleSearchStringChange} ref={inputRef} />
      {resultsOpen && ( // We could/should use <Popover/> component if possible..
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
            <IconButton size="small" onClick={() => setResultsOpen(false)}>
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
      )}
    </div>
  );
}
