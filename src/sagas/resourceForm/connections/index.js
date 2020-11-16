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
  SCOPES,
  newIAFrameWorkPayload,
} from '../index';
import { selectors } from '../../../reducers/index';
import { commitStagedChanges } from '../../resources';
import functionsTransformerMap from '../../../components/DynaForm/fields/DynaTokenGenerator/functionTransformersMap';
import { isNewId } from '../../../utils/resource';
import conversionUtil from '../../../utils/httpToRestConnectionConversionUtil';
import { REST_ASSISTANTS } from '../../../utils/constants';
import inferErrorMessage from '../../../utils/inferErrorMessage';

export function* createPayload({ values, resourceId }) {
  const resourceType = 'connections';
  // TODO: Select resource Data staged changes should be included
  let connectionResource = yield select(
    selectors.resourceData,
    resourceType,
    resourceId,
    'value'
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
  if (
    returnData.assistant &&
    REST_ASSISTANTS.indexOf(returnData.assistant) > -1
  ) {
    returnData = conversionUtil.convertConnJSONObjHTTPtoREST(returnData);
  }

  return returnData;
}

export function* netsuiteUserRoles({ connectionId, values }) {
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

    if (!respSuccess) {
      yield put(
        actions.resource.connections.netsuite.requestUserRolesFailed(
          connectionId,
          'Invalid netsuite credentials provided'
        )
      );
    } else if (values) {
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
    } else {
      yield put(
        actions.resource.connections.netsuite.receivedUserRoles(
          connectionId,
          resp
        )
      );
    }
  } catch (e) {
    if (e.status === 403 || e.status === 401) {
      return;
    }

    const errorsJSON = JSON.parse(e.message);
    const { errors } = errorsJSON;

    yield put(
      actions.resource.connections.netsuite.requestUserRolesFailed(
        connectionId,
        errors[0].message
      )
    );
  }
}

export function* requestToken({ resourceId, fieldId, values }) {
  const resourceType = 'connections';
  const { merged: connectionResource } = yield select(
    selectors.resourceData,
    resourceType,
    resourceId
  );
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
        inferErrorMessage(e.message)
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

function* pingConnection({ resourceId, values }) {
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
        body: connectionPayload,
        ...pingConnectionParams.opts,
      },
      hidden: true,
    });
  } catch (e) {
    return yield put(
      actions.resource.connections.testErrored(
        resourceId,
        inferErrorMessage(e.message)
      )
    );
  }

  if (resp && resp.errors) {
    return yield put(
      actions.resource.connections.testErrored(
        resourceId,
        inferErrorMessage(resp)
      )
    );
  }

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

function* commitAndAuthorizeConnection({ resourceId }) {
  const resp = yield call(commitStagedChanges, {
    resourceType: 'connections',
    id: resourceId,
    scope: SCOPES.VALUE,
  });

  // if there is conflict let conflict dialog show up
  // and oauth authorize be skipped
  if (resp && (resp.error || resp.conflict)) {
    // could not save the resource...lets just return
    return;
  }

  try {
    yield call(openOAuthWindowForConnection, [resourceId]);
  } catch (e) {
    // could not close the window
  }
}

function* requestIClients({ connectionId }) {
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
    const { iclients } = yield apiCallWithRetry({
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

export function* pingAndUpdateConnection({ connectionId }) {
  try {
    yield call(apiCallWithRetry, {
      path: `/connections/${connectionId}/ping`,
      hidden: true,
    });

    const connectionResource = yield call(apiCallWithRetry, {
      path: `/connections/${connectionId}`,
      hidden: true,
    });

    yield put(actions.resource.received('connections', connectionResource));
  } catch (error) {
    // do nothing
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
  takeEvery(
    actionTypes.RESOURCE_FORM.COMMIT_AND_AUTHORIZE,
    commitAndAuthorizeConnection
  ),
  takeLatest(actionTypes.ICLIENTS, requestIClients),
];
