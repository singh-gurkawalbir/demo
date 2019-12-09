import { call, put, takeLatest, takeEvery } from 'redux-saga/effects';
import actions from '../../actions';
import actionTypes from '../../actions/types';
import { apiCallWithRetry } from '../index';

export function* fetchMetadata({
  fieldType,
  fieldName,
  _integrationId,
  options = {},
}) {
  const path = `/integrations/${_integrationId}/settings/refreshMetadata`;
  let metadata;

  try {
    metadata = yield call(apiCallWithRetry, {
      path,
      opts: {
        body: {
          ...(fieldType ? { [options.key || 'type']: fieldType } : {}),
          fieldName,
        },
        method: 'PUT',
      },
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

export function* updateInstallBase({ _integrationIds, connectorId }) {
  const path = `/connectors/${connectorId}/update`;

  try {
    yield call(apiCallWithRetry, {
      path,
      opts: {
        method: 'POST',
        body: { _integrationIds },
      },
      message: 'Updating install base',
    });
  } catch (error) {
    return true;
  }
}

export default [
  takeLatest(actionTypes.CONNECTORS.METADATA_REQUEST, fetchMetadata),
  takeEvery(actionTypes.CONNECTORS.INSTALLBASE.UPDATE, updateInstallBase),
];
