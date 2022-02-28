import React from 'react';
import { makeStyles,
  Typography,
  Tooltip,
  Badge} from '@material-ui/core';
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
    <Tooltip title={`${getTextAfterCount('Filter', filters.length)} applied`} placement="bottom" aria-label="Filters">
      <Badge color="secondary" overlap="circle" variant="dot">
        <FilterIcon fontSize="small" />
      </Badge>
    </Tooltip>
  );
};
export default FilterLabel;
