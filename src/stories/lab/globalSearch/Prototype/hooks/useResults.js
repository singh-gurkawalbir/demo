import { useMemo } from 'react';
import { useGlobalSearchContext } from '../GlobalSearchContext';
import { getTabResults } from '../utils';
import { useGlobalSearchState } from './useGlobalSearchState';

export default function useResults() {
  const keyword = useGlobalSearchState(state => state.keyword);
  const filters = useGlobalSearchState(state => state.filters);
  const { getResults, results: resultsProp } = useGlobalSearchContext();
  const searchValue = keyword?.includes(':') ? keyword?.split(':')?.[1] : keyword;
  const results = resultsProp ?? keyword?.length > 1 ? getResults(searchValue, filters) : {};
  const {resourceResults, marketplaceResults, marketplaceResultCount, resourceResultCount} = useMemo(() => getTabResults(results), [results]);

  return {resourceResults, marketplaceResults, marketplaceResultCount, resourceResultCount};
}
