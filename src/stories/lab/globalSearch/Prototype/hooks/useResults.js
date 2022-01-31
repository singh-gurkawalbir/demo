import { useMemo } from 'react';
import { useGlobalSearchContext } from '../GlobalSearchContext';
import { getTabResults } from '../utils';
import { useGlobalSearchState } from './useGlobalSearchState';

const resultsSelector = getResults => state => {
  const {keyword, filters} = state;
  const searchTokens = keyword?.includes(':') ? keyword?.split(':') : keyword;
  const searchValue = (Array.isArray(searchTokens) ? searchTokens[searchTokens?.length - 1] : searchTokens)?.trim?.();
  const results = searchValue?.trim().length > 1 ? getResults(searchValue, filters) : {};

  return results;
};
export default function useResults() {
  const { getResults } = useGlobalSearchContext();
  const results = useGlobalSearchState(resultsSelector(getResults));
  const {resourceResults, marketplaceResults, marketplaceResultCount, resourceResultCount} = useMemo(() => getTabResults(results), [results]);

  return {resourceResults, marketplaceResults, marketplaceResultCount, resourceResultCount};
}
