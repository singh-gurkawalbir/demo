/* global describe, test, expect */

import { call, put, select } from 'redux-saga/effects';
import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import actions from '../../../actions';
import { apiCallWithRetry } from '../../index';
import {newIAFrameWorkPayload, submitFormValues, createFormValuesPatchSet} from '../index';
import inferErrorMessage from '../../../utils/inferErrorMessage';
import { requestToken, requestIClients, pingAndUpdateConnection, pingConnection, createPayload, openOAuthWindowForConnection, commitAndAuthorizeConnection, saveAndAuthorizeConnection, netsuiteUserRoles } from '.';
import { pingConnectionParams } from '../../api/apiPaths';
import { commitStagedChanges } from '../../resources';
import { selectors } from '../../../reducers/index';
import functionsTransformerMap from '../../../components/DynaForm/fields/DynaTokenGenerator/functionTransformersMap';

describe('ping and update connection saga', () => {
  const connectionId = 'C1';

  test('should able to ping and update connection successfully', () => {
    const saga = pingAndUpdateConnection({ connectionId });

    const pingPath = `/connections/${connectionId}/ping`;
    const connectionResourcePath = `/connections/${connectionId}`;
    const mockResourceReferences =
      { name: 'connection1', id: 1};

    expect(saga.next().value).toEqual(
      call(apiCallWithRetry, { path: pingPath, hidden: true })
    );
    expect(saga.next().value).toEqual(
      call(apiCallWithRetry, { path: connectionResourcePath, hidden: true })
    );
    const effect = saga.next(mockResourceReferences).value;

    expect(effect).toEqual(
      put(actions.resource.received('connections', mockResourceReferences))
    );
    expect(saga.next().done).toEqual(true);
  });
  test('should handle api error properly', () => {
    const saga = pingAndUpdateConnection({ connectionId });

    const pingPath = `/connections/${connectionId}/ping`;
    const connectionResourcePath = `/connections/${connectionId}`;

    expect(saga.next().value).toEqual(
      call(apiCallWithRetry, { path: pingPath, hidden: true })
    );
    expect(saga.next().value).toEqual(
      call(apiCallWithRetry, { path: connectionResourcePath, hidden: true })
    );
    expect(saga.throw(new Error()).value).toEqual(undefined);
    expect(saga.next().done).toEqual(true);
  });
});
describe('ping connection saga', () => {
  const resourceId = 'C1';

  const values = {name: 'conn1'};

  test('should able to ping connection successfully ', () => {
    const connectionPayload = { name: 'new Connection' };
    const response = {status: 'success'};

    return expectSaga(pingConnection, { resourceId, values })
      .provide([
        [matchers.call.fn(createPayload), connectionPayload],
        [matchers.call.fn(apiCallWithRetry), response],
      ])
      .call.fn(createPayload)
      .call.fn(apiCallWithRetry)
      .put(
        actions.resource.connections.testSuccessful(
          resourceId,
          'Connection is working fine!'
        )
      )
      .run();
  });

  test('should able to throw error message if any', () => {
    const connectionPayload = { name: 'new Connection' };
    const resp = {errors: ['Errors']};

    return expectSaga(pingConnection, { resourceId, values })
      .provide([
        [matchers.call.fn(createPayload), connectionPayload],
        [matchers.call.fn(apiCallWithRetry), resp],
      ])
      .call.fn(createPayload)
      .call.fn(apiCallWithRetry)
      .put(
        actions.resource.connections.testErrored(
          resourceId,
          inferErrorMessage(resp)
        )
      )
      .run();
  });
  test('should handle api error properly', () => {
    const saga = pingConnection({ resourceId, values });

    expect(saga.next().value).toEqual(
      call(createPayload, {
        values,
        resourceType: 'connections',
        resourceId,
      })
    );
    expect(saga.next().value).toEqual(
      call(apiCallWithRetry, {
        path: pingConnectionParams.path,
        opts: {
          body: undefined,
          ...pingConnectionParams.opts,
        },
        hidden: true,
      })
    );
    const error = new Error();

    expect(saga.throw(error).value).toEqual(
      put(actions.resource.connections.testErrored(
        resourceId,
        inferErrorMessage(error?.message)
      ))
    );
  });
});
describe('request IClients saga', () => {
  const connectionId = 'C1';

  test('should able to to get IClients successfully', () => {
    const saga = requestIClients({ connectionId });

    const pingPath = `/connections/${connectionId}/iclients`;

    expect(saga.next().value).toEqual(
      call(newIAFrameWorkPayload, {
        resourceId: connectionId,
      })
    );

    expect(saga.next().value).toEqual(
      call(apiCallWithRetry, { path: pingPath,
        opts: {
          method: 'GET',
        } })
    );
    expect(saga.next().done).toEqual(true);
  });
  test('should able to verify ping path correctly if itis assistant connection', () => {
    const saga = requestIClients({ connectionId });

    const pingPath = '/integrations/1234/iclients?type=rest&assistant=shopify';
    const mockResourceReferences = {connectionType: 'rest', assistant: 'shopify', id: '1234'};

    expect(saga.next().value).toEqual(
      call(newIAFrameWorkPayload, {
        resourceId: connectionId,
      })
    );
    const effect = saga.next(mockResourceReferences).value;

    expect(effect).toEqual(
      call(apiCallWithRetry, { path: pingPath,
        opts: {
          method: 'GET',
        } })
    );
    expect(saga.next().done).toEqual(true);
  });
  test('should able to verify ping path correctly if connection has type and does not have assistant', () => {
    const saga = requestIClients({ connectionId });

    const pingPath = '/integrations/1234/iclients?type=netsuite';
    const mockResourceReferences = {connectionType: 'netsuite', id: '1234'};

    expect(saga.next().value).toEqual(
      call(newIAFrameWorkPayload, {
        resourceId: connectionId,
      })
    );
    const effect = saga.next(mockResourceReferences).value;

    expect(effect).toEqual(
      call(apiCallWithRetry, { path: pingPath,
        opts: {
          method: 'GET',
        } })
    );
    expect(saga.next().done).toEqual(true);
  });
  test('should handle api error properly', () => {
    const saga = requestIClients({ connectionId });

    const pingPath = `/connections/${connectionId}/iclients`;

    expect(saga.next().value).toEqual(
      call(newIAFrameWorkPayload, {
        resourceId: connectionId,
      })
    );

    expect(saga.next().value).toEqual(
      call(apiCallWithRetry, { path: pingPath,
        opts: {
          method: 'GET',
        } })
    );
    expect(saga.throw(new Error()).value).toEqual(undefined);
    expect(saga.next().done).toEqual(true);
  });
  test('should handle api error properly if it is assistant connection', () => {
    const saga = requestIClients({ connectionId });
    const mockResourceReferences = {connectionType: 'rest', assistant: 'shopify', id: '1234'};

    const pingPath = '/integrations/1234/iclients?type=rest&assistant=shopify';

    expect(saga.next().value).toEqual(
      call(newIAFrameWorkPayload, {
        resourceId: connectionId,
      })
    );
    const effect = saga.next(mockResourceReferences).value;

    expect(effect).toEqual(
      call(apiCallWithRetry, { path: pingPath,
        opts: {
          method: 'GET',
        } })
    );
    expect(saga.throw(new Error()).value).toEqual(undefined);
    expect(saga.next().done).toEqual(true);
  });
  test('should handle api error properly if connection has type and does not have assistant', () => {
    const saga = requestIClients({ connectionId });

    const pingPath = '/integrations/1234/iclients?type=netsuite';
    const mockResourceReferences = {connectionType: 'netsuite', id: '1234'};

    expect(saga.next().value).toEqual(
      call(newIAFrameWorkPayload, {
        resourceId: connectionId,
      })
    );
    const effect = saga.next(mockResourceReferences).value;

    expect(effect).toEqual(
      call(apiCallWithRetry, { path: pingPath,
        opts: {
          method: 'GET',
        } })
    );

    expect(saga.throw(new Error()).value).toEqual(undefined);
    expect(saga.next().done).toEqual(true);
  });
});

