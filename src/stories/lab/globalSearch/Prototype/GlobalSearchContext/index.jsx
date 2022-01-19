import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { buildSearchString, getKeyword } from '../utils';

const GlobalSearchContext = React.createContext();

export const GlobalSearchProvider = ({
  children,
  results,
  filterBlacklist,
  defaultKeyword = '',
  defaultFilters = [],
  onKeywordChange,
  onFiltersChange }) => {
  const [filters, setFilters] = useState(defaultFilters);
  const [keyword, setKeyword] = useState(defaultKeyword);
  const [open, setOpen] = useState(false);
  const dispatchRefs = useRef({
    onKeywordChange,
    onFiltersChange,
  });
  const handleKeywordChange = useCallback(newSearchString => {
    let newKeyword = getKeyword(newSearchString);

    if (newSearchString?.includes(':')) {
      newKeyword = buildSearchString(filters, newSearchString);
    }

    setKeyword(newKeyword);
    const { onKeywordChange} = dispatchRefs.current;

    onKeywordChange?.(newKeyword);
  }, [filters]);

  const handleFiltersChange = useCallback(filters => {
    setFilters(filters);
    const { onFiltersChange} = dispatchRefs.current;

    onFiltersChange?.(filters);
  }, []);
  const handleOpenChange = useCallback(value => {
    setOpen(value);
    if (!value) {
      setKeyword('');
      setFilters([]);
    }
  }, []);

  const initialState = useMemo(() => ({
    open,
    filters,
    keyword,
    results,
    filterBlacklist,
    setOpen: handleOpenChange,
    setFilters: handleFiltersChange,
    setKeyword: handleKeywordChange,
    isResultsOpen: keyword?.length > 1,
  }), [filterBlacklist, filters, handleFiltersChange, handleKeywordChange, handleOpenChange, keyword, open, results]);

  return (
    <GlobalSearchContext.Provider
      value={initialState}>
      {children}
    </GlobalSearchContext.Provider>
  );
};

export function useGlobalSearchContext() {
  return useContext(GlobalSearchContext);
}

export default {
  GlobalSearchProvider,
  useGlobalSearchContext,
};
