import { call, put, takeEvery, select } from 'redux-saga/effects';
import actions from '../../../actions';
import actionTypes from '../../../actions/types';
import { apiCallWithRetry } from '../../index';
import { resource, commMetadataPathGen } from '../../../reducers/index';

function* getNetsuiteOrSalesforceMeta({ connectionId, metadataType, mode }) {
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

    if (applicationType === 'netsuite')
      yield put(
        actions.metadata.netsuite.receivedCollection(
          metadata,
          metadataType,
          connectionId,
          mode
        )
      );

    return metadata;
  } catch (error) {
    return undefined;
  }
}

export default [
  takeEvery(actionTypes.REQUEST_METADATA, getNetsuiteOrSalesforceMeta),
];
