import { call, put, takeEvery, select, race, take } from 'redux-saga/effects';
import jsonpatch from 'fast-json-patch';
import actions from '../../../actions';
import actionTypes from '../../../actions/types';
import { apiCallWithRetry } from '../../index';
import { pingConnectionParams } from '../../api/apiPaths';
import { createFormValuesPatchSet, submitFormValues, SCOPES } from '../index';
import * as selectors from '../../../reducers/index';
import { commitStagedChanges } from '../../resources';
import { getAdditionalHeaders } from '../../../sagas/api/requestInterceptors';
import functionsTransformerMap from '../../../components/DynaForm/fields/DynaTokenGenerator/functionTransformersMap';

function* createPayload({ values, resourceId }) {
  const resourceType = 'connections';
  // TODO: Select resource Data staged changes should be included
  let connectionResource = yield select(
    selectors.resource,
    resourceType,
    resourceId
  );
  const { patchSet } = yield call(createFormValuesPatchSet, {
    resourceType,
    resourceId,
    values,
  });

  if (!connectionResource) {
    connectionResource = {};
  }

  return jsonpatch.applyPatch(connectionResource, patchSet).newDocument;
}

export function* netsuiteUserRoles({ resourceId, values }) {
  // '/netsuite/alluserroles'
  let reqPayload = {};
  const connectionResource = yield select(
    selectors.resource,
    'connections',
    resourceId
  );
  let connectionId;

  if (connectionResource) {
    connectionId = connectionResource._id;
  }

  if (!values && !connectionId) return;

  if (!values) {
    // retrieving existing userRoles for a connection

    reqPayload = { _connectionId: connectionId };
  } else {
    // retrieving userRoles for a new connection
    const { '/netsuite/email': email, '/netsuite/password': password } = values;

    reqPayload = { email, password };
  }

  try {
    const resp = yield call(apiCallWithRetry, {
      path: '/netsuite/alluserroles',
      opts: { body: reqPayload, method: 'POST' },
      hidden: true,
    });

    if (resp && resp.production && !resp.production.success)
      yield put(
        actions.resource.connections.netsuite.requestUserRolesFailed(
          resourceId,
          resp.production.error.message
        )
      );
    else
      yield put(
        actions.resource.connections.netsuite.receivedUserRoles(
          resourceId,
          resp
        )
      );
  } catch (e) {
    if (e.status === 403 || e.status === 401) {
      return;
    }

    const errorsJSON = JSON.parse(e.message);
    const { errors } = errorsJSON;

    yield put(
      actions.resource.connections.netsuite.requestUserRolesFailed(
        resourceId,
        errors[0].message
      )
    );
  }
}

export function* requestToken({ resourceId, values }) {
  const resourceType = 'connections';
  const connectionResource = yield select(
    selectors.resource,
    resourceType,
    resourceId
  );
  const { assistant } = connectionResource;

  if (!assistant) throw new Error('Could not determine the assistant type');

  const path = `/${assistant}/generate-token`;
  const { payloadTransformer, responseParser } = functionsTransformerMap[
    assistant
  ];

  if (!payloadTransformer || !responseParser)
    throw new Error(
      'No Payload transform function or token transform function provided'
    );

  let reqPayload;

  try {
    reqPayload = payloadTransformer(values);
  } catch (e) {
    yield put(
      actions.resource.connections.requestTokenFailed(
        resourceId,
        'An error occurred when we tried to generate your token request. Please try again later, or contact our customer support team.'
      )
    );
    // eslint-disable-next-line no-console
    console.warn(
      'Could not process payload, Please revist your form payloadTransformer',
      e
    );

    return;
  }

  let resp;

  try {
    resp = yield call(apiCallWithRetry, {
      path,
      opts: { body: reqPayload, method: 'POST' },
      hidden: true,
    });
  } catch (e) {
    const errorsJSON = JSON.parse(e.message);
    const { errors } = errorsJSON;

    yield put(
      actions.resource.connections.requestTokenFailed(
        resourceId,
        errors[0].message
      )
    );

    return;
  }

  try {
    const fieldsToBeSetWithValues = responseParser(resp.token);

    yield put(
      actions.resource.connections.saveToken(
        resourceId,
        fieldsToBeSetWithValues
      )
    );
  } catch (e) {
    yield put(
      actions.resource.connections.requestTokenFailed(
        resourceId,
        'An error occurred when we tried to extract your token from the response. Please try again later, or contact our customer support team.'
      )
    );

    // eslint-disable-next-line no-console
    console.warn(
      'Could not process token to field values, Please revisit your responseParser',
      e
    );
  }
}

