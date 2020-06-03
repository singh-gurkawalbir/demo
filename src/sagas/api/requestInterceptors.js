import { call, put, select, delay } from 'redux-saga/effects';
import { sendRequest } from 'redux-saga-requests';
import actions from '../../actions';
import {
  normalizeUrlAndOptions,
  introduceNetworkLatency,
  checkToThrowSessionValidationException,
  throwExceptionUsingTheResponse,
  // isUnauthorized,
  isCsrfExpired,
} from './index';
import { unauthenticateAndDeleteProfile } from '..';
import { resourceStatus, accountShareHeader } from '../../reducers/index';
import { isJsonString } from '../../utils/string';

const tryCount = 3;

export function* onRequestSaga(request) {
  const { path, opts = {}, message = path, hidden = false } = request.args;
  const method = (opts && opts.method) || 'GET';
  const { retryCount = 0 } = yield select(resourceStatus, path, method);

  // check if you are retrying ...if you are not retrying make a brand new request
  if (retryCount === 0) yield put(actions.api.request(path, method, message, hidden));

  const { options, url } = normalizeUrlAndOptions(path, opts);
  const additionalHeaders = yield select(accountShareHeader, path);

  options.headers = { ...options.headers, ...additionalHeaders };

  // all request bodies we stringify
  if (options && options.body) {
    options.body = JSON.stringify(options.body);
  }

  // for development only to slow down local api calls
  // lets built for a good UX that can deal with high latency calls...

  yield call(introduceNetworkLatency);
  // TODO: proxing path so that resourceStatus selector can pick up
  // the right comm call status
  const requestPayload = yield {
    url,
    method,
    ...options,
    meta: {
      path,
      method,
      origReq: request,
    },
    responseType: 'text',
  };

  return requestPayload;
}

export function* onSuccessSaga(response, action) {
  // the path is an additional attribute proxied in the request action
  // we could use the uri but some of them have api prefixed some dont
  const { path, method } = action.request.meta;

  // if error in response

  // This api does not support 204 very well so
  // we expect all responses to be of type text

  try {
    yield call(checkToThrowSessionValidationException, response);
  } catch (e) {
    yield call(unauthenticateAndDeleteProfile);
    yield put(actions.api.complete(path, method));

    throw e;
  }

  if (response.data === '') {
    response.data = undefined;
    yield put(actions.api.complete(path, method));
    yield put(actions.auth.sessionTimestamp());

    return response;
  }

  response.data = isJsonString(response.data)
    ? JSON.parse(response.data)
    : response.data;

  yield put(actions.api.complete(path, method));
  yield put(actions.auth.sessionTimestamp());

  return response;
}

export function* onErrorSaga(error, action) {
  const { path, method, origReq } = action.request.meta;

  if (error.status >= 400 && error.status < 500) {
    // All api calls should have this behavior
    // & CSRF expiration failure should dispatch these actions
    // TODO:whitelist the generate token for now until the backend team fixes it
    if (/* isUnauthorized({ error, path }) || */ isCsrfExpired(error)) {
      yield call(unauthenticateAndDeleteProfile);
      const hidden = true;

      // make sure it is hidden so that it does not show up
      // in the network snackbar and simply launch the session
      // expiration modal
      yield put(
        actions.api.failure(path, method, JSON.stringify(error.data), hidden)
      );
    } else {
      yield put(
        actions.api.failure(
          path,
          method,
          JSON.stringify(error.data),
          origReq && origReq.args && origReq.args.hidden
        )
      );
    }

    // give up and let the parent saga try.
    // send the first message
    yield call(throwExceptionUsingTheResponse, error);

    return { error };
  }

  const { retryCount = 0 } = yield select(resourceStatus, path, method);

  if (retryCount < tryCount) {
    yield delay(Number(process.env.REATTEMPT_INTERVAL));
    yield put(actions.api.retry(path, method));

    // resend the request ..silent false meta allows the
    // sendRequest to dispatch redux actions
    // otherwise its defaulted to true in an interceptor

    // runOnError is defaulted to false to prevent an infinite calls to onErrorHook
    // we already check the retry count onErrorHook for an exit case to prevent it from happening
    yield call(
      sendRequest,
      { request: origReq, type: 'API_WATCHER' },
      { silent: false, runOnError: true }
    );
  } else {
    // attempts failed after 'tryCount' attempts
    // this time yield an error...
    const errorMessage =
      typeof error.data === 'object' ? JSON.stringify(error.data) : error.data;

    yield put(actions.api.failure(path, method, errorMessage));
    // the parent saga may need to know if there was an error for
    // its own "Data story"...
    yield call(throwExceptionUsingTheResponse, error);
  }

  // not related token error, we pass it like nothing happened
  return { error };
}

export function* onAbortSaga(action) {
  const { path, method } = action.request.meta;

  yield put(actions.api.complete(path, method, 'Request aborted'));
}
