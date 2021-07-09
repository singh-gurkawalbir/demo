import clsx from 'clsx';
import React, { useState, useCallback } from 'react';
import { makeStyles, Tooltip, Paper, InputBase, IconButton, Typography } from '@material-ui/core';
import SearchIcon from '../../../../components/icons/SearchIcon';
import useKeyboardShortcut from '../../../../hooks/useKeyboardShortcut';
import ResourceFilter from './ResourceFilter';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    width: 500,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.easeIn,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  closed: {
    width: 0,
  },
  searchContainer: {
    padding: theme.spacing(0.5, 1),
    display: 'flex',
    alignItems: 'center',
    borderRadius: 24,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    borderColor: theme.palette.primary.main,
    borderLeft: 0,
    flexGrow: 1,
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  muiTooltip: {
    paddingBottom: 6,
  },
}));

const useTooltipStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    alignItems: 'center',
  },
  shortcutBox: {
    backgroundColor: theme.palette.secondary.light,
    borderRadius: 4,
    padding: theme.spacing(0.25, 1),
    margin: theme.spacing(0, 0, 0, 2),
  },
}));

const TooltipTitle = () => {
  const classes = useTooltipStyles();

  return (
    <div className={classes.root}>
      <Typography
        color="inherit"
        variant="subtitle2">
        Search integrator.io
      </Typography>
      <div className={classes.shortcutBox}>
        <Typography color="inherit" variant="h6">/</Typography>
      </div>
    </div>
  );
};

export default function GlobalSearchProto() {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const handleOpenSearch = useCallback(() => setOpen(true), []);
  const handleCloseSearch = useCallback(() => setOpen(false), []);

  useKeyboardShortcut(['/'], handleOpenSearch);
  useKeyboardShortcut(['Escape'], handleCloseSearch, true);

  return (
    <>
      {!open && (
        <Tooltip
          classes={{tooltip: classes.muiTooltip}}
          arrow
          data-public
          title={<TooltipTitle />}
          placement="bottom"
          aria-label="Global search">
          <IconButton size="small" onClick={() => setOpen(true)}>
            <SearchIcon />
          </IconButton>
        </Tooltip>
      )}

      <div className={clsx(classes.root, {[classes.closed]: !open})}>
        {open && (
          <>
            <ResourceFilter />

            <Paper component="form" className={classes.searchContainer} variant="outlined">
              <SearchIcon />
              <InputBase
                className={classes.input}
                placeholder="Search integrator.io"
                inputProps={{ 'aria-label': 'Search integrator.io' }}
              />
            </Paper>
          </>
        )}
      </div>
    </>
  );
}
