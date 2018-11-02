import {
  all,
  call,
  put,
  // takeLatest,
  takeEvery,
  select,
} from 'redux-saga/effects';
import { delay } from 'redux-saga';
import jsonPatch from 'fast-json-patch';
import actions from '../actions';
import actionTypes from '../actions/types';
import api from '../utils/api';
import * as selectors from '../reducers';
import util from '../utils/array';

const tryCount = 3;

export function* apiCallWithRetry(path, opts) {
  yield put(actions.api.request(path));

  for (let i = 0; i < tryCount; i += 1) {
    try {
      const successResponse = yield call(api, path, opts);

      yield put(actions.api.complete(path));

      return successResponse;
    } catch (error) {
      console.log('Got error from parent saga', error);

      if (error.status >= 400 && error.status < 500) {
        // give up and let the parent saga try.
        console.log('threw from api call with rety saga');
        throw error;
      }

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
  } catch (error) {
    switch (error.status) {
      case 401:
        // redirect to sigin page
        yield put(actions.auth.failure(path));

        break;
      case 429:
        // too many get requests
        yield call(delay, 2000);
        yield put(actions.api.retry(path));
        break;
      default:
        // generic message to the user that the
        // saga failed and services team working on it
        return undefined;
    }
  }
}

export function* getResourceCollection({ resourceType }) {
  const path = `/${resourceType}`;

  try {
    const collection = yield call(apiCallWithRetry, path);

    yield put(actions.resource.receivedCollection(resourceType, collection));

    return collection;
  } catch (error) {
    switch (error.status) {
      case 401:
        // redirect to sigin page

        break;
      case 429:
        // too many get requests
        // Indicate loading in the network snackbar
        break;

      default:
        // generic message to the user that the
        // saga failed and services team working on it
        return undefined;
    }
  }
}

export function* commitStagedChanges({ resourceType, id }) {
  const getResourceData = state =>
    selectors.resourceData(state, resourceType, id);
  const { patch, merged, master } = yield select(getResourceData);

  // console.log('resourceData', resourceData);
  // const { patch, merged, master } = resourceData;

  if (!patch) return; // nothing to do.

  const path = id ? `/${resourceType}/${id}` : `/${resourceType}`;
  const upstream = yield call(apiCallWithRetry, path);

  // console.log('latest', latest);
  // console.log('resource', resource);

  if (upstream.lastModified !== master.lastModified) {
    let conflict = jsonPatch.compare(master, upstream);

    conflict = util.removeItem(conflict, p => p.path === '/lastModified');
    conflict = util.removeItem(conflict, p => p.path === '/connection');

    yield put(actions.resource.commitConflict(id, conflict));
    // yield put(actions.resource.received(resourceType, latest));

    // console.log(server.lastModified, master.lastModified);
    // console.log(conflict);

    return;
  }

  try {
    const updated = yield call(apiCallWithRetry, path, {
      method: 'put',
      body: JSON.stringify(merged),
    });

    yield put(actions.resource.received(resourceType, updated));
    yield put(actions.resource.clearStaged(id));
  } catch (error) {
    switch (error.status) {
      case 400:
        // form validation errors;
        break;
      case 401:
        // redirect to sigin page
        break;
      case 409:
        // Exisiting job inplace, resubmiting again
        // it shouldn't be here
        break;
      case 413:
        // Sending more data in the request body than server restrictions
        break;
      case 415:
        // Incorrect media type, we should enforce in the UI end
        break;
      case 422:
        // unprocessable entity, occurs when there is a cumulative error
        break;
      case 429:
        // Throtling error, repeated requests
        break;
      default:
        // any other error, Give a generic message to the user
        return undefined;
    }
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actionTypes.RESOURCE.REQUEST, getResource),
    takeEvery(actionTypes.RESOURCE.REQUEST_COLLECTION, getResourceCollection),
    takeEvery(actionTypes.RESOURCE.STAGE_COMMIT, commitStagedChanges),
  ]);
}
