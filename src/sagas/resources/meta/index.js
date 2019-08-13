import { call, put, takeEvery, takeLatest, select } from 'redux-saga/effects';
import actions from '../../../actions';
import actionTypes from '../../../actions/types';
import { apiCallWithRetry } from '../../index';
import { resource, commMetadataPathGen } from '../../../reducers/index';

function* getNetsuiteOrSalesforceMeta({
  connectionId,
  metadataType,
  mode,
  filterKey,
}) {
  const connection = yield select(resource, 'connections', connectionId);
  const applicationType = connection.type;
  const commMetadataPath = commMetadataPathGen(
    applicationType,
    connectionId,
    metadataType,
    mode
  );
  const path = `/${commMetadataPath}`;

  try {
    const metadata = yield call(apiCallWithRetry, {
      path,
      opts: {},
      message: `Fetching ${metadataType}`,
    });

    // Handle Errors sent as part of response object  with status 200
    if (metadata && metadata.errors) {
      yield put(
        actions.metadata.netsuite.receivedError(
          metadata.errors[0] && metadata.errors[0].message,
          metadataType,
          connectionId,
          mode,
          filterKey
        )
      );
    } else if (applicationType === 'netsuite') {
      yield put(
        actions.metadata.netsuite.receivedCollection(
          metadata,
          metadataType,
          connectionId,
          mode,
          filterKey
        )
      );
    }

    return metadata;
  } catch (error) {
    // Handling error statuses in  between 400 and 500 to show customized error
    if (error.status >= 400 && error.status < 500) {
      const parsedError = JSON.parse(error.message);

      yield put(
        actions.metadata.netsuite.receivedError(
          parsedError && parsedError[0] && parsedError[0].message,
          metadataType,
          connectionId,
          mode,
          filterKey
        )
      );
    }
  }
}

export default [
  takeEvery(actionTypes.METADATA.REQUEST, getNetsuiteOrSalesforceMeta),
  takeLatest(actionTypes.METADATA.REFRESH, getNetsuiteOrSalesforceMeta),
];
