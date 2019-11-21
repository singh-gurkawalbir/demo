import { call, put, takeEvery, select, race, take } from 'redux-saga/effects';
import jsonpatch from 'fast-json-patch';
import actions from '../../../actions';
import actionTypes from '../../../actions/types';
import { apiCallWithRetry } from '../../index';
import { pingConnectionParams } from '../../api/apiPaths';
import { createFormValuesPatchSet, submitFormValues, SCOPES } from '../index';
import * as selectors from '../../../reducers/index';
import { commitStagedChanges } from '../../resources';
import functionsTransformerMap from '../../../components/DynaForm/fields/DynaTokenGenerator/functionTransformersMap';
import { isNewId } from '../../../utils/resource';
import conversionUtil from '../../../utils/httpToRestConnectionConversionUtil';
import { REST_ASSISTANTS } from '../../../utils/constants';

function* createPayload({ values, resourceId }) {
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

  const returnData = jsonpatch.applyPatch(connectionResource.merged, patchSet)
    .newDocument;

  // We built all connection assistants on HTTP adaptor on React. With recent changes to decouple REST deprecation
  // and React we are forced to convert HTTP to REST doc for existing REST assistants since we dont want to build
  // 150 odd connection assistants again. Once React becomes the only app and when assistants are migrated we would
  // remove this code and let all docs be built on HTTP adaptor.
  if (
    connectionResource.merged &&
    connectionResource.merged.assistant &&
    REST_ASSISTANTS.indexOf(connectionResource.merged.assistant) > -1
  ) {
    connectionResource.merged = conversionUtil.convertConnJSONObjHTTPtoREST(
      connectionResource.merged
    );
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

    if (!respSuccess)
      yield put(
        actions.resource.connections.netsuite.requestUserRolesFailed(
          connectionId,
          'Invalid netsuite credentials provided'
        )
      );
    else if (values) {
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
    } else
      yield put(
        actions.resource.connections.netsuite.receivedUserRoles(
          connectionId,
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

  if (assistant === 'procurify' && fieldId === 'http.encrypted.clientSecret') {
    assistant = 'procurifyauthenticate';
  }

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
        errors && errors[0] && errors[0].message ? errors[0].message : errors
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
      if (resp && !resp.token.Success)
        yield put(
          actions.resource.connections.requestTokenFailed(
            resourceId,
            resp && resp.token.ResponseMessages
          )
        );
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
    if (e.status === 200 || e.status === 422) {
      // these errors are json errors
      const errorsJSON = JSON.parse(e.message);
      const { errors } = errorsJSON;

      yield put(
        actions.api.failure(
          pingConnectionParams.path,
          pingConnectionParams.opts.method,
          errors && errors[0] && errors[0].message ? errors[0].message : errors
        )
      );
    }
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

  try {
    yield call(openOAuthWindowForConnection, id);
  } catch (e) {
    // could not close the window
  }
}

function* commitAndAuthorizeConnection({ resourceId }) {
  const error = yield call(commitStagedChanges, {
    resourceType: 'connections',
    id: resourceId,
    scope: SCOPES.VALUE,
  });

  if (error) {
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
