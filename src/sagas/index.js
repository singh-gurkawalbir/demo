import { all, call, put, take, race } from 'redux-saga/effects';
import { createRequestInstance, sendRequest } from 'redux-saga-requests';
import { createDriver } from 'redux-saga-requests-fetch';
import actions from '../actions';
import actionsTypes from '../actions/types';
import { resourceSagas } from './resources';
import { userSagas } from './users';
import editorSagas from './editor';
import {
  onRequestSaga,
  onSuccessSaga,
  onErrorSaga,
  onAbortSaga,
} from './requestInterceptors';
import { authenticationSagas } from './authentication';
import { APIException } from './api/index';
import { logoutParams } from './api/apiPaths';

export function* unauthenticateAndDeleteProfile() {
  yield put(actions.auth.failure('Authentication Failure'));
  yield put(actions.user.profile.delete());
}

// all tasks can be cancelable except for the logout
const cancelableTasksDuringLogouts = path => {
  if (path !== logoutParams.path) return [take(actionsTypes.USER_LOGOUT)];

  return [];
};

// TODO: decide if we this saga has to have takeLatest
export function* apiCallWithRetry(args) {
  const { opts, path } = args;
  const method = (opts && opts.method) || 'GET';
  const apiRequestAction = {
    type: 'API_WATCHER',
    request: { url: path, method, args },
  };

  try {
    const [resp, ...remainingActions] = yield race([
      call(sendRequest, apiRequestAction, {
        dispatchRequestAction: true,
      }),
      ...cancelableTasksDuringLogouts(path),
    ]);
    // a hack to schedule the logout later so that it cleans the store
    // to logout gracefully
    // this is how are middlwares are scheduled by design
    const isLoggedOut = remainingActions.filter(
      action => action.type === actionsTypes.USER_LOGOUT
    );

    if (isLoggedOut.length > 0) {
      yield put(actions.auth.logout());
      // we have to throw this exception otherwise
      // the parent saga would continue to run setting a null
      // to the resource call
      throw new APIException();
    }

    if (resp && resp.response) {
      const { response } = resp;

      // do sth with response
      return response.data;
    }

    return null;
  } catch (error) {
    throw error;
  }
}

export default function* rootSaga() {
  yield createRequestInstance({
    driver: createDriver(window.fetch, {
      AbortController: window.AbortController, // optional, if your browser supports AbortController or you use a polyfill like https://github.com/mo/abortcontroller-polyfill
    }),
    onRequest: onRequestSaga,
    onSuccess: onSuccessSaga,
    onError: onErrorSaga,
    onAbort: onAbortSaga,
  });
  yield all([
    ...resourceSagas,
    ...editorSagas,
    ...userSagas,
    ...authenticationSagas,
  ]);
}
