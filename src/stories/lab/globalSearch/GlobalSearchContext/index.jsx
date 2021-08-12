import React, { useContext, useState } from 'react';

const GlobalSearchContext = React.createContext();

export const GlobalSearchProvider = ({ children, defaultKeyword = '', defaultType = [] }) => {
  const [type, setType] = useState(defaultType);
  const [keyword, setKeyword] = useState(defaultKeyword);
  const [open, setOpen] = useState(false);

  return (
    <GlobalSearchContext.Provider
      value={{ open, type, keyword, setOpen, setType, setKeyword }}>
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
