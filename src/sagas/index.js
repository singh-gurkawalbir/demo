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
import { api } from './api';
import {
  authParams,
  logoutParams,
  changePasswordParams,
  changeEmailParams,
  updateProfileParams,
  updatePreferencesParams,
} from './api/apiPaths';
import * as selectors from '../reducers';
import util from '../utils/array';

const tryCount = 3;

export function* apiCallWithRetry(path, opts, message = path, hidden = false) {
  yield put(actions.api.request(path, message, hidden));

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
      body: merged,
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
    const credentialsBody = { email, password };
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

  const { violations, processor, body } = reqOpts;

  if (violations) {
    return yield put(actions.editor.validateFailure(id, violations));
  }

  // console.log(`editorProcessorOptions for ${id}`, processor, body);
  const path = `/processors/${processor}`;
  const opts = {
    method: 'post',
    body,
  };

  try {
    const results = yield call(apiCallWithRetry, path, opts);

    return yield put(actions.editor.evaluateResponse(id, results));
  } catch (e) {
    if (e.status === 401) {
      yield put(actions.auth.failure('Authentication Failure'));
      yield put(actions.profile.delete());
    }

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

export function* changePassword({ updatedPassword }) {
  try {
    const payload = { ...changePasswordParams.opts, body: updatedPassword };

    yield call(
      apiCallWithRetry,
      changePasswordParams.path,
      payload,
      "Changing user's password",
      true
    );
    yield put(
      actions.api.complete(
        changePasswordParams.path,
        'Success!! Changed user password'
      )
    );
  } catch (e) {
    yield put(
      actions.api.failure(
        changePasswordParams.path,
        'Invalid credentials provided.  Please try again.'
      )
    );
  }
}

export function* updatePreferences(preferences) {
  if (preferences === {}) return;

  try {
    const payload = {
      ...updatePreferencesParams.opts,
      body: preferences,
    };

    yield call(
      apiCallWithRetry,
      updatePreferencesParams.path,
      payload,
      "Updating user's info"
    );
    yield put(actions.resource.receivedCollection('preferences', preferences));
  } catch (e) {
    yield put(
      actions.api.failure(
        updatePreferencesParams.path,
        'Could not update user Preferences'
      )
    );
  }
}

export function* updateProfile(profile) {
  try {
    const payload = {
      ...updateProfileParams.opts,
      body: profile,
    };

    yield call(
      apiCallWithRetry,
      updateProfileParams.path,
      payload,
      "Updating user's info"
    );
    yield put(actions.resource.received('profile', profile));
  } catch (e) {
    yield put(
      actions.api.failure(
        updateProfileParams.path,
        'Could not update user Profile'
      )
    );
  }
}

export function* updateUserProfileAndPreferences({
  profilePreferencesPayload,
}) {
  const { _id, timeFormat, dateFormat } = profilePreferencesPayload;

  yield updatePreferences({ _id, timeFormat, dateFormat });
  const copy = { ...profilePreferencesPayload };

  delete copy.dateFormat;
  delete copy.timeFormat;
  const profile = copy;

  yield updateProfile(profile);
}

export function* changeEmail({ updatedEmail }) {
  try {
    const payload = { ...changeEmailParams.opts, body: updatedEmail };

    yield call(
      apiCallWithRetry,
      changeEmailParams.path,
      payload,
      "Changing user's Email",
      true
    );
    yield put(
      actions.api.complete(
        changeEmailParams.path,
        'Success!! Sent user change Email setup to you email'
      )
    );
  } catch (e) {
    if (e.status === 403) {
      yield put(
        actions.api.failure(
          changeEmailParams.path,
          'Existing email provided, Please try again.'
        )
      );

      return;
    }

    yield put(
      actions.api.failure(
        changeEmailParams.path,
        'Cannot change user Email , Please try again.'
      )
    );
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(
      actionTypes.UPDATE_PROFILE_PREFERENCES,
      updateUserProfileAndPreferences
    ),
    takeEvery(actionTypes.USER_CHANGE_EMAIL, changeEmail),
    takeEvery(actionTypes.USER_CHANGE_PASSWORD, changePassword),
    takeEvery(actionTypes.USER_LOGOUT, invalidateSession),
    takeEvery(actionTypes.INIT_SESSION, initializeApp),
    takeEvery(actionTypes.AUTH_REQUEST, auth),
    takeEvery(actionTypes.RESOURCE.REQUEST, getResource),
    takeEvery(actionTypes.RESOURCE.REQUEST_COLLECTION, getResourceCollection),
    takeEvery(actionTypes.RESOURCE.STAGE_COMMIT, commitStagedChanges),
    takeEvery(actionTypes.EDITOR_EVALUATE_REQUEST, evaluateProcessor),
    // since the reducers handle actions FIRST, it is safe to re-use the same
    // editor_init action to trigger auto-evaluation for the initial editor
    // state.
    takeEvery(actionTypes.EDITOR_INIT, autoEvaluateProcessor),
    takeLatest(actionTypes.EDITOR_PATCH, autoEvaluateProcessor),
  ]);
}
