import React from 'react';
import HomeCard from './HomeCard';
import { selectors } from '../../../../reducers';
import { useSelectorMemo } from '../../../../hooks';
import NoResultTypography from '../../../../components/NoResultTypography';
import { NO_RESULT_SEARCH_MESSAGE } from '../../../../constants';
import ResourceEmptyState from '../../../ResourceList/ResourceEmptyState';

export default function TileView() {
  const {filteredTiles, totalCount} = useSelectorMemo(selectors.mkFilteredHomeTiles);

  if (!filteredTiles?.length && totalCount === 0) {
    return (
      <ResourceEmptyState resourceType="tiles" />
    );
  }
  if (!filteredTiles?.length && totalCount) {
    return (
      <NoResultTypography>{NO_RESULT_SEARCH_MESSAGE}</NoResultTypography>
    );
  }

  return (

    <HomeCard sortedTiles={filteredTiles} />
  );
}
