import { useMemo } from 'react';
import { useGlobalSearchContext } from '../GlobalSearchContext';
import { getTabResults } from '../utils';
import { useGlobalSearchState } from './useGlobalSearchState';

const resultsSelector = getResults => state => {
  const {keyword, filters} = state;
  const searchValue = keyword?.includes(':') ? keyword?.split(':')?.[1] : keyword;
  const results = searchValue?.length > 1 ? getResults(searchValue, filters) : {};

  return results;
};
export default function useResults() {
  const { getResults } = useGlobalSearchContext();
  const results = useGlobalSearchState(resultsSelector(getResults));
  const {resourceResults, marketplaceResults, marketplaceResultCount, resourceResultCount} = useMemo(() => getTabResults(results), [results]);

  return {resourceResults, marketplaceResults, marketplaceResultCount, resourceResultCount};
}
