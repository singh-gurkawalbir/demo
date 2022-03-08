import { combineReducers } from 'redux';
import cloneFamily, { selectors as fromCloneFamily } from './cloneFamily';
import { genSelectors } from '../../util';

export default combineReducers({
  cloneFamily,
});

export const selectors = {};
const subSelectors = {
  cloneFamily: fromCloneFamily,
};

genSelectors(selectors, subSelectors);
