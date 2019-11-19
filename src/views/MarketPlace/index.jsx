import { Fragment } from 'react';
import { useSelector } from 'react-redux';
import MarketplaceList from '../../components/MarketplaceList';
import CeligoPageBar from '../../components/CeligoPageBar';
import KeywordSearch from '../../components/KeywordSearch';
import * as selectors from '../../reducers';
import { MARKETPLACE_HELPINFO } from '../../utils/helpInfo';

export default function Marketplace() {
  const filter = useSelector(state => selectors.filter(state, 'marketplace'));

  return (
    <Fragment>
      <CeligoPageBar title="App store" infoText={MARKETPLACE_HELPINFO}>
        <KeywordSearch filterKey="marketplace" />
      </CeligoPageBar>
      <MarketplaceList filter={filter} />
    </Fragment>
  );
}
