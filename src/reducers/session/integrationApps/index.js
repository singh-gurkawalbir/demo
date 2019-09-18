import { combineReducers } from 'redux';
import installer, * as fromInstaller from './installer';
import uninstaller, * as fromUninstaller from './uninstaller';

export default combineReducers({
  installer,
  uninstaller,
});

export function integrationAppsInstaller(state, id) {
  return fromInstaller.integrationAppsInstaller(state && state.installer, id);
}

export function uninstallSteps(state, id, storeId) {
  return fromUninstaller.uninstallSteps(
    state && state.uninstaller,
    id,
    storeId
  );
}

export function addNewStoreSteps(state, id) {
  return fromInstaller.addNewStoreSteps(state && state.installer, id);
}
