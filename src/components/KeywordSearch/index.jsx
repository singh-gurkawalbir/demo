import { useDispatch, useSelector } from 'react-redux';
import React, { useCallback, useEffect } from 'react';
import actions from '../../actions';
import { selectors } from '../../reducers';
import SearchInputPageBar from '../SearchInput/SearchInputPageBar';
import useDebouncedValue from '../../hooks/useDebouncedInput';

export default function KeywordSearch({ filterKey, onFocus, autoFocus, placeHolder, className}) {
  const dispatch = useDispatch();
  const filter =
    useSelector(state => selectors.filter(state, filterKey));

  const [text, setText] = useDebouncedValue(filter?.keyword || '', value => {
    dispatch(
      actions.patchFilter(filterKey, {
        keyword: value,
      })
    );
  });

  // when using the same filterkey patch to filter states and setText to text field will follow faithfully
  // but if you change the filterkey we should pull in the new filterState value into the text field
  useEffect(() => {
    setText(filter?.keyword || '');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterKey]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleKeywordChange = useCallback(e => {
    setText(e.target.value);
  }, [setText]);

  return (
    <SearchInputPageBar
      value={text}
      onChange={handleKeywordChange}
      autoFocus={autoFocus}
      onFocus={onFocus}
      placeHolder={placeHolder || 'Search…'}
      className={className}
  />
  );
}
