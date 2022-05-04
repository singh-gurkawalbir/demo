import { takeLatest, delay } from 'redux-saga/effects';
import actionTypes from '../../actions/types';

export function* requestUserSettings() {
  yield delay(500);
}
export function* requestAccountSettings() {
  yield delay(500);
}
export function* setupMFA({ mfaConfig }) {
  yield delay(500);
}
export function* updateAccountSettings({ accountSettings }) {
  yield delay(500);
}
export function* requestSecretCode({ isQRCode }) {
  yield delay(500);
}
export function* resetMFA({ aShareId }) {
  yield delay(500);
}
export function* updateTrustedDevice({ deviceInfo }) {
  yield delay(500);
}
export function* deleteTrustedDevice({ deviceName }) {
  yield delay(500);
}
export function* verifyMobileCode({ code }) {
  yield delay(500);
}
export function* requestMFASessionInfo() {
  yield delay(500);
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
