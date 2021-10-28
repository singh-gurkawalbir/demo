import { call, cancelled } from 'redux-saga/effects';
import { onAbortSaga, onErrorSaga, onRequestSaga, onSuccessSaga } from './requestInterceptors';
import { APIException } from './requestInterceptors/utils';

export function* extractResponse(response) {
  const {url, headers, status} = response;
  // convert into text only for 400 to 500 do you parse it into json
  const data = yield response.text();

  return {
    url, headers, status, data,
  };
}

// this saga orchestrates all request interceptors
export function* sendRequest(request) {
  const controller = new AbortController();
  const {signal} = controller;

  // this is called first which gives us the payload with which we should make the actual network call
  const generatedRequestPayload = yield call(onRequestSaga, request);

  const {meta, ...requestPayload} = generatedRequestPayload;
  const actionWrappedInRequest = {request: generatedRequestPayload};

  try {
    const {url, ...options} = requestPayload;

    const actualResponse = yield call(fetch, url, {...options, signal});

    // extract just what is important from the fetch api response like url, headers, status and actual data
    const response = yield call(extractResponse, actualResponse);

    const isError = response.status >= 400 && response.status < 600;

    if (isError) {
      // error sagas bubble exceptions of type APIException
      return yield call(onErrorSaga, response, actionWrappedInRequest);
    }

    const successResponse = yield call(onSuccessSaga, response, actionWrappedInRequest);

    return {response: successResponse};
  } catch (e) {
    // All exceptions originating from the errorSaga are of type APIException..just bubble exception
    if (e instanceof APIException) {
      throw e;
    }

    // cases such as connection goes offline...the window.fetch will throw an excepion ...in these case just retry the same request
    return yield call(onErrorSaga, {status: 500, message: 'Connection has gone offline'}, actionWrappedInRequest);
  } finally {
    if (yield cancelled()) {
      // kill ongoing api request if this saga gets cancelled
      controller.abort();
      yield call(onAbortSaga, actionWrappedInRequest);
    }
  }
}
