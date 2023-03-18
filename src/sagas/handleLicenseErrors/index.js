import { call, put } from 'redux-saga/effects';
import { throwExceptionUsingTheResponse } from '../api/requestInterceptors/utils';
import actions from '../../actions';

export function* handleLicenseErrors(error, path, method, code, message) {
  const entitlementReachedCodeIndex = code?.findIndex(e => e === 'entitlement_reached');

  if (code?.includes('subscription_required')) {
    yield put(actions.license.receivedLicenseErrorMessage('subscription_required'));
  } else {
    yield put(actions.license.receivedLicenseErrorMessage('entitlement_reached', message[entitlementReachedCodeIndex]));
  }
  yield put(
    actions.api.failure(path, method, error.data, true)
  );
  yield call(throwExceptionUsingTheResponse, error);

  return {error};
}
