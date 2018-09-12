import { combineReducers } from 'redux';
import data from './data';
import session from './session';

const rootReducer = combineReducers({
  session,
  data,
});

export default rootReducer;
