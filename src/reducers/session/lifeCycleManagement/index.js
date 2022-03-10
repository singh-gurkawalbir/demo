import { combineReducers } from 'redux';
import cloneFamily, { selectors as fromCloneFamily } from './cloneFamily';
import revision, { selectors as fromRevision } from './revision';
import compare, { selectors as fromCompare } from './compare';
import { genSelectors } from '../../util';

export default combineReducers({
  cloneFamily,
  revision,
  compare,
});

export const selectors = {};
const subSelectors = {
  cloneFamily: fromCloneFamily,
  revision: fromRevision,
  compare: fromCompare,
};

genSelectors(selectors, subSelectors);
