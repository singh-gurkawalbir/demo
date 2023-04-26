import { useDispatch, useSelector } from 'react-redux';
import React, { useCallback, useEffect } from 'react';
import {SearchInput} from '@celigo/fuse-ui';
import actions from '../../actions';
import { selectors } from '../../reducers';

export default function KeywordSearch({
  filterKey,
  placeholder = 'Search…',
  size = 'large',
  onFocus,
  sx}) {
  const dispatch = useDispatch();
  const filter = useSelector(state => selectors.filter(state, filterKey));

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
      autoFocus
      value={filter?.keyword || ''}
      onChange={handleKeywordChange}
      onFocus={onFocus}
      placeholder={placeholder}
      debounceDuration={300}
      size={size}
      sx={sx}
    />
  );
}
