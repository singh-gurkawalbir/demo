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

const resources = [
  'Integrations',
  'Flows',
  'Connections',
  'Imports',
  'Exports',
  'Scripts',
  'Agents',
  'Stacks',
  'My APIs',
  'API tokens',
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
  const { type, setType } = useGlobalSearchContext();
  const [open, setOpen] = useState(openByDefault);

  const handleArrowClick = () => setOpen(o => !o);

  const FilterLabel = () => {
    if (type?.length === 0) {
      return (
        <Typography variant="h6" color="inherit" className={classes.filterLabel}>
          All
        </Typography>
      );
    }

    return (
      <Tooltip title={`Filter${type.length > 1 ? 's' : ''} applied`} placement="bottom" aria-label="Filters">
        <Badge color="secondary" overlap="circle" variant="dot">
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

          {resources.map(r => (
            <MenuItem key={r} name={r} label={r} />
          ))}

          <Divider orientation="horizontal" className={classes.divider} />
          <Typography variant="subtitle2" gutterBottom component="div">MARKETPLACE</Typography>

          <MenuItem name="ia" label="Integration apps" />
          <MenuItem name="template" label="Template" />
        </FloatingPaper>
      )}
    </div>
  );
}
