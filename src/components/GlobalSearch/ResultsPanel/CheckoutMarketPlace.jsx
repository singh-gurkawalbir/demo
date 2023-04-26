import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import MarketplaceIcon from '../../icons/MarketplaceIcon';
import TextButton from '../../Buttons/TextButton';
import useResults from '../hooks/useResults';
import { useActiveTab } from '../GlobalSearchContext/createActiveTab';
import { getTextAfterCount } from '../../../utils/string';

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

  if (marketplaceResults?.length < 1) return null;

  return (
    <>
      <div className={classes.resultFooter}>
        <TextButton
          onClick={() => setActiveTab(1)}
          startIcon={<MarketplaceIcon />}
          color="primary">
          Checkout {getTextAfterCount('result', marketplaceResultCount)} in Marketplace
        </TextButton>
      </div>
    </>
  );
}