describe('Commit and authorize connection saga', () => {
  const resourceId = 'C1';
  const resp = {name: 'conn1'};
  const errorResponse = {error: 'error'};

  test('should able to commit and authorize connection successfully ', () => expectSaga(commitAndAuthorizeConnection, { resourceId })
    .provide([
      [matchers.call.fn(commitStagedChanges), resp],
    ])
    .call.fn(commitStagedChanges)
    .call.fn(openOAuthWindowForConnection)
    .run());
  test('should not authorize connection if there is any error in response', () => expectSaga(commitAndAuthorizeConnection, { resourceId })
    .provide([
      [matchers.call.fn(commitStagedChanges), errorResponse],
    ])
    .call.fn(commitStagedChanges)
    .run());
});

describe('Save and authorize connection saga', () => {
  const resourceId = 'C1';
  const values = {name: 'name'};
  const conflictResponse = {conflict: 'conflict'};
  const resp = {name: 'conn2'};
  const newIAConnDoc = {};

  test('should able to save and authorize connection successfully ', () => expectSaga(saveAndAuthorizeConnection, { resourceId, values })
    .provide([
      [matchers.call.fn(submitFormValues), resp],
      [select(selectors.createdResourceId), '12345'],
      [select(selectors.resourceData), resp],
      [matchers.call.fn(newIAFrameWorkPayload), newIAConnDoc],
    ])
    .call.fn(submitFormValues)
    .call.fn(newIAFrameWorkPayload)
    .call.fn(openOAuthWindowForConnection)
    .run());
  test('should able to save and does not authorize connection if there are any conflicts ', () => expectSaga(saveAndAuthorizeConnection, { resourceId, values })
    .provide([
      [matchers.call.fn(submitFormValues), resp],
      [select(selectors.createdResourceId), '12345'],
      [select(selectors.resourceData), conflictResponse],
      [matchers.call.fn(newIAFrameWorkPayload), newIAConnDoc],
    ])
    .call.fn(submitFormValues)
    .run());

  test('should handle api error properly', () => {
    const saga = saveAndAuthorizeConnection({ resourceId, values });

    expect(saga.next().value).toEqual(
      call(submitFormValues, {
        resourceType: 'connections',
        resourceId,
        values,
      })
    );

    expect(saga.throw(new Error()).value).toEqual(undefined);
    expect(saga.next().done).toEqual(true);
  });
  test('should able to handle conflicts properly', () => {
    const saga = saveAndAuthorizeConnection({ resourceId, values });
    const mockResourceReferences = {conflict: 'conflict'};

    expect(saga.next().value).toEqual(
      call(submitFormValues, {
        resourceType: 'connections',
        resourceId,
        values,
      })
    );

    expect(saga.next().value).toEqual(select(
      selectors.resourceData,
      'connections',
      resourceId
    ));
    const effect = saga.next(mockResourceReferences).value;

    expect(effect).toEqual(undefined);
  });
  test('should not open oauth window if it is new IA2.0 installer step', () => {
    const saga = saveAndAuthorizeConnection({ resourceId, values });
    const mockResourceReferences = {conn: 'conn1'};
    const newIAConnDoc = {installStepConnection: true};

    expect(saga.next().value).toEqual(
      call(submitFormValues, {
        resourceType: 'connections',
        resourceId,
        values,
      })
    );

    expect(saga.next().value).toEqual(select(
      selectors.resourceData,
      'connections',
      resourceId
    ));
    let effect = saga.next(mockResourceReferences).value;

    expect(effect).toEqual(call(newIAFrameWorkPayload, {
      resourceId,
    }));
    effect = saga.next(newIAConnDoc).value;
    expect(effect).toEqual(true);
  });
  test('should handle api error in open oauth window', () => {
    const saga = saveAndAuthorizeConnection({ resourceId, values });
    const mockResourceReferences = {conn: 'conn1'};
    const newIAConnDoc = {};

    expect(saga.next().value).toEqual(
      call(submitFormValues, {
        resourceType: 'connections',
        resourceId,
        values,
      })
    );

    expect(saga.next().value).toEqual(select(
      selectors.resourceData,
      'connections',
      resourceId
    ));
    let effect = saga.next(mockResourceReferences).value;

    expect(effect).toEqual(call(newIAFrameWorkPayload, {
      resourceId,
    }));
    effect = saga.next(newIAConnDoc).value;
    expect(effect).toEqual(call(openOAuthWindowForConnection, resourceId));
    expect(saga.throw(new Error()).value).toEqual(undefined);
    expect(saga.next().done).toEqual(true);
  });
});

