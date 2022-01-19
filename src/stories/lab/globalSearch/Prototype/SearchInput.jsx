import React, { useEffect, useState, useRef } from 'react';
import { IconButton, InputBase, makeStyles, Paper } from '@material-ui/core';
import {isEqual} from 'lodash';
import CloseIcon from '../../../../components/icons/CloseIcon';
import { useGlobalSearchContext } from './GlobalSearchContext';
import { buildSearchString, getFilters, getKeyword } from './utils';

const useStyles = makeStyles(theme => ({
  searchBox: {
    width: '100%',
    padding: [[5, 8]],
    display: 'flex',
    alignItems: 'center',
    border: `1px solid ${theme.palette.secondary.contrastText}`,
    borderRadius: 24,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    borderLeft: 0,
    flexGrow: 1,
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  inputBase: {
    padding: 0,
  },
  searchCloseButton: {
    padding: 0,
    margin: -6,
    marginLeft: 4,
  },
}));

function SearchInput() {
  const classes = useStyles();
  const {setOpen, setKeyword, keyword, filters, setFilters} = useGlobalSearchContext();
  const [searchString, setSearchString] = useState();
  const [skip, setSkip] = useState(false);
  const ref = useRef();

  const handleSearchStringChange = e => {
    const newSearchString = e.target.value;

    setSkip(true);
    setSearchString(newSearchString);

    const newKeyword = getKeyword(newSearchString);
    const newFilters = getFilters(newSearchString);

    if (keyword !== newKeyword) {
      setKeyword(newKeyword);
    }

    if (!isEqual(filters, newFilters)) {
      setFilters(newFilters);
    }
  };

  useEffect(() => {
    if (skip) return setSkip(false);

    // we only want to rebuild the search string IFF it already has
    // the filter shorthand. The filter syntax is advanced feature,
    // and may confuse non-developer or first time users.
    if (keyword?.includes(':')) {
      setSearchString(buildSearchString(filters, keyword));
    }

    // The ref of <InputBase> is actually a div wrapper.
    // We want the first child, which is the input element.
    const input = ref.current?.children?.[0];

    input?.focus();
  // we do not want this effect to fire on anything BUT filter changes...
  // This effect is used to update the search string if a user interacts with
  // the filter list component...
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  return (
    <Paper component="form" className={classes.searchBox} variant="outlined">
      <InputBase
        ref={ref}
        spellcheck="false"
        value={searchString}
        classes={{input: classes.inputBase}}
        className={classes.input}
        autoFocus
        placeholder="Search integrator.io"
        inputProps={{ 'aria-label': 'Search integrator.io', tabIndex: 0 }}
        onChange={handleSearchStringChange}
      />
      <IconButton size="small" onClick={() => setOpen(false)} className={classes.searchCloseButton}>
        <CloseIcon />
      </IconButton>
    </Paper>
  );
}

const MemoizedSearchInput = React.memo(SearchInput);

export default MemoizedSearchInput;
