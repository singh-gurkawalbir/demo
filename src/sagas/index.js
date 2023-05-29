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
  authenticationSagas,
  initializeApp,
  initializeLogrocket,
  invalidateSession,
} from './authentication';
import { logoutParams } from './api/apiPaths';
import { agentSagas } from './agent';
import { templateSagas } from './template';
import { cloneSagas } from './clone';
import { concurSagas } from './concur';
import { uploadFileSagas } from './uploadFile';
import { stackSagas } from './stack';
import resourceFormSampleDataSagas from './sampleData/resourceForm';
import mockInput from './sampleData/mockInput';
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
import retriesSagas from './errorManagement/retries';
import accountSettings from './accountSettings';
import { customSettingsSagas } from './customSettings';
import lifecycleManagementSagas from './lifecycleManagement';
import uiFieldsSagas from './uiFields';
import exportDataSagas from './exportData';
import { logsSagas } from './logs';
import ssoSagas from './sso';
import flowbuildersagas from './flowbuilder';
import mfaSagas from './mfa';
import { APIException } from './api/requestInterceptors/utils';
import { bottomDrawerSagas } from './bottomDrawer';
import { AUTH_FAILURE_MESSAGE } from '../constants';
import { getNextLinkRelativeUrl } from '../utils/resource';
import flowGroupSagas from './flowGroups';
import aliasSagas from './aliases';
import { appSagas } from './app';
import { sendRequest } from './api';
import customApiSagas from './dashboardSettings';
import flowTrendsSagas from './flowTrendsSettings';
import userTrendsSagas from './userTrendsSettings';
import connectionTrendsSagas from './connectionTrendsSettings';

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

export const CANCELLED_REQ = {
  status: 'Cancelled',
  message: 'Cancelled request',
};
// TODO: decide if we this saga has to have takeLatest
// api call
export function* apiCallWithRetry(args) {
  const { path, timeout = 2 * 60 * 1000, opts, requireHeaders } = args;
  const apiRequestPayload = { url: path, args };

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

    const { data, headers } = apiResp?.response || {};

    if (requireHeaders) {
      return { data, headers };
    }

    return data;
  } finally {
    if (yield cancelled()) {
      yield call(requestCleanup, path, opts?.method);
    }
  }
}

export function* apiCallWithPaging(args) {
  const response = yield call(apiCallWithRetry, {
    ...args,
    requireHeaders: true,
  });

  if (!response) return response;

  const { data, headers } = response;

  // BE only supports 'link' pagination for now
  const link = headers ? headers.get('link') : undefined;

  const nextLinkPath = getNextLinkRelativeUrl(link);

  // for audit logs, pagination is supported at UI level so
  // we need to store the nextLinkPath in state
  if (args.path.includes('/audit')) {
    return { data, nextLinkPath };
  }

  if (nextLinkPath) {
    try {
      // if 'next' url exists, recursively call for next page data
      let nextPageData = yield call(apiCallWithPaging, {
        ...args,
        path: nextLinkPath,
      });

      if (
        nextPageData !== undefined &&
        !Array.isArray(nextPageData) &&
        !nextLinkPath.includes('/ui/assistants')
      ) {
        // eslint-disable-next-line no-console
        console.warn('Getting unexpected collection values: ', nextPageData);
        nextPageData = undefined;
      }

      // push next page data to original data
      return [...(data || []), ...(nextPageData || [])];
    } catch (e) {
      // once UI pagination is supported, we can handle this error case better
      // right now we should return the data so far so user is not blocked
      return data;
    }
  }

  // return the total accumulated data to parent saga
  return data;
}

export function* allSagas() {
  yield all([
    ...appSagas,
    ...resourceSagas,
    ...connectorSagas,
    ...templateSagas,
    ...cloneSagas,
    ...concurSagas,
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
    ...mockInput,
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
    ...retriesSagas,
    ...accountSettings,
    ...customSettingsSagas,
    ...exportDataSagas,
    ...logsSagas,
    ...ssoSagas,
    ...mfaSagas,
    ...bottomDrawerSagas,
    ...flowGroupSagas,
    ...aliasSagas,
    ...lifecycleManagementSagas,
    ...flowbuildersagas,
    ...uiFieldsSagas,
    ...customApiSagas,
    ...flowTrendsSagas,
    ...userTrendsSagas,
    ...connectionTrendsSagas,
  ]);
}

export default function* rootSaga() {
  const t = yield fork(allSagas);
  const { logrocket, logout, switchAcc } = yield race({
    logrocket: take(actionsTypes.AUTH.ABORT_ALL_SAGAS_AND_INIT_LR),
    logout: take(actionsTypes.AUTH.USER.LOGOUT),
    switchAcc: take(actionsTypes.AUTH.ABORT_ALL_SAGAS_AND_SWITCH_ACC),
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
    yield call(invalidateSession, {
      isExistingSessionInvalid: logout.isExistingSessionInvalid,
    });

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
      actions.auth.clearStore({
        authenticated: true,
      })
    );

    yield put(actions.auth.initSession({ switchAcc: true }));
  }
}
