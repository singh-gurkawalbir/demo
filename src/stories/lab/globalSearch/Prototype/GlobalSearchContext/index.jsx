import React, { useContext, useEffect, useRef } from 'react';

const GlobalSearchContext = React.createContext();
export const GlobalSearchProvider = ({
  children,
  filterBlacklist,
  getResults }) => {
  const dispatchRefs = useRef({
    filterBlacklist,
    getResults,
  });

  useEffect(() => {
    dispatchRefs.current = {
      filterBlacklist,
      getResults,
    };
  }, [filterBlacklist, getResults]);

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
