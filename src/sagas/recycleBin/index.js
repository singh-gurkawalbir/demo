import { call, takeEvery, put, all } from 'redux-saga/effects';
import actionTypes from '../../actions/types';
import { apiCallWithRetry } from '../index';
import actions from '../../actions';
import { recycleBinDependencies } from '../../constants/resource';

export function* restore({ resourceType, resourceId }) {
  const path = `/recycleBinTTL/${resourceType}/${resourceId}/doCascadeRestore`;

  try {
    yield call(apiCallWithRetry, {
      path,
      opts: {
        method: 'POST',
        body: {},
      },
    });
  } catch (e) {
    return;
  }

  yield all(
    recycleBinDependencies[resourceType].map(resources =>
      put(actions.resource.requestCollection(resources))
    )
  );
  yield put(actions.resource.requestCollection('recycleBinTTL'));
}

export function* purge({ resourceType, resourceId }) {
  const path = `/recycleBinTTL/${resourceType}/${resourceId}`;

  try {
    yield call(apiCallWithRetry, {
      path,
      opts: {
        method: 'DELETE',
      },
    });
  } catch (e) {
    return;
  }

  yield put(actions.resource.requestCollection('recycleBinTTL'));
}

export const recycleBinSagas = [
  takeEvery(actionTypes.RECYCLEBIN.RESTORE, restore),
  takeEvery(actionTypes.RECYCLEBIN.PURGE, purge),
];
