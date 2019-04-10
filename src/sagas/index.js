import 'abortcontroller-polyfill/dist/polyfill-patch-fetch';
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
} from './api/requestInterceptors';
import { authenticationSagas } from './authentication';
import { logoutParams } from './api/apiPaths';

export function* unauthenticateAndDeleteProfile() {
  yield put(actions.auth.failure('Authentication Failure'));
  yield put(actions.user.profile.delete());
}

// TODO: decide if we this saga has to have takeLatest
// api call
export function* apiCallWithRetry(args) {
  const { path } = args;
  const apiRequestAction = {
    type: 'API_WATCHER',
    request: { url: path, args },
  };

  try {
    let apiResp;
    let logout;

    if (path !== logoutParams.path) {
      ({ apiResp, logout } = yield race({
        apiResp: call(sendRequest, apiRequestAction, {
          dispatchRequestAction: true,
        }),
        logout: take(actionsTypes.USER_LOGOUT),
      }));
    } else {
      apiResp = yield call(sendRequest, apiRequestAction, {
        dispatchRequestAction: true,
      });
    }

    // logout effect succeeded in then apiResp would be null
    if (logout) return null;

    const { response } = apiResp;

    return response;
  } catch (error) {
    throw error;
  }
}

export default function* rootSaga() {
  yield createRequestInstance({
    driver: createDriver(window.fetch, {
      // AbortController Not supported in IE installed this pollyfill package
      // that it would resort to
      // TODO: Have to check if it works in an IE explorer
      AbortController: window.AbortController,
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
