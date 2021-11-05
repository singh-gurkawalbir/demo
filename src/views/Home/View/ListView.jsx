import React from 'react';
import { Typography } from '@material-ui/core';
import { selectors } from '../../../reducers';
import { useSelectorMemo } from '../../../hooks';
import ResourceTable from '../../../components/ResourceTable';
import ShowMoreDrawer from '../../../components/drawer/ShowMore';
import { FILTER_KEY } from '../../../utils/home';

export default function ListView() {
  const {filteredTiles, filteredCount, perPageCount, totalCount} = useSelectorMemo(selectors.mkFilteredHomeTiles);

  // todo: don't call generic selectors as tiles
  if (!filteredTiles?.length && totalCount) {
    return (
    // <div className={classes.root}>
      <Typography>
        Your search didn’t return any matching results. Try expanding your search criteria
      </Typography>
    // </div>
    );
  }

  return (
    <>
      <ResourceTable
        resourceType={FILTER_KEY}
        resources={filteredTiles}
              />
      <ShowMoreDrawer
        filterKey={FILTER_KEY}
        count={perPageCount}
        maxCount={filteredCount}
        />
    </>
  );
}
