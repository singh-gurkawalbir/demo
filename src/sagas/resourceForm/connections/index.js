import {
  call,
  put,
  takeEvery,
  select,
  race,
  take,
  takeLatest,
} from 'redux-saga/effects';
import jsonpatch from 'fast-json-patch';
import actions from '../../../actions';
import actionTypes from '../../../actions/types';
import { apiCallWithRetry } from '../../index';
import { pingConnectionParams } from '../../api/apiPaths';
import {
  createFormValuesPatchSet,
  submitFormValues,
  newIAFrameWorkPayload,
} from '../index';
import { selectors } from '../../../reducers/index';
import functionsTransformerMap from '../../../components/DynaForm/fields/DynaTokenGenerator/functionTransformersMap';
import { isNewId } from '../../../utils/resource';
import { convertConnJSONObjHTTPtoREST } from '../../../utils/httpToRestConnectionConversionUtil';
import { emptyObject, REST_ASSISTANTS } from '../../../constants';
import inferErrorMessages from '../../../utils/inferErrorMessages';
import { getAsyncKey } from '../../../utils/saveAndCloseButtons';
import { pingConnectionParentContext } from '../../../utils/requestOptions';
import { getHttpConnector} from '../../../constants/applications';

export function* createPayload({ values, resourceId }) {
  const resourceType = 'connections';
  // TODO: Select resource Data staged changes should be included
  let connectionResource = yield select(
    selectors.resourceData,
    resourceType,
    resourceId,
  );
  const { patchSet } = yield call(createFormValuesPatchSet, {
    resourceType,
    resourceId,
    values,
  });

  if (!connectionResource) {
    connectionResource = {};
  }

  let returnData = jsonpatch.applyPatch(
    connectionResource.merged
      ? jsonpatch.deepClone(connectionResource.merged)
      : {},
    jsonpatch.deepClone(patchSet)
  ).newDocument;

  // We built all connection assistants on HTTP adaptor on React. With recent changes to decouple REST deprecation
  // and React we are forced to convert HTTP to REST doc for existing REST assistants since we dont want to build
  // 150 odd connection assistants again. Once React becomes the only app and when assistants are migrated we would
  // remove this code and let all docs be built on HTTP adaptor.
  if (!getHttpConnector(returnData?._httpConnectorId || returnData?.http?._httpConnectorId) &&
    returnData.assistant &&
    REST_ASSISTANTS.indexOf(returnData.assistant) > -1
  ) {
    returnData = convertConnJSONObjHTTPtoREST(returnData);
  }
  if (getHttpConnector(returnData?._httpConnectorId || returnData?.http?._httpConnectorId)) {
    if (connectionResource?.master?.type === 'rest') {
      returnData.type = 'rest';
      delete returnData.rest;
    }
  }

  return returnData;
}

export function* netsuiteUserRoles({ connectionId, values, hideNotificationMessage, parentContext, shouldPingConnection }) {
  const asyncKey = getAsyncKey('connections', connectionId);

  // '/netsuite/alluserroles'
  let reqPayload = {};

  if (!values && !connectionId) return;

  if (!values) {
    if (isNewId(connectionId)) return;
    // retrieving existing userRoles for a connection
    reqPayload = { _connectionId: connectionId };
  } else {
    // retrieving userRoles for a new connection
    const { '/netsuite/email': email, '/netsuite/password': password } = values;

    reqPayload = { email, password };
  }
  yield put(actions.asyncTask.start(asyncKey));

  try {
    const resp = yield call(apiCallWithRetry, {
      path: '/netsuite/alluserroles',
      opts: { body: reqPayload, method: 'POST' },
      hidden: true,
    });
    const respSuccess =
      resp &&
      Object.keys(resp).reduce(
        (acc, env) => acc || (resp[env] && resp[env].success),
        false
      );
    const errorMessage =
      resp &&
      Object.keys(resp).reduce((acc, env) => (resp[env] && (resp[env]?.Error?.message || resp[env]?.error?.message)) || acc, undefined);

    if (!respSuccess) {
      yield put(
        actions.resource.connections.netsuite.requestUserRolesFailed(
          connectionId,
          errorMessage || 'Invalid netsuite credentials provided'
        )
      );
      if (!hideNotificationMessage) {
        yield put(actions.resource.connections.testErrored(
          connectionId,
          errorMessage || 'Invalid netsuite credentials provided')
        );
      }
      yield put(actions.asyncTask.failed(asyncKey));

      return;
    }
    // on success of netsuite userroles
    if (values) {
      // for a new connection we fetch userRoles
      // remove non success user environments
      const successOnlyEnvs = Object.keys(resp)
        .filter(env => resp[env].success)
        .map(env => ({ [env]: resp[env] }))
        .reduce((acc, env) => ({ ...acc, ...env }), {});

      yield put(
        actions.resource.connections.netsuite.receivedUserRoles(
          connectionId,
          successOnlyEnvs
        )
      );
      if (!hideNotificationMessage) {
        yield put(actions.resource.connections.testSuccessful(connectionId));
      }
    } else {
      yield put(
        actions.resource.connections.netsuite.receivedUserRoles(
          connectionId,
          resp
        )
      );
      if (!hideNotificationMessage) {
        yield put(actions.resource.connections.testSuccessful(connectionId));
      }
    }
  } catch (e) {
    if (e.status === 403 || e.status === 401) {
      yield put(actions.asyncTask.failed(asyncKey));

      return;
    }

    yield put(
      actions.resource.connections.netsuite.requestUserRolesFailed(
        connectionId,
        inferErrorMessages(e.message)?.[0]
      )
    );
    if (!hideNotificationMessage) {
      yield put(actions.resource.connections.testErrored(connectionId, inferErrorMessages(e.message)?.[0]));
    }
    yield put(actions.asyncTask.failed(asyncKey));

    return;
  }
  yield put(actions.asyncTask.success(asyncKey));

  // if the user selects 2 factor authentication for a netsuite account,
  // the netsuite user roles fetch call can succeed but the ping call can fail
  // for this reason we have to perform another ping
  if (!shouldPingConnection) {
    return;
  }
  const newValues = { ...values };

  if (!newValues['/_borrowConcurrencyFromConnectionId']) {
    newValues['/_borrowConcurrencyFromConnectionId'] = undefined;
  }
  yield put(actions.resource.connections.test(connectionId, newValues, parentContext));
}

