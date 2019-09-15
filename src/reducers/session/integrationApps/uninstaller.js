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
      case actionTypes.INTEGRATION_APPS.UNINSTALLER.UNINSTALL_STEPS_RECEIVED:
        draft[id].uninstall = uninstallSteps;
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
