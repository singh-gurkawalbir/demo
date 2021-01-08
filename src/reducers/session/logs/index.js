import { combineReducers } from 'redux';
import connections, { selectors as fromConnections } from './connections';
import scripts, { selectors as fromScripts } from './scripts';
import { genSelectors } from '../../util';

export default combineReducers({
  connections,
  scripts,
});

export const selectors = {};
const subSelectors = {
  connections: fromConnections,
  scripts: fromScripts,
};

genSelectors(selectors, subSelectors);
