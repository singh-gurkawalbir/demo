// import clsx from 'clsx';
import React, { useState } from 'react';
import { makeStyles,
  IconButton,
  Typography,
  Checkbox,
  Divider,
  FormControlLabel,
  Tooltip} from '@material-ui/core';
import ArrowDownIcon from '../../../../components/icons/ArrowDownIcon';
import ArrowUpIcon from '../../../../components/icons/ArrowUpIcon';
import FloatingPaper from './FloatingPaper';
import CloseIcon from '../../../../components/icons/CloseIcon';
import { useGlobalSearchContext } from '../GlobalSearchContext';

const resources = [
  'Connections',
  'Imports',
  'Exports',
  'Flows',
  'Integrations',
  'Templates',
  'Integration apps',
];

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    alignItems: 'flex-end',
    flexDirection: 'column',
  },
  arrowContainer: {
    color: theme.palette.common.white,
    paddingLeft: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    borderRadius: 24,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    backgroundColor: theme.palette.secondary.light,
    borderColor: theme.palette.primary.main,
  },
  iconButton: {
    // margin: theme.spacing(0, 1),
  },
  menu: {
    marginRight: 2,
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
    width: 18,
    textAlign: 'center',
  },
}));

export default function ResourceFilter({openByDefault = false}) {
  const classes = useStyles();
  const { filter, setFilter } = useGlobalSearchContext();
  const [open, setOpen] = useState(openByDefault);

  const handleArrowClick = () => setOpen(o => !o);

  const FilterLabel = () => {
    if (filter?.length === 0) {
      return 'All';
    }

    return (
      <Tooltip title={filter.join(', ')} placement="bottom" aria-label="Filters">
        <span>{filter.length.toString()}</span>
      </Tooltip>
    );
  };

  const MenuItem = ({ name, label }) => {
    const isChecked = filter.includes(name) || (name === 'all' && !filter?.length);

    const handleMenuItemClick = name => {
      if (name === 'all') {
        setFilter([]);
      } else if (filter?.includes(name)) {
        setFilter(filter.filter(i => i !== name));
      } else {
      // last case is filter not present, so add it.
        setFilter([...filter, name]);
      }
    };

    return (
      <div>
        <FormControlLabel
          onClick={() => handleMenuItemClick(name)}
          control={<Checkbox checked={isChecked} name={name} color="primary" />}
          label={label} />
      </div>
    );
  };

  return (
    <div className={classes.root}>
      <div className={classes.arrowContainer}>
        <Typography variant="h6" color="inherit" className={classes.filterLabel}>
          <FilterLabel />
        </Typography>
        <IconButton
          size="small"
          color="inherit"
          className={classes.iconButton}
          onClick={handleArrowClick}
        >
          {open ? <ArrowUpIcon /> : <ArrowDownIcon />}
        </IconButton>
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
          <Typography variant="caption" color="textSecondary" gutterBottom component="div">Filter by category:</Typography>
          <Typography variant="subtitle2" gutterBottom component="div">RESOURCES</Typography>

          {resources.map(r => (
            <MenuItem key={r} name={r} label={r} />
          ))}

          <Divider orientation="horizontal" className={classes.divider} />
          <Typography variant="subtitle2" gutterBottom component="div">MARKETPLACE</Typography>

          <MenuItem name="ia" label="Integration App" />
          <MenuItem name="template" label="Template" />
        </FloatingPaper>
      )}
    </div>
  );
}
