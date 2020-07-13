import produce from 'immer';
import actionTypes from '../../../actions/types';

const emptyObj = {};

export default (state = {}, action) => {
  const { id, type, update, formMeta, openOauthConnection, connectionId } = action;

  return produce(state, draft => {
    if (!id && !connectionId) {
      return;
    }

    // eslint-disable-next-line default-case
    switch (type) {
      case actionTypes.INTEGRATION_APPS.INSTALLER.STEP.DONE:
        draft[id] = {};
        break;
      case actionTypes.INTEGRATION_APPS.INSTALLER.RECEIVED_OAUTH_CONNECTION_STATUS:
        draft.openOauthConnection = openOauthConnection;
        draft.connectionId = connectionId;
        break;

      case actionTypes.INTEGRATION_APPS.INSTALLER.STEP.UPDATE:
        if (!draft[id]) {
          draft[id] = {};
        }

        // for 'form' type step
        draft[id].formMeta = formMeta;

        if (update === 'inProgress') {
          draft[id].isTriggered = true;
        } else if (update === 'verify') {
          draft[id].verifying = true;
          draft[id].isTriggered = true;
        } else if (update === 'failed') {
          draft[id].verifying = false;
          draft[id].isTriggered = false;
        }

        break;
    }
  });
};

// #region PUBLIC SELECTORS
export function integrationAppsInstaller(state, id) {
  if (!state || !state[id]) {
    return emptyObj;
  }

  return state[id];
}

export function canOpenOauthConnection(state) {
  if (!state) {
    return { openOauthConnection: false };
  }

  return { openOauthConnection: state.openOauthConnection || false, connectionId: state.connectionId};
}

// #endregion
