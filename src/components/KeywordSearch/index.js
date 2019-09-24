import { useDispatch } from 'react-redux';
import actions from '../../actions';
import SearchInput from '../../components/SearchInput';

export default function KeywordSearch({ filterKey, defaultFilter }) {
  const dispatch = useDispatch();
  const handleKeywordChange = e => {
    dispatch(
      actions.patchFilter(filterKey, {
        ...defaultFilter,
        keyword: e.target.value,
      })
    );
  };

  return <SearchInput variant="light" onChange={handleKeywordChange} />;
}
