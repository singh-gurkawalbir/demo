import { call, put, takeEvery, select } from 'redux-saga/effects';
import actions from '../../actions';
import actionTypes from '../../actions/types';
import { apiCallWithRetry } from '../index';
import getRequestOptions from '../../utils/requestOptions';
import * as selectors from '../../reducers';
import commKeyGenerator from '../../utils/commKeyGenerator';
import { COMM_STATES } from '../../reducers/comms';

export function* requestMetadata({ adaptorType, assistant }) {
  const { path, opts } = getRequestOptions(
    actionTypes.ASSISTANT_METADATA.REQUEST,
    {
      resourceId: assistant,
      adaptorType,
    }
  );
  const commStatus = yield select(
    selectors.commStatusByKey,
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
      adaptorType: adaptorType || 'rest',
      assistant,
      metadata,
    })
  );

  return metadata;
}

export const assistantMetadataSagas = [
  takeEvery(actionTypes.ASSISTANT_METADATA.REQUEST, requestMetadata),
];
