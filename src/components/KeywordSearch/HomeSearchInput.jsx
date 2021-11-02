import React, { useState} from 'react';
import clsx from 'clsx';
import {InputBase, IconButton, ClickAwayListener} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import SearchIcon from '../icons/SearchIcon';
import CloseIcon from '../icons/CloseIcon';

const useStyles = makeStyles(theme => ({
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
  hideSearchIcon: {
    display: 'none',
  },
  hideCloseIcon: {
    display: 'none',
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
  hideCloseBtn: {
    display: 'none',
  },
  closeIconSvg: {
    fontSize: 18,
    color: theme.palette.secondary.main,
  },
}));

export default function HomeSearchInput({value, onChange}) {
  const [searchFocused, setSearchFocused] = useState(false);
  const [isSearchIconHidden, setSearchIconHidden] = useState(false);
  const [isCloseIconHidden, setCloseIconHidden] = useState(true);

  const classes = useStyles();
  const onChangeHandler = e => {
    if (e.target.value !== '') {
      setSearchIconHidden(true);
      setCloseIconHidden(false);
    } else {
      setSearchIconHidden(false);
      setCloseIconHidden(true);
    }
    onChange(e);
  };
  const searchClickHandler = () => {
    setSearchFocused(true);
    setSearchIconHidden(false);
  };
  const onClearInput = e => {
    // eslint-disable-next-line no-param-reassign
    e.target.value = '';
    setSearchFocused(false);
    onChangeHandler(e);
  };

  const handleClose = e => {
    if (e.target.value === '') {
      setSearchIconHidden(false);
    }
    setSearchFocused(false);
  };

  return (
    <ClickAwayListener onClickAway={handleClose}>
      <div className={clsx(classes.search, {[classes.searchActive]: searchFocused})} onClick={searchClickHandler}>
        {!isSearchIconHidden && (
        <div className={clsx(classes.searchIcon, {[classes.hideSearchIcon]: isSearchIconHidden})}>
          <SearchIcon />
        </div>
        )}
        <InputBase
          value={value}
          onChange={onChangeHandler}
          placeholder="Search integrations & flows"
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
    </ClickAwayListener>
  );
}
