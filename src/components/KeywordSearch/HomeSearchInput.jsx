import React, { useRef, useCallback, useReducer} from 'react';
import clsx from 'clsx';
import {InputBase, IconButton} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import SearchIcon from '../icons/SearchIcon';
import CloseIcon from '../icons/CloseIcon';

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

function reducer(state, action) {
  const { type, value } = action;

  switch (type) {
    case 'setSearchFocused':
      return { ...state, searchFocused: value };
    case 'setSearchIconHidden':
      return { ...state, isSearchIconHidden: value };
    case 'setCloseIconHidden':
      return { ...state, isCloseIconHidden: value };
    default:
      throw new Error();
  }
}

const PLACEHOLDER = 'Search integrations & flows';
export default function HomeSearchInput({value, onChange}) {
  const inputRef = useRef();
  const classes = useStyles();
  const [searchBoxState, dispatchLocalAction] = useReducer(reducer, {
    searchFocused: false,
    isSearchIconHidden: false,
    isCloseIconHidden: true,
  });
  const {searchFocused, isSearchIconHidden, isCloseIconHidden} = searchBoxState;

  const onChangeHandler = useCallback(e => {
    if (e.target.value === '') {
      inputRef.current.firstChild.focus();
      inputRef.current.firstChild.placeholder = PLACEHOLDER;
      dispatchLocalAction({type: 'setSearchIconHidden', value: true});
      dispatchLocalAction({type: 'setCloseIconHidden', value: true});
    } else {
      dispatchLocalAction({type: 'setCloseIconHidden', value: false});
    }
    dispatchLocalAction({type: 'setSearchIconHidden', value: true});
    onChange(e);
  }, [onChange]);

  const blurHandler = useCallback(e => {
    if (e.target.value !== '') {
      dispatchLocalAction({type: 'setSearchIconHidden', value: true});
      dispatchLocalAction({type: 'setCloseIconHidden', value: false});
    } else {
      dispatchLocalAction({type: 'setSearchIconHidden', value: false});
    }
    dispatchLocalAction({type: 'setSearchFocused', value: false});
  }, []);

  const onClearInput = useCallback(e => {
    // eslint-disable-next-line no-param-reassign
    e.target.value = '';
    onChangeHandler(e);
  }, [onChangeHandler]);

  const focusHandler = useCallback(() => {
    dispatchLocalAction({type: 'setSearchFocused', value: true});
    dispatchLocalAction({type: 'setSearchIconHidden', value: true});
  }, []);

  return (
    <div className={clsx(classes.search, {[classes.searchActive]: searchFocused})}>
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
        placeholder={PLACEHOLDER}
        data-test="homeSearchInput"
        classes={{
          root: classes.inputRoot,
          input: clsx(classes.inputInput, {[classes.inputSearch]: isSearchIconHidden}),
        }}
        inputProps={{ 'aria-label': 'search integrations & flows' }}
        />
      <IconButton size="small" onClick={onClearInput} className={clsx(classes.closeIcon, {[classes.hideCloseBtn]: isCloseIconHidden})}>
        <CloseIcon className={classes.closeIconSvg} />
      </IconButton>
    </div>
  );
}
