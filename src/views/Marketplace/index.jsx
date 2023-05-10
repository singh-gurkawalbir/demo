import React from 'react';
import { useSelector } from 'react-redux';
import ApplicationsList from './ApplicationsList';
import CeligoPageBar from '../../components/CeligoPageBar';
import KeywordSearch from '../../components/KeywordSearch';
import { selectors } from '../../reducers';
import {message} from '../../utils/messageStore';

export default function Marketplace() {
  const filterKey = 'marketplace';
  const filter = useSelector(state => selectors.filter(state, filterKey));

  return (
    <>
      <CeligoPageBar title="Marketplace" infoText={message.MARKETPLACE.HELPINFO} contentId="marketplace">
        <KeywordSearch filterKey={filterKey} placeholder="Search templates & integration apps" />
      </CeligoPageBar>
      <ApplicationsList filter={filter} />
    </>
  );
}
