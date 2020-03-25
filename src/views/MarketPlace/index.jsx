import { Fragment } from 'react';
import { useSelector } from 'react-redux';
import ApplicationsList from './ApplicationsList';
import CeligoPageBar from '../../components/CeligoPageBar';
import KeywordSearch from '../../components/KeywordSearch';
import * as selectors from '../../reducers';
import { MARKETPLACE_HELPINFO } from '../../utils/helpInfo';
import LoadResources from '../../components/LoadResources';

export default function Marketplace() {
  const filter = useSelector(state => selectors.filter(state, 'marketplace'));

  return (
    <Fragment>
      <LoadResources resources="connectors">
        <CeligoPageBar title="Marketplace" infoText={MARKETPLACE_HELPINFO}>
          <KeywordSearch filterKey="marketplace" />
        </CeligoPageBar>
        <ApplicationsList filter={filter} />
      </LoadResources>
    </Fragment>
  );
}
