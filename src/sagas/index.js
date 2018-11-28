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
import { api, authParams, logoutParams } from '../utils/api';
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
      if (error.status === 302) {
        yield put(actions.auth.failure('Authentication Failure'));
        throw error;
      }

      if (error.status >= 400 && error.status < 500) {
        // give up and let the parent saga try.
        yield put(actions.api.complete(path));
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
        throw error;
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
    if (error.status === 401) {
      yield put(actions.auth.failure('Authentication Failure'));
      yield put(actions.profile.delete());

      return;
    }

    return undefined;
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
        yield put(actions.auth.failure('Authentication Failure'));
        yield put(actions.profile.delete());

        return;
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
  const origin = yield call(apiCallWithRetry, path);

  // console.log('latest', latest);
  // console.log('resource', resource);

  if (origin.lastModified !== master.lastModified) {
    let conflict = jsonPatch.compare(master, origin);

    conflict = util.removeItem(conflict, p => p.path === '/lastModified');

    yield put(actions.resource.commitConflict(id, conflict));
    yield put(actions.resource.received(resourceType, origin));

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
    // Dave would handle this part
  }
}

export function* auth({ message }) {
  try {
    // replace credentials in the request body
    const payload = { ...authParams.opts, body: message };
    const apiAuthentications = yield call(
      apiCallWithRetry,
      authParams.path,
      payload
    );

    yield put(actions.auth.complete());

    return apiAuthentications.succes;
  } catch (error) {
    yield put(actions.auth.failure('Authentication Failure'));
    yield put(actions.profile.delete());

    return undefined;
  }
}

export function* evaluateProcessor({ id }) {
  const getProcessorOptions = state =>
    selectors.processorRequestOptions(state, id);
  const { errors, processor, body } = yield select(getProcessorOptions);

  if (errors && errors.length) {
    return yield put(
      actions.editor.evaluateFailure(id, JSON.stringify(errors, null, 2))
    );
  }

  // console.log(`editorProcessorOptions for ${id}`, processor, body);
  const path = `/processors/${processor}`;
  const opts = {
    method: 'post',
    body: JSON.stringify(body),
  };

  try {
    const results = yield call(apiCallWithRetry, path, opts);

    return yield put(actions.editor.evaluateResponse(id, results));
  } catch (e) {
    return yield put(actions.editor.evaluateFailure(id, e.message));
  }
}

function* setAuthWhenSessionValid() {
  try {
    const resp = yield call(getResource, actions.profile.request());

    if (resp) {
      yield put(actions.auth.complete());
    } else {
      yield put(actions.auth.logout());
    }
  } catch (e) {
    yield put(actions.auth.logout());
  }
}

function* invalidateSession() {
  try {
    yield call(apiCallWithRetry, logoutParams.path, logoutParams.opts);
    yield put(actions.auth.clearStore());
  } catch (e) {
    yield put(actions.auth.clearStore());
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actionTypes.USER_LOGOUT, invalidateSession),
    takeEvery(actionTypes.INIT_SESSION, setAuthWhenSessionValid),
    takeEvery(actionTypes.AUTH_REQUEST, auth),
    takeEvery(actionTypes.RESOURCE.REQUEST, getResource),
    takeEvery(actionTypes.RESOURCE.REQUEST_COLLECTION, getResourceCollection),
    takeEvery(actionTypes.RESOURCE.STAGE_COMMIT, commitStagedChanges),
    takeEvery(actionTypes.EDITOR_EVALUATE_REQUEST, evaluateProcessor),
  ]);
}
