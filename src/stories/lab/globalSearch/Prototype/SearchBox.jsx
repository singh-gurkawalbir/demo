import React from 'react';
import { makeStyles, Paper, InputBase, Tabs, Tab } from '@material-ui/core';
import FloatingPaper from './FloatingPaper';
import { useGlobalSearchContext } from '../GlobalSearchContext';
import filterMeta from './filterMeta';

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

function getSearchString(filters, keyword) {
  if (!filters?.length) {
    return keyword;
  }
  const filterPrefix = filters.map(f => filterMeta[f]?.shortcut).filter(s => s).join(',');

  return `${filterPrefix}: ${keyword}`;
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
  const [activeTab, setActiveTab] = React.useState(0);
  const { keyword, setKeyword, filters } = useGlobalSearchContext();
  const showResults = keyword?.length >= 2;
  const handleKeywordChange = e => setKeyword(getKeyword(e.target.value));

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <div className={classes.root}>
      <Paper component="form" className={classes.searchBox} variant="outlined">
        <InputBase
          value={getSearchString(filters, keyword)}
          classes={{input: classes.inputBase}}
          className={classes.input}
          placeholder="Search integrator.io"
          inputProps={{ 'aria-label': 'Search integrator.io' }}
          onChange={handleKeywordChange}
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
