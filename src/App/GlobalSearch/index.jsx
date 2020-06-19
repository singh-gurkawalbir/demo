import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import { Typography, InputBase } from '@material-ui/core';
import { fade, makeStyles } from '@material-ui/core/styles';
import * as selectors from '../../reducers';
import actions from '../../actions';
import LoadResources from '../../components/LoadResources';
import SearchIcon from '../../components/icons/SearchIcon';

const useStyles = makeStyles(theme => ({
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,

    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
      marginRight: theme.spacing(-0.5),
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
    '&.Mui-focused': {
      border: '1px solid',
      borderColor: fade(theme.palette.common.black, 0.15),
      borderRadius: 20,
      backgroundColor: theme.palette.common.white,
      zIndex: '-1',
    },
  },
  inputInput: {
    background: 'transparent',
    padding: theme.spacing(0.5, 1, 0.5, 4),
    transition: theme.transitions.create('width'),
    [theme.breakpoints.up('sm')]: {
      width: 0,
      '&:focus': {
        width: 200,
      },
    },
  },
  searchResults: {
    position: 'fixed',
    zIndex: theme.zIndex.modal - 1,
    maxHeight: '75vh',
    overflow: 'auto',
    width: '100%',
    marginTop: theme.appBarHeight - 1,
    boxShadow: theme.shadows[1],
    borderTop: 0,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    backgroundColor: theme.palette.common.white,
    color: theme.palette.secondary.light,
    maxWidth: 390,
  },
  searchItem: {
    display: 'flex',
    position: 'relative',
    padding: theme.spacing(1),
    justifyContent: 'space-between',
    wordBreak: 'break-word',
    borderBottom: `solid 1px ${fade(theme.palette.common.black, 0.1)}`,
    '& > *:first-child': {
      flexGrow: 1,
      marginRight: theme.spacing(1),
      flexBasis: '50%',
    },
    '&:before': {
      content: '""',
      width: 6,
      height: '100%',
      position: 'absolute',
      left: 0,
      top: 0,
      backgroundColor: 'transparent',
    },
    '&:hover': {
      backgroundColor: theme.palette.background.paper2,
      '&:before': {
        background: theme.palette.primary.main,
      },
    },
  },
  noResult: {
    padding: theme.spacing(1),
  },
}));

function GlobalSearch({ location }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const filter = useSelector(state => selectors.filter(state, 'global'));
  const [showSearchResults, setShowSearchResults] = useState(true);
  //
  // TECH DEBT: This resource merge and sort code below should be move to
  // a custom global search selector and tests added to ensure below
  // code is robust.
  const resourceTypes = [
    'exports',
    'imports',
    'connections',
    'agents',
    'scripts',
    'stacks',
    'apis',
  ];
  const searchResults = useSelector(state => {
    const results = [];

    resourceTypes.forEach(type => {
      selectors
        .resourceList(state, { type, take: 5, keyword: filter.keyword })
        .resources.forEach(r =>
          results.push({ type, id: r._id, name: r.name })
        );
    });

    return results.sort((a, b) => {
      const nameA = a.name ? a.name.toUpperCase() : '';
      const nameB = b.name ? b.name.toUpperCase() : '';

      if (nameA < nameB) return -1;

      if (nameA > nameB) return 1;

      return 0; // names must be equal
    });
  });
  const handleChange = keyword => {
    dispatch(actions.patchFilter('global', { keyword }));
  };

  const handleBlur = () => {
    setShowSearchResults(false);
  };

  const handleFocus = () => {
    setShowSearchResults(true);
  };

  return (
    <>
      <div className={classes.search}>
        {filter.keyword && (
          <LoadResources resources={resourceTypes}>
            {showSearchResults && (
              <div className={classes.searchResults}>
                {searchResults.length ? (
                  searchResults.map(r => (
                    <div className={classes.searchItem} key={r.id}>
                      <Typography
                        color="inherit"
                        component={Link}
                        onClick={() => handleChange('')}
                        to={`${location.pathname}/edit/${r.type}/${r.id}`}>
                        {r.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        [{r.type}]
                      </Typography>
                    </div>
                  ))
                ) : (
                  <Typography className={classes.noResult}>No Match</Typography>
                )}
              </div>
            )}
          </LoadResources>
        )}
        <div className={classes.searchIcon}>
          <SearchIcon />
        </div>
        <InputBase
          onChange={e => handleChange(e.target.value)}
          onBlur={handleBlur}
          onFocus={handleFocus}
          placeholder="Search"
          classes={{
            root: classes.inputRoot,
            input: classes.inputInput,
          }}
          inputProps={{ 'aria-label': 'search' }}
        />
      </div>
    </>
  );
}

export default withRouter(GlobalSearch);
