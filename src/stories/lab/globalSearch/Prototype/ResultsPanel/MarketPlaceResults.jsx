import React from 'react';
import { makeStyles } from '@material-ui/core';
import Results from './ResultsList';
import useResults from '../hooks/useResults';
import useKeyboardNavigation from '../hooks/useKeyboardNavigation';

const useStyles = makeStyles(() => ({
  resultContainer: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: 200,
    maxHeight: '50vh',
  },
}));

function Marketplaceresults() {
  const classes = useStyles();
  const { marketplaceResults} = useResults();
  const listItemLength = marketplaceResults?.reduce((oldState, action) => oldState + action?.results?.length, 0);
  const {currentFocussed} = useKeyboardNavigation({listLength: listItemLength});

  return (
    <div className={classes.resultContainer}>
      <Results results={marketplaceResults} currentFocussed={currentFocussed} />
    </div>
  );
}
export default React.memo(Marketplaceresults);
