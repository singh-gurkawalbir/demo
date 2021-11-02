import { call, cancelled } from 'redux-saga/effects';
import { onAbortSaga, onErrorSaga, onRequestSaga, onSuccessSaga } from './requestInterceptors';
import { APIException } from './requestInterceptors/utils';

export function* extractResponse(response) {
  const {url, headers, status} = response;
  // response is a promise yield it to as a text in all cases
  // the reason we convert it into a text is not all responses can be parsed into JSON, such as 204 response will be an "" and between 400 to 600 not all responses can be parsed.
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
      // error sagas bubble exceptions of type APIException uses the errored response in the API exception message
      return yield call(onErrorSaga, response, actionWrappedInRequest);
    }
    // we call the onSuccess saga which tries to parse the response into JSON and ultimately return it to the parent saga
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
