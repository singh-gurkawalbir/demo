import { combineReducers } from 'redux';
import connections, { selectors as fromConnections } from './connections';
import scripts, { selectors as fromScripts } from './scripts';
import listener, { selectors as fromListener } from './listener';
import { genSelectors } from '../../util';

export default combineReducers({
  connections,
  scripts,
  listener,
});

export const selectors = {};
const subSelectors = {
  connections: fromConnections,
  scripts: fromScripts,
  listener: fromListener,
};

genSelectors(selectors, subSelectors);
