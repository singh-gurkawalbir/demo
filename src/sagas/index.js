import {
  all,
  call,
  put,
  takeLatest,
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

export function* apiCallWithRetry(path, opts, message = path) {
  // todo path and message

  yield put(actions.api.request(path, message));

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

export function* getResource({ resourceType, id, message }) {
  const path = id ? `/${resourceType}/${id}` : `/${resourceType}`;

  try {
    const resource = yield call(apiCallWithRetry, path, message);

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
  const { patch, merged, master } = yield select(
    selectors.resourceData,
    resourceType,
    id
  );

  if (!patch) return; // nothing to do.

  const path = id ? `/${resourceType}/${id}` : `/${resourceType}`;
  const origin = yield call(apiCallWithRetry, path);

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

export function* auth({ email, password }) {
  try {
    // replace credentials in the request body
    const credentialsBody = JSON.stringify({ email, password });
    const payload = { ...authParams.opts, body: credentialsBody };
    const apiAuthentications = yield call(
      apiCallWithRetry,
      authParams.path,
      payload,
      'Authenticating User'
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
  const reqOpts = yield select(selectors.processorRequestOptions, id);

  if (!reqOpts) {
    return; // nothing to do...
  }

  const { errors, processor, body } = reqOpts;

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

export function* autoEvaluateProcessor({ id }) {
  const editor = yield select(selectors.editor, id);

  if (!editor || (editor.violations && editor.violations.length)) {
    return; // nothing to do...
  }

  if (!editor.autoEvaluate) return;

  if (editor.autoEvaluateDelay) {
    yield call(delay, editor.autoEvaluateDelay);
  }

  return yield call(evaluateProcessor, { id });
}

export function* initializeApp() {
  try {
    const resp = yield call(
      getResource,
      actions.profile.request(),
      'Initializing application'
    );

    if (resp) {
      yield put(actions.auth.complete());
    } else {
      yield put(actions.auth.logout());
    }
  } catch (e) {
    yield put(actions.auth.logout());
  }
}

export function* invalidateSession() {
  try {
    yield call(
      apiCallWithRetry,
      logoutParams.path,
      logoutParams.opts,
      'Logging out user'
    );
    yield put(actions.auth.clearStore());
  } catch (e) {
    yield put(actions.auth.clearStore());
  }
}

// function* changePassword({ message }) {
//   try {
//     const payload = { method: 'PUT', body: message };
//     const path = '/change-password';

//     yield call(apiCallWithRetry, path, payload, "Changing user's password");
//   } catch (e) {
//     yield put(actions.auth.failure('Authentication Failure'));
//   }
// }

export default function* rootSaga() {
  yield all([
    // takeEvery(actionTypes.USER_CHANGE_PASSWORD, changePassword),
    takeEvery(actionTypes.USER_LOGOUT, invalidateSession),
    takeEvery(actionTypes.INIT_SESSION, initializeApp),
    takeEvery(actionTypes.AUTH_REQUEST, auth),
    takeEvery(actionTypes.RESOURCE.REQUEST, getResource),
    takeEvery(actionTypes.RESOURCE.REQUEST_COLLECTION, getResourceCollection),
    takeEvery(actionTypes.RESOURCE.STAGE_COMMIT, commitStagedChanges),
    takeEvery(actionTypes.EDITOR_EVALUATE_REQUEST, evaluateProcessor),
    takeLatest(actionTypes.EDITOR_PATCH, autoEvaluateProcessor),
  ]);
}
