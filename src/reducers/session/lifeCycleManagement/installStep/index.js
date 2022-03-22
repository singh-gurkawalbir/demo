import produce from 'immer';
import actionTypes from '../../../../actions/types';

export default (state = {}, action) => {
  const { revisionId, type, status, url } = action;

  if (!revisionId) return state;

  return produce(state, draft => {
    switch (type) {
      case actionTypes.INTEGRATION_LCM.INSTALL_STEPS.STEP.UPDATE:
        if (!draft[revisionId]) {
          draft[revisionId] = {};
        }
        draft[revisionId].updatedUrl = url;

        if (status === 'inProgress') {
          draft[revisionId].isTriggered = true;
        } else if (status === 'verify') {
          draft[revisionId].verifying = true;
          draft[revisionId].isTriggered = true;
        } else if (status === 'failed') {
          draft[revisionId].verifying = false;
          draft[revisionId].isTriggered = false;
        }
        break;
      case actionTypes.INTEGRATION_LCM.INSTALL_STEPS.STEP.DONE:
        delete draft[revisionId];
        break;
      default:
    }
  });
};

export const selectors = {};

selectors.updatedRevisionInstallStep = (state, revisionId) => state?.[revisionId];
