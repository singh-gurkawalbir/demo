import React, { useRef, useCallback, useEffect } from 'react';
import { IconButton, InputBase, Paper } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import CloseIcon from '../../icons/CloseIcon';
import useDebouncedValue from '../../../hooks/useDebouncedInput';
import useKeyboardShortcut from '../../../hooks/useKeyboardShortcut';
import useSyncedRef from '../../../hooks/useSyncedRef';
import { useGlobalSearchState } from '../GlobalSearchContext/createGlobalSearchState';
import { useActiveTab } from '../GlobalSearchContext/createActiveTab';

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
  const keyword = useGlobalSearchState(state => state.keyword);
  const setKeyword = useGlobalSearchState(state => state.changeKeyword);
  const setOpen = useGlobalSearchState(state => state.changeOpen);
  const filters = useGlobalSearchState(state => state.filters);
  const isResourceFiltersOpen = useGlobalSearchState(state => state.resourceFiltersOpen);
  const [activeTab] = useActiveTab();
  const [inputValue, setInputValue] = useDebouncedValue('', value => {
    setKeyword(value);
  }, 100);
  const memoizedValues = useSyncedRef({
    setInputValue,
    setOpen,
    inputValue,
    keyword,
  });
  const ref = useRef();

  // This effect is for syncing the keyword value with internal input
  // When the results panel is closed, we want the input to be empty
  useEffect(() => {
    if (keyword === '') {
      setInputValue('');
      if (ref?.current) {
        ref?.current?.children[0]?.focus();
      }
    }
  }, [keyword, setInputValue]);

  // When a filter is selected by clicking, we clear the special characters in keyword
  // So this is effect will sync the new keyword to the local inputvalue
  useEffect(() => {
    const { keyword, inputValue, setInputValue } = memoizedValues?.current;

    if (!keyword?.includes(':') && inputValue?.includes(':')) {
      setInputValue(keyword);
    }
  }, [filters, memoizedValues]);
  const handleEscapeKeypress = useCallback(() => {
    const {inputValue, setInputValue, setOpen} = memoizedValues?.current;

    if (inputValue?.length > 0) {
      setInputValue('');
    } else {
      setOpen(false);
    }
  }, [memoizedValues]);

  // focus input when isResourceFiltersOpen, filters and active Tab changed
  useEffect(() => {
    if (ref?.current) {
      ref?.current?.children[0]?.focus();
    }
  }, [activeTab, filters, isResourceFiltersOpen]);

  useKeyboardShortcut(['Escape'], handleEscapeKeypress, {ignoreBlacklist: true});

  const handleSearchStringChange = e => {
    const newSearchString = e.target.value;

    setInputValue(newSearchString);
  };

  return (
    <Paper className={classes.searchBox} variant="outlined">
      <InputBase
        ref={ref}
        spellCheck="false"
        value={inputValue}
        classes={{input: classes.inputBase}}
        className={classes.input}
        placeholder="Search integrator.io"
        inputProps={{ 'aria-label': 'Search integrator.io', tabIndex: 0 }}
        onChange={handleSearchStringChange}
      />
      <IconButton title="Close Search" size="small" onClick={() => setOpen(false)} className={classes.searchCloseButton}>
        <CloseIcon />
      </IconButton>
    </Paper>
  );
}
export default SearchInput;
