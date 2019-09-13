import produce from 'immer';
import actionTypes from '../../../actions/types';

export default (state = {}, action) => {
  const { id, type } = action;

  return produce(state, draft => {
    if (!draft[id]) {
      draft[id] = {};
    }

    if (!draft[id].installer) {
      draft[id].installer = {};
    }

    const config = draft[id].installer;

    // eslint-disable-next-line default-case
    switch (type) {
      case actionTypes.INTEGRATION_APPS.INSTALLER.STEP_INSTALL_COMPLETE:
        draft[id].installer = {};
        break;
      case actionTypes.INTEGRATION_APPS.INSTALLER.STEP_INSTALL_VERIFY:
        config.verifying = true;
        config.isTriggered = true;
        break;
      case actionTypes.INTEGRATION_APPS.INSTALLER.STEP_INSTALL_FAILURE:
        config.verifying = false;
        config.isTriggered = false;
        break;
      case actionTypes.INTEGRATION_APPS.INSTALLER.STEP_INSTALL_IN_PROGRESS:
        config.isTriggered = true;
        break;
    }
  });
};

// #region PUBLIC SELECTORS
export function integrationAppsInstaller(state, id) {
  if (!state || !state[id]) {
    return {};
  }

  return state[id].installer || {};
}
// #endregion
