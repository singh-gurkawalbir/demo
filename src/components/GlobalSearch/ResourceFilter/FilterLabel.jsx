import React from 'react';
import { Typography, Tooltip, Badge } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import FilterIcon from '../../icons/FilterIcon';
import { useGlobalSearchState } from '../GlobalSearchContext/createGlobalSearchState';
import { getTextAfterCount } from '../../../utils/string';

const useStyles = makeStyles(() => ({
  filterLabel: {
    width: 22,
    textAlign: 'center',
  },
}));

const FilterLabel = () => {
  const classes = useStyles();
  const filters = useGlobalSearchState(state => state.filters);

  if (filters.length === 0) {
    return (
      <Typography variant="h6" color="inherit" className={classes.filterLabel}>
        All
      </Typography>
    );
  }

  return (
    <Tooltip title={`${getTextAfterCount('filter', filters.length)} applied`} placement="bottom" aria-label="Filters">
      <Badge color="secondary" overlap="circular" variant="dot">
        <FilterIcon fontSize="small" />
      </Badge>
    </Tooltip>
  );
};
export default FilterLabel;
