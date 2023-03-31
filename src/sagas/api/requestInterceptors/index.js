import { call, put, select, delay } from 'redux-saga/effects';
import actions from '../../../actions';
import {
  normalizeUrlAndOptions,
  checkToThrowSessionValidationException,
  throwExceptionUsingTheResponse,
  // isUnauthorized,
  isCsrfExpired,
} from './utils/index';
import { unauthenticateAndDeleteProfile } from '../..';
import { selectors } from '../../../reducers';
import { isJsonString } from '../../../utils/string';
import { handleLicenseErrors } from '../../handleLicenseErrors';
import { RETRY_COUNT } from '../../../reducers/comms/networkComms';
import { sendRequest } from '..';

function* isCurrentProfileDifferent() {
  const currentProfile = yield select(selectors.userProfile);
  const currentUserId = currentProfile?._id;
  // for browsers without this local state variable skip the check

  const latestUserId = localStorage.getItem('latestUser');

  if (!latestUserId || !currentUserId) { return false; }

  // only when its defined do you attempt to compare
  return currentUserId !== latestUserId;
}

export function* isCurrentUserAndLatestUserTheSame() {
  // check the current userProfile is different from the latest user profile
  const isProfileDiff = yield call(isCurrentProfileDifferent);
  const isUserAuthenticated = yield select(selectors.isAuthenticated);

  // When user is not authenticated we have to skip these
  // checks for network calls during authentication process
  if (isProfileDiff && isUserAuthenticated) {
    yield put(actions.auth.userAlreadyLoggedIn());

    return false;
  }

  return true;
}
export function* onRequestSaga(request) {
  const { path, opts = {}, message = path, hidden = false, refresh = false, shouldNotUpdateAuthTimestamp = false } = request.args;
  const method = (opts && opts.method) || 'GET';

  const shouldMakeRequest = yield call(isCurrentUserAndLatestUserTheSame);

  if (!shouldMakeRequest) { return null; }

  const { retryCount = 0 } = yield select(selectors.resourceStatus, path, method);

  // check if you are retrying ...if you are not retrying make a brand new request
  if (retryCount === 0) {
    // console.log(path, method, hidden);
    yield put(actions.api.request(path, method, message, hidden, refresh));
  }

  const { options, url } = normalizeUrlAndOptions(path, opts);
  const additionalHeaders = yield select(selectors.accountShareHeader, path);

  options.headers = { ...options.headers, ...additionalHeaders };

  // all request bodies we stringify
  if (options && options.body) {
    options.body = JSON.stringify(options.body);
  }

  // for development only to slow down local api calls
  // lets built for a good UX that can deal with high latency calls...

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
      shouldNotUpdateAuthTimestamp,
    },
    responseType: 'text',
  };

  return requestPayload;
}

export function* onSuccessSaga(response, action) {
  // the path is an additional attribute proxied in the request action
  // we could use the uri but some of them have api prefixed some dont
  const { path, method, shouldNotUpdateAuthTimestamp } = action.request.meta;

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
    if (!shouldNotUpdateAuthTimestamp) { yield put(actions.auth.sessionTimestamp()); }

    return response;
  }

  response.data = isJsonString(response.data)
    ? JSON.parse(response.data)
    : response.data;

  yield put(actions.api.complete(path, method));
  if (!shouldNotUpdateAuthTimestamp) {
    yield put(actions.auth.sessionTimestamp());
  }

  return response;
}

export function* onErrorSaga(error, action) {
  const { path, method, origReq } = action.request.meta;
  const {data} = error;
  let code = [];
  let message = [];

  if (isJsonString(data)) {
    code = JSON.parse(data)?.errors?.map(error => error.code) || [];
    message = JSON.parse(data)?.errors?.map(error => error.message) || [];
  }

  if ((code?.includes('subscription_required') || code?.includes('entitlement_reached'))) {
    yield call(handleLicenseErrors, error, path, method, code, message);
  }
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
        actions.api.failure(path, method, error.data, hidden)
      );
    } else {
      yield put(
        actions.api.failure(
          path,
          method,
          error.data,
          origReq && origReq.args && origReq.args.hidden
        )
      );
    }

    // give up and let the parent saga try.
    // send the first message
    yield call(throwExceptionUsingTheResponse, error);

    return { error };
  }

  const { retryCount = 0 } = yield select(selectors.resourceStatus, path, method);

  if (retryCount < RETRY_COUNT) {
    yield delay(Number(process.env.REATTEMPT_INTERVAL));
    yield put(actions.api.retry(path, method));

    // resend the request and it will keep incrementing the retry count in the onSuccess saga
    // Once it exceeds the retry count it will exit the retry process and throw an exception
    return yield call(sendRequest, origReq);
  }
  // attempts failed after 'tryCount' attempts
  // this time yield an error...

  yield put(actions.api.failure(path, method, error.data, origReq?.args?.hidden));
  // the parent saga may need to know if there was an error for
  // its own "Data story"...
  yield call(throwExceptionUsingTheResponse, error);

  // not related token error, we pass it like nothing happened
  return { error };
}

export function* onAbortSaga(action) {
  const { path, method } = action.request.meta;

  yield put(actions.api.complete(path, method, 'Request aborted'));
}
