import clsx from 'clsx';
import React, { useMemo, useState } from 'react';
import { makeStyles,
  IconButton,
  Typography,
  Checkbox,
  Button,
  Divider,
  FormControlLabel,
  Tooltip,
  Badge} from '@material-ui/core';
import ArrowDownIcon from '../../../../components/icons/ArrowDownIcon';
import ArrowUpIcon from '../../../../components/icons/ArrowUpIcon';
import FloatingPaper from './FloatingPaper';
import CloseIcon from '../../../../components/icons/CloseIcon';
import { useGlobalSearchContext } from '../GlobalSearchContext';
import FilterIcon from '../../../../components/icons/FilterIcon';
import { filterMap } from './filterMeta';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    alignItems: 'flex-end',
    flexDirection: 'column',
  },
  arrowContainer: {
    paddingLeft: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    borderRadius: 24,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    backgroundColor: theme.palette.secondary.lightest,
    border: `1px solid ${theme.palette.secondary.contrastText}`,
  },
  iconButton: {
    // margin: theme.spacing(0, 1),
  },
  menu: {
    padding: theme.spacing(1, 1, 1, 2),
  },
  allItemChecked: {
    color: `${theme.palette.text.disabled}!important`,
    cursor: 'not-allowed',
  },
  divider: {
    margin: theme.spacing(1, 0),
  },
  allContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  filterLabel: {
    width: 22,
    textAlign: 'center',
  },
  typeButton: {
    padding: theme.spacing(0.5),
  },
  marketplaceTitle: {
    marginTop: theme.spacing(2),
  },
}));

export default function ResourceFilter() {
  const classes = useStyles();
  const { filters, setFilters, onFiltersChange } = useGlobalSearchContext();
  const [open, setOpen] = useState(false);

  const handleArrowClick = () => setOpen(o => !o);

  const FilterLabel = () => {
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

  const MenuItem = ({ type, label }) => {
    const isChecked = filters.includes(type) || (type === 'all' && !filters?.length);

    const handleMenuItemClick = type => {
      let newFilters = [];

      if (type === 'all') {
        newFilters = [];
      } else if (filters?.includes(type)) {
        newFilters = filters.filter(i => i !== type);
      } else {
      // last case is type not present, so add it.
        newFilters = [...filters, type];
      }
      setFilters(newFilters);
      onFiltersChange?.(newFilters);
    };

    return (
      <div>
        <FormControlLabel
          onClick={() => handleMenuItemClick(type)}
          control={(
            <Checkbox
              checked={isChecked}
              name={type}
              className={clsx({[classes.allItemChecked]: isChecked && type === 'all' })}
              color="primary" />
          )}
          label={label} />
      </div>
    );
  };

  // This is repetitive code that has similar patterns in the <SearchBox> component as well.
  // These helper functions could move into the fieldMeta file and we can then also write tests
  // for them... basically we need helper methods to split results and metadata between "resources"
  // and "marketplace" in several places of global search.
  const resourceFilters = useMemo(() => Object.keys(filterMap)
    .filter(key => filterMap[key].isResource)
    .map(key => filterMap[key]), []);

  const marketplaceFilters = useMemo(() => Object.keys(filterMap)
    .filter(key => !filterMap[key].isResource)
    .map(key => filterMap[key]), []);

  return (
    <div className={classes.root}>
      <div className={classes.arrowContainer}>
        <Button
          disableRipple
          className={classes.typeButton}
          onClick={handleArrowClick}
          endIcon={open ? <ArrowUpIcon /> : <ArrowDownIcon />}
        >
          <FilterLabel />
        </Button>
      </div>

      {open && (
        <FloatingPaper className={classes.menu}>
          <div className={classes.allContainer}>
            <MenuItem type="all" label="All" />
            <IconButton size="small" onClick={handleArrowClick}>
              <CloseIcon />
            </IconButton>
          </div>

          <Divider orientation="horizontal" className={classes.divider} />
          <Typography variant="subtitle2" gutterBottom component="div">RESOURCES</Typography>
          {resourceFilters.map(filter => <MenuItem key={filter.type} type={filter.type} label={filter.label} />)}

          <Typography variant="subtitle2" className={classes.marketplaceTitle} gutterBottom component="div">MARKETPLACE</Typography>
          {marketplaceFilters.map(filter => <MenuItem key={filter.type} type={filter.type} label={filter.label} />)}
        </FloatingPaper>
      )}
    </div>
  );
}
