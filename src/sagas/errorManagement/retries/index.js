import { put, takeLatest, call, select } from 'redux-saga/effects';
import actions from '../../../actions';
import actionTypes from '../../../actions/types';
import { apiCallWithRetry } from '../../index';
import { selectors } from '../../../reducers';

export function* getRetryJobCollection({flowId, resourceId}) {
  let resourceType = 'exports';
  const importResource = yield select(selectors.resource, 'imports', resourceId);

  if (importResource) {
    resourceType = 'imports';
  }
  const path = `/jobs?_flowId=${flowId}&type=retry&${resourceType === 'exports' ? '_exportId' : '_importId'}=${resourceId}`;

  try {
    const retryList = yield call(apiCallWithRetry, {
      path,
      opts: {
        method: 'GET',
      },
      hidden: true,
    });

    yield put(
      actions.errorManager.retries.received({
        resourceId,
        retries: retryList,
      })
    );
  } catch (e) {
    // errors
  }
}

export default [
  takeLatest(
    actionTypes.ERROR_MANAGER.RETRIES.REQUEST,
    getRetryJobCollection
  ),
];
