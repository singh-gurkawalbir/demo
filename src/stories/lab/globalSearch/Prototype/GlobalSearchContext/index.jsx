import React, { useContext, useEffect, useRef } from 'react';

const GlobalSearchContext = React.createContext();
export const GlobalSearchProvider = ({
  children,
  results,
  filterBlacklist,
  onKeywordChange,
  onFiltersChange,
  getResults }) => {
  const dispatchRefs = useRef({
    results,
    filterBlacklist,
    onKeywordChange,
    onFiltersChange,
    getResults,
  });

  useEffect(() => {
    dispatchRefs.current = {
      results,
      filterBlacklist,
      onKeywordChange,
      onFiltersChange,
      getResults,
    };
  }, [filterBlacklist, getResults, onFiltersChange, onKeywordChange, results]);

  return (
    <GlobalSearchContext.Provider
      value={dispatchRefs?.current}>
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
