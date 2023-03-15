import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import ResultsList from './ResultsList';
import useResults from '../hooks/useResults';
import useKeyboardNavigation from '../../../hooks/useKeyboardNavigation';
import { getResultsLength } from '../utils';
import CheckoutMarketPlace from './CheckoutMarketPlace';

const useStyles = makeStyles(theme => ({
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
}));

function ResourceResults() {
  const classes = useStyles();
  const {resourceResults } = useResults();
  const {currentFocussed} = useKeyboardNavigation({listLength: getResultsLength(resourceResults)});

  return (
    <div className={classes.resultContainer}>
      <ResultsList results={resourceResults} currentFocussed={currentFocussed} />
      <CheckoutMarketPlace />
    </div>
  );
}

export default React.memo(ResourceResults);
