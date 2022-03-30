import React, { useContext, useRef, useEffect } from 'react';

const TreeContext = React.createContext();

export const TreeContextProvider = ({ treeData, setTreeData, children }) => {
  const treeRefs = useRef(
    setTreeData,
  );

  useEffect(() => {
    treeRefs.current = setTreeData;
  }, [setTreeData]);

  return (
    <TreeContext.Provider
      value={{
        treeData,
        setTreeData: treeRefs.current,
      }}>
      {children}
    </TreeContext.Provider>
  );
};

export function useTreeContext() {
  return useContext(TreeContext);
}

export default {
  TreeContextProvider,
  useTreeContext,
};

