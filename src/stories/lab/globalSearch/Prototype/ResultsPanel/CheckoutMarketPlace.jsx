import React from 'react';
import { makeStyles } from '@material-ui/core';
import MarketplaceIcon from '../../../../../components/icons/MarketplaceIcon';
import TextButton from '../../../../../components/Buttons/TextButton';
import useActiveTab from '../hooks/useActiveTab';
import useResults from '../hooks/useResults';

const useStyles = makeStyles(theme => ({
  resultFooter: {
    paddingTop: theme.spacing(1),
    borderTop: 'solid 1px',
    borderColor: theme.palette.secondary.lightest,
  },
}));

export default function CheckoutMarketPlace() {
  const classes = useStyles();
  const [, setActiveTab] = useActiveTab();
  const {marketplaceResults, marketplaceResultCount} = useResults();

  return (
    <>
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
    </>
  );
}

