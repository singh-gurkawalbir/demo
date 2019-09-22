import { Fragment } from 'react';
import MarketplaceGridList from '../../components/MarketplaceGridList';
import CeligoPageBar from '../../components/CeligoPageBar';

export default function Marketplace() {
  return (
    <Fragment>
      <CeligoPageBar title="Marketplace" />
      <MarketplaceGridList />
    </Fragment>
  );
}
