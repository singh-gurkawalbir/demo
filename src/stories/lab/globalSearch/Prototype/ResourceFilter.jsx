// import clsx from 'clsx';
import React, { useState } from 'react';
import { makeStyles, IconButton, Typography, Paper, Checkbox, Divider } from '@material-ui/core';
import ArrowDownIcon from '../../../../components/icons/ArrowDownIcon';

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
    padding: theme.spacing(1, 2),
    position: 'absolute',
    zIndex: 6000,
    top: 65,
    // left: 50,
  },
  menuItem: {
    display: 'flex',
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
    <>
      <div className={classes.root}>
        <Typography variant="h6" color="inherit">All</Typography>
        <IconButton
          size="small"
          color="inherit"
          className={classes.iconButton}
          onClick={handleArrowClick}
        >
          <ArrowDownIcon />
        </IconButton>
      </div>

      {open && (
        <Paper className={classes.menu} elevation={5}>
          <div className={classes.menuItem}>
            <Checkbox />
            <Typography variant="body2">All item types</Typography>
          </div>

          <Divider orientation="horizontal" className={classes.divider} />

          <Typography variant="subheading2" gutterBottom component="div">Search only:</Typography>

          {resources.map(r => (
            <div key={r} className={classes.menuItem}>
              <Checkbox />
              <Typography variant="body2">{r}</Typography>
            </div>
          ))}
        </Paper>
      )}
    </>
  );
}
