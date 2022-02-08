import { createSharedState } from '../../../store/createSharedState';

export const createSharedTabsState = () => createSharedState({
  activeTab: 0,
});
