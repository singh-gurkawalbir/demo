import { Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import InputBase from '@material-ui/core/InputBase';
import SearchIcon from '@material-ui/icons/Search';
import { fade, makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import * as selectors from '../../reducers';
import actions from '../../actions';

const useStyles = makeStyles(theme => ({
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    '&:focus': {
      backgroundColor: fade(theme.palette.common.white, 0.15),
      '&:hover': {
        backgroundColor: fade(theme.palette.common.white, 0.25),
      },
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
      width: 0,
      backgroundColor: 'none',
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
    color: theme.palette.common.white,
  },
  searchItem: {
    display: 'flex',
    '& > *:first-child': {
      marginRight: theme.spacing(1),
    },
  },
}));

export default function Search() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const filter = useSelector(state => selectors.filter(state, 'global'));
  const searchResults = useSelector(state => {
    const results = [];
    const resourceTypes = ['exports', 'imports', 'connections'];

    resourceTypes.forEach(type => {
      selectors
        .resourceList(state, { type, take: 5, keyword: filter.keyword })
        .resources.forEach(r =>
          results.push({ type, id: r._id, name: r.name })
        );
    });

    return results.sort((a, b) => {
      const nameA = a.name.toUpperCase();
      const nameB = b.name.toUpperCase();

      if (nameA < nameB) return -1;

      if (nameA > nameB) return 1;

      return 0; // names must be equal
    });
  });
  const handleChange = e => {
    dispatch(actions.patchFilter('global', { keyword: e.target.value }));
  };

  return (
    <Fragment>
      <div className={classes.search}>
        {filter.keyword && searchResults.length && (
          <div className={classes.searchResults}>
            {searchResults.map(r => (
              <div className={classes.searchItem} key={r._id}>
                <Typography>{r.name}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {r.type}
                </Typography>
              </div>
            ))}
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
