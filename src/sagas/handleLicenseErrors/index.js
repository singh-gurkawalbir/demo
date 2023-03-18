import { call, put } from 'redux-saga/effects';
import { throwExceptionUsingTheResponse } from '../api/requestInterceptors/utils';
import actions from '../../actions';
import { isJsonString } from '../../utils/string';

export function* handleLicenseErrors(error, path, method) {
  const {data} = error;
  let code = [];
  let message = [];

  if (isJsonString(data)) {
    code = JSON.parse(data)?.errors?.map(error => error.code) || [];
    message = JSON.parse(data)?.errors?.map(error => error.message) || [];
  }
  const entitlementReachedCodeIndex = code?.findIndex(e => e === 'entitlement_reached');

  if (code?.includes('subscription_required') || code?.includes('entitlement_reached')) {
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
}
