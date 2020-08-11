import { combineReducers } from 'redux';
import networkComms, { selectors as fromNetworkComms } from './networkComms';
import ping, { selectors as fromPing } from './ping';
import suiteScript, { selectors as fromSuiteScript } from './suiteScript';
import { genSelectors } from '../util';

export default combineReducers({
  networkComms,
  ping,
  suiteScript,
});

// auto generated selectors
export const selectors = {};
const subSelectors = {
  ping: fromPing,
  networkComms: fromNetworkComms,
  suiteScript: fromSuiteScript,
};

genSelectors(selectors, subSelectors);