export function* pingConnection({ resourceId, values }) {
  try {
    const connectionPayload = yield call(createPayload, {
      values,
      resourceType: 'connections',
      resourceId,
    });
    // Either apiResp or cancelTask can race successfully
    // , both will never happen
    const { apiResp, cancelTask } = yield race({
      apiResp: call(apiCallWithRetry, {
        path: pingConnectionParams.path,
        opts: {
          body: connectionPayload,
          ...pingConnectionParams.opts,
        },
        hidden: true,
      }),
      cancelTask: take(actionTypes.CANCEL_TASK),
    });

    // if the api call raced successfully without errors
    if (apiResp) {
      yield put(
        actions.api.complete(
          pingConnectionParams.path,
          pingConnectionParams.opts.method,
          'Connection is working fine!'
        )
      );
    }

    if (cancelTask) {
      yield put(
        actions.api.failure(
          pingConnectionParams.path,
          pingConnectionParams.opts.method,
          'Request Cancelled'
        )
      );
    }
  } catch (e) {
    // The ping test gives back a 200 response if the ping connection has failed
    if (e.status === 200) {
      // these errors are json errors
      const errorsJSON = JSON.parse(e.message);
      const { errors } = errorsJSON;

      yield put(
        actions.api.failure(
          pingConnectionParams.path,
          pingConnectionParams.opts.method,
          errors[0].message
        )
      );
    }
  }
}

export function* openOAuthWindowForConnection(resourceId) {
  const options = 'scrollbars=1,height=600,width=800';
  let url = `/connection/${resourceId}/oauth2`;
  const additionalHeaders = yield call(getAdditionalHeaders, url);

  if (additionalHeaders && additionalHeaders['integrator-ashareid']) {
    url += `?integrator-ashareid=${additionalHeaders['integrator-ashareid']}`;
  }

  const win = window.open(url, '_blank', options);

  if (!win || win.closed || typeof win.closed === 'undefined') {
    // POPUP BLOCKED
    // eslint-disable-next-line no-alert
    window.alert('POPUP blocked');

    try {
      win.close();
    } catch (ex) {
      throw ex;
    }

    return false;
  }

  win.focus();
}

export function* saveAndAuthorizeConnection({ resourceId, values }) {
  try {
    yield call(submitFormValues, {
      resourceType: 'connections',
      resourceId,
      values,
    });
  } catch (e) {
    // could not save the resource...lets just return
    return;
  }

  const { conflict } = yield select(
    selectors.resourceData,
    'connections',
    resourceId
  );

  // if there is conflict let conflict dialog show up
  // and oauth authorize be skipped
  if (conflict) return;

  try {
    yield call(openOAuthWindowForConnection, [resourceId]);
  } catch (e) {
    // could not close the window
  }
}

function* commitAndAuthorizeConnection({ resourceId }) {
  try {
    yield call(commitStagedChanges, {
      resourceType: 'connections',
      id: resourceId,
      scope: SCOPES.VALUE,
    });
  } catch (e) {
    // could not save the resource...lets just return
    return;
  }

  // check to see if there is still a conflict
  const { conflict } = yield select(
    selectors.resourceData,
    'connections',
    resourceId
    // A scope is not required for the conflict
  );

  // if there is conflict let conflict dialog show up
  // and oauth authorize be skipped
  if (conflict) return;

  try {
    yield call(openOAuthWindowForConnection, [resourceId]);
  } catch (e) {
    // could not close the window
  }
}

export default [
  takeEvery(actionTypes.TEST_CONNECTION, pingConnection),
  takeEvery(actionTypes.TOKEN.REQUEST, requestToken),
  takeEvery(
    actionTypes.RESOURCE_FORM.SAVE_AND_AUTHORIZE,
    saveAndAuthorizeConnection
  ),
  takeEvery(actionTypes.NETSUITE_USER_ROLES.REQUEST, netsuiteUserRoles),
  takeEvery(
    actionTypes.RESOURCE_FORM.COMMIT_AND_AUTHORIZE,
    commitAndAuthorizeConnection
  ),
];
