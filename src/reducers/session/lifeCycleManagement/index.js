import { combineReducers } from 'redux';
import cloneFamily, { selectors as fromCloneFamily } from './cloneFamily';
import revision, { selectors as fromRevision } from './revision';
import { genSelectors } from '../../util';

export default combineReducers({
  cloneFamily,
  revision,
});

export const selectors = {};
const subSelectors = {
  cloneFamily: fromCloneFamily,
  revision: fromRevision,
};

genSelectors(selectors, subSelectors);
