import {
  all,
  call,
  put,
  // takeLatest,
  takeEvery,
  select,
} from 'redux-saga/effects';
import { delay } from 'redux-saga';
import actions from '../actions';
import actionTypes from '../actions/types';
import api from '../utils/api';
import * as selectors from '../reducers';

const tryCount = 3;

export function* apiCallWithRetry(path, opts) {
  yield put(actions.api.request(path));

  for (let i = 0; i < tryCount; i += 1) {
    try {
      const successResponse = yield call(api, path, opts);

      yield put(actions.api.complete(path));

      return successResponse;
    } catch (error) {
      // TODO: analyze error and dispatch(put) different actions as need.
      // for example, if we get a 401, we should dispatch a redirect action
      // to the login page. Possibly some 4xx errors could also have custom
      // behavior, etc..

      if (i < tryCount - 1) {
        yield call(delay, 2000);
        yield put(actions.api.retry(path));
      } else {
        // attempts failed after 'tryCount' attempts
        // this time yield an error...
        yield put(actions.api.failure(path, error.message));

        // the parent saga may need to know if there was an error for
        // its own "Data story"...
        throw new Error(error);
      }
    }
  }
}

export function* getResource({ resourceType, id }) {
  const path = `/${resourceType}/${id}`;

  try {
    const resource = yield call(apiCallWithRetry, path);

    yield put(actions.resource.received(resourceType, resource));

    return resource;
  } catch (e) {
    return undefined;
  }
}

export function* getResourceCollection({ resourceType }) {
  const path = `/${resourceType}`;

  try {
    const collection = yield call(apiCallWithRetry, path);

    yield put(actions.resource.receivedCollection(resourceType, collection));

    return collection;
  } catch (e) {
    return undefined;
  }
}

export function* commitStagedChanges({ resourceType, id }) {
  const getResourceData = state => {
    const resourceData = selectors.resourceData(state, resourceType, id);

    // console.log(resourceData);

    return resourceData;
  };

  const { merged } = yield select(getResourceData);

  // if (!staged || merged === master) // retrun from saga.. nothing to do.

  /* const updated = */ yield call(api, `/${resourceType}/${id}`, {
    method: 'put',
    body: JSON.stringify(merged),
  });

  // console.log('response from put:', updated);

  // TODO: check for error response and deliver correct error message by
  // updating the comms store? somehow we need 4xx errrors that contain
  // business rule violations to show up on the edit page.

  // TODO: Replace below code with a new data reducer and action creator
  // that will replace within the data store, the single resource returned
  // from the above update call. (Instead of the brute force replace-all
  // call to the specific collection below:

  yield put(actions.resource.requestCollection(resourceType));

  // It will take some time for the put request to be fullfilled
  // lets delasy clearing the staged data.
  yield call(delay, 200);

  yield put(actions.resource.clearStaged(id));
}

export default function* rootSaga() {
  yield all([
    takeEvery(actionTypes.RESOURCE.REQUEST_COLLECTION, getResourceCollection),
    takeEvery(actionTypes.RESOURCE.STAGE_COMMIT, commitStagedChanges),
  ]);
}
