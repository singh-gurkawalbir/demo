import { useDispatch, useSelector } from 'react-redux';
import React, { useCallback, useEffect, useState } from 'react';
import { debounce } from 'lodash';
import actions from '../../actions';
import SearchInput from '../SearchInput';
import { selectors } from '../../reducers';

const DEBOUNCE_DURATION = 300;
export default function KeywordSearch({ filterKey }) {
  const dispatch = useDispatch();
  const filter =
    useSelector(state => selectors.filter(state, filterKey));

  const [text, setText] = useState(filter?.keyword || '');

  // when using the same filterkey patch to filter states and setText to text field will follow faithfully
  // but if you change the filterkey we should pull in the new filterState value into the text field
  useEffect(() => {
    setText(filter?.keyword || '');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterKey]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncePatchTextInput = useCallback(
    debounce(value => {
      dispatch(
        actions.patchFilter(filterKey, {
          keyword: value,
        })
      );
    }, DEBOUNCE_DURATION), [filterKey]);

  const handleKeywordChange = useCallback(e => {
    setText(e.target.value);
    debouncePatchTextInput(e.target.value);
  }, [debouncePatchTextInput]);

  return (
    <SearchInput
      value={text}
      onChange={handleKeywordChange}
    />
  );
}