export function* requestToken({ resourceId, fieldId, values }) {
  const resourceType = 'connections';
  const connectionResource = (yield select(
    selectors.resourceData,
    resourceType,
    resourceId
  ))?.merged || emptyObject;
  let { assistant } = connectionResource;

  if (!assistant) throw new Error('Could not determine the assistant type');

  if (assistant === 'procurify' && fieldId === 'http.unencrypted.clientId') {
    assistant = 'procurifyauthenticate';
  }

  const path = `/${assistant}/generate-token`;
  const { payloadTransformer, responseParser } = functionsTransformerMap[
    assistant
  ];

  if (!payloadTransformer || !responseParser) {
    throw new Error(
      'No Payload transform function or token transform function provided'
    );
  }

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
    yield put(
      actions.resource.connections.requestTokenFailed(
        resourceId,
        inferErrorMessages(e.message)
      )
    );

    return;
  }

  try {
    if (
      resp &&
      resp.token &&
      typeof resp.token === 'string' &&
      assistant !== 'magento'
      // for magento assistant we are getting regular string ,so we are not doing parse check here.
    ) {
      try {
        resp.token = JSON.parse(resp.token);
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
    }

    const fieldsToBeSetWithValues = responseParser(resp.token);

    yield put(
      actions.resource.connections.saveToken(
        resourceId,
        fieldsToBeSetWithValues
      )
    );

    if (assistant === 'grms') {
      if (resp && !resp.token.Success) {
        yield put(
          actions.resource.connections.requestTokenFailed(
            resourceId,
            resp && resp.token.ResponseMessages
          )
        );
      }
    }
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

export function* pingConnection({ resourceId, values, parentContext }) {
  const asyncKey = getAsyncKey('connections', resourceId);

  yield put(actions.asyncTask.start(asyncKey));
  const connectionPayload = yield call(createPayload, {
    values,
    resourceType: 'connections',
    resourceId,
  });

  let resp;

  try {
    resp = yield call(apiCallWithRetry, {
      path: pingConnectionParams.path,
      opts: {
        body: {
          ...connectionPayload,
          ...pingConnectionParentContext(parentContext),
        },
        ...pingConnectionParams.opts,
      },
      hidden: true,
    });
  } catch (e) {
    yield put(actions.asyncTask.failed(asyncKey));

    return yield put(
      actions.resource.connections.testErrored(
        resourceId,
        inferErrorMessages(e.message)
      )
    );
  }

  if (resp && resp.errors) {
    yield put(actions.asyncTask.failed(asyncKey));
    // This is added temporarily to fix IO-34226. We need to come up with generic solution in future.
    if (connectionPayload?.assistant === 'sapbydesign' && resp.errors?.[0]?.code === 401) {
      resp.errors[0].message = 'The SAP credentials you entered are invalid. Check your username and password and try again.';
    }

    return yield put(
      actions.resource.connections.testErrored(
        resourceId,
        inferErrorMessages(resp)
      )
    );
  }
  yield put(actions.asyncTask.success(asyncKey));
  yield put(
    actions.resource.connections.testSuccessful(
      resourceId,
      'Connection is working fine!'
    )
  );
}

export function* pingConnectionWithAbort(params) {
  const { resourceId } = params;
  const { abortPing } = yield race({
    testConn: call(pingConnection, params),
    abortPing: take(
      action =>
        action.type === actionTypes.CONNECTION.TEST_CANCELLED &&
        action.resourceId === resourceId
    ),
  });

  // perform submit cleanup
  if (abortPing) {
    const asyncKey = getAsyncKey('connections', resourceId);

    yield put(actions.asyncTask.success(asyncKey));
    yield put(
      actions.resource.connections.testCancelled(
        resourceId,
        'Request Cancelled'
      )
    );
  }
}

export function* openOAuthWindowForConnection(resourceId) {
  const options = 'scrollbars=1,height=600,width=800';
  let url = `/connection/${resourceId}/oauth2`;
  const additionalHeaders = yield select(selectors.accountShareHeader, url);

  if (additionalHeaders && additionalHeaders['integrator-ashareid']) {
    url += `?integrator-ashareid=${additionalHeaders['integrator-ashareid']}`;
  }

  const win = window.open(url, '_blank', options);

  if (!win || win.closed || typeof win.closed === 'undefined') {
    // POPUP BLOCKED
    // eslint-disable-next-line no-alert
    window.alert('POPUP blocked');

    win.close();

    return false;
  }

  win.focus();
}

export function* saveAndAuthorizeConnection({ resourceId, values, parentContext }) {
  try {
    yield call(submitFormValues, {
      resourceType: 'connections',
      resourceId,
      values,
      parentContext,
    });
  } catch (e) {
    // could not save the resource...lets just return
    return;
  }

  let id = resourceId;

  if (isNewId(resourceId)) {
    // if its a new connection id the submitFormValues saga would update with a new resourceReference
    // resourceId in this case is tmp id and id is the created resource id
    id = yield select(selectors.createdResourceId, resourceId);
  } else {
    const { conflict } = yield select(
      selectors.resourceData,
      'connections',
      resourceId
    );

    // if there is conflict let conflict dialog show up
    // and oauth authorize be skipped
    if (conflict) return;
  }

  // For New IA framework, UI will not create a connection and backend does it.
  // Open Oauth window logic handled as part of install integration app sagas.
  const newIAConnDoc = yield call(newIAFrameWorkPayload, {
    resourceId,
  });

  if (
    newIAConnDoc?.installStepConnection
  ) {
    return true;
  }

  try {
    yield call(openOAuthWindowForConnection, id);
  } catch (e) {
    // could not close the window
  }
}

function* saveAndAuthorizeConnectionForm(params) {
  const { resourceId } = params;
  const { cancelSave } = yield race({
    apiResp: call(saveAndAuthorizeConnection, params),
    cancelSave: take(
      action =>
        action.type === actionTypes.RESOURCE_FORM.SUBMIT_ABORTED &&
        action.resourceId === resourceId
    ),
  });

  // clean up
  if (cancelSave) yield put(actions.resource.clearStaged(resourceId));
}

export function* requestIClients({ connectionId }) {
  let path;
  const newIAConnDoc = yield call(newIAFrameWorkPayload, {
    resourceId: connectionId,
  });

  if (newIAConnDoc) {
    path = `/integrations/${newIAConnDoc.id}/iclients?type=${newIAConnDoc.connectionType}`;

    if (newIAConnDoc.assistant) {
      path += `&assistant=${newIAConnDoc.assistant}`;
    }
  } else {
    path = `/connections/${connectionId}/iclients`;
  }

  try {
    const { iclients } = yield call(apiCallWithRetry, {
      path,
      opts: {
        method: 'GET',
      },
    });

    yield put(actions.connection.updateIClients(iclients, connectionId));
  } catch (e) {
    // exception handler
  }
}

export function* pingConnectionWithId({ connectionId, parentContext }) {
  yield call(apiCallWithRetry, {
    path: `/connections/${connectionId}/ping`,
    hidden: true,
    opts: {
      body: pingConnectionParentContext(parentContext),
      method: 'POST',
    },
  });
}

export function* pingAndUpdateConnection({ connectionId, parentContext }) {
  try {
    yield call(pingConnectionWithId, { connectionId, parentContext });

    const connectionResource = yield call(apiCallWithRetry, {
      path: `/connections/${connectionId}`,
      hidden: true,
    });

    yield put(actions.resource.received('connections', connectionResource));
  } catch (error) {
    // do nothing
  }
}

export function* requestTradingPartnerConnections({ connectionId }) {
  const path = `/connections/${connectionId}/tradingPartner`;

  try {
    const conns = yield call(apiCallWithRetry, {
      path,
      opts: {
        method: 'GET',
      },
    });

    yield put(actions.connection.receivedTradingPartnerConnections(connectionId, conns));
  } catch (e) {
    // exception handler
  }
}

export default [
  takeLatest(actionTypes.CONNECTION.PING_AND_UPDATE, pingAndUpdateConnection),
  takeEvery(actionTypes.CONNECTION.TEST, pingConnectionWithAbort),
  takeEvery(actionTypes.TOKEN.REQUEST, requestToken),
  takeEvery(
    actionTypes.RESOURCE_FORM.SAVE_AND_AUTHORIZE,
    saveAndAuthorizeConnectionForm
  ),
  takeEvery(actionTypes.NETSUITE_USER_ROLES.REQUEST, netsuiteUserRoles),
  takeLatest(actionTypes.ICLIENTS, requestIClients),
  takeLatest(actionTypes.CONNECTION.TRADING_PARTNER_CONNECTIONS_REQUEST, requestTradingPartnerConnections),
];
