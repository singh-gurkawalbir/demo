import { call, put, takeLatest, delay, select } from 'redux-saga/effects';
import actions from '../../actions';
import { selectors } from '../../reducers';
import actionTypes from '../../actions/types';
import { apiCallWithRetry } from '../index';

export function* requestUserSettings() {
  yield delay(500);
  // const response = {
  //   enabled: true,
  //   secret: undefined,
  //   trustedDevices: [{browser: 'browser', os: 'os', _id: '_id'}],
  //   _allowResetByUserId: true,
  //   allowTrustedDevices: true,
  // };

  const path = '/mfa/setup';

  try {
    const response = yield call(apiCallWithRetry, {
      path,
      opts: {
        method: 'GET',
      },
    });

    yield put(actions.mfa.receivedUserSettings(response));
  } catch (error) {
    return undefined;
  }
}
export function* requestAccountSettings() {
  yield delay(500);
  const response = {
    allowTrustedDevices: true,
    trustDeviceForPeriod: 200,
  };

  // const path = '/trustedDevices/settings';
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

  // const path = '/mfa/setup';

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
  // const path = '/trustedDevices/settings';

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
export function* requestSecretCode({ password, isQRCode }) {
  // yield delay(500);
  // const response = { secret: 'secret', keyURI: 'http://keyURI.com' };
  const isSecretCodeGenerated = yield select(selectors.isSecretCodeGenerated);

  const path = `/mfa/secret/${isSecretCodeGenerated ? 'view' : 'generate'}`;

  try {
    const response = yield call(apiCallWithRetry, {
      path,
      opts: {
        body: { password },
        method: 'POST',
      },
      // message: 'Requesting license upgrade.',
    });

    yield put(actions.mfa.receivedSecretCode(response));
    if (!isSecretCodeGenerated) {
      yield put(actions.mfa.requestUserSettings());
    }
  } catch (error) {
    yield put(actions.mfa.secretCodeError(error));

    return undefined;
  }
  if (isQRCode) {
    return yield put(actions.mfa.showQrCode());
  }
  yield put(actions.mfa.showSecretCode());
}
export function* resetMFA({ password, aShareId }) {
  // yield delay(500);
  // const response = undefined;
  const path = '/mfa/reset';

  try {
    const response = yield call(apiCallWithRetry, {
      path,
      opts: {
        body: { password },
        method: 'POST',
      },
    });

    yield put(actions.mfa.receivedUserSettings(response));
  } catch (error) {
    return undefined;
  }
}
export function* updateTrustedDevice({ deviceInfo }) {
  yield delay(500);
  const response = {allowTrustedDevices: true, trustDeviceForPeriod: 20};
  // const path = '/trustedDevices/settings';

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
  // const path = `/trustedDevices/${deviceName}`;

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
  // yield delay(500);
  // const response = { status: 'success'};
  const path = '/mfa/test';

  try {
    const response = yield call(apiCallWithRetry, {
      path,
      opts: {
        body: { code },
        method: 'POST',
      },
    });

    if (response.status === 'success') {
      return yield put(actions.mfa.mobileCodeVerified('success'));
    }

    yield put(actions.mfa.mobileCodeVerified('fail'));
  } catch (error) {
    yield put(actions.mfa.mobileCodeVerified('fail'));

    return undefined;
  }
}
export function* requestMFASessionInfo() {
  yield delay(500);
  const response = {
    mfaRequired: true,
    mfaSetupRequired: false,
    mfaVerified: true,
  };
  // const path = '/mfa/sessionInfo';

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
  takeLatest(actionTypes.MFA.SECRET_CODE.REQUEST, requestSecretCode),
  takeLatest(actionTypes.MFA.RESET, resetMFA),
  takeLatest(actionTypes.MFA.UPDATE_DEVICE, updateTrustedDevice),
  takeLatest(actionTypes.MFA.DELETE_DEVICE, deleteTrustedDevice),
  takeLatest(actionTypes.MFA.MOBILE_CODE.VERIFY, verifyMobileCode),
  takeLatest(actionTypes.MFA.SESSION_INFO.REQUEST, requestMFASessionInfo),
];
