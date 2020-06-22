import produce from 'immer';
import actionTypes from '../../../actions/types';
import { SUITESCRIPT_CONNECTORS } from '../../../utils/constants';

const emptyObj = {};

export default (state = {}, action) => {
  const { id, type, status, error, ssLinkedConnectionId, ssIntegrationId, connectionId, doc, packageType, packageUrl } = action;
  let step;
  let connector;

  return produce(state, draft => {
    if (!id) {
      return;
    }
    if (!draft[id]) {
      draft[id] = {};
    }
    // eslint-disable-next-line default-case
    switch (type) {
      case actionTypes.SUITESCRIPT.INSTALLER.INIT_STEPS:
        connector = SUITESCRIPT_CONNECTORS.find(s => s._id === id);
        draft[id].steps = [...connector.installSteps];
        break;

      case actionTypes.SUITESCRIPT.INSTALLER.FAILED:
        draft[id].error = error;
        break;

      case actionTypes.SUITESCRIPT.INSTALLER.CLEAR_STEPS:
        delete draft[id];
        break;

      case actionTypes.SUITESCRIPT.INSTALLER.UPDATE.LINKED_CONNECTION:
        draft[id].ssLinkedConnectionId = ssLinkedConnectionId;
        break;

      case actionTypes.SUITESCRIPT.INSTALLER.UPDATE.SS_INTEGRATION_ID:
        draft[id].ssIntegrationId = ssIntegrationId;
        break;

      case actionTypes.SUITESCRIPT.INSTALLER.UPDATE.SS_CONNECTION:
        draft[id][connectionId] = doc;
        break;


      case actionTypes.SUITESCRIPT.INSTALLER.UPDATE.PACKAGE:
        if (draft[id] && draft[id].steps) {
          step = draft[id].steps.find(
            s => s.type === 'package' && s.installerFunction === packageType
          );
        }
        if (step) {
          step.installURL = packageUrl;
          step.packageUpdateInProgress = false;
        }
        break;

      case actionTypes.SUITESCRIPT.INSTALLER.UPDATE.STEP:
        if (draft[id] && draft[id].steps) {
          step = draft[id].steps.find(
            s => !s.completed
          );
        }

        if (step) {
          if (status === 'completed') {
            step.isTriggered = false;
            step.completed = true;
            step.verifying = false;
          } else if (status === 'reset') {
            step.isTriggered = false;
            step.completed = false;
            step.verifying = false;
          } else if (status === 'inProgress') {
            step.isTriggered = true;
            step.verifying = false;
          } else if (status === 'verify') {
            step.verifying = true;
            step.isTriggered = true;
          }
        }
        break;
    }
  });
};

// #region PUBLIC SELECTORS
export function installerData(state, id) {
  if (!state || !state[id]) {
    return emptyObj;
  }

  return state[id];
}

// #endregion
