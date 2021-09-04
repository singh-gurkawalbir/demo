import React, { useEffect, useRef } from 'react';
import { makeStyles, Paper, InputBase, Tabs, Tab } from '@material-ui/core';
import FloatingPaper from './FloatingPaper';
import { useGlobalSearchContext } from '../GlobalSearchContext';
import { filterMap, shortcutMap } from './filterMeta';

const useStyles = makeStyles(theme => ({
  root: {
    // display: 'flex',
    // alignItems: 'flex-start',
    // flexDirection: 'column',
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
    maxHeight: 500,
  },
  tabPanel: {
    borderTop: `solid 1px ${theme.palette.secondary.lightest}`,
    paddingTop: theme.spacing(1),
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

export default function SearchBox() {
  const classes = useStyles();
  const [skip, setSkip] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState(0);
  const [searchString, setSearchString] = React.useState('');
  const inputRef = useRef();
  const { keyword, setKeyword, filters, setFilters } = useGlobalSearchContext();
  const showResults = keyword?.length >= 2;

  const handleSearchStringChange = e => {
    const newSearchString = e.target.value;

    setSkip(true);
    setSearchString(newSearchString);
    setKeyword(getKeyword(newSearchString));
    setFilters(getFilters(newSearchString));
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  useEffect(() => {
    if (skip) return setSkip(false);

    setSearchString(buildSearchString(filters, keyword));

    // The ref of <InputBase> is actually a div. We want the first child.
    const input = inputRef.current.children[0];

    input.focus();
  // we do not want this effect to fire on anything BUT filter changes...
  // This effect is used to update the search string if a user interacts with
  // the filter list component...
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

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
      {showResults && (
        <FloatingPaper className={classes.resultsPaper}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            aria-label="Global search results"
            variant="fullWidth"
            indicatorColor="primary"
          >
            <Tab label="Resources (0)" />
            <Tab label="Marketplace (0)" />
          </Tabs>

          <TabPanel value={activeTab} index={0}>
            No resource search results. Try another term or adjust your filter.
          </TabPanel>

          <TabPanel value={activeTab} index={1}>
            No marketplace search results. Try another term or adjust your filter.
          </TabPanel>
        </FloatingPaper>
      )}
    </div>
  );
}
