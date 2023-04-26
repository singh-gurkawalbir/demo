import clsx from 'clsx';
import React, { useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import makeStyles from '@mui/styles/makeStyles';
import { useLocation } from 'react-router-dom';
import useKeyboardShortcut from '../../hooks/useKeyboardShortcut';
import ResourceFilter from './ResourceFilter';
import SearchBox from './SearchBox/SearchBox';
import { GlobalSearchProvider } from './GlobalSearchContext';
import SearchToolTip from './SearchBox/SearchTooltip';
import useClickOutSide from '../../hooks/useClickOutSide';
import { useGlobalSearchState } from './GlobalSearchContext/createGlobalSearchState';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    width: '100%',
    minWidth: ({open}) => open ? '400px' : '32px',
    maxWidth: '400px',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.easeIn,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  closed: {
    width: 0,
  },
}));

function GlobalSearchConsumer() {
  const open = useGlobalSearchState(state => state.open);
  const setOpen = useGlobalSearchState(state => state.changeOpen);
  const location = useLocation();
  const classes = useStyles({open});
  const handleOpenSearch = useCallback(() => setOpen(true), [setOpen]);
  const memoizedHandler = useRef({setOpen});
  const rootRef = useRef();
  const handleCloseSearch = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  useEffect(() => {
    const { setOpen } = memoizedHandler?.current;

    setOpen(false);
  }, [location.pathname]);
  useEffect(() => {
    const { setOpen } = memoizedHandler?.current;

    return () => setOpen(false);
  }, []);
  useKeyboardShortcut(['/'], handleOpenSearch, {useCapture: false});

  useClickOutSide(rootRef, handleCloseSearch);

  return (
    <div ref={rootRef} className={clsx(classes.root, {[classes.closed]: !open})}>
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

export default function GlobalSearch({getResults, filterBlacklist}) {
  return (
    <GlobalSearchProvider
      getResults={getResults}
      filterBlacklist={filterBlacklist}
     >
      <GlobalSearchConsumer />
    </GlobalSearchProvider>
  );
}

GlobalSearch.propTypes = {
  getResults: PropTypes.func.isRequired,
  filterBlacklist: PropTypes.array,
};
