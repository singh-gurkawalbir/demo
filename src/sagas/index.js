import 'abortcontroller-polyfill/dist/polyfill-patch-fetch';
import {
  all,
  call,
  put,
  take,
  select,
  race,
  delay,
  spawn,
  fork,
  cancelled,
} from 'redux-saga/effects';
import actions from '../actions';
import actionsTypes from '../actions/types';
import { resourceSagas } from './resources';
import connectorSagas from './connectors';
import { resourceFormSagas } from './resourceForm';
import { userSagas } from './users';
import { jobSagas } from './jobs';
import { flowMetricSagas } from './flowMetrics';
import integrationAppsSagas from './integrationApps';
import { flowSagas } from './flows';
import editor from './editor';
import {
  onRequestSaga,
  onSuccessSaga,
  onErrorSaga,
  onAbortSaga,
} from './api/requestInterceptors';
import { authenticationSagas, initializeApp, initializeLogrocket, invalidateSession } from './authentication';
import { logoutParams } from './api/apiPaths';
import { agentSagas } from './agent';
import { templateSagas } from './template';
import { cloneSagas } from './clone';
import { uploadFileSagas } from './uploadFile';
import { stackSagas } from './stack';
import resourceFormSampleDataSagas from './sampleData/resourceForm';
import flowDataSagas from './sampleData/flows';
import rawDataUpdateSagas from './sampleData/rawDataUpdates';
import importsSampleDataSagas from './sampleData/imports';
import fileDefinitionSagas from './fileDefinitions';
import { marketplaceSagas } from './marketPlace';
import { accessTokenSagas } from './accessToken';
import { mappingSagas } from './mapping';
import { responseMappingSagas } from './responseMapping';
import { recycleBinSagas } from './recycleBin';
import analyticsSagas from './analytics';
import { selectors } from '../reducers';
import { COMM_STATES } from '../reducers/comms/networkComms';
import { transferSagas } from './transfer';
import { suiteScriptSagas } from './suiteScript';
import jobErrorsPreviewSagas from './jobErrorsPreview';
import openErrorsSagas from './errorManagement/openErrors';
import errorDetailsSagas from './errorManagement/errorDetails';
import latestIntegrationJobsSagas from './errorManagement/latestJobs/integrations';
import latestFlowJobsSagas from './errorManagement/latestJobs/flows';
import errorMetadataSagas from './errorManagement/metadata';
import runHistorySagas from './errorManagement/runHistory';
import { customSettingsSagas } from './customSettings';
import exportDataSagas from './exportData';
import {logsSagas} from './logs';
import ssoSagas from './sso';
import { APIException } from './api';
import { bottomDrawerSagas } from './bottomDrawer';
import { AUTH_FAILURE_MESSAGE } from '../utils/constants';
import { appSagas } from './app';

export function* unauthenticateAndDeleteProfile() {
  const authFailure = yield select(selectors.authenticationErrored);

  if (!authFailure) {
    yield put(actions.auth.failure(AUTH_FAILURE_MESSAGE));
  }
  yield put(actions.user.profile.delete());
}

