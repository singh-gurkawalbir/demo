import produce from 'immer';
import actionTypes from '../../../actions/types';

export default (state = {}, action) => {
  const { id, type, uninstallSteps } = action;

  return produce(state, draft => {
    if (!id) {
      return;
    }

    if (!draft[id]) {
      draft[id] = {};
    }

    // eslint-disable-next-line default-case
    switch (type) {
      case actionTypes.INTEGRATION_APPS.UNINSTALLER.PRE_UNINSTALL:
        draft[id] = {};
        break;
      case actionTypes.INTEGRATION_APPS.UNINSTALLER.RECEIVED_UNINSTALL_STEPS:
        draft[id].uninstall = uninstallSteps;
        break;
      case actionTypes.INTEGRATION_APPS.UNINSTALLER.UNINSTALL_STEP.DONE:
        draft[id] = {};
        break;
      case actionTypes.INTEGRATION_APPS.UNINSTALLER.UNINSTALL_STEP.VERIFY:
        draft[id].verifying = true;
        draft[id].isTriggered = true;
        break;
      case actionTypes.INTEGRATION_APPS.UNINSTALLER.UNINSTALL_STEP.FAILURE:
        draft[id].verifying = false;
        draft[id].isTriggered = false;
        break;
      case actionTypes.INTEGRATION_APPS.UNINSTALLER.UNINSTALL_STEP.IN_PROGRESS:
        draft[id].isTriggered = true;
        break;
    }
  });
};

// #region PUBLIC SELECTORS
export function uninstallSteps(state, id) {
  if (!state || !state[id]) {
    return {};
  }

  return state[id].uninstall;
}
// #endregion
