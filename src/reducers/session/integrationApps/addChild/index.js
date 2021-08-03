import produce from 'immer';
import actionTypes from '../../../../actions/types';

const emptyObj = {};

export default (state = {}, action) => {
  const { id, type, update, steps, installerFunction, message, formMeta } = action;
  let step;

  return produce(state, draft => {
    if (!id) {
      return;
    }

    // eslint-disable-next-line default-case
    switch (type) {
      case actionTypes.INTEGRATION_APPS.CHILD.RECEIVED:
        draft[id] = { steps };
        break;
      case actionTypes.INTEGRATION_APPS.CHILD.FAILURE:
        draft[id] = { error: message };
        break;
      case actionTypes.INTEGRATION_APPS.CHILD.COMPLETE:
        steps.forEach(step => {
          let stepIndex = -1;

          if (draft[id] && draft[id].steps) {
            stepIndex = draft[id].steps.findIndex(
              s => s.installerFunction === step.installerFunction
            );
          }

          if (stepIndex !== -1) {
            draft[id].steps[stepIndex] = {
              ...draft[id].steps[stepIndex],
              ...step,
            };
          }
        });
        break;
      case actionTypes.INTEGRATION_APPS.CHILD.CLEAR:
        delete draft[id];
        break;
      case actionTypes.INTEGRATION_APPS.CHILD.UPDATE:
        if (draft[id] && draft[id].steps) {
          step = draft[id].steps.find(
            s => s.installerFunction === installerFunction
          );
        }

        if (step) {
          // for 'form' type step
          if (formMeta) {
            step.showForm = formMeta;
          }
          if (update === 'inProgress') {
            step.isTriggered = true;
          } else if (update === 'verify') {
            step.verifying = true;
            step.isTriggered = true;
          } else if (update === 'failed') {
            step.verifying = false;
            step.isTriggered = false;
          } else if (update === 'completed') {
            step.isTriggered = false;
            step.verifying = false;
            step.completed = true;
          }
        }

        break;
    }
  });
};

// #region PUBLIC SELECTORS
export const selectors = {};

selectors.addNewChildSteps = (state, id) => {
  if (!state || !state[id]) {
    return emptyObj;
  }

  return state[id];
};
// #endregion
