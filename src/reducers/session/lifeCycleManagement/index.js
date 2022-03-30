import { combineReducers } from 'redux';
import cloneFamily, { selectors as fromCloneFamily } from './cloneFamily';
import revision, { selectors as fromRevision } from './revision';
import compare, { selectors as fromCompare } from './compare';
import installStep, { selectors as fromInstallStep } from './installStep';
import { genSelectors } from '../../util';

export default combineReducers({
  cloneFamily,
  revision,
  compare,
  installStep,
});

export const selectors = {};
const subSelectors = {
  cloneFamily: fromCloneFamily,
  revision: fromRevision,
  compare: fromCompare,
  installStep: fromInstallStep,
};

genSelectors(selectors, subSelectors);
