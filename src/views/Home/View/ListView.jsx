import React from 'react';
import { selectors } from '../../../reducers';
import { useSelectorMemo } from '../../../hooks';
import ResourceTable from '../../../components/ResourceTable';
import ShowMoreDrawer from '../../../components/drawer/ShowMore';
import { FILTER_KEY } from '../../../utils/home';
import NoResultTypography from '../../../components/NoResultTypography';
import { NO_RESULT_SEARCH_MESSAGE } from '../../../constants';
import ResourceTableWrapper from '../../../components/ResourceTableWrapper';
import PageContent from '../../../components/PageContent';

export default function ListView() {
  const {filteredTiles, filteredCount, perPageCount, totalCount} = useSelectorMemo(selectors.mkFilteredHomeTiles);

  const isPagingBar = perPageCount >= 100;
  const hasNoData = !filteredTiles?.length && totalCount === 0;

  return (
    <ResourceTableWrapper resourceType="tiles" hasNoData={hasNoData} >
      <PageContent isPagingBar={isPagingBar}>
        <ResourceTable
          resourceType={FILTER_KEY}
          resources={filteredTiles} />
        <ShowMoreDrawer
          filterKey={FILTER_KEY}
          count={perPageCount}
          maxCount={filteredCount} />
        {!filteredTiles?.length && totalCount && (
        <NoResultTypography>{NO_RESULT_SEARCH_MESSAGE}</NoResultTypography>
        )}
      </PageContent>
    </ResourceTableWrapper>
  );
}
