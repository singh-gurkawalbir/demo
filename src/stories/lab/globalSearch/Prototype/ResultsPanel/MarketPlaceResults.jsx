import React from 'react';
import { makeStyles } from '@material-ui/core';
import Results from './ResultsList';
import useResults from '../hooks/useResults';

const useStyles = makeStyles(() => ({
  resultContainer: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: 200,
    maxHeight: '50vh',
  },
}));

function Marketplaceresults({currentFocussed}) {
  const classes = useStyles();
  const { marketplaceResults} = useResults();

  return (
    <div className={classes.resultContainer}>
      <Results results={marketplaceResults} currentFocussed={currentFocussed} />
    </div>
  );
}
export default React.memo(Marketplaceresults);
