import clsx from 'clsx';
import React, { useCallback, useState } from 'react';
import { makeStyles, Tooltip, IconButton } from '@material-ui/core';
import SearchIcon from '../../../../components/icons/SearchIcon';
import useKeyboardShortcut from '../../../../hooks/useKeyboardShortcut';
import ResourceFilter from './ResourceFilter';
import SearchBox from './SearchBox';
import TooltipTitle from './TooltipTitle';
import { GlobalSearchProvider, useGlobalSearchContext } from '../GlobalSearchContext';

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

function GlobalSearch() {
  const classes = useStyles();
  const { keyword, setKeyword, open, setOpen } = useGlobalSearchContext();
  const [escapePressed, setEscapePressed] = useState(false);
  const handleOpenSearch = useCallback(() => setOpen(true), [setOpen]);
  const handleEscapeKeypress = useCallback(() => {
    // clear the text on first ESCAPE press, then close search on second.
    if (escapePressed) return;

    if (keyword?.length) {
      setKeyword('');
    } else {
      setOpen(false);
    }

    // We want to de-bounce this handler as the useKeyboardShortcut would
    // otherwise get called repeatedly each time this handler's dependency
    // array changes.
    setEscapePressed(true);
    setTimeout(() => setEscapePressed(false), 200);
  }, [escapePressed, keyword, setKeyword, setOpen]);

  useKeyboardShortcut(['/'], handleOpenSearch);
  useKeyboardShortcut(['Escape'], handleEscapeKeypress, true);

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
          <SearchBox />
        </>
        )}
      </div>
    </>
  );
}

export default function GlobalSearchProto() {
  return (
    <GlobalSearchProvider>
      <GlobalSearch />
    </GlobalSearchProvider>
  );
}
