import React, { useContext, useState } from 'react';
import { Box } from '@celigo/fuse-ui';

const TabContext = React.createContext();

export const CeligoTabWrapper = ({ children, height, className }) => {
  const [activeTab, setActiveTab] = useState();

  return (
    <TabContext.Provider value={{activeTab, setActiveTab, height}}>
      <Box className={className}>
        {children}
      </Box>
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
