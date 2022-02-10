import React, { useContext, useEffect, useRef } from 'react';
import { TabsStateProvider } from './createActiveTab';
import { GlobalSearchStateProvider } from './createGlobalSearchState';

const GlobalSearchContext = React.createContext();
export const GlobalSearchProvider = ({
  children,
  ...props }) => {
  const dispatchRefs = useRef({
    ...props,
  });

  useEffect(() => {
    dispatchRefs.current = {
      ...props,
    };
  }, [props]);

  return (
    <GlobalSearchContext.Provider
      value={dispatchRefs?.current}>
      <GlobalSearchStateProvider>
        <TabsStateProvider>
          {children}
        </TabsStateProvider>
      </GlobalSearchStateProvider>
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
