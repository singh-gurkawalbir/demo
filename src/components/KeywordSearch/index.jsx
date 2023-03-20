import { useDispatch, useSelector } from 'react-redux';
import React, { useCallback, useEffect } from 'react';
import {SearchInput} from '@celigo/fuse-ui';
import makeStyles from '@mui/styles/makeStyles';
import actions from '../../actions';
import { selectors } from '../../reducers';

const useStyles = makeStyles(theme => ({
  homeSearchInput: {
    marginRight: theme.spacing(1),
    height: 38,
  },
  searchInput: {
    width: 'auto',
    '& .MuiInputBase-input': {
      width: 70,
      transition: theme.transitions.create('width'),
    },
    '& .MuiInputBase-input:focus': {
      width: 200,
    },
  },
}));

export default function KeywordSearch({ filterKey, isHomeSearch, onFocus}) {
  const dispatch = useDispatch();
  const filter = useSelector(state => selectors.filter(state, filterKey));
  const classes = useStyles();

  // when using the same filterkey patch to filter states and setText to text field will follow faithfully
  // but if you change the filterkey we should pull in the new filterState value into the text field
  useEffect(() => {
    dispatch(
      actions.patchFilter(filterKey, {
        keyword: filter?.keyword || '',
      })
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterKey]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleKeywordChange = useCallback(value => {
    dispatch(
      actions.patchFilter(filterKey, {
        keyword: value,
      })
    );
  }, [dispatch, filterKey]);

  return (
    <SearchInput
      value={filter?.keyword || ''}
      onChange={handleKeywordChange}
      onFocus={onFocus}
      placeholder={isHomeSearch ? 'Search integrations & flows' : 'Search…'}
      debounceDuration={300}
      size={isHomeSearch ? 'large' : 'small'}
      className={isHomeSearch ? classes.homeSearchInput : classes.searchInput}
    />
  );
}
