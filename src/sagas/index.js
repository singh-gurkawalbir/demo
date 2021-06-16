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
import { createRequestInstance, sendRequest } from 'redux-saga-requests';
import { createDriver } from 'redux-saga-requests-fetch';
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
import { authenticationSagas, initializeApp, initializeLogrocket } from './authentication';
import { logoutParams } from './api/apiPaths';
import { agentSagas } from './agent';
import { templateSagas } from './template';
import { cloneSagas } from './clone';
import { uploadFileSagas } from './uploadFile';
import { stackSagas } from './stack';
import exportsSampleDataSagas from './sampleData/exports';
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

export function* unauthenticateAndDeleteProfile() {
  yield put(actions.auth.failure(AUTH_FAILURE_MESSAGE));
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

export const CANCELLED_REQ = {
  status: 'Cancelled',
  message: 'Cancelled request',
};
// TODO: decide if we this saga has to have takeLatest
// api call
export function* apiCallWithRetry(args) {
  const { path, timeout = 2 * 60 * 1000, opts } = args;
  const apiRequestAction = {
    type: 'API_WATCHER',
    request: { url: path, args },
  };

  try {
    let apiResp;
    let logout;
    let timeoutEffect;

    if (path !== logoutParams.path) {
      ({ apiResp, logout, timeoutEffect } = yield race({
        apiResp: call(sendRequest, apiRequestAction, {
          dispatchRequestAction: false,
        }),
        logout: take(actionsTypes.USER_LOGOUT),
        timeoutEffect: delay(timeout),
      }));
    } else {
      apiResp = yield call(sendRequest, apiRequestAction, {
        dispatchRequestAction: false,
      });
    }

    if (timeoutEffect) {
      yield call(requestCleanup, path, opts?.method);

      throw new APIException(CANCELLED_REQ);
    }

    // logout effect succeeded then the apiResp would be undefined

    if (logout) { return null; }

    const { data } = apiResp.response || {};

    return data;
  } finally {
    if (yield cancelled()) {
      yield call(requestCleanup, path, opts?.method);
    }
  }
}

export function* allSagas() {
  yield all([
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
    ...exportsSampleDataSagas,
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
  yield createRequestInstance({
    driver: createDriver(window.fetch, {
      // AbortController Not supported in IE installed this polyfill package
      // that it would resort to
      // TODO: Have to check if it works in an IE explorer
      AbortController: window.AbortController,
    }),
    onRequest: onRequestSaga,
    onSuccess: onSuccessSaga,
    onError: onErrorSaga,
    onAbort: onAbortSaga,
  });
  const t = yield fork(allSagas);
  const {logrocket, logout, switchAcc} = yield race({
    logrocket: take(actionsTypes.ABORT_ALL_SAGAS_AND_INIT_LR),
    logout: take(actionsTypes.ABORT_ALL_SAGAS_AND_RESET),
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
    // logout requires also reset the store
    yield put(actions.auth.clearStore());
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
