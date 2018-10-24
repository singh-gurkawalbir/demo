import {
  all,
  call,
  put,
  // takeLatest,
  takeEvery,
  select,
} from 'redux-saga/effects';
import { delay } from 'redux-saga';
// import jsonPatch from 'fast-json-patch';
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
  const path = id ? `/${resourceType}/${id}` : `/${resourceType}`;

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
  const getResourceData = state =>
    selectors.resourceData(state, resourceType, id);
  const { staged, merged, resource } = yield select(getResourceData);

  if (!staged) return; // nothing to do.

  const path = id ? `/${resourceType}/${id}` : `/${resourceType}`;
  const latest = yield call(apiCallWithRetry, path);

  // console.log('latest', latest);
  // console.log('resource', resource);

  if (latest.lastModified !== resource.lastModified) {
    // for now, just force a reload and skip the stage commit
    // we can add this later.
    yield put(actions.resource.request(resourceType, id));

    // console.log(latest.lastModified, resource.lastModified);
    // console.log(jsonPatch.compare(resource, latest));
    return;
  }

  const updated = yield call(apiCallWithRetry, path, {
    method: 'put',
    body: JSON.stringify(merged),
  });

  yield put(actions.resource.received(resourceType, updated));

  // console.log('response from put:', updated);

  // TODO: check for error response and deliver correct error message by
  // updating the comms store? somehow we need 4xx errrors that contain
  // business rule violations to show up on the edit page.

  yield put(actions.resource.clearStaged(id));
}

export default function* rootSaga() {
  yield all([
    takeEvery(actionTypes.RESOURCE.REQUEST, getResource),
    takeEvery(actionTypes.RESOURCE.REQUEST_COLLECTION, getResourceCollection),
    takeEvery(actionTypes.RESOURCE.STAGE_COMMIT, commitStagedChanges),
  ]);
}
