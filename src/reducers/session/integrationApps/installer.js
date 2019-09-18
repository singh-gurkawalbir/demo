import produce from 'immer';
import actionTypes from '../../../actions/types';

export default (state = {}, action) => {
  const { id, type, update, steps } = action;

  return produce(state, draft => {
    if (!id) {
      return;
    }

    if (!draft[id]) {
      draft[id] = {};
    }

    // eslint-disable-next-line default-case
    switch (type) {
      case actionTypes.INTEGRATION_APPS.INSTALLER.INSTALL_STEP.DONE:
        draft[id] = {};
        break;
      case actionTypes.INTEGRATION_APPS.STORE.RECEIVED:
        draft[id].addNewStoreSteps = steps;
        break;
      case actionTypes.INTEGRATION_APPS.STORE.CLEAR:
        draft[id].addNewStoreSteps = undefined;
        break;
      case actionTypes.INTEGRATION_APPS.INSTALLER.INSTALL_STEP.UPDATE:
        if (update === 'inProgress') {
          draft[id].isTriggered = true;
        } else if (update === 'verify') {
          draft[id].verifying = true;
          draft[id].isTriggered = true;
        } else if (update === 'failed') {
          draft[id].verifying = false;
          draft[id].isTriggered = false;
        }

        break;
    }
  });
};

// #region PUBLIC SELECTORS
export function integrationAppsInstaller(state, id) {
  if (!state || !state[id]) {
    return {};
  }

  return state[id];
}

export function addNewStoreSteps(state, id) {
  if (!state || !state[id]) {
    return {};
  }

  return state[id].addNewStoreSteps;
}
// #endregion
