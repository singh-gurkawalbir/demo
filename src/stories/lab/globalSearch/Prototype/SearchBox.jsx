import React, { useEffect, useMemo, useState, useRef } from 'react';
import { makeStyles, Paper, InputBase, Tabs, Tab, Typography, IconButton } from '@material-ui/core';
import { isEqual } from 'lodash';
import FloatingPaper from './FloatingPaper';
import MarketplaceIcon from '../../../../components/icons/MarketplaceIcon';
import CloseIcon from '../../../../components/icons/CloseIcon';
import { useGlobalSearchContext } from '../GlobalSearchContext';
import { filterMap, shortcutMap } from './filterMeta';
import Results from './Results';
import TextButton from '../../../../components/Buttons/TextButton';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
  searchBox: {
    width: '100%',
    padding: [[5, 8]],
    display: 'flex',
    alignItems: 'center',
    border: `1px solid ${theme.palette.secondary.contrastText}`,
    borderRadius: 24,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    borderLeft: 0,
    flexGrow: 1,
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  inputBase: {
    padding: 0,
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
  searchCloseButton: {
    padding: 0,
    margin: -6,
    marginLeft: 4,
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

function buildSearchString(filters, keyword) {
  if (!filters?.length) {
    return keyword;
  }
  const filterPrefix = filters.map(f => filterMap[f]?.shortcut).filter(s => s).join(',');

  return `${filterPrefix}: ${keyword}`;
}

function getFilters(searchString) {
  if (!searchString?.length) return [];

  const parts = searchString.split(':');

  if (parts.length === 1) return [];

  const filterShortcuts = parts[0].split(',');

  return filterShortcuts.map(s => shortcutMap[s.trim()]).filter(f => f);
}

function getKeyword(searchString) {
  const parts = searchString.split(':');

  if (parts.length > 1) {
    return parts[1].trim();
  }

  return searchString;
}

function getResultCount(results, isResource) {
  if (!results || typeof results !== 'object') return 0;

  return Object.keys(results)?.reduce((count, r) => {
    const match = filterMap[r]?.isResource === isResource;

    return match ? count + (results[r].length) : count;
  }, 0);
}

function getTabResults(results, isResource) {
  return Object.keys(filterMap)
    .filter(key => filterMap[key].isResource === isResource && results[key] !== undefined)
    .map(key => ({type: key, results: results[key]}));
}

export default function SearchBox() {
  const classes = useStyles();
  const [skip, setSkip] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [searchString, setSearchString] = useState('');
  const [resultsOpen, setResultsOpen] = useState(false);
  const inputRef = useRef();
  const { results, keyword, setKeyword, filters, setFilters, setOpen, onKeywordChange, onFiltersChange } = useGlobalSearchContext();

  const resourceResults = useMemo(() => getTabResults(results, true), [results]);
  const marketplaceResults = useMemo(() => getTabResults(results, false), [results]);
  const resourceResultCount = getResultCount(results, true);
  const marketplaceResultCount = getResultCount(results, false);

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
    setActiveTab(newValue);
  };

  useEffect(() => {
    if (skip) return setSkip(false);

    setSearchString(buildSearchString(filters, keyword));

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
    <div className={classes.root}>
      <Paper component="form" className={classes.searchBox} variant="outlined">
        <InputBase
          ref={inputRef}
          spellcheck="false"
          value={searchString}
          classes={{input: classes.inputBase}}
          className={classes.input}
          placeholder="Search integrator.io"
          inputProps={{ 'aria-label': 'Search integrator.io' }}
          onChange={handleSearchStringChange}
      />
        <IconButton size="small" onClick={() => setOpen(false)} className={classes.searchCloseButton}>
          <CloseIcon />
        </IconButton>
      </Paper>
      {resultsOpen && ( // We could/should use <Popover/> component if possible..
        <FloatingPaper className={classes.resultsPaper}>
          <div className={classes.tabsContainer}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              aria-label="Global search results"
              indicatorColor="primary"
          >
              <Tab label={`Resources (${getResultCount(results, true)})`} />
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

              <Results results={resourceResults} />

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
              <Results results={marketplaceResults} />
            </div>
          </TabPanel>
        </FloatingPaper>
      )}
    </div>
  );
}
