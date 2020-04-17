import { combineReducers } from 'redux';
import openErrors from './openErrors';
import errorDetails from './errorDetails';

export default combineReducers({
  openErrors,
  errorDetails,
});