describe('Create payload saga', () => {
  const conn = {master: { _id: 2, name: 'conn', lastModified: new Date().toISOString(), http: {ping: {relativeURI: '/api/v2/users.json'}} }, merged: { _id: 2, name: 'conn', lastModified: new Date().toISOString(), http: {ping: {relativeURI: '/api/v2/users.json'}} }};
  const resourceId = 2;
  const values = {name: 'conn'};
  const patchSet = [{op: 'replace', path: '/name', value: 'ZendeskToday'}, {op: 'add', path: '/http', value: {}}, {op: 'add', path: '/http/ping', value: {}}, {op: 'replace', path: '/http/ping/relativeURI', value: '/api/v3/users.json'}, {op: 'replace', path: '/assistant', value: 'zendesk'}];
  const patchSetAmazonMws = [{op: 'replace', path: '/name', value: 'AmazonMWS'}, {op: 'add', path: '/http', value: {}}, {op: 'add', path: '/http/ping', value: {}}, {op: 'replace', path: '/http/ping/relativeURI', value: '/api/v3/users.json'}, {op: 'replace', path: '/assistant', value: 'amazonmws'}];

  test('should able to check payload calls successfully', () => expectSaga(createPayload, { resourceId, values })
    .provide([
      [select(selectors.resourceData), conn],
    ])
    .call.fn(createFormValuesPatchSet)
    .run());
  test('should able to verify payload for rest assistants successfully', () => expectSaga(createPayload, { resourceId, values })
    .provide([
      [select(selectors.resourceData), conn],
      [matchers.call.fn(createFormValuesPatchSet), {patchSet}],
    ])
    .call.fn(createFormValuesPatchSet)
    .returns({name: 'ZendeskToday', assistant: 'zendesk', type: 'rest', rest: {pingRelativeURI: '/api/v3/users.json'}})
    .run());
  test('should able to verify payload for http assistants successfully', () => expectSaga(createPayload, { resourceId, values })
    .provide([
      [select(selectors.resourceData), conn],
      [matchers.call.fn(createFormValuesPatchSet), {patchSet: patchSetAmazonMws}],
    ])
    .call.fn(createFormValuesPatchSet)
    .returns({name: 'AmazonMWS', assistant: 'amazonmws', http: {ping: {relativeURI: '/api/v3/users.json'}}})
    .run());
});

