import React from 'react';
import { makeStyles,
  Typography,
  Tooltip,
  Badge} from '@material-ui/core';
import { useGlobalSearchState } from '../hooks/useGlobalSearchState';
import FilterIcon from '../../icons/FilterIcon';

const useStyles = makeStyles(() => ({
  filterLabel: {
    width: 22,
    textAlign: 'center',
  },
}));

const FilterLabel = () => {
  const classes = useStyles();
  const filters = useGlobalSearchState(state => state.filters);

  if (filters?.length === 0) {
    return (
      <Typography variant="h6" color="inherit" className={classes.filterLabel}>
        All
      </Typography>
    );
  }

  return (
    <Tooltip title={`Filter${filters.length > 1 ? 's' : ''} applied`} placement="bottom" aria-label="Filters">
      <Badge color="secondary" overlap="circle" variant="dot">
        <FilterIcon fontSize="small" />
      </Badge>
    </Tooltip>
  );
};
export default React.memo(FilterLabel);
