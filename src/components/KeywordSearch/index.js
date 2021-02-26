import { useDispatch, useSelector } from 'react-redux';
import React, { useCallback } from 'react';
import actions from '../../actions';
import SearchInput from '../SearchInput';
import { selectors } from '../../reducers';

export default function KeywordSearch({ filterKey }) {
  const dispatch = useDispatch();
  const filter =
    useSelector(state => selectors.filter(state, filterKey));
  const handleKeywordChange = useCallback(
    e => {
      dispatch(
        actions.patchFilter(filterKey, {
          keyword: e.target.value,
        })
      );
    },
    [dispatch, filterKey]
  );

  return (
    <SearchInput
      value={filter?.keyword || ''}
      onChange={handleKeywordChange}
    />
  );
}
