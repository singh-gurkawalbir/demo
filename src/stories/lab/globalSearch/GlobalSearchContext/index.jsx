import React, { useContext, useState } from 'react';

const GlobalSearchContext = React.createContext();

export const GlobalSearchProvider = ({ children, defaultFilter = [] }) => {
  const [filter, setFilter] = useState(defaultFilter);

  return (
    <GlobalSearchContext.Provider
      value={{ filter, setFilter }}>
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
