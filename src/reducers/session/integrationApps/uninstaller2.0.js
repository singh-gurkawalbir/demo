import produce from 'immer';
import actionTypes from '../../../actions/types';

const emptyObject = {};

export default (state = {}, action) => {
  const {
    id,
    type,
    error,
    uninstallSteps,
    update,
  } = action;
  let step;

  return produce(state, draft => {
    if (!id) {
      return;
    }

    // eslint-disable-next-line default-case
    switch (type) {
      case actionTypes.INTEGRATION_APPS.UNINSTALLER2.INIT:
        draft[id] = {};
        break;
      case actionTypes.INTEGRATION_APPS.UNINSTALLER2.FAILED:
        if (!draft[id]) {
          draft[id] = {};
        }

        draft[id].error = error;
        break;
      case actionTypes.INTEGRATION_APPS.UNINSTALLER2.RECEIVED_STEPS:
        if (!draft[id]) {
          draft[id] = {};
        }

        // isFetched is used to identify if integration has 0 steps
        draft[id].isFetched = true;
        draft[id].steps = uninstallSteps;

        break;
      case actionTypes.INTEGRATION_APPS.UNINSTALLER2.CLEAR_STEPS:
        delete draft[id];
        break;
      case actionTypes.INTEGRATION_APPS.UNINSTALLER2.STEP.UPDATE:
        if (draft[id] && draft[id].steps) {
          step = draft[id].steps.find(
            s => !s.completed
          );
        }

        if (step) {
          if (update === 'completed') {
            step.isTriggered = false;
            step.completed = true;
          } else if (update === 'reset') {
            step.isTriggered = false;
            step.completed = false;
          } else if (update === 'inProgress') {
            step.isTriggered = true;
          }
        }

        break;
    }
  });
};

// #region PUBLIC SELECTORS
export function uninstall2Data(state, id) {
  if (!state || !state[id]) {
    return emptyObject;
  }

  return state[id];
}
// #endregion
