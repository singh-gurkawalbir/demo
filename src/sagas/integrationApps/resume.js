import { call, put, takeLatest } from 'redux-saga/effects';
import actions from '../../actions';
import actionTypes from '../../actions/types';
import { apiCallWithRetry } from '../index';

export function* resumeIntegration({ integrationId }) {
  const path = `/integrations/${integrationId}/resume`;

  try {
    yield call(apiCallWithRetry, {
      path,
      opts: {
        body: {},
        method: 'PUT',
      },
      message: 'Reactivating...',
    }) || {};
  } catch (error) {
    return undefined;
  }

  yield put(actions.resource.request('integrations', integrationId));
  yield put(actions.resource.requestCollection('flows'));
  yield put(actions.resource.requestCollection('exports'));
  yield put(actions.resource.requestCollection('imports'));
  yield put(actions.resource.requestCollection('licenses'));
}

export default [
  takeLatest(
    actionTypes.INTEGRATION_APPS.LICENSE.RESUME,
    resumeIntegration
  ),
];
