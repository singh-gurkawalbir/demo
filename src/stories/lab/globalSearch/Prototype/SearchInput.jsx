import React from 'react';
import { IconButton, InputBase, makeStyles, Paper } from '@material-ui/core';
import CloseIcon from '../../../../components/icons/CloseIcon';
import { useGlobalSearchContext } from './GlobalSearchContext';

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

function SearchInput({value, onChange}, ref) {
  const classes = useStyles();
  const {setOpen} = useGlobalSearchContext();

  return (
    <Paper component="form" className={classes.searchBox} variant="outlined">
      <InputBase
        ref={ref}
        spellcheck="false"
        value={value}
        classes={{input: classes.inputBase}}
        className={classes.input}
        placeholder="Search integrator.io"
        inputProps={{ 'aria-label': 'Search integrator.io', tabIndex: 0 }}
        onChange={onChange}
      />
      <IconButton size="small" onClick={() => setOpen(false)} className={classes.searchCloseButton}>
        <CloseIcon />
      </IconButton>
    </Paper>
  );
}

const SearchInputWithRef = React.forwardRef(SearchInput);

const MemoizedSearchInput = React.memo(SearchInputWithRef, (prev, next) => prev?.value === next?.value);

export default MemoizedSearchInput;
