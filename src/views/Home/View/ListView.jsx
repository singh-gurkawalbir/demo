import React from 'react';
import clsx from 'clsx';
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
  resultContainer: {
    padding: theme.spacing(3, 3, 14, 3),
    maxHeight: `calc(100vh - (${theme.appBarHeight}px + ${theme.pageBarHeight}px))`,
    overflowY: 'auto',
  },
  noShowMoreContainer: {
    paddingBottom: theme.spacing(3),
  },
}));

export default function ListView() {
  const {filteredTiles, filteredCount, perPageCount, totalCount} = useSelectorMemo(selectors.mkFilteredHomeTiles);
  const classes = useStyles();

  if (!totalCount) {
    return null;
  }

  return (
    <div className={clsx(classes.resultContainer, {[classes.noShowMoreContainer]: perPageCount === filteredCount })}>
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
