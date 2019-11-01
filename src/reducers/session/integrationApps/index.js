import { combineReducers } from 'redux';
import installer, * as fromInstaller from './installer';
import uninstaller, * as fromUninstaller from './uninstaller';
import addStore, * as fromAddStore from './addStore';
import settings, * as fromSettings from './settings';

export default combineReducers({
  installer,
  uninstaller,
  settings,
  addStore,
});

export function integrationAppsInstaller(state, id) {
  return fromInstaller.integrationAppsInstaller(state && state.installer, id);
}

export function integrationAppSettingsFormState(state, integrationId, flowId) {
  return fromSettings.integrationAppSettingsFormState(
    state && state.settings,
    integrationId,
    flowId
  );
}

export function checkUpgradeRequested(state, licenseId) {
  return fromSettings.checkUpgradeRequested(state && state.settings, licenseId);
}

export function uninstallSteps(state, id, storeId) {
  return fromUninstaller.uninstallSteps(
    state && state.uninstaller,
    id,
    storeId
  );
}

export function addNewStoreSteps(state, id) {
  return fromAddStore.addNewStoreSteps(state && state.addStore, id);
}