export function* requestCleanup(path, reqMethod) {
  // yield cancelled is true when the saga gets cancelled
  // lets perform some cleanup here by completing any ongoing requests
  const method = reqMethod || 'GET';

  // deliberately delay the sampling of the state so that we capture the cancelled saga state accurately
  // the select seems to be executed in the same cycle as the canceled sagas actions...by introducing a delay of 0 ms
  // we are forcing the select to compute in the next cycle...thereby we have the state ready
  yield delay(0);
  const status = yield select(selectors.commStatusPerPath, path, method);

  // only dispatch a completed action when the request state is not completed
  if (status !== COMM_STATES.SUCCESS) {
    yield put(actions.api.complete(path, method, 'Request Aborted'));
  }
}

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

    console.log('check ', actualResponse);
    // extract just what is important from the fetch api response like url, headers, status and actual data
    const response = yield call(extractResponse, actualResponse);

    const isError = response.status >= 400 && response.status < 600;

    if (isError) {
      console.log('hi there ', response, actionWrappedInRequest);

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

export const CANCELLED_REQ = {
  status: 'Cancelled',
  message: 'Cancelled request',
};
// TODO: decide if we this saga has to have takeLatest
// api call
export function* apiCallWithRetry(args) {
  const { path, timeout = 2 * 60 * 1000, opts } = args;
  const apiRequestPayload = yield { url: path, args };

  console.log('should not call ');
  try {
    let apiResp;
    let timeoutEffect;

    if (path !== logoutParams.path) {
      ({ apiResp, timeoutEffect } = yield race({
        apiResp: call(sendRequest, apiRequestPayload),
        timeoutEffect: delay(timeout),
      }));
    } else {
      apiResp = yield call(sendRequest, apiRequestPayload);
    }
    if (timeoutEffect) {
      yield call(requestCleanup, path, opts?.method);

      throw new APIException(CANCELLED_REQ);
    }

    const { data } = apiResp?.response || {};

    return data;
  } finally {
    if (yield cancelled()) {
      yield call(requestCleanup, path, opts?.method);
    }
  }
}

export function* allSagas() {
  yield all([
    ...appSagas,
    ...resourceSagas,
    ...connectorSagas,
    ...templateSagas,
    ...cloneSagas,
    ...editor,
    ...userSagas,
    ...authenticationSagas,
    ...resourceFormSagas,
    ...integrationAppsSagas,
    ...jobSagas,
    ...flowMetricSagas,
    ...flowSagas,
    ...agentSagas,
    ...uploadFileSagas,
    ...stackSagas,
    ...resourceFormSampleDataSagas,
    ...flowDataSagas,
    ...rawDataUpdateSagas,
    ...importsSampleDataSagas,
    ...fileDefinitionSagas,
    ...marketplaceSagas,
    ...accessTokenSagas,
    ...recycleBinSagas,
    ...analyticsSagas,
    ...transferSagas,
    ...mappingSagas,
    ...responseMappingSagas,
    ...suiteScriptSagas,
    ...jobErrorsPreviewSagas,
    ...openErrorsSagas,
    ...errorDetailsSagas,
    ...latestIntegrationJobsSagas,
    ...latestFlowJobsSagas,
    ...errorMetadataSagas,
    ...runHistorySagas,
    ...customSettingsSagas,
    ...exportDataSagas,
    ...logsSagas,
    ...ssoSagas,
    ...bottomDrawerSagas,
  ]);
}

export default function* rootSaga() {
  const t = yield fork(allSagas);
  const {logrocket, logout, switchAcc} = yield race({
    logrocket: take(actionsTypes.ABORT_ALL_SAGAS_AND_INIT_LR),
    logout: take(actionsTypes.USER_LOGOUT),
    switchAcc: take(actionsTypes.ABORT_ALL_SAGAS_AND_SWITCH_ACC),
  });

  // stop the main sagas
  t.cancel();
  if (logrocket) {
    // initializeLogrocket init must be done prior to redux-saga-requests fetch wrapping and must be done synchronously
    yield call(initializeLogrocket);
    yield spawn(rootSaga);
    // initializeApp must be called(again) after initilizeLogrocket and saga restart
    // the only code path that leads here is by calling initializeApp after successful `auth` or `initializeSession`
    // from within sagas/authentication/index.js
    yield call(initializeApp, logrocket.opts);
  }
  if (logout) {
    // invalidate the session and clear the store
    yield call(invalidateSession, { isExistingSessionInvalid: logout.isExistingSessionInvalid });

    // restart the root saga again
    yield spawn(rootSaga);
  }
  // this effect originates from switching accounts...
  // when switching accounts we would like to kill all outstanding
  // api requests than updatePreferences to the selected account restart the saga and subsequently reinitilialize session

  if (switchAcc) {
    // restart the root saga again
    yield spawn(rootSaga);
    // this action updates the redux state as well as the preferences in the backend
    // we need the preferences state before we clear it
    // this action ensures that the selected account is tied to the user in the backend...
    // so when we perform initialization the app knows which account to show
    // TODO: we should wait for update preferences to complete...inorder to prevent a race
    // with initSession to get preferences.
    yield put(
      actions.user.preferences.update({
        defaultAShareId: switchAcc.accountToSwitchTo,
        environment: 'production',
      })
    );
    yield put(actions.auth.clearStore());

    yield put(actions.auth.initSession());
  }
}

