import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import clsx from 'clsx';
import FilterIcon from '../../../icons/FilterIcon';

const useStyles = makeStyles(theme => ({
  filterSelected: {
    color: theme.palette.primary.main,
  },
  filter: {
    fontSize: 18,
  },
}));

export default function FilterIconWrapper({ selected }) {
  const classes = useStyles();

  return <FilterIcon className={clsx(classes.filter, {[classes.filterSelected]: selected})} />;
}
