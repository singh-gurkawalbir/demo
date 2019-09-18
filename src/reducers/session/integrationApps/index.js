import { combineReducers } from 'redux';
import installer, * as fromInstaller from './installer';
import uninstaller, * as fromUninstaller from './uninstaller';
import addStore, * as fromAddStore from './addStore';

export default combineReducers({
  installer,
  uninstaller,
  addStore,
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
  return fromAddStore.addNewStoreSteps(state && state.addStore, id);
}
