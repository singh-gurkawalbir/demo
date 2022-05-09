import React from 'react';
import { useSelector } from 'react-redux';
import ApplicationsList from './ApplicationsList';
import CeligoPageBar from '../../components/CeligoPageBar';
import KeywordSearch from '../../components/KeywordSearch';
import { selectors } from '../../reducers';
import messageStore from '../../utils/messageStore';

export default function Marketplace() {
  const filterKey = 'marketplace';
  const filter = useSelector(state => selectors.filter(state, filterKey));

  return (
    <>
      <CeligoPageBar title="Marketplace" infoText={messageStore('MARKETPLACE_HELPINFO')}>
        <KeywordSearch filterKey={filterKey} />
      </CeligoPageBar>
      <ApplicationsList filter={filter} />
    </>
  );
}
