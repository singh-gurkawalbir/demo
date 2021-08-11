import { call, put, takeLatest, delay, select } from 'redux-saga/effects';
import { apiCallWithRetry } from '../index';
import actionTypes from '../../actions/types';
import actions from '../../actions';
import { selectors } from '../../reducers';

export function* validateOrgId({ orgId = '' }) {
  yield delay(500);
  try {
    const oidcClient = yield select(selectors.oidcSSOClient);

    if (oidcClient && oidcClient.orgId === orgId) {
      return yield put(actions.sso.validationSuccess());
    }
    const orgIdRegex = /^[a-zA-Z][a-zA-Z0-9]{2,19}$/;

    if (!orgIdRegex.test(orgId)) {
      return yield put(actions.sso.validationError('The Organization Id should be alphanumeric and starting with an alphabet and its length should be between 3 and 20'));
    }
    const response = yield call(apiCallWithRetry, {
      path: '/ssoOrgId/validate',
      opts: {
        method: 'PUT',
        body: { orgId },
      },
    });
    const { valid, errors } = response || {};

    if (valid) {
      return yield put(actions.sso.validationSuccess());
    }
    yield put(actions.sso.validationError(errors?.[0]?.message));
  } catch (e) {
    // handle errors
    yield put(actions.sso.validationError('validation error'));
  }
}

export default [
  takeLatest(actionTypes.SSO.ORG_ID.VALIDATION_REQUEST, validateOrgId),
];
