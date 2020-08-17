import { combineReducers } from 'redux';
import installer, { selectors as fromInstaller } from './installer';
import uninstaller, { selectors as fromUninstaller } from './uninstaller';
import uninstaller2, { selectors as fromUninstaller2 } from './uninstaller2.0';
import addStore, { selectors as fromAddStore } from './addStore';
import settings, { selectors as fromSettings } from './settings';
import addon, { selectors as fromAddon } from './addon';
import clone, { selectors as fromClone } from './clone';
import { genSelectors } from '../../util';

export default combineReducers({
  installer,
  uninstaller,
  uninstaller2,
  settings,
  addStore,
  addon,
  clone,
});

export const selectors = {};
const subSelectors = {
  installer: fromInstaller,
  uninstaller: fromUninstaller,
  uninstaller2: fromUninstaller2,
  addStore: fromAddStore,
  settings: fromSettings,
  addon: fromAddon,
  clonse: fromClone,
};

genSelectors(selectors, subSelectors);
