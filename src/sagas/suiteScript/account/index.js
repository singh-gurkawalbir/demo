import { call, put, takeEvery, select } from 'redux-saga/effects';
import actions from '../../../actions';
import actionTypes from '../../../actions/types';
import { apiCallWithRetry } from '../../index';
import * as selectors from '../../../reducers';

export function* checkHasIntegrations({ connectionId }) {
  const requestOptions = {
    path: `/suitescript/connections/${connectionId}`,
    opts: {
      method: 'GET',
    },
    hidden: true,
  };
  let response;

  try {
    response = yield call(apiCallWithRetry, requestOptions);
  } catch (error) {
    return true;
  }

  const connection = yield select(
    selectors.resource,
    'connections',
    connectionId
  );

  yield put(
    actions.suiteScript.account.receivedHasIntegrations(
      connection.netsuite.account,
      response.hasIntegrations
    )
  );
}

export const accountSagas = [
  takeEvery(
    actionTypes.SUITESCRIPT.ACCOUNT.CHECK_HAS_INTEGRATIONS,
    checkHasIntegrations
  ),
];
