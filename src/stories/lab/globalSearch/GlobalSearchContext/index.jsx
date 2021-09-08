import React, { useContext, useState } from 'react';

const GlobalSearchContext = React.createContext();

export const GlobalSearchProvider = ({
  children,
  defaultKeyword = '',
  defaultType = [],
  onKeywordChange,
  onFiltersChange }) => {
  const [filters, setFilters] = useState(defaultType);
  const [keyword, setKeyword] = useState(defaultKeyword);
  const [open, setOpen] = useState(false);

  const initialState = {
    open,
    filters,
    keyword,
    onKeywordChange,
    onFiltersChange,
    setOpen,
    setFilters,
    setKeyword,
  };

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
