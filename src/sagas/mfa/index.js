import { call, put, takeLatest, select } from 'redux-saga/effects';
import actions from '../../actions';
import { MFA_RESET_ASYNC_KEY, MFA_SETUP_ASYNC_KEY, MFA_DELETE_DEVICE_ASYNC_KEY } from '../../constants';
import { selectors } from '../../reducers';
import actionTypes from '../../actions/types';
import { apiCallWithRetry } from '../index';

export function* requestUserSettings() {
  try {
    const response = yield call(apiCallWithRetry, {
      path: '/mfa/setup',
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
  yield put(actions.asyncTask.start(MFA_SETUP_ASYNC_KEY));
  try {
    const { context, ...payload} = mfaConfig;
    const response = yield call(apiCallWithRetry, {
      path: '/mfa/setup',
      opts: {
        body: payload,
        method: 'POST',
      },
    });

    yield put(actions.mfa.receivedUserSettings(response));
    yield put(actions.mfa.addSetupContext(context));
    const isMFASetupIncomplete = yield select(selectors.isMFASetupIncomplete);

    if (isMFASetupIncomplete) {
      // If mfa setup is incomplete, fetch latest session info once mfa setup is successful to update UI layout for the user
      yield put(actions.mfa.requestSessionInfo());
    }
    yield put(actions.asyncTask.success(MFA_SETUP_ASYNC_KEY));
  } catch (error) {
    yield put(actions.asyncTask.failed(MFA_SETUP_ASYNC_KEY));

    return undefined;
  }
}
export function* updateAccountSettings({ accountSettings }) {
  const { dontAllowTrustedDevices, trustDeviceForPeriod } = accountSettings;

  try {
    const response = yield call(apiCallWithRetry, {
      path: '/trustedDevices/settings',
      opts: {
        body: { dontAllowTrustedDevices, ...(!dontAllowTrustedDevices ? {trustDeviceForPeriod} : {}) },
        method: 'PUT',
      },
    });

    yield put(actions.mfa.receivedAccountSettings(response));
  } catch (error) {
    return undefined;
  }
}
export function* requestSecretCode({ password, isQRCode }) {
  const isSecretCodeGenerated = yield select(selectors.isSecretCodeGenerated);

  const path = `/mfa/secret/${isSecretCodeGenerated ? 'view' : 'generate'}`;

  try {
    const response = yield call(apiCallWithRetry, {
      path,
      opts: {
        body: { password },
        method: 'POST',
      },
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
  const path = aShareId ? `/ashares/${aShareId}/mfa/reset` : '/mfa/reset';

  yield put(actions.asyncTask.start(MFA_RESET_ASYNC_KEY));
  try {
    yield call(apiCallWithRetry, {
      path,
      opts: {
        body: !aShareId ? { password } : {},
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
export function* deleteTrustedDevice({ deviceId }) {
  try {
    yield put(actions.asyncTask.start(MFA_DELETE_DEVICE_ASYNC_KEY));
    yield call(apiCallWithRetry, {
      path: `/trustedDevices/${deviceId}`,
      opts: {
        method: 'DELETE',
      },
    });
    yield put(actions.asyncTask.success(MFA_DELETE_DEVICE_ASYNC_KEY));
    yield put(actions.mfa.requestUserSettings());
  } catch (error) {
    yield put(actions.asyncTask.failed(MFA_DELETE_DEVICE_ASYNC_KEY));

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
      return yield put(actions.mfa.mobileCodeVerified('success'));
    }

    yield put(actions.mfa.mobileCodeVerified('error'));
  } catch (error) {
    yield put(actions.mfa.mobileCodeVerified('error'));

    return undefined;
  }
}
export function* requestMFASessionInfo() {
  try {
    const response = yield call(apiCallWithRetry, {
      path: '/mfa/sessionInfo',
      opts: {
        method: 'GET',
      },
    });

    yield put(actions.mfa.receivedSessionInfo(response));
  } catch (error) {
    return undefined;
  }
}

export default [
  takeLatest(actionTypes.MFA.USER_SETTINGS.REQUEST, requestUserSettings),
  takeLatest(actionTypes.MFA.ACCOUNT_SETTINGS.REQUEST, requestAccountSettings),
  takeLatest(actionTypes.MFA.USER_SETTINGS.SETUP, setupMFA),
  takeLatest(actionTypes.MFA.ACCOUNT_SETTINGS.UPDATE, updateAccountSettings),
  takeLatest(actionTypes.MFA.SECRET_CODE.REQUEST, requestSecretCode),
  takeLatest(actionTypes.MFA.RESET, resetMFA),
  takeLatest(actionTypes.MFA.DELETE_DEVICE, deleteTrustedDevice),
  takeLatest(actionTypes.MFA.MOBILE_CODE.VERIFY, verifyMobileCode),
  takeLatest(actionTypes.MFA.SESSION_INFO.REQUEST, requestMFASessionInfo),
];
