import { combineReducers } from 'redux';
import connections, { selectors as fromConnections } from './connections';
import scripts, { selectors as fromScripts } from './scripts';
import flowStep, { selectors as fromFlowStep } from './flowStep';
import { genSelectors } from '../../util';

export default combineReducers({
  connections,
  scripts,
  flowStep,
});

export const selectors = {};
const subSelectors = {
  connections: fromConnections,
  scripts: fromScripts,
  flowStep: fromFlowStep,
};

genSelectors(selectors, subSelectors);
