import { call, put, takeEvery } from 'redux-saga/effects';
import actions from '../../actions';
import actionTypes from '../../actions/types';
import { apiCallWithRetry } from '../index';

export function* preUninstall({ storeId, id }) {
  const path = `/integrations/${id}/uninstaller/preUninstallFunction`;
  let uninstallSteps;

  try {
    uninstallSteps = yield call(apiCallWithRetry, {
      path,
      opts: { body: { storeId }, method: 'PUT' },
      message: `Fetching Uninstall steps`,
    });
  } catch (error) {
    return undefined;
  }

  yield put(
    actions.integrationApps.uninstaller.receivedUninstallSteps(
      uninstallSteps,
      storeId,
      id
    )
  );
}

export default [
  takeEvery(
    actionTypes.INTEGRATION_APPS.UNINSTALLER.PRE_UNINSTALL,
    preUninstall
  ),
];
