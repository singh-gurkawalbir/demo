import { call, put, select, delay } from 'redux-saga/effects';
import { sendRequest } from 'redux-saga-requests';
import actions from '../../actions';
import {
  normalizeUrlAndOptions,
  introduceNetworkLatency,
  checkToThrowSessionValidationException,
  throwExceptionUsingTheResponse,
} from './index';
import { unauthenticateAndDeleteProfile } from '..';
import { resourceStatus } from '../../reducers/index';
import { pingConnectionParams } from '../api/apiPaths';

const tryCount = 3;

export function* onRequestSaga(request) {
  const { path, opts, message = path, hidden = false } = request.args;
  const method = (opts && opts.method) || 'GET';

  yield put(actions.api.request(path, message, hidden, method));

  const { options, url } = normalizeUrlAndOptions(path, opts);

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
    },
    responseType: 'text',
  };

  return requestPayload;
}

export function* onSuccessSaga(response, action) {
  // the path is an additional attribute proxied in the request action
  // we could use the uri but some of them have api prefixed some dont
  const { path } = action.request.meta;

  yield put(actions.api.complete(path));

  // if error in response

  // This api does not support 204 very well so
  // we expect all responses to be of type text

  try {
    yield call(checkToThrowSessionValidationException, response);
  } catch (e) {
    yield call(unauthenticateAndDeleteProfile);
    throw e;
  }

  if (response.data === '')
    // if 204
    return undefined;

  response.data = JSON.parse(response.data);

  // This is just to support ping calls...
  // if it succeeds or fails it would give back a 200
  // status code...so for these failed ping calls
  // we have the following code to support it
  // which essentially throws an exception to the parent
  if (path === pingConnectionParams.path) {
    const { errors } = response.data;

    if (errors) yield call(throwExceptionUsingTheResponse, response);
  }

  return response.data;
}

export function* onErrorSaga(error, action) {
  const { path } = action.request.meta;

  if (error.status >= 400 && error.status < 500) {
    // give up and let the parent saga try.
    yield put(actions.api.complete(path));

    // All api calls should have this behavior
    // & CSRF expiration failure should dispatch these actions
    if (error.status === 401 || error.status === 403) {
      yield call(unauthenticateAndDeleteProfile);
    }

    yield call(throwExceptionUsingTheResponse, error);

    return { error };
  }

  const { retryCount = 0 } = yield select(resourceStatus, path);

  if (retryCount < tryCount) {
    yield delay(Number(process.env.REATTEMPT_INTERVAL));
    yield put(actions.api.retry(path));
    yield call(sendRequest, action, { silent: false });
  } else {
    // attempts failed after 'tryCount' attempts
    // this time yield an error...
    yield put(actions.api.failure(path, error.data));
    // the parent saga may need to know if there was an error for
    // its own "Data story"...
    yield call(throwExceptionUsingTheResponse, error);
  }

  // not related token error, we pass it like nothing happened
  return { error };
}

export function* onAbortSaga(action) {
  yield put(actions.api.complete(action.request.meta.path, 'Request aborted'));
}