describe('Netsuite user roles saga', () => {
  const connectionId = '1234';
  const values = {'/name': 'Netsuite', '/application': 'Netsuite'};
  const resp = {production: {
    success: true, accounts: [{accont: {type: 'production'}}],
  }};
  const unSuccessfulResp = {};
  const successOnlyEnvs = Object.keys(resp)
    .filter(env => resp[env].success)
    .map(env => ({ [env]: resp[env] }))
    .reduce((acc, env) => ({ ...acc, ...env }), {});

  test('should update netsuite user roles successfully', () => expectSaga(netsuiteUserRoles, { connectionId, values })
    .provide([
      [matchers.call.fn(apiCallWithRetry), resp],
    ])
    .call.fn(apiCallWithRetry)
    .put(
      actions.resource.connections.netsuite.receivedUserRoles(
        connectionId,
        successOnlyEnvs
      )
    )
    .run());
  test('should throw error for invalid credentials', () => expectSaga(netsuiteUserRoles, { connectionId, values })
    .provide([
      [matchers.call.fn(apiCallWithRetry), unSuccessfulResp],
    ])
    .call.fn(apiCallWithRetry)
    .put(
      actions.resource.connections.netsuite.requestUserRolesFailed(
        connectionId,
        'Invalid netsuite credentials provided'
      )
    )
    .run());
  test('should handle api error properly', () => {
    const saga = netsuiteUserRoles({ connectionId, values });
    const { '/netsuite/email': email, '/netsuite/password': password } = values;

    const reqPayload = { email, password };

    expect(saga.next().value).toEqual(
      call(apiCallWithRetry, {
        path: '/netsuite/alluserroles',
        opts: { body: reqPayload, method: 'POST' },
        hidden: true,
      })
    );
    const e = {message: '{"errors":[{"message":"Error message"}]}'};
    const errorsJSON = JSON.parse(e.message);
    const { errors } = errorsJSON;

    expect(saga.throw(e).value).toEqual(put(
      actions.resource.connections.netsuite.requestUserRolesFailed(
        connectionId,
        errors[0].message
      ))
    );
  });
});

