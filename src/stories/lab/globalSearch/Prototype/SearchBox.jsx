import React, { useEffect, useMemo, useRef } from 'react';
import { makeStyles, Paper, InputBase, Tabs, Tab, Typography } from '@material-ui/core';
import { isEqual } from 'lodash';
import FloatingPaper from './FloatingPaper';
import MarketplaceIcon from '../../../../components/icons/MarketplaceIcon';
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
    width: 500,
    minHeight: 300,
  },
  tabPanel: {
    borderTop: `solid 1px ${theme.palette.secondary.lightest}`,
  },
  resultContainer: {
    display: 'flex',
    flexDirection: 'column',
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
  const [skip, setSkip] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState(0);
  const [searchString, setSearchString] = React.useState('');
  const inputRef = useRef();
  const { results, keyword, setKeyword, filters, setFilters, onKeywordChange, onFiltersChange } = useGlobalSearchContext();
  const showResults = keyword?.length >= 2;

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

  const resourceResults = useMemo(() => getTabResults(results, true), [results]);
  const marketplaceResults = useMemo(() => getTabResults(results, false), [results]);

  const marketplaceResultCount = getResultCount(results, false);

  return (
    <div className={classes.root}>
      <Paper component="form" className={classes.searchBox} variant="outlined">
        <InputBase
          ref={inputRef}
          value={searchString}
          classes={{input: classes.inputBase}}
          className={classes.input}
          placeholder="Search integrator.io"
          inputProps={{ 'aria-label': 'Search integrator.io' }}
          onChange={handleSearchStringChange}
      />
      </Paper>
      {showResults && ( // We could/should use <Popover/> component if possible..
        <FloatingPaper className={classes.resultsPaper}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            aria-label="Global search results"
            variant="fullWidth"
            indicatorColor="primary"
          >
            <Tab label={`Resources (${getResultCount(results, true)})`} />
            <Tab label={`Marketplace (${marketplaceResultCount})`} />
          </Tabs>

          <TabPanel value={activeTab} index={0}>
            <div className={classes.resultContainer}>
              <div className={classes.resourceHeader}>
                <Typography variant="subtitle2"><b>Name</b></Typography>
                <Typography variant="subtitle2" className={classes.lastUpdated}><b>Last updated</b></Typography>
              </div>
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
