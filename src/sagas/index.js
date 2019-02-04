import { delay } from 'redux-saga';
import { all, call, put } from 'redux-saga/effects';
import actions from '../actions';
import { resourceSagas } from './resources';
import { userSagas } from './users';
import editorSagas from './editor';
import { authenticationSagas } from './authentication';
import { api } from './api';

const tryCount = 3;

export function* unauthenticateAndDeleteProfile() {
  yield put(actions.auth.failure('Authentication Failure'));
  yield put(actions.user.profile.delete());
}

export function* apiCallWithRetry(path, opts, message = path, hidden = false) {
  const method = (opts && opts.method) || 'GET';

  yield put(actions.api.request(path, message, hidden, method));

  for (let i = 0; i < tryCount; i += 1) {
    try {
      const successResponse = yield call(api, path, opts);

      yield put(actions.api.complete(path));

      return successResponse;
    } catch (error) {
      if (error.status >= 400 && error.status < 500) {
        // give up and let the parent saga try.
        yield put(actions.api.complete(path));

        // All api calls should have this behavior
        // & CSRF expiration failure should dispatch these actions
        if (error.status === 401 || error.status === 403) {
          yield call(unauthenticateAndDeleteProfile);
        }

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

export default function* rootSaga() {
  yield all([
    ...resourceSagas,
    ...editorSagas,
    ...userSagas,
    ...authenticationSagas,
  ]);
}
