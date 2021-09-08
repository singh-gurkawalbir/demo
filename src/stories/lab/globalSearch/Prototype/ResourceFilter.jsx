import clsx from 'clsx';
import React, { useState } from 'react';
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
    marginRight: 2,
  },
  allItemChecked: {
    color: `${theme.palette.text.disabled}!important`,
    cursor: 'default',
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
}));

export default function ResourceFilter({openByDefault = false}) {
  const classes = useStyles();
  const { filters, setFilters, onFiltersChange } = useGlobalSearchContext();
  const [open, setOpen] = useState(openByDefault);

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

  const MenuItem = ({ name, label }) => {
    const isChecked = filters.includes(name) || (name === 'all' && !filters?.length);

    const handleMenuItemClick = name => {
      let newFilters = [];

      if (name === 'all') {
        newFilters = [];
      } else if (filters?.includes(name)) {
        newFilters = filters.filter(i => i !== name);
      } else {
      // last case is type not present, so add it.
        newFilters = [...filters, name];
      }
      setFilters(newFilters);
      onFiltersChange?.(newFilters);
    };

    return (
      <div>
        <FormControlLabel
          onClick={() => handleMenuItemClick(name)}
          control={(
            <Checkbox
              checked={isChecked}
              name={name}
              className={clsx({[classes.allItemChecked]: isChecked && name === 'all' })}
              color="primary" />
          )}
          label={label} />
      </div>
    );
  };

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
            <MenuItem name="all" label="All" />
            <IconButton size="small" onClick={handleArrowClick}>
              <CloseIcon />
            </IconButton>
          </div>

          <Divider orientation="horizontal" className={classes.divider} />
          <Typography variant="subtitle2" gutterBottom component="div">RESOURCES</Typography>

          {Object.keys(filterMap).map(key => {
            const filter = filterMap[key];

            return <MenuItem key={key} name={filter.name} label={filter.label} />;
          })}

          <Divider orientation="horizontal" className={classes.divider} />
          <Typography variant="subtitle2" gutterBottom component="div">MARKETPLACE</Typography>

          <MenuItem name="ia" label="Integration apps" />
          <MenuItem name="template" label="Template" />
        </FloatingPaper>
      )}
    </div>
  );
}
