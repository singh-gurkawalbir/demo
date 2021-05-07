import { useDispatch, useSelector } from 'react-redux';
import React, { useCallback, useState } from 'react';
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncePatchTextInput = useCallback(
    debounce(value => {
      dispatch(
        actions.patchFilter(filterKey, {
          keyword: value,
        })
      );
    }, DEBOUNCE_DURATION), []);

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
