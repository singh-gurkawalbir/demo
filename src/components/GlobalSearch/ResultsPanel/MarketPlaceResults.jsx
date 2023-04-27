import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
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

function MarketplaceResults() {
  const classes = useStyles();
  const { marketplaceResults} = useResults();

  return (
    <div className={classes.resultContainer}>
      <Results results={marketplaceResults} />
    </div>
  );
}
export default React.memo(MarketplaceResults);
