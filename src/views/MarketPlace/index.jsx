import { Fragment } from 'react';
import MarketplaceList from '../../components/MarketplaceList';
import CeligoPageBar from '../../components/CeligoPageBar';

export default function Marketplace() {
  return (
    <Fragment>
      <CeligoPageBar title="App store" />
      <MarketplaceList />
    </Fragment>
  );
}
