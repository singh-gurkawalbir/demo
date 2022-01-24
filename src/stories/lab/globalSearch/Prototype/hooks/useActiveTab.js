import { useCallback } from 'react';
import { createSharedState } from '../GlobalSearchContext/createSharedState';

const useTabState = createSharedState({
  activeTab: 0,
});
export default function useActiveTab() {
  const [{activeTab}, setState] = useTabState();
  const handleSetState = useCallback(activeTab => {
    setState({activeTab});
  }, [setState]);

  return [activeTab, handleSetState];
}
