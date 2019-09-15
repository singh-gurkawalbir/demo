import produce from 'immer';
import actionTypes from '../../../actions/types';

export default (state = {}, action) => {
  const { id, type } = action;

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
      case actionTypes.INTEGRATION_APPS.INSTALLER.INSTALL_STEP.VERIFY:
        draft[id].verifying = true;
        draft[id].isTriggered = true;
        break;
      case actionTypes.INTEGRATION_APPS.INSTALLER.INSTALL_STEP.FAILURE:
        draft[id].verifying = false;
        draft[id].isTriggered = false;
        break;
      case actionTypes.INTEGRATION_APPS.INSTALLER.INSTALL_STEP.IN_PROGRESS:
        draft[id].isTriggered = true;
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
// #endregion
