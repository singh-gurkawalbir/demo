import clsx from 'clsx';
import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
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
    width: 400,
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
  const { open, setOpen } = useGlobalSearchContext();
  const [escapePressed, setEscapePressed] = useState(false);
  const handleOpenSearch = useCallback(() => setOpen(true), [setOpen]);
  const handleEscapeKeypress = useCallback(() => {
    // clear the text on first ESCAPE press, then close search on second.
    if (escapePressed) return;

    setOpen(false);

    // We want to de-bounce this handler as the useKeyboardShortcut would
    // otherwise get called repeatedly each time this handler's dependency
    // array changes.
    setEscapePressed(true);
    setTimeout(() => setEscapePressed(false), 200);
  }, [escapePressed, setOpen]);

  useKeyboardShortcut(['/'], handleOpenSearch);
  useKeyboardShortcut(['Escape'], handleEscapeKeypress, true);

  return (
    <>
      {!open && (
      <Tooltip
        classes={{tooltip: classes.muiTooltip}}
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

export default function GlobalSearchProto({results, onKeywordChange, onFiltersChange, filterBlacklist}) {
  return (
    <GlobalSearchProvider
      results={results}
      filterBlacklist={filterBlacklist}
      onKeywordChange={onKeywordChange}
      onFiltersChange={onFiltersChange}>
      <GlobalSearch />
    </GlobalSearchProvider>
  );
}

GlobalSearchProto.propTypes = {
  onKeywordChange: PropTypes.func.isRequired,
  onFiltersChange: PropTypes.func.isRequired,
  results: PropTypes.object,
  filterBlacklist: PropTypes.array,
};
