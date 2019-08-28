import { Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Typography, InputBase } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { fade, makeStyles } from '@material-ui/core/styles';
import * as selectors from '../../reducers';
import actions from '../../actions';

const useStyles = makeStyles(theme => ({
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    '&:hover': {
      backgroundColor: fade(theme.palette.common.black, 0.15),
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
    width: theme.spacing(5),
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
    padding: theme.spacing(1, 1, 1, 4),
    transition: theme.transitions.create('width'),
    [theme.breakpoints.up('sm')]: {
      width: 0,
      '&:focus': {
        width: 200,
        backgroundColor: fade(theme.palette.common.white, 0.15),
      },
    },
  },
  searchResults: {
    position: 'fixed',
    display: 'inline-block',
    zIndex: theme.zIndex.appBar + 1,
    padding: theme.spacing(1, 2),
    // minHeight: '10vh',
    maxHeight: '75vh',
    overflow: 'auto',
    width: '100%',
    marginTop: theme.appBarHeight - 1,
    // border: `solid 1px ${fade(theme.palette.common.black, 0.87)}`,
    // borderTop: 0,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    backgroundColor: theme.palette.secondary.light,
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
  //
  // TECH DEBT: This resource merge and sort code below should be move to
  // a custom global search selector and tests added to ensure below
  // code is robust.
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
        {filter.keyword && (
          <div className={classes.searchResults}>
            {searchResults.length ? (
              searchResults.map(r => (
                <div className={classes.searchItem} key={r.id}>
                  <Typography
                    color="inherit"
                    component={Link}
                    to={`/pg/${r.type}/edit/${r.id}`}>
                    {r.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {r.type}
                  </Typography>
                </div>
              ))
            ) : (
              <Typography>No Match</Typography>
            )}
          </div>
        )}
        <div className={classes.searchIcon}>
          <SearchIcon />
        </div>
        <InputBase
          onChange={handleChange}
          placeholder="Global search…"
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
