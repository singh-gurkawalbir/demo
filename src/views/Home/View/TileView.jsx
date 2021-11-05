import React from 'react';
import { Typography } from '@material-ui/core';
import HomeCard from '../HomeCard';
import { selectors } from '../../../reducers';
import { useSelectorMemo } from '../../../hooks';

export default function TileView() {
  const {filteredTiles, totalCount} = useSelectorMemo(selectors.mkFilteredHomeTiles);

  // todo: ashu dont call generic selectors as tiles
  // todo: empty search msg css
  if (!filteredTiles?.length && totalCount?.length) {
    return (
    // <div className={classes.root}>
      <Typography>
        Your search didn’t return any matching results. Try expanding your search criteria
      </Typography>
    // </div>
    );
  }

  return (
    <HomeCard sortedTiles={filteredTiles} />
  );
}
