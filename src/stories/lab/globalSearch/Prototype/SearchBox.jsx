import React from 'react';
import { makeStyles, Paper, InputBase } from '@material-ui/core';
import SearchIcon from '../../../../components/icons/SearchIcon';
import FloatingPaper from './FloatingPaper';
import { useGlobalSearchContext } from '../GlobalSearchContext';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    alignItems: 'flex-start',
    flexDirection: 'column',
  },
  searchBox: {
    width: '100%',
    padding: theme.spacing(0.5, 1),
    display: 'flex',
    alignItems: 'center',
    borderRadius: 24,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    borderColor: theme.palette.primary.main,
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
  resultsPaper: {
    width: 400,
    minHeight: 300,
    maxHeight: 500,
  },
}));

export default function SearchBox() {
  const classes = useStyles();
  const { keyword, setKeyword } = useGlobalSearchContext();
  const showResults = keyword?.length >= 2;
  const handleChange = e => setKeyword(e.target.value);

  return (
    <div className={classes.root}>
      <Paper component="form" className={classes.searchBox} variant="outlined">
        <SearchIcon fontSize="small" />

        <InputBase
          value={keyword}
          classes={{input: classes.inputBase}}
          className={classes.input}
          placeholder="Search integrator.io"
          inputProps={{ 'aria-label': 'Search integrator.io' }}
          onChange={handleChange}
      />
      </Paper>
      {showResults && (
        <FloatingPaper className={classes.resultsPaper}>
          Search Results.!
        </FloatingPaper>
      )}
    </div>
  );
}
