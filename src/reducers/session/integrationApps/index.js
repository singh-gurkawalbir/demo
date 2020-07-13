import { combineReducers } from 'redux';
import installer, * as fromInstaller from './installer';
import uninstaller, * as fromUninstaller from './uninstaller';
import uninstaller2, * as fromUninstaller2 from './uninstaller2.0';
import addStore, * as fromAddStore from './addStore';
import settings, * as fromSettings from './settings';
import addon, * as fromAddon from './addon';
import clone, * as fromClone from './clone';

export default combineReducers({
  installer,
  uninstaller,
  uninstaller2,
  settings,
  addStore,
  addon,
  clone,
});

export function integrationAppsInstaller(state, id) {
  return fromInstaller.integrationAppsInstaller(state && state.installer, id);
}

export function categoryMapping(state, integrationId, flowId) {
  return fromSettings.categoryMapping(
    state && state.settings,
    integrationId,
    flowId
  );
}

export function categoryMappingsCollapsedStatus(state, integrationId, flowId) {
  return fromSettings.categoryMappingsCollapsedStatus(
    state && state.settings,
    integrationId,
    flowId
  );
}

export function categoryMappingsChanged(state, integrationId, flowId) {
  return fromSettings.categoryMappingsChanged(
    state && state.settings,
    integrationId,
    flowId
  );
}

export function categoryMappingSaveStatus(state, integrationId, flowId) {
  return fromSettings.categoryMappingSaveStatus(
    state && state.settings,
    integrationId,
    flowId
  );
}

export function categoryMappingsForSection(state, integrationId, flowId, id) {
  return fromSettings.categoryMappingsForSection(
    state && state.settings,
    integrationId,
    flowId,
    id
  );
}

export function categoryMappingFilters(state, integrationId, flowId) {
  return fromSettings.categoryMappingFilters(
    state && state.settings,
    integrationId,
    flowId
  );
}

export function variationMappingData(state, integrationId, flowId) {
  return fromSettings.variationMappingData(
    state && state.settings,
    integrationId,
    flowId
  );
}

export function categoryMappingData(state, integrationId, flowId) {
  return fromSettings.categoryMappingData(
    state && state.settings,
    integrationId,
    flowId
  );
}

export function categoryMappingGeneratesMetadata(state, integrationId, flowId) {
  return fromSettings.categoryMappingGeneratesMetadata(
    state && state.settings,
    integrationId,
    flowId
  );
}

export function integrationAppSettingsFormState(
  state,
  integrationId,
  flowId,
  sectionId
) {
  return fromSettings.integrationAppSettingsFormState(
    state && state.settings,
    integrationId,
    flowId,
    sectionId
  );
}

export function integrationAppAddOnState(state, integrationId) {
  return fromSettings.integrationAppAddOnState(
    state && state.settings,
    integrationId
  );
}

export function integrationAppMappingMetadata(state, integrationId) {
  return fromSettings.integrationAppMappingMetadata(
    state && state.settings,
    integrationId
  );
}

export function shouldRedirect(state, integrationId) {
  return fromSettings.shouldRedirect(state && state.settings, integrationId);
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

export function uninstallData(state, id, storeId) {
  return fromUninstaller.uninstallData(state && state.uninstaller, id, storeId);
}

export function uninstall2Data(state, id) {
  return fromUninstaller2.uninstall2Data(state && state.uninstaller2, id);
}

export function addNewStoreSteps(state, id) {
  return fromAddStore.addNewStoreSteps(state && state.addStore, id);
}

export function isAddOnInstallInProgress(state, id) {
  return fromAddon.isAddOnInstallInProgress(state && state.addon, id);
}

export function integrationClonedDetails(state, id) {
  return fromClone.integrationClonedDetails(state && state.clone, id);
}

export function canOpenOauthConnection(state) {
  return fromInstaller.canOpenOauthConnection(state && state.installer);
}
