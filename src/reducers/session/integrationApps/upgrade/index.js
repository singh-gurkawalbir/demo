import produce from 'immer';
import { forEach } from 'lodash';
import actionTypes from '../../../../actions/types';

const emptyObj = {};

export default (state = {}, action) => {
  const { id, type, statusObj, childList } = action;

  return produce(state, draft => {
    if (!id) {
      return;
    }

    // eslint-disable-next-line default-case
    switch (type) {
      case actionTypes.INTEGRATION_APPS.SETTINGS.V2.SET_STATUS:
        if (!draft[id]) draft[id] = {};
        if (statusObj?.steps) draft[id].steps = statusObj.steps;
        if (statusObj?.showWizard) draft[id].showWizard = statusObj.showWizard;
        if (statusObj?.status) draft[id].status = statusObj.status;
        if (statusObj?.inQueue) draft[id].inQueue = statusObj.inQueue;
        break;

      case actionTypes.INTEGRATION_APPS.SETTINGS.V2.ADD_CHILD_UPGRADE_LIST:
        draft.childList = childList;
        childList.forEach(id => {
          if (!draft[id]) draft[id] = {};
          draft[id].inQueue = true;
        });
        break;
    }
  });
};

// #region PUBLIC SELECTORS
export const selectors = {};

selectors.getStatus = (state, id) => {
  if (!state || !state[id]) {
    return emptyObj;
  }

  return state[id];
};

selectors.currentChildUpgrade = state => {
  if (!state || !state.childList) {
    return '';
  }

  let currentChild = '';

  forEach(state?.childList, id => {
    if (state[id].inQueue) {
      currentChild = id;

      return false;
    }
  });

  return currentChild;
};

selectors.changeEditionSteps = (state, id) => {
  if (!state || !state[id]) {
    return [];
  }

  const steps = state[id]?.steps || [];

  if (!steps.length) {
    return [];
  }

  if (steps && steps.length) {
    return produce(steps, draft => {
      if (draft.find(step => !step.completed)) {
        draft.find(step => !step.completed).isCurrentStep = true;
      }
    });
  }
};

// #endregion
