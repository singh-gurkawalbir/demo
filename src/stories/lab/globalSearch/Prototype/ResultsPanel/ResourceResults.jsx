import React from 'react';
import { makeStyles } from '@material-ui/core';
import MarketplaceIcon from '../../../../../components/icons/MarketplaceIcon';
import ResultsList from './ResultsList';
import TextButton from '../../../../../components/Buttons/TextButton';
import useActiveTab from '../hooks/useActiveTab';
import useResults from '../hooks/useResults';

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

function Resourceresults({currentFocussed}) {
  const classes = useStyles();
  const [, setActiveTab] = useActiveTab();
  const {resourceResults, marketplaceResults, marketplaceResultCount} = useResults();

  return (
    <div className={classes.resultContainer}>
      <ResultsList results={resourceResults} currentFocussed={currentFocussed} />

      {marketplaceResults?.length > 0 && (
      <div className={classes.resultFooter}>
        <TextButton
          onClick={() => setActiveTab(1)}
          startIcon={<MarketplaceIcon />}
          color="primary">
          Checkout {marketplaceResultCount} result{marketplaceResultCount > 1 && 's'} in Marketplace
        </TextButton>
      </div>
        )}
    </div>
  );
}

export default React.memo(Resourceresults);
