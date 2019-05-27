import { call, put, takeEvery } from 'redux-saga/effects';
import actions from '../../../actions';
import actionTypes from '../../../actions/types';
import { apiCallWithRetry } from '../../index';

function* getNetsuiteOrSalesforceResourceCollection({
  commResourcePath,
  applicationType,
  connectionId,
  resourceType,
  mode,
}) {
  const path = `/${commResourcePath}`;

  try {
    const resource = yield call(apiCallWithRetry, { path, opts: {} });

    if (applicationType === 'netsuite')
      yield put(
        actions.metadata.netsuite.receivedCollection(
          resource,
          resourceType,
          connectionId,
          mode
        )
      );

    return resource;
  } catch (error) {
    return undefined;
  }
}

export default [
  takeEvery(
    actionTypes.REQUEST_METADATA_COLLECTION,
    getNetsuiteOrSalesforceResourceCollection
  ),
];
