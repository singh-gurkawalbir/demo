// import clsx from 'clsx';
import React, { useState } from 'react';
import { makeStyles,
  IconButton,
  Typography,
  Checkbox,
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
    width: 22,
    textAlign: 'center',
  },
  badge: {
    backgroundColor: theme.palette.primary.light,
  },
}));

export default function ResourceFilter({openByDefault = false}) {
  const classes = useStyles();
  const { type, setType } = useGlobalSearchContext();
  const [open, setOpen] = useState(openByDefault);

  const handleArrowClick = () => setOpen(o => !o);

  const FilterLabel = () => {
    if (type?.length === 0) {
      return 'All';
    }

    return (
      <Tooltip title={type.join(', ')} placement="bottom" aria-label="Filters">
        <Badge classes={{badge: classes.badge}} overlap="circle" variant="dot" badgeContent={type.length}>
          <FilterIcon fontSize="small" />
        </Badge>
      </Tooltip>
    );
  };

  const MenuItem = ({ name, label }) => {
    const isChecked = type.includes(name) || (name === 'all' && !type?.length);

    const handleMenuItemClick = name => {
      if (name === 'all') {
        setType([]);
      } else if (type?.includes(name)) {
        setType(type.filter(i => i !== name));
      } else {
      // last case is type not present, so add it.
        setType([...type, name]);
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
