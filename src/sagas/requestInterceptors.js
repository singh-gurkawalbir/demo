import { delay } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';
import { sendRequest } from 'redux-saga-requests';
import actions from '../actions';
import {
  createAppropriatePathAndOptions,
  introduceNetworkLatency,
  APIException,
  checkToThrowSessionValidationException,
  throwExceptionUsingTheResponse,
} from './api/index';
import { unauthenticateAndDeleteProfile } from '.';
import { resourceStatus } from '../reducers/index';

const tryCount = 3;

export function* onRequestSaga(request) {
  const { path, opts, message = path, hidden = false } = request.args;
  const method = (opts && opts.method) || 'GET';

  yield put(actions.api.request(path, message, hidden, method));

  const { options, req } = createAppropriatePathAndOptions(path, opts);

  // all request bodies we stringify
  if (options && options.body) {
    options.body = JSON.stringify(options.body);
  }

  // for development only to slow down local api calls
  // lets built for a good UX that can deal with high latency calls...

  yield introduceNetworkLatency();
  const requestPayload = {
    url: req,
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
  const { path } = action.request.meta;

  yield put(actions.api.complete(path));

  // if error in response
  if (response.status >= 400 && response.status < 600) {
    throwExceptionUsingTheResponse(response);
  }

  // This api does not support 204 very well so
  // we expect all responses to be of type text

  try {
    checkToThrowSessionValidationException(response);
  } catch (e) {
    yield call(unauthenticateAndDeleteProfile);

    return null;
  }

  // if 204
  if (response.data === '') return undefined;

  response.data = JSON.parse(response.data);

  return response.data;
}

export function* onErrorSaga(error, action) {
  const { path } = action.request.meta;
  const { retryCount } = select(resourceStatus, path);

  if (error.status >= 400 && error.status < 500) {
    // give up and let the parent saga try.
    yield put(actions.api.complete(path));

    // All api calls should have this behavior
    // & CSRF expiration failure should dispatch these actions
    if (error.status === 401 || error.status === 403) {
      yield call(unauthenticateAndDeleteProfile);
    }

    throw new APIException(error);
  }
  // TODO: Use select effect to get the retry count

  if (retryCount < tryCount - 1) {
    yield call(delay, 2000);
    yield put(actions.api.retry(path));
    yield call(sendRequest, action, { silent: true });
  } else {
    // attempts failed after 'tryCount' attempts
    // this time yield an error...
    yield put(actions.api.failure(path, error.message));
    // the parent saga may need to know if there was an error for
    // its own "Data story"...
    throw new APIException(error);
  }

  // not related token error, we pass it like nothing happened
  return { error };
}

export function onAbortSaga(action) {
  // do sth, for example an action dispatch
  //

  console.log('check act ', action);
}
