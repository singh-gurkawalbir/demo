// import clsx from 'clsx';
import React, { useState } from 'react';
import { makeStyles,
  IconButton,
  Typography,
  Checkbox,
  Divider,
  MenuItem,
  FormControlLabel } from '@material-ui/core';
import ArrowDownIcon from '../../../../components/icons/ArrowDownIcon';
import ArrowUpIcon from '../../../../components/icons/ArrowUpIcon';
import FloatingPaper from './FloatingPaper';

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
    margin: theme.spacing(0, 1),
  },
  menu: {
    marginRight: 2,
  },
  divider: {
    margin: theme.spacing(1, 0),
  },
}));

export default function ResourceFilter({openByDefault = false}) {
  const classes = useStyles();
  const [open, setOpen] = useState(openByDefault);

  const handleArrowClick = () => setOpen(o => !o);

  return (
    <div className={classes.root}>
      <div className={classes.arrowContainer}>
        <Typography variant="h6" color="inherit">All</Typography>
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
          <MenuItem>
            <FormControlLabel
              control={<Checkbox name="All" color="primary" />}
              label="All item types" />
          </MenuItem>

          <Divider orientation="horizontal" className={classes.divider} />

          <Typography variant="subheading2" gutterBottom component="div">Search only:</Typography>

          {resources.map(r => (
            <MenuItem key={r}>
              <FormControlLabel
                control={<Checkbox name={r} color="primary" />}
                label={r} />
            </MenuItem>
          ))}
        </FloatingPaper>
      )}
    </div>
  );
}
