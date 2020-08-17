import { useDispatch, useSelector } from 'react-redux';
import React, { useCallback, useEffect } from 'react';
import actions from '../../actions';
import SearchInput from '../SearchInput';
import { selectors } from '../../reducers';

export default function KeywordSearch({ filterKey, defaultFilter }) {
  const dispatch = useDispatch();
  const filter =
    useSelector(state => selectors.filter(state, filterKey)) || defaultFilter;
  const handleKeywordChange = useCallback(
    e => {
      dispatch(
        actions.patchFilter(filterKey, {
          ...defaultFilter,
          keyword: e.target.value,
        })
      );
    },
    [defaultFilter, dispatch, filterKey]
  );

  useEffect(() => handleKeywordChange({ target: { value: '' } }), [
    handleKeywordChange,
  ]);

  return (
    <SearchInput
      value={(filter && filter.keyword) || ''}
      onChange={handleKeywordChange}
    />
  );
}
