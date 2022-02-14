import React, { useContext } from 'react';

const TreeContext = React.createContext();

export const TreeContextProvider = ({ treeData, setTreeData, children }) => (
  <TreeContext.Provider
    value={{ treeData, setTreeData }}>
    {children}
  </TreeContext.Provider>
);

export function useTreeContext() {
  return useContext(TreeContext);
}

export default {
  TreeContextProvider,
  useTreeContext,
};

