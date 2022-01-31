import React, { useRef, useCallback, useEffect } from 'react';
import { IconButton, InputBase, makeStyles, Paper } from '@material-ui/core';
import CloseIcon from '../../../../../components/icons/CloseIcon';
import { useGlobalSearchState } from '../hooks/useGlobalSearchState';
import useDebouncedValue from '../hooks/useDebouncedInput';
import useActiveTab from '../hooks/useActiveTab';
import useKeyboardShortcut from '../../../../../hooks/useKeyboardShortcut';
import useSyncedRef from '../hooks/useSyncedRef';

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
  const setKeyword = useGlobalSearchState(state => state.changeKeyword);
  const setOpen = useGlobalSearchState(state => state.changeOpen);
  const filters = useGlobalSearchState(state => state.filters);
  const [activeTab] = useActiveTab();

  const [inputValue, setInputValue] = useDebouncedValue('', value => {
    setKeyword(value);
  }, 200);
  const memoizedValues = useSyncedRef({
    setInputValue,
    setOpen,
    inputValue,
  });

  const handleEscapeKeypress = useCallback(() => {
    const {inputValue, setInputValue, setOpen} = memoizedValues?.current;

    if (inputValue?.length > 0) {
      setInputValue('');
    } else {
      setOpen(false);
    }
  }, [memoizedValues]);

  const ref = useRef();

  // focus input when filters and active Tab changed
  useEffect(() => {
    if (ref?.current) {
      ref?.current?.children[0]?.focus();
    }
  }, [activeTab, filters]);

  useKeyboardShortcut(['Escape'], handleEscapeKeypress, true);

  const handleSearchStringChange = e => {
    const newSearchString = e.target.value;

    setInputValue(newSearchString);
  };

  return (
    <Paper className={classes.searchBox} variant="outlined">
      <InputBase
        ref={ref}
        spellcheck="false"
        value={inputValue}
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
