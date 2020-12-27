import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import FilterIcon from '../../../icons/FilterIcon';

const useStyles = makeStyles(theme => ({
  filterSelected: {
    color: theme.palette.primary.main,
  },
}));

export default function ErrorFilterIcon({ selected }) {
  const classes = useStyles();

  return <FilterIcon className={clsx({[classes.filterSelected]: selected})} />;
}
