import { combineReducers } from 'redux';
import installer, * as fromInstaller from './installer';

export default combineReducers({
  installer,
});

export function integrationAppsInstaller(state, id) {
  return fromInstaller.integrationAppsInstaller(state.installer, id);
}
