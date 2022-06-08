import { call, put, takeLatest, select, race, take, delay } from 'redux-saga/effects';
import actions from '../../actions';
import actionTypes from '../../actions/types';
import { apiCallWithRetry } from '../index';

export function* requestUserSettings() {
  yield delay(500);
  const response = {
    enabled: true,
    secret: undefined,
    trustedDevices: [{browser: 'browser', os: 'os', _id: '_id'}],
    _allowResetByUserId: true,
    allowTrustedDevices: true,
  };

  // const path = '/api/mfa/setup';
  // try {
  //   response = yield call(apiCallWithRetry, {
  //     path,
  //     opts: {
  //       method: 'GET',
  //     },
  //   });
  // } catch (error) {
  //   return undefined;
  // }

  yield put(actions.mfa.receivedUserSettings(response));
}
export function* requestAccountSettings() {
  yield delay(500);
  const response = {
    allowTrustedDevices: true,
    trustDeviceForPeriod: 200,
  };

  // const path = '/api/trustedDevices/settings';
  // try {
  //   response = yield call(apiCallWithRetry, {
  //     path,
  //     opts: {
  //       method: 'GET',
  //     },
  //   });
  // } catch (error) {
  //   return undefined;
  // }

  yield put(actions.mfa.receivedAccountSettings(response));
}
export function* setupMFA({ mfaConfig }) {
  yield delay(500);
  const response = {
    enabled: true,
    secret: undefined,
    trustedDevices: [{browser: 'browser', os: 'os', _id: '_id'}],
    _allowResetByUserId: true,
  };

  // const path = '/api/mfa/setup';

  // try {
  //   response = yield call(apiCallWithRetry, {
  //     path,
  //     opts: {
  //       body: {
  //         enabled: true,
  //         _allowResetByUserId: true,
  //         trustDevice: true, // if trust device is checked
  //       },
  //       method: 'POST',
  //     },
  //   });
  // } catch (error) {
  //   return undefined;
  // }

  yield put(actions.mfa.receivedUserSettings(response));
}
export function* updateAccountSettings({ accountSettings }) {
  yield delay(500);
  const response = accountSettings;
  // const path = '/api/trustedDevices/settings';

  // try {
  //   response = yield call(apiCallWithRetry, {
  //     path,
  //     opts: {
  //       body: { allowTrustedDevices, trustDeviceForPeriod },
  //       method: 'PUT',
  //     },
  //   });
  // } catch (error) {
  //   return undefined;
  // }
  yield put(actions.mfa.receivedAccountSettings(response));
}
export function* requestSecretCode({ isQRCode }) {
  yield delay(500);
  const response = { secret: 'secret', keyURI: 'http://keyURI.com' };
  // const path = '/api/mfa/secret/generate';

  // try {
  //   response = yield call(apiCallWithRetry, {
  //     path,
  //     opts: {
  //       body: { password },
  //       method: 'PUT',
  //     },
  //     // message: 'Requesting license upgrade.',
  //   });
  // } catch (error) {
  //   return undefined;
  // }
  if (isQRCode) {
    return yield put(actions.mfa.showQrCode(response.keyURI));
  }
  yield put(actions.mfa.showSecretCode(response.secret));
}
export function* resetMFA({ aShareId }) {
  yield delay(500);
  const response = undefined;
  // const path = '/api/mfa/reset';

  // try {
  //   response = yield call(apiCallWithRetry, {
  //     path,
  //     opts: {
  //       body: { password },
  //       method: 'POST',
  //     },
  //   });
  // } catch (error) {
  //   return undefined;
  // }
  yield put(actions.mfa.receivedUserSettings(response));
}
export function* updateTrustedDevice({ deviceInfo }) {
  yield delay(500);
  const response = {allowTrustedDevices: true, trustDeviceForPeriod: 20};
  // const path = '/api/trustedDevices/settings';

  // try {
  //   response = yield call(apiCallWithRetry, {
  //     path,
  //     opts: {
  //       body: {
  //   allowTrustedDevices: true/false,
  //   trustDeviceForPeriod: <Number>/undefined
  // },
  //       method: 'PUT',
  //     },
  //   });
  // } catch (error) {
  //   return undefined;
  // }

  yield put(actions.mfa.receivedAccountSettings(response));
}
export function* deleteTrustedDevice({ deviceName }) {
  yield delay(500);
  const response = undefined;
  // const path = `/api/trustedDevices/${deviceName}`;

  // try {
  //   response = yield call(apiCallWithRetry, {
  //     path,
  //     opts: {
  //       method: 'DELETE',
  //     },
  //     // message: 'Requesting license upgrade.',
  //   });
  // } catch (error) {
  //   return undefined;
  // }

  yield put(actions.mfa.receivedAccountSettings(response));
}
export function* verifyMobileCode({ code }) {
  yield delay(500);
  const response = { status: 'success'};
  // const path = '/api/mfa/test';

  // try {
  //   response = yield call(apiCallWithRetry, {
  //     path,
  //     opts: {
  //       body: { code },
  //       method: 'POST',
  //     },
  //     // message: 'Requesting license upgrade.',
  //   });
  // } catch (error) {
  //   return undefined;
  // }
  if (response.status === 'success') {
    return yield put(actions.mfa.mobileCodeVerified('success'));
  }

  return yield put(actions.mfa.mobileCodeVerified('fail', 'error'));
}
export function* requestMFASessionInfo() {
  yield delay(500);
  const response = {
    mfaRequired: true,
    mfaSetupRequired: false,
    mfaVerified: true,
  };
  // const path = '/api/mfa/sessionInfo';

  // try {
  //   response = yield call(apiCallWithRetry, {
  //     path,
  //     opts: {
  //       method: 'GET',
  //     },
  //   });
  // } catch (error) {
  //   return undefined;
  // }

  yield put(actions.mfa.receivedSessionInfo(response));
}

export default [
  takeLatest(actionTypes.MFA.USER_SETTINGS.REQUEST, requestUserSettings),
  takeLatest(actionTypes.MFA.ACCOUNT_SETTINGS.REQUEST, requestAccountSettings),
  takeLatest(actionTypes.MFA.USER_SETTINGS.SETUP, setupMFA),
  takeLatest(actionTypes.MFA.ACCOUNT_SETTINGS.UPDATE, updateAccountSettings),
  takeLatest(actionTypes.MFA.REQUEST_SECRET_CODE, requestSecretCode),
  takeLatest(actionTypes.MFA.RESET, resetMFA),
  takeLatest(actionTypes.MFA.UPDATE_DEVICE, updateTrustedDevice),
  takeLatest(actionTypes.MFA.DELETE_DEVICE, deleteTrustedDevice),
  takeLatest(actionTypes.MFA.MOBILE_CODE.VERIFY, verifyMobileCode),
  takeLatest(actionTypes.MFA.SESSION_INFO.REQUEST, requestMFASessionInfo),
];
