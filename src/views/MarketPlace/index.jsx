import { Fragment } from 'react';
import MarketplaceList from '../../components/MarketplaceList';
import CeligoPageBar from '../../components/CeligoPageBar';
import KeywordSearch from '../../components/KeywordSearch';

export default function Marketplace() {
  const defaultFilter = { take: 5 };

  return (
    <Fragment>
      <CeligoPageBar title="App store">
        <KeywordSearch defaultFilter={defaultFilter} />
      </CeligoPageBar>
      <MarketplaceList />
    </Fragment>
  );
}
