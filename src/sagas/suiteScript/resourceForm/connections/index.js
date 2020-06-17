import {
  call,
  put,
  takeEvery,
  select,
  race,
  take,
} from 'redux-saga/effects';
import jsonpatch from 'fast-json-patch';
import actions from '../../../../actions';
import actionTypes from '../../../../actions/types';
import * as selectors from '../../../../reducers/index';
import { apiCallWithRetry } from '../../../index';
// import { pingConnectionParams } from '../../../api/apiPaths';
import {
  createFormValuesPatchSet /* submitFormValues, SCOPES */,
} from '../index';
import inferErrorMessage from '../../../../utils/inferErrorMessage';

function getPingConnectionParams(ssLinkedConnectionId) {
  return {
    opts: {
      method: 'POST',
    },
    path: `/suitescript/connections/${ssLinkedConnectionId}/connections/ping`,
  };
}

function* createPayload({ values, resourceId, ssLinkedConnectionId }) {
  const resourceType = 'connections';
  // TODO: Select resource Data staged changes should be included
  let connectionResource = yield select(selectors.suiteScriptResourceData, {
    resourceType,
    id: resourceId,
    ssLinkedConnectionId,
    scope: 'value',
  });
  const { patchSet } = yield call(createFormValuesPatchSet, {
    resourceType,
    resourceId,
    values,
    ssLinkedConnectionId,
  });

  if (!connectionResource) {
    connectionResource = {};
  }

  const returnData = jsonpatch.applyPatch(
    connectionResource.merged
      ? jsonpatch.deepClone(connectionResource.merged)
      : {},
    jsonpatch.deepClone(patchSet)
  ).newDocument;

  return returnData;
}

function* pingConnection({ resourceId, values, ssLinkedConnectionId }) {
  const connectionPayload = yield call(createPayload, {
    values,
    resourceId,
    ssLinkedConnectionId,
  });
  let resp;
  const pingConnectionParams = getPingConnectionParams(ssLinkedConnectionId);

  try {
    resp = yield call(apiCallWithRetry, {
      path: pingConnectionParams.path,
      opts: {
        body: connectionPayload,
        ...pingConnectionParams.opts,
      },
      hidden: true,
    });
  } catch (e) {
    return yield put(
      actions.suiteScript.resource.connections.testErrored(
        resourceId,
        inferErrorMessage(e.message),
        ssLinkedConnectionId
      )
    );
  }

  if (resp && resp.errors) {
    return yield put(
      actions.suiteScript.resource.connections.testErrored(
        resourceId,
        inferErrorMessage(resp),
        ssLinkedConnectionId
      )
    );
  }

  yield put(
    actions.suiteScript.resource.connections.testSuccessful(
      resourceId,
      'Connection is working fine!',
      ssLinkedConnectionId
    )
  );
}

export function* pingConnectionWithAbort(params) {
  const { resourceId } = params;
  const { abortPing } = yield race({
    testConn: call(pingConnection, params),
    abortPing: take(
      action =>
        action.type === actionTypes.SUITESCRIPT.CONNECTION.TEST_CANCELLED &&
        action.resourceId === resourceId
    ),
  });

  // perform submit cleanup
  if (abortPing) {
    yield put(
      actions.suiteScript.resource.connections.testCancelled(
        resourceId,
        'Request Cancelled'
      )
    );
  }
}

export default [
  takeEvery(actionTypes.SUITESCRIPT.CONNECTION.TEST, pingConnectionWithAbort),
];
