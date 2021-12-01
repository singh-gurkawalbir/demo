import React from 'react';
import { Typography, makeStyles } from '@material-ui/core';
import HomeCard from './HomeCard';
import { selectors } from '../../../../reducers';
import { useSelectorMemo } from '../../../../hooks';

const useStyles = makeStyles(theme => ({
  textWrapper: {
    padding: theme.spacing(2),
  },
}));

export default function TileView() {
  const classes = useStyles();
  const {filteredTiles, totalCount} = useSelectorMemo(selectors.mkFilteredHomeTiles);

  if (!filteredTiles?.length && totalCount) {
    return (
      <Typography className={classes.textWrapper}>
        Your search didn’t return any matching results. Try expanding your search criteria
      </Typography>
    );
  }

  return (
    <HomeCard sortedTiles={filteredTiles} />
  );
}
