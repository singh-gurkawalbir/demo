import React from 'react';
import { makeStyles } from '@material-ui/core';
import { useGlobalSearchContext } from './GlobalSearchContext';
import SearchInput from './SearchInput';
import ResultsPanel from './ResultsPanel';

const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
  },
}));

export default function SearchBox() {
  const classes = useStyles();

  const { isResultsOpen } = useGlobalSearchContext();

  return (
    <div className={classes.root}>
      <SearchInput />
      {isResultsOpen && <ResultsPanel />}
    </div>
  );
}
