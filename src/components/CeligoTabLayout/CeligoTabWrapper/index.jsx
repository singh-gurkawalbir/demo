import React, { useContext, useState } from 'react';

const TabContext = React.createContext();

export const CeligoTabWrapper = ({ children, height }) => {
  const [activeTab, setActiveTab] = useState();

  return (
    <TabContext.Provider value={{activeTab, setActiveTab, height}}>
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
