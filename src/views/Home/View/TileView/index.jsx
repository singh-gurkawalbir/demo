import React from 'react';
import HomeCard from './HomeCard';
import { selectors } from '../../../../reducers';
import { useSelectorMemo } from '../../../../hooks';
import NoResultMessageWrapper from '../../../../components/NoResultMessageWrapper';
import { NO_RESULT_SEARCH_MESSAGE } from '../../../../utils/constants';

export default function TileView() {
  const {filteredTiles, totalCount} = useSelectorMemo(selectors.mkFilteredHomeTiles);

  if (!filteredTiles?.length && totalCount) {
    return (
      <NoResultMessageWrapper>{NO_RESULT_SEARCH_MESSAGE}</NoResultMessageWrapper>
    );
  }

  return (
    <HomeCard sortedTiles={filteredTiles} />
  );
}
