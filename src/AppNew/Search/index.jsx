import { useState, Fragment } from 'react';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import { fade, makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(1),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  },
  searchIcon: {
    width: theme.spacing(7),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 7),
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: 100,
      '&:focus': {
        width: 200,
      },
    },
  },
  searchResults: {
    position: 'fixed',
    display: 'inline-block',
    zIndex: theme.zIndex.appBar + 1,
    padding: theme.spacing(1, 2),
    height: 200,
    width: '100%',
    marginTop: theme.spacing(6),
    // border: `solid 1px ${fade(theme.palette.common.black, 0.87)}`,
    // borderTop: 0,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    backgroundColor: fade(theme.palette.secondary.light, 0.9),
  },
}));

export default function Search() {
  const classes = useStyles();
  const [searchTerm, setSearchTerm] = useState(null);
  const handleChange = e => {
    setSearchTerm(e.target.value);
  };

  return (
    <Fragment>
      <div className={classes.search}>
        {searchTerm && (
          <div className={classes.searchResults}>
            <Typography>Exports</Typography>
            <Typography variant="body2">Export {searchTerm}</Typography>
            <Typography variant="body2">{searchTerm} exp</Typography>
            <Typography style={{ marginTop: 8 }}>Imports</Typography>
            <Typography variant="body2">{searchTerm} import</Typography>
            <Typography variant="body2">import {searchTerm}</Typography>
            <Typography variant="body2">import {searchTerm}</Typography>
            <Typography variant="body2">import {searchTerm}</Typography>
          </div>
        )}
        <div className={classes.searchIcon}>
          <SearchIcon />
        </div>
        <InputBase
          onChange={handleChange}
          placeholder="Search…"
          classes={{
            root: classes.inputRoot,
            input: classes.inputInput,
          }}
          inputProps={{ 'aria-label': 'search' }}
        />
      </div>
    </Fragment>
  );
}
