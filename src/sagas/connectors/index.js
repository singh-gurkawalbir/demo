import { call, put, takeEvery } from 'redux-saga/effects';
import actions from '../../actions';
import actionTypes from '../../actions/types';
import { apiCallWithRetry } from '../index';

function* fetchMetadata({ fieldName, id, _integrationId }) {
  const path = `/integrations/${_integrationId}/settings/refreshMetadata`;

  try {
    const metadata = yield call(apiCallWithRetry, {
      path,
      opts: { body: { fieldName: id, type: fieldName }, method: 'PUT' },
      message: `Fetching metadata`,
    });

    yield put(
      actions.connectors.receivedMetadata(
        metadata,
        fieldName,
        id,
        _integrationId
      )
    );

    return metadata;
  } catch (error) {
    yield put(actions.connectors.failedMetadata());

    return undefined;
  }
}

export default [
  takeEvery(actionTypes.CONNECTORS.METADATA_REQUEST, fetchMetadata),
];
