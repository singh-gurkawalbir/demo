import React, { useContext } from 'react';
import useSyncedRef from '../../../hooks/useSyncedRef';
import { TabsStateProvider } from './createActiveTab';
import { GlobalSearchStateProvider } from './createGlobalSearchState';

const GlobalSearchContext = React.createContext();
export const GlobalSearchProvider = ({
  children,
  ...props }) => {
  const dispatchRefs = useSyncedRef(props);

  return (
    <GlobalSearchContext.Provider
      value={dispatchRefs}>
      <GlobalSearchStateProvider>
        <TabsStateProvider>
          {children}
        </TabsStateProvider>
      </GlobalSearchStateProvider>
    </GlobalSearchContext.Provider>
  );
};

export function useGlobalSearchContext() {
  return useContext(GlobalSearchContext)?.current;
}
export default {
  GlobalSearchProvider,
  useGlobalSearchContext,
};
