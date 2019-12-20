import produce from 'immer';
import actionTypes from '../../../actions/types';

const emptyObject = {};
const emptyArray = [];

export default (state = {}, action) => {
  const {
    id,
    type,
    error,
    uninstallSteps,
    uninstallerFunction,
    update,
  } = action;
  let step;

  return produce(state, draft => {
    if (!id) {
      return;
    }

    // eslint-disable-next-line default-case
    switch (type) {
      case actionTypes.INTEGRATION_APPS.UNINSTALLER.PRE_UNINSTALL:
        draft[id] = {};
        break;
      case actionTypes.INTEGRATION_APPS.UNINSTALLER.RECEIVED_STEPS:
        if (!draft[id]) {
          draft[id] = {};
        }

        draft[id].steps = uninstallSteps;

        break;
      case actionTypes.INTEGRATION_APPS.UNINSTALLER.FAILED_UNINSTALL_STEPS:
        if (!draft[id]) {
          draft[id] = {};
        }

        draft[id].error = error;
        break;
      case actionTypes.INTEGRATION_APPS.UNINSTALLER.STEP.CLEAR:
        delete draft[id];
        break;
      case actionTypes.INTEGRATION_APPS.UNINSTALLER.STEP.UPDATE:
        if (draft[id] && draft[id].steps) {
          step = draft[id].steps.find(
            s => s.uninstallerFunction === uninstallerFunction
          );
        }

        if (step) {
          if (update === 'completed') {
            step.isTriggered = false;
            step.verifying = false;
            step.completed = true;
          } else if (update === 'verify') {
            step.verifying = true;
            step.isTriggered = true;
          } else if (update === 'failed') {
            step.verifying = false;
            step.isTriggered = false;
          } else if (update === 'inProgress') {
            step.isTriggered = true;
          }
        }

        break;
    }
  });
};

// #region PUBLIC SELECTORS
export function uninstallSteps(state, id) {
  if (!state || !state[id]) {
    return emptyArray;
  }

  return state[id].steps;
}

export function uninstallData(state, id) {
  if (!state || !state[id]) {
    return emptyObject;
  }

  return state[id];
}
// #endregion
