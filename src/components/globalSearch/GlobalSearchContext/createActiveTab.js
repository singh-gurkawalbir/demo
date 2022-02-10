import { useCallback } from 'react';
import { createSharedState } from '../../../store/createSharedState';

export const {StateProvider: TabsStateProvider, useSharedStateSelector: useTabsState} = createSharedState({
  activeTab: 0,
});
export function useActiveTab() {
  const [{activeTab}, setState] = useTabsState();
  const handleSetState = useCallback(activeTab => {
    setState({activeTab});
  }, [setState]);

  return [activeTab, handleSetState];
}
