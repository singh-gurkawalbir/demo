import { call, takeEvery, put, all, select } from 'redux-saga/effects';
import actionTypes from '../../actions/types';
import { apiCallWithRetry } from '../index';
import actions from '../../actions';
import {
  recycleBinDependencies,
  RESOURCE_TYPE_PLURAL_TO_SINGULAR,
} from '../../constants/resource';
import { getResourceCollection } from '../resources';
import * as selectors from '../../reducers';

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

  // TODO: what does recycleBinTTL do?
  // wait for the completion of resource calls, so that the state is ready for the redirectUrlToResourceListingPage selector
  yield all(
    [...(recycleBinDependencies[resourceType] || []), 'recycleBinTTL'].map(
      resourceType => call(getResourceCollection, { resourceType })
    )
  );

  const listingPageUrl = yield select(
    selectors.redirectUrlToResourceListingPage,
    RESOURCE_TYPE_PLURAL_TO_SINGULAR[resourceType],
    resourceId
  );

  yield put(actions.recycleBin.restoreRedirectUrl(listingPageUrl));
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
