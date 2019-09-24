import { call, put, takeEvery, takeLatest, select } from 'redux-saga/effects';
import actions from '../../../actions';
import actionTypes from '../../../actions/types';
import { apiCallWithRetry } from '../../index';
import {
  resource,
  commMetadataPathGen,
  commStatusByKey,
} from '../../../reducers/index';
import getRequestOptions from '../../../utils/requestOptions';
import commKeyGenerator from '../../../utils/commKeyGenerator';
import { COMM_STATES } from '../../../reducers/comms';

function* getNetsuiteOrSalesforceMeta({
  connectionId,
  metadataType,
  mode = '',
  filterKey = '',
  recordType = '',
  selectField = '',
  addInfo = {},
}) {
  const connection = yield select(resource, 'connections', connectionId);
  const applicationType = (connection || {}).type || 'netsuite';
  const commMetadataPath = commMetadataPathGen(
    applicationType,
    connectionId,
    metadataType,
    mode,
    recordType,
    selectField,
    addInfo
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
      if (applicationType === 'netsuite') {
        yield put(
          actions.metadata.netsuite.receivedError(
            metadata.errors[0] && metadata.errors[0].message,
            metadataType,
            connectionId,
            mode,
            filterKey,
            recordType,
            selectField
          )
        );
      } else {
        yield put(
          actions.metadata.salesforce.receivedError(
            metadata.errors[0] && metadata.errors[0].message,
            metadataType,
            connectionId,
            recordType,
            selectField
          )
        );
      }
    } else if (applicationType === 'netsuite') {
      yield put(
        actions.metadata.netsuite.receivedCollection(
          metadata,
          metadataType,
          connectionId,
          mode,
          filterKey,
          recordType,
          selectField
        )
      );
    } else if (applicationType === 'salesforce') {
      yield put(
        actions.metadata.salesforce.receivedCollection(
          metadata,
          metadataType,
          connectionId,
          recordType,
          selectField
        )
      );
    }

    return metadata;
  } catch (error) {
    // Handling error statuses in  between 400 and 500 to show customized error
    if (error.status >= 400 && error.status < 500) {
      const parsedError = JSON.parse(error.message);

      if (applicationType === 'netsuite') {
        yield put(
          actions.metadata.netsuite.receivedError(
            parsedError && parsedError[0] && parsedError[0].message,
            metadataType,
            connectionId,
            mode,
            filterKey,
            recordType,
            selectField
          )
        );
      } else {
        yield put(
          actions.metadata.salesforce.receivedError(
            parsedError && parsedError[0] && parsedError[0].message,
            metadataType,
            connectionId,
            recordType,
            selectField
          )
        );
      }
    }
  }
}

export function* requestAssistantMetadata({ adaptorType = 'rest', assistant }) {
  const { path, opts } = getRequestOptions(
    actionTypes.METADATA.ASSISTANT_REQUEST,
    {
      resourceId: assistant,
      adaptorType,
    }
  );
  const commStatus = yield select(
    commStatusByKey,
    commKeyGenerator(path, opts.method)
  );

  if (commStatus && commStatus.status !== COMM_STATES.ERROR) {
    return;
  }

  let metadata;

  try {
    metadata = yield call(apiCallWithRetry, { path, opts });
  } catch (error) {
    return;
  }

  yield put(
    actions.assistantMetadata.received({
      adaptorType,
      assistant,
      metadata,
    })
  );

  return metadata;
}

export default [
  takeEvery(actionTypes.METADATA.NETSUITE_REQUEST, getNetsuiteOrSalesforceMeta),
  takeEvery(
    actionTypes.METADATA.SALESFORCE_REQUEST,
    getNetsuiteOrSalesforceMeta
  ),
  takeLatest(actionTypes.METADATA.REFRESH, getNetsuiteOrSalesforceMeta),
  takeEvery(actionTypes.METADATA.ASSISTANT_REQUEST, requestAssistantMetadata),
];
