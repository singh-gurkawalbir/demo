import produce from 'immer';
import actionTypes from '../../../actions/types';

const emptyObj = {};
export default (state = {}, action) => {
  const { value, type, tabType, resourceId, label, index } = action;

  return produce(state, draft => {
    switch (type) {
      case actionTypes.BOTTOM_DRAWER.INIT:
        if (!draft.bottomDrawer) {
          draft.bottomDrawer = {};
        }
        draft.bottomDrawer.tabs = [];

        break;
      case actionTypes.BOTTOM_DRAWER.INIT_COMPLETE:
        if (!draft.bottomDrawer) {
          draft.bottomDrawer = {};
        }
        draft.bottomDrawer.activeTabIndex = 0;
        draft.bottomDrawer.tabs = value;
        break;

      case actionTypes.BOTTOM_DRAWER.ADD_TAB: {
        const requestedTabIndex = draft.bottomDrawer.tabs.findIndex(tab => tab.tabType === tabType && tab.resourceId === resourceId);

        if (requestedTabIndex !== -1) {
          draft.bottomDrawer.activeTabIndex = requestedTabIndex;
        } else {
          draft.bottomDrawer.tabs.push({
            tabType,
            resourceId,
            label,
          });
          draft.bottomDrawer.activeTabIndex = draft.bottomDrawer.tabs.length - 1;
        }
        break;
      }

      case actionTypes.BOTTOM_DRAWER.REMOVE_TAB:
        draft.bottomDrawer.tabs = draft.bottomDrawer.tabs.filter(tab => tab.resourceId !== resourceId);
        if (tabType === 'scriptLogs') {
          const scriptTabIndex = draft.bottomDrawer.tabs.findIndex(tab => tab.tabType === 'scripts');

          if (scriptTabIndex !== -1) {
            draft.bottomDrawer.activeTabIndex = scriptTabIndex;
          }
        } else if (tabType === 'connectionLogs') {
          const connectionsTabIndex = draft.bottomDrawer.tabs.findIndex(tab => tab.tabType === 'connections');

          if (connectionsTabIndex !== -1) {
            draft.bottomDrawer.activeTabIndex = connectionsTabIndex;
          }
        }
        break;
      case actionTypes.BOTTOM_DRAWER.SET_ACTIVE_TAB:
        if (index !== undefined) {
          draft.bottomDrawer.activeTabIndex = index;
        } else if (tabType) {
          const newActiveTabIndex = draft.bottomDrawer.tabs.findIndex(tab => tab.tabType === tabType);

          if (newActiveTabIndex !== -1) draft.bottomDrawer.activeTabIndex = newActiveTabIndex;
        }

        break;
      case actionTypes.BOTTOM_DRAWER.CLEAR:
        delete draft.bottomDrawer;

        break;
      default:
    }
  });
};

// #region PUBLIC SELECTORS
export const selectors = {};

selectors.bottomDrawerTabs = state => state?.bottomDrawer || emptyObj;

