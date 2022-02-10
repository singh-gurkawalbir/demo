import React from 'react';
import { IconButton, makeStyles, Tooltip } from '@material-ui/core';
import SearchIcon from '../../icons/SearchIcon';
import TooltipTitle from './TooltipTitle';
import { useGlobalSearchState } from '../GlobalSearchContext/createGlobalSearchState';

const useStyles = makeStyles(() => ({
  muiTooltip: {
    paddingBottom: 6,
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
