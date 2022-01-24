import clsx from 'clsx';
import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core';
import useKeyboardShortcut from '../../../../hooks/useKeyboardShortcut';
import ResourceFilter from './ResourceFilter';
import SearchBox from './SearchBox/SearchBox';
import { GlobalSearchProvider } from './GlobalSearchContext';
import { useGlobalSearchState } from './hooks/useGlobalSearchState';
import SearchToolTip from './SearchBox/SearchTooltip';

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
}));

function GlobalSearch() {
  const classes = useStyles();
  const open = useGlobalSearchState(state => state.open);
  const setOpen = useGlobalSearchState(state => state.changeOpen);
  const handleOpenSearch = useCallback(() => setOpen(true), [setOpen]);

  useKeyboardShortcut(['/'], handleOpenSearch);

  return (
    <div className={clsx(classes.root, {[classes.closed]: !open})}>
      {!open ? (
        <SearchToolTip />
      ) : (
        <>
          <ResourceFilter />
          <SearchBox />
        </>
      )}
    </div>
  );
}

export default function GlobalSearchProto({getResults, results, onKeywordChange, onFiltersChange, filterBlacklist}) {
  return (
    <GlobalSearchProvider
      getResults={getResults}
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
