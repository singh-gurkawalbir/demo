import { combineReducers } from 'redux';
import ping, { selectors as fromPing } from './ping';
import { genSelectors } from '../../util';

export default combineReducers({
  ping,
});

// auto generated selectors
export const selectors = {};
const subSelectors = {
  ping: fromPing,
};

genSelectors(selectors, subSelectors);
