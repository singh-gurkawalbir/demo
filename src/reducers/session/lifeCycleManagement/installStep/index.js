import produce from 'immer';
import actionTypes from '../../../../actions/types';

export default (state = {}, action) => {
  const { revisionId, type, status, url, openOauthConnection, connectionId } = action;

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
      case actionTypes.INTEGRATION_LCM.INSTALL_STEPS.STEP.RECEIVED_OAUTH_CONNECTION_STATUS:
        draft[revisionId] = {};
        draft[revisionId].openOauthConnection = openOauthConnection;
        draft[revisionId].oAuthConnectionId = connectionId;
        break;
      default:
    }
  });
};

export const selectors = {};

selectors.updatedRevisionInstallStep = (state, revisionId) => state?.[revisionId];

selectors.revisionInstallStepOAuthConnectionId = (state, revisionId) => {
  const installStep = selectors.updatedRevisionInstallStep(state, revisionId);

  return installStep?.oAuthConnectionId;
};

selectors.hasOpenedOAuthRevisionInstallStep = (state, revisionId) => {
  const installStep = selectors.updatedRevisionInstallStep(state, revisionId);

  return !!installStep?.openOauthConnection;
};

