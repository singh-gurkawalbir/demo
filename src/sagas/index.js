import { delay } from 'redux-saga';
import { all, call, put } from 'redux-saga/effects';
import actions from '../actions';
import { resourceSagas } from './resources';
import { modalsSagas } from './modals';
import { editorSagas } from './editor';
import { processorSagas } from './editor/processor';
import { authenticationSagas } from './authentication';
import { api } from './api';

const tryCount = 3;

export function* apiCallWithRetry(path, opts, message = path, hidden = false) {
  yield put(actions.api.request(path, message, hidden));

  for (let i = 0; i < tryCount; i += 1) {
    try {
      const successResponse = yield call(api, path, opts);

      yield put(actions.api.complete(path));

      return successResponse;
    } catch (error) {
      if (error.status >= 400 && error.status < 500) {
        // give up and let the parent saga try.
        yield put(actions.api.complete(path));

        if (error.status === 401) {
          yield put(actions.auth.failure('Authentication Failure'));
          yield put(actions.profile.delete());
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
    ...processorSagas,
    ...editorSagas,
    ...modalsSagas,
    ...authenticationSagas,
  ]);
}
