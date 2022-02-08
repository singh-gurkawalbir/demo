import React, { useCallback, useContext, useEffect, useRef } from 'react';
import { createSharedTabsState } from './createActiveTab';
import { createGlobalSearchState } from './createGlobalSearchState';

const GlobalSearchContext = React.createContext();
export const GlobalSearchProvider = ({
  children,
  ...props }) => {
  const useGlobalSearchSharedState = createGlobalSearchState();
  const useActiveTabState = createSharedTabsState({
    activeTab: 0,
  });

  const dispatchRefs = useRef({
    ...props,
    useGlobalSearchSharedState,
    useActiveTabState,
  });

  useEffect(() => {
    dispatchRefs.current = {
      ...props,
      useGlobalSearchSharedState,
      useActiveTabState,
    };
  }, [props, useActiveTabState, useGlobalSearchSharedState]);

  return (
    <GlobalSearchContext.Provider
      value={dispatchRefs?.current}>
      {children}
    </GlobalSearchContext.Provider>
  );
};

export function useGlobalSearchContext() {
  return useContext(GlobalSearchContext);
}
export function useGlobalSearchState(selector) {
  const {useGlobalSearchSharedState} = useContext(GlobalSearchContext);

  return useGlobalSearchSharedState(selector);
}
export function useActiveTab() {
  const {useActiveTabState} = useContext(GlobalSearchContext);
  const [{activeTab}, setState] = useActiveTabState();
  const handleSetState = useCallback(activeTab => {
    setState({activeTab});
  }, [setState]);

  return [activeTab, handleSetState];
}
export default {
  GlobalSearchProvider,
  useGlobalSearchContext,
};
