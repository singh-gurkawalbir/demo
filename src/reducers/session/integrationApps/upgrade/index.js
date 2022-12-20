import produce from 'immer';
import { forEach } from 'lodash';
import actionTypes from '../../../../actions/types';

const emptyObj = {};

export default (state = {}, action) => {
  const { id, type, statusObj, childList } = action;

  return produce(state, draft => {
    if (!id && !childList) {
      return;
    }

    // eslint-disable-next-line default-case
    switch (type) {
      case actionTypes.INTEGRATION_APPS.SETTINGS.V2.SET_STATUS:
        // following are the possible values:
        // status: "done", "hold", "inProgress", "error"
        // inQueue: "true" or "false"
        // showWizard: "true" or "false"
        // steps: [Array]
        // errMessage: denoting error message

        // following values will always be with "successMessageFlags" id
        // showMessage: 'true' or 'false'
        // showFinalMessage: 'true' or 'false'
        if (!draft[id]) draft[id] = {};
        draft[id] = {...draft[id], ...statusObj};
        break;

      case actionTypes.INTEGRATION_APPS.SETTINGS.V2.ADD_CHILD_UPGRADE_LIST:
        draft.childList = childList;
        childList.forEach(id => {
          if (!draft[id]) draft[id] = {};
          draft[id].inQueue = true;
        });
        break;

      case actionTypes.INTEGRATION_APPS.SETTINGS.V2.DELETE_STATUS:
        delete draft[id];
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

  let currentChild = 'none';

  forEach(state?.childList, id => {
    if (state[id]?.inQueue) {
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

  return produce(steps, draft => {
    if (draft.find(step => !step.completed)) {
      draft.find(step => !step.completed).isCurrentStep = true;
    }
  });
};

// #endregion
