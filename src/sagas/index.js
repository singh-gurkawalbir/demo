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

// TODO: decide if we this saga has to have takeLatest
// api call
export function* apiCallWithRetry(args) {
  const { opts, path } = args;
  const method = (opts && opts.method) || 'GET';
  const apiRequestAction = {
    type: 'API_WATCHER',
    request: { url: path, method, args },
  };

  try {
    // TODO: logout path make it call
    let apiResp;
    let logoutResp;

    if (path !== logoutParams.path) {
      [apiResp, logoutResp] = yield race([
        call(sendRequest, apiRequestAction, {
          dispatchRequestAction: true,
        }),
        take(actionsTypes.USER_LOGOUT),
      ]);
    } else {
      apiResp = call(sendRequest, apiRequestAction, {
        dispatchRequestAction: true,
      });
    }

    if (apiResp && apiResp.response) {
      const { response } = apiResp;

      // do sth with response
      return response;
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
