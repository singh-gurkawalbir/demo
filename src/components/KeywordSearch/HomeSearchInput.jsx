import React from 'react';
import {InputBase, IconButton} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import SearchIcon from '../icons/SearchIcon';
import CloseIcon from '../icons/CloseIcon';

const useStyles = makeStyles(theme => ({
  search: {
    position: 'relative',
    borderRadius: 32,
    fontSize: theme.spacing(2),
    lineHeight: '38px',
    backgroundColor: 'transparent',
    marginRight: theme.spacing(1),
    marginLeft: 0,
    width: '300px',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
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
    height: '38px',
  },
  inputInput: {
    fontSize: '16px',
    lineHeight: '20px',
    letterSpacing: 'normal',
    fontFamily: 'source sans pro',
    color: theme.palette.secondary.main,
    padding: theme.spacing(0, 1, 0, 4),
    transition: theme.transitions.create('width'),
    width: 300,
    [theme.breakpoints.up('sm')]: {
      '&:focus': {
        width: 300,
      },
    },
  },
}));

// todo: Azhar, fix below things:
// search bar width and height
// when field is click, close icon appears, field outline turns blue, search icon disappears
// rest verify from mocks
// with console open, distorted view
export default function HomeSearchInput({ onChange, ...rest }) {
  const classes = useStyles();
  const onClearInput = e => {
    // eslint-disable-next-line no-param-reassign
    e.target.value = '';
    onChange(e);
  };

  return (
    <>
      <div className={classes.search}>
        <div className={classes.searchIcon}>
          <SearchIcon />
        </div>
        <InputBase
          {...rest}
          onChange={onChange}
          placeholder="Search integrations & flows"
          classes={{
            root: classes.inputRoot,
            input: classes.inputInput,
          }}
          inputProps={{ 'aria-label': 'search integrations & flows' }}
        />
        <IconButton size="small" onClick={onClearInput}>
          <CloseIcon />
        </IconButton>
      </div>
    </>
  );
}
