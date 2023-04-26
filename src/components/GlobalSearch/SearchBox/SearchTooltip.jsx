import React from 'react';
import { IconButton, Tooltip, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import SearchIcon from '../../icons/SearchIcon';
import { useGlobalSearchState } from '../GlobalSearchContext/createGlobalSearchState';

const useStyles = makeStyles(theme => ({
  muiTooltip: {
    paddingBottom: 6,
  },
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
export default function SearchToolTip() {
  const classes = useStyles();
  const setOpen = useGlobalSearchState(state => state.changeOpen);

  return (
    <Tooltip
      classes={{tooltip: classes.muiTooltip}}
      title={<TooltipTitle />}
      placement="bottom"
      aria-label="Global search">
      <IconButton size="small" onClick={() => setOpen(true)}>
        <SearchIcon />
      </IconButton>
    </Tooltip>
  );
}

function TooltipTitle() {
  const classes = useStyles();

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
}
