import { Fragment } from 'react';
import InputBase from '@material-ui/core/InputBase';
import { fade, makeStyles } from '@material-ui/core/styles';
import SearchIcon from '../icons/SearchIcon';

const useStyles = makeStyles(theme => ({
  search: {
    position: 'relative',
    borderRadius: 32,
    backgroundColor: props =>
      props.variant === 'light'
        ? fade(theme.palette.common.black, 0.04)
        : fade(theme.palette.common.white, 0.1),
    '&:hover': {
      backgroundColor: props =>
        props.variant === 'light'
          ? fade(theme.palette.common.black, 0.15)
          : fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(1),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
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
      width: 70,
      '&:focus': {
        width: 200,
      },
    },
  },
}));

export default function SearchInput({ variant, ...rest }) {
  const classes = useStyles({ variant });

  return (
    <Fragment>
      <div className={classes.search}>
        <div className={classes.searchIcon}>
          <SearchIcon />
        </div>
        <InputBase
          {...rest}
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
