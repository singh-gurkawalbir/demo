import { memoize } from 'lodash';
import { useMemo } from 'react';
import { createSelector } from 'reselect';
import { useGlobalSearchContext, useGlobalSearchState } from '../GlobalSearchContext';
import { getTabResults } from '../utils';

const resultsSelector = memoize(getResults => createSelector(
  state => state.keyword,
  state => state.filters,
  (keyword, filters) => {
    const searchTokens = keyword?.includes(':') && !keyword?.startsWith(':') ? keyword?.split(':') : keyword;
    const searchValue = (Array.isArray(searchTokens) ? searchTokens[searchTokens?.length - 1] : searchTokens)?.trim?.();
    let results = {};

    if (searchValue?.trim().length > 1) {
      results = getResults?.(searchValue, filters) || {};
    }

    return results;
  }));

export default function useResults() {
  const { getResults } = useGlobalSearchContext();
  const results = useGlobalSearchState(resultsSelector(getResults));
  const {resourceResults, marketplaceResults, marketplaceResultCount, resourceResultCount} = useMemo(() => getTabResults(results), [results]);

  return {resourceResults, marketplaceResults, marketplaceResultCount, resourceResultCount};
}