describe('Request token saga', () => {
  const resourceId = '1234';

  test('should able to verify request token successfully', () => {
    const fieldId = 'http.auth.token.token';
    const values = {
      '/application': 'Pitney Bowes',
      '/http/sandbox': 'false',
      '/name': 'New Pitney Bowes Connection'};

    const response = {token: {access_token: '12345'}};
    const data = { merged: {assistant: 'pitneybowes'}};
    const saga = requestToken({ resourceId, fieldId, values });

    expect(saga.next().value).toEqual(
      select(
        selectors.resourceData,
        'connections',
        resourceId
      )
    );
    let effect = saga.next(data).value;

    const { merged: connectionResource } = data;
    const { assistant } = connectionResource;
    const { payloadTransformer, responseParser } = functionsTransformerMap[
      assistant
    ];
    const reqPayload = payloadTransformer(values);
    const fieldsToBeSetWithValues = responseParser(response.token);

    expect(effect).toEqual(call(
      apiCallWithRetry, {
        path: `/${assistant}/generate-token`,
        opts: { body: reqPayload, method: 'POST' },
        hidden: true,
      })
    );
    effect = saga.next(response).value;
    expect(effect).toEqual(put(
      actions.resource.connections.saveToken(
        resourceId,
        fieldsToBeSetWithValues,
      )
    )
    );
  });
  test('should able to verify request token successfully', () => {
    const fieldId = 'http.unencrypted.clientId';
    const values = {
      '/application': 'Procurify',
      '/http/sandbox': 'false',
      '/name': 'Procurify'};

    const response = {token: {data: {client_id: '1234444', client_secret: 'asasas'}}};
    const data = { merged: {assistant: 'procurify'}};
    const saga = requestToken({ resourceId, fieldId, values });

    expect(saga.next().value).toEqual(
      select(
        selectors.resourceData,
        'connections',
        resourceId
      )
    );
    let effect = saga.next(data).value;

    const assistant = 'procurifyauthenticate';
    const { payloadTransformer, responseParser } = functionsTransformerMap[
      assistant
    ];
    const reqPayload = payloadTransformer(values);
    const fieldsToBeSetWithValues = responseParser(response.token);

    expect(effect).toEqual(call(
      apiCallWithRetry, {
        path: `/${assistant}/generate-token`,
        opts: { body: reqPayload, method: 'POST' },
        hidden: true,
      })
    );
    effect = saga.next(response).value;
    expect(effect).toEqual(put(
      actions.resource.connections.saveToken(
        resourceId,
        fieldsToBeSetWithValues,
      )
    )
    );
  });
  test('should handle api error properly', () => {
    const fieldId = 'http.unencrypted.clientId';
    const values = {
      '/application': 'Procurify',
      '/http/sandbox': 'false',
      '/name': 'Procurify'};

    const data = { merged: {assistant: 'procurify'}};
    const saga = requestToken({ resourceId, fieldId, values });

    expect(saga.next().value).toEqual(
      select(
        selectors.resourceData,
        'connections',
        resourceId
      )
    );
    const effect = saga.next(data).value;

    const assistant = 'procurifyauthenticate';
    const { payloadTransformer} = functionsTransformerMap[
      assistant
    ];
    const reqPayload = payloadTransformer(values);

    expect(effect).toEqual(call(
      apiCallWithRetry, {
        path: `/${assistant}/generate-token`,
        opts: { body: reqPayload, method: 'POST' },
        hidden: true,
      })
    );
    const e = {message: '{"errors":[{"message":"Error message"}]}'};

    expect(saga.throw(e).value).toEqual(put(
      actions.resource.connections.requestTokenFailed(
        resourceId,
        inferErrorMessage(e.message)
      )
    )
    );
  });
});
