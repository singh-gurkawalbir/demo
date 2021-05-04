import { call, put, takeLatest, delay } from 'redux-saga/effects';
import { apiCallWithRetry } from '../index';
import actionTypes from '../../actions/types';
import actions from '../../actions';

export function* validateOrgId({ orgId }) {
  yield delay(500);
  try {
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
    yield put(actions.sso.validationError(errors[0]?.message));
  } catch (e) {
    // handle errors
  }
}

export default [
  takeLatest(actionTypes.SSO.ORG_ID.VALIDATION_REQUEST, validateOrgId),
];
