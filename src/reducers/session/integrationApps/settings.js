import produce from 'immer';
import actionTypes from '../../../actions/types';

export default (state = {}, action) => {
  const { type, integrationId, flowId, licenseId } = action;
  const key = `${integrationId}-${flowId}`;

  return produce(state, draft => {
    // eslint-disable-next-line default-case
    switch (type) {
      case actionTypes.INTEGRATION_APPS.SETTINGS.UPDATE:
        draft[key] = { submitComplete: false };
        break;
      case actionTypes.INTEGRATION_APPS.SETTINGS.FORM.SUBMIT_COMPLETE:
        draft[key] = { submitComplete: true };
        break;
      case actionTypes.INTEGRATION_APPS.SETTINGS.FORM.SUBMIT_FAILED:
        draft[key] = { submitFailed: true };
        break;
      case actionTypes.INTEGRATION_APPS.SETTINGS.FORM.CLEAR:
        delete draft[key];
        break;
      case actionTypes.INTEGRATION_APPS.SETTINGS.UPGRADE_REQUESTED:
        draft[licenseId] = true;
        break;
    }
  });
};

// #region PUBLIC SELECTORS
export function integrationAppSettingsFormState(state, integrationId, flowId) {
  if (!state) {
    return {};
  }

  const key = `${integrationId}-${flowId}`;

  return state[key] || {};
}

export function checkUpgradeRequested(state, licenseId) {
  if (!state) {
    return false;
  }

  return !!state[licenseId];
}
// #endregion
