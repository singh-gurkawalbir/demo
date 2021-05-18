import { combineReducers } from 'redux';
import installer, { selectors as fromInstaller } from './installer';
import uninstaller, { selectors as fromUninstaller } from './uninstaller';
import uninstaller2, { selectors as fromUninstaller2 } from './uninstaller2.0';
import addChild, { selectors as fromAddChild } from './addChild';
import settings, { selectors as fromSettings } from './settings';
import addon, { selectors as fromAddon } from './addon';
import clone, { selectors as fromClone } from './clone';
import { genSelectors } from '../../util';

export default combineReducers({
  installer,
  uninstaller,
  uninstaller2,
  settings,
  addChild,
  addon,
  clone,
});

export const selectors = {};
const subSelectors = {
  installer: fromInstaller,
  uninstaller: fromUninstaller,
  uninstaller2: fromUninstaller2,
  addChild: fromAddChild,
  settings: fromSettings,
  addon: fromAddon,
  clone: fromClone,
};

genSelectors(selectors, subSelectors);
