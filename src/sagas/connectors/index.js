import { call, put, all, takeEvery } from 'redux-saga/effects';
import actions from '../../actions';
import actionTypes from '../../actions/types';
import { apiCallWithRetry } from '../index';
import { commitStagedChanges } from '../resources';
import { SCOPES } from '../suiteScript/resourceForm';

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
      message: 'Loading',
    });
  } catch (error) {
    yield put(actions.connectors.failedMetadata(fieldName, _integrationId));

    return undefined;
  }

  if (options?.autoPostBack) {
    if (Array.isArray(metadata)) {
      yield all(
        metadata.map(fieldMeta =>
          put(
            actions.connectors.receivedMetadata(
              fieldMeta,
              null,
              fieldMeta.name,
              _integrationId
            )
          )
        )
      );
    } else {
      yield put(
        actions.connectors.receivedMetadata(
          metadata,
          null,
          metadata.name,
          _integrationId
        )
      );
    }
    yield put(
      actions.connectors.clearStatus(
        fieldName,
        _integrationId
      )
    );
  } else {
    yield put(
      actions.connectors.receivedMetadata(
        metadata,
        fieldType,
        fieldName,
        _integrationId
      )
    );
  }
}

export function* updateInstallBase({ _integrationIds, connectorId }) {
  const path = `/connectors/${connectorId}/update`;

  try {
    yield call(apiCallWithRetry, {
      path,
      opts: {
        method: 'PUT',
        body: { _integrationIds },
      },
      message: 'Updating install base',
    });
  } catch (error) {
    return true;
  }
}

export function* publishStatus({ _integrationId: connectorId, isPublished }) {
  const patchSet = [
    {
      op: 'replace',
      path: '/published',
      value: !isPublished,
    },
  ];

  yield put(actions.resource.patchStaged(connectorId, patchSet, SCOPES.VALUE));

  const resp = yield call(commitStagedChanges, {
    resourceType: 'connectors',
    id: connectorId,
    scope: SCOPES.VALUE,
  });

  if (resp?.error) {
    yield put(actions.connectors.publish.error(connectorId));
  } else {
    yield put(actions.connectors.publish.success(connectorId));
  }
}

export default [
  takeEvery(actionTypes.CONNECTORS.METADATA_REQUEST, fetchMetadata),
  takeEvery(actionTypes.CONNECTORS.INSTALLBASE.UPDATE, updateInstallBase),
  takeEvery(actionTypes.CONNECTORS.PUBLISH.REQUEST, publishStatus),
];
