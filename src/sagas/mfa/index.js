import { call, put, takeLatest, delay, select } from 'redux-saga/effects';
import actions from '../../actions';
import { MFA_RESET_ASYNC_KEY } from '../../utils/constants';
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
  // yield delay(500);
  // const response = {
  //   allowTrustedDevices: true,
  //   trustDeviceForPeriod: 200,
  // };

  try {
    const response = yield call(apiCallWithRetry, {
      path: '/trustedDevices/settings',
      opts: {
        method: 'GET',
      },
    });

    yield put(actions.mfa.receivedAccountSettings(response));
  } catch (error) {
    return undefined;
  }
}
export function* setupMFA({ mfaConfig }) {
  // const response = {
  //   enabled: true,
  //   secret: undefined,
  //   trustedDevices: [{browser: 'browser', os: 'os', _id: '_id'}],
  //   _allowResetByUserId: true,
  // };

  // const path = '/mfa/setup';

  try {
    const response = yield call(apiCallWithRetry, {
      path: '/mfa/setup',
      opts: {
        body: {...mfaConfig, enabled: true},
        method: 'POST',
      },
    });

    yield put(actions.mfa.receivedUserSettings(response));
  } catch (error) {
    return undefined;
  }
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
export function* resetMFA({ password }) {
  // yield delay(500);
  // const response = undefined;
  const path = '/mfa/reset';

  yield put(actions.asyncTask.start(MFA_RESET_ASYNC_KEY));
  try {
    yield call(apiCallWithRetry, {
      path,
      opts: {
        body: { password },
        method: 'POST',
      },
    });

    yield put(actions.mfa.requestUserSettings());
    yield put(actions.asyncTask.success(MFA_RESET_ASYNC_KEY));
  } catch (error) {
    yield put(actions.asyncTask.failed(MFA_RESET_ASYNC_KEY));

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
export function* deleteTrustedDevice({ deviceId }) {
  try {
    yield call(apiCallWithRetry, {
      path: `/trustedDevices/${deviceId}`,
      opts: {
        method: 'DELETE',
      },
    });

    yield put(actions.mfa.requestUserSettings());
  } catch (error) {
    return undefined;
  }
}
export function* verifyMobileCode({ code }) {
  const path = '/mfa/test';

  try {
    const response = yield call(apiCallWithRetry, {
      path,
      opts: {
        body: { code },
        method: 'POST',
      },
    });

    if (response.status === 'pass') {
      return yield put(actions.mfa.mobileCodeVerified('pass'));
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
