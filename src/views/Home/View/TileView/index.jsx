import React from 'react';
import HomeCard from './HomeCard';
import { selectors } from '../../../../reducers';
import { useSelectorMemo } from '../../../../hooks';
import ResourceTableWrapper from '../../../../components/ResourceTableWrapper';

export default function TileView() {
  const {filteredTiles, totalCount} = useSelectorMemo(selectors.mkFilteredHomeTiles);
  const hasNoData = !filteredTiles?.length && totalCount === 0;
  const hasEmptySearchResults = !filteredTiles?.length && totalCount;

  return (
    <ResourceTableWrapper resourceType="tiles" hasNoData={hasNoData} hasEmptySearchResults={hasEmptySearchResults} >
      <HomeCard sortedTiles={filteredTiles} />
    </ResourceTableWrapper>
  );
}
