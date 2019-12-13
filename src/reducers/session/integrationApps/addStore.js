import produce from 'immer';
import actionTypes from '../../../actions/types';

export default (state = {}, action) => {
  const { id, type, update, steps, installerFunction, message } = action;
  let step;

  return produce(state, draft => {
    if (!id) {
      return;
    }

    // eslint-disable-next-line default-case
    switch (type) {
      case actionTypes.INTEGRATION_APPS.STORE.RECEIVED:
        draft[id] = { steps };
        break;
      case actionTypes.INTEGRATION_APPS.STORE.FAILURE:
        draft[id] = { error: message };
        break;
      case actionTypes.INTEGRATION_APPS.STORE.COMPLETE:
        steps.forEach(step => {
          let stepIndex = -1;

          if (draft[id] && draft[id].steps)
            stepIndex = draft[id].steps.findIndex(
              s => s.installerFunction === step.installerFunction
            );

          if (stepIndex !== -1) {
            draft[id][stepIndex] = {
              ...draft[id][stepIndex],
              ...step,
              isTriggered: true,
              verifying: false,
            };
          }
        });
        break;
      case actionTypes.INTEGRATION_APPS.STORE.CLEAR:
        delete draft[id];
        break;
      case actionTypes.INTEGRATION_APPS.STORE.UPDATE:
        if (draft[id] && draft[id].steps)
          step = draft[id].steps.find(
            s => s.installerFunction === installerFunction
          );

        if (step) {
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

export function addNewStoreSteps(state, id) {
  if (!state || !state[id]) {
    return {};
  }

  return state[id];
}
// #endregion
