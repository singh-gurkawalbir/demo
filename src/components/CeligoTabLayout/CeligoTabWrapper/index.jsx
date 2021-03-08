import React, { useContext, useState } from 'react';

const TabContext = React.createContext();

export const CeligoTabWrapper = ({ children }) => {
  const [activeTab, setActiveTab] = useState();

  return (
    <TabContext.Provider value={{activeTab, setActiveTab}}>
      {children}
    </TabContext.Provider>
  );
};

export function useTabContext() {
  return useContext(TabContext);
}

export default {
  CeligoTabWrapper,
  useTabContext,
};
