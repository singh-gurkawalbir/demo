import { call, put, takeEvery, takeLatest, select } from 'redux-saga/effects';
import actions from '../../../actions';
import actionTypes from '../../../actions/types';
import { apiCallWithRetry } from '../../index';
import { commStatusByKey } from '../../../reducers/index';
import getRequestOptions from '../../../utils/requestOptions';
import commKeyGenerator from '../../../utils/commKeyGenerator';
import { COMM_STATES } from '../../../reducers/comms/networkComms';
import { isJsonString } from '../../../utils/string';

export function* getNetsuiteOrSalesforceMeta({
  connectionId,
  commMetaPath,
  addInfo,
}) {
  let path = `/${commMetaPath}`;

  if (addInfo) {
    if (addInfo.refreshCache === true) {
      path += `${path.indexOf('?') > -1 ? '&' : '?'}refreshCache=true`;
    } else if (addInfo.query) {
      path += `?q=${encodeURIComponent(addInfo.query)}`;
    }
  }

  try {
    const metadata = yield call(apiCallWithRetry, {
      path,
      opts: {},
      message: `Fetching`,
    });

    // Handle Errors sent as part of response object  with status 200
    if (metadata && metadata.errors) {
      yield put(
        actions.metadata.receivedError(
          metadata.errors[0] && metadata.errors[0].message,
          connectionId,
          commMetaPath
        )
      );
    } else {
      yield put(
        actions.metadata.receivedCollection(
          metadata,
          connectionId,
          commMetaPath
        )
      );
    }

    return metadata;
  } catch (error) {
    // Handling error statuses in  between 400 and 500 to show customized error
    if (error.status === 403 || error.status === 401) {
      return;
    }

    if (error.status >= 400 && error.status < 500) {
      const parsedError = isJsonString(error.message)
        ? JSON.parse(error.message)
        : error.message;

      yield put(
        actions.metadata.receivedError(
          parsedError && parsedError[0] && parsedError[0].message,
          connectionId,
          commMetaPath
        )
      );
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
  takeEvery(actionTypes.METADATA.REQUEST, getNetsuiteOrSalesforceMeta),
  takeLatest(actionTypes.METADATA.REFRESH, getNetsuiteOrSalesforceMeta),
  takeEvery(actionTypes.METADATA.ASSISTANT_REQUEST, requestAssistantMetadata),
];
