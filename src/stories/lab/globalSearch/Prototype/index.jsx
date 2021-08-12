import clsx from 'clsx';
import React, { useState, useCallback } from 'react';
import { makeStyles, Tooltip, IconButton } from '@material-ui/core';
import SearchIcon from '../../../../components/icons/SearchIcon';
import useKeyboardShortcut from '../../../../hooks/useKeyboardShortcut';
import ResourceFilter from './ResourceFilter';
import SearchBox from './SearchBox';
import TooltipTitle from './TooltipTitle';
import { GlobalSearchProvider } from '../GlobalSearchContext';

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
  muiTooltip: {
    paddingBottom: 6,
  },
}));

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
        <GlobalSearchProvider>
          {open && (
            <>
              <ResourceFilter />
              <SearchBox />
            </>
          )}
        </GlobalSearchProvider>
      </div>
    </>
  );
}
