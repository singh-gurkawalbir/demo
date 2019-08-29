import { call, put, takeLatest } from 'redux-saga/effects';
import actions from '../../actions';
import actionTypes from '../../actions/types';
import { apiCallWithRetry } from '../index';

export function* fetchMetadata({ fieldType, fieldName, _integrationId }) {
  const path = `/integrations/${_integrationId}/settings/refreshMetadata`;
  let metadata;

  try {
    metadata = yield call(apiCallWithRetry, {
      path,
      opts: { body: { type: fieldType, fieldName }, method: 'PUT' },
      message: `Fetching metadata`,
    });
  } catch (error) {
    yield put(actions.connectors.failedMetadata(fieldName, _integrationId));

    return undefined;
  }

  yield put(
    actions.connectors.receivedMetadata(
      metadata,
      fieldType,
      fieldName,
      _integrationId
    )
  );
}

export default [
  takeLatest(actionTypes.CONNECTORS.METADATA_REQUEST, fetchMetadata),
];
