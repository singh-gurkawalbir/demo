import React, { useRef, useCallback, useReducer, useEffect} from 'react';
import clsx from 'clsx';
import {InputBase, IconButton} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import SearchIcon from '../../icons/SearchIcon';
import CloseIcon from '../../icons/CloseIcon';
import reducer from './stateReducer';

const useStyles = makeStyles(theme => ({
  // TODO (Azhar): *** styles are repeating work on to make a generic component
  search: {
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    borderRadius: 32,
    fontSize: theme.spacing(2),
    lineHeight: '38px',
    backgroundColor: 'transparent',
    marginRight: theme.spacing(1),
    marginLeft: 0,
    height: 38,
    width: '300px',
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
  },
  searchIcon: {
    height: '100%',
    padding: theme.spacing(0.5, 0.5, 0.5, 1),
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '& svg': {
      width: theme.spacing(2),
    },
  },
  inputRoot: {
    color: theme.palette.secondary.light,
    height: '100%',
    top: -1,
    width: '100%',
  },
  inputInput: {
    fontSize: '16px',
    lineHeight: '20px',
    letterSpacing: 'normal',
    fontFamily: 'source sans pro',
    color: theme.palette.secondary.main,
    padding: theme.spacing(0, 1, 0, 4),
    transition: theme.transitions.create('width'),
    '&::placeholder': {
      color: theme.palette.secondary.light,
      opacity: 1,
    },
  },
  inputSearch: {
    paddingLeft: 18,
    width: '90%',
  },
  searchActive: {
    borderColor: theme.palette.primary.main,
    transition: theme.transitions.create(['borderColor'],
      {
        easing: theme.transitions.easing.easeInOut,
        duration: theme.transitions.duration.complex,
      }
    ),
  },
  closeIcon: {
    marginRight: 8,
    width: 24,
    height: 24,
  },
  hideSearchIcon: {
    display: 'none',
  },
  hideCloseBtn: {
    display: 'none',
  },
  closeIconSvg: {
    fontSize: 18,
    color: theme.palette.secondary.main,
  },
}));

export default function SearchInputPageBar({value, onChange, placeHolder, openWithFocus, className, autoFocus}) {
  const inputRef = useRef();
  const classes = useStyles();
  const [searchBoxState, dispatchLocalAction] = useReducer(reducer, {
    isSearchFocused: false,
    isSearchIconHidden: false,
    isCloseIconHidden: true,
  });
  const {isSearchFocused, isSearchIconHidden, isCloseIconHidden} = searchBoxState;

  const onChangeHandler = useCallback(e => {
    if (e.target.value === '') {
      inputRef.current.firstChild.focus();
    }
    dispatchLocalAction({type: 'onInputChange', value: e.target.value});
    onChange(e);
  }, [onChange]);

  const blurHandler = useCallback(e => {
    dispatchLocalAction({type: 'onBlur', value: e.target.value});
  }, []);

  const onClearInput = useCallback(e => {
    // eslint-disable-next-line no-param-reassign
    e.target.value = '';
    onChangeHandler(e);
  }, [onChangeHandler]);

  const focusHandler = useCallback(() => {
    dispatchLocalAction({type: 'onFocus'});
  }, []);

  // to bring cursor and focus in search field when it is opened for first time
  useEffect(() => {
    if (openWithFocus) {
      inputRef.current.firstChild.focus();
      dispatchLocalAction({type: 'onInputChange', value: ''});
    }
  }, [openWithFocus]);

  return (
    <div className={clsx(classes.search, {[classes.searchActive]: isSearchFocused}, className)}>
      {!isSearchIconHidden && (
        <div className={clsx(classes.searchIcon, {[classes.hideSearchIcon]: isSearchIconHidden})}>
          <SearchIcon />
        </div>
      )}
      <InputBase
        value={value}
        ref={inputRef}
        onBlur={blurHandler}
        onFocus={focusHandler}
        onChange={onChangeHandler}
        placeholder={placeHolder || 'Search…'}
        data-test="homeSearchInput"
        classes={{
          root: classes.inputRoot,
          input: clsx(classes.inputInput, {[classes.inputSearch]: isSearchIconHidden}),
        }}
        inputProps={{ 'aria-label': placeHolder || 'search'}}
        autoFocus={autoFocus}
        />
      <IconButton size="small" onClick={onClearInput} className={clsx(classes.closeIcon, {[classes.hideCloseBtn]: isCloseIconHidden})}>
        <CloseIcon className={classes.closeIconSvg} />
      </IconButton>
    </div>
  );
}
