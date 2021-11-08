import React from 'react';
import { Typography, makeStyles } from '@material-ui/core';
import { selectors } from '../../../reducers';
import { useSelectorMemo } from '../../../hooks';
import ResourceTable from '../../../components/ResourceTable';
import ShowMoreDrawer from '../../../components/drawer/ShowMore';
import { FILTER_KEY } from '../../../utils/home';

const useStyles = makeStyles(theme => ({
  textWrapper: {
    padding: theme.spacing(2),
  },
}));

export default function ListView() {
  const classes = useStyles();
  const {filteredTiles, filteredCount, perPageCount, totalCount} = useSelectorMemo(selectors.mkFilteredHomeTiles);

  if (!totalCount) {
    return null;
  }

  return (
    <div>
      <ResourceTable
        resourceType={FILTER_KEY}
        resources={filteredTiles} />
      <ShowMoreDrawer
        filterKey={FILTER_KEY}
        count={perPageCount}
        maxCount={filteredCount} />
      {!filteredTiles?.length && totalCount && (
      <Typography className={classes.textWrapper}>
        Your search didn’t return any matching results. Try expanding your search criteria.
      </Typography>
      )}
    </div>
  );
}
