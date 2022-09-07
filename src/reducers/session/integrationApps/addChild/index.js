import produce from 'immer';
import { createSelector } from 'reselect';
import actionTypes from '../../../../actions/types';
import { emptyObject } from '../../../../constants';

export default (state = {}, action) => {
  const { id, type, update, steps, installerFunction, message, showForm } = action;
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
          if (showForm) {
            step.showForm = showForm;
          }
          if (update === 'inProgress') {
            step.isTriggered = true;
            delete step.showForm;
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
          } else if (update === 'reset') {
            step.isTriggered = false;
            delete step.showForm;
          }
        }

        break;
    }
  });
};

// #region PUBLIC SELECTORS
export const selectors = {};

selectors.addNewChildSteps = createSelector(
  (state, integrationId) => state && state[integrationId],
  addNewChildSteps => {
    const { steps, error } = addNewChildSteps || {};

    if (error) return {error};

    if (!steps || !Array.isArray(steps)) {
      return emptyObject;
    }

    return { steps: produce(steps, draft => {
      if (draft.find(step => !step.completed)) {
        draft.find(step => !step.completed).isCurrentStep = true;
      }
    })};
  });
// #endregion
