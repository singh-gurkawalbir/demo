/* global describe, test, expect, jest */
import { call, put, select, race, take } from 'redux-saga/effects';
import { throwError } from 'redux-saga-test-plan/providers';
import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import actions from '../../../actions';
import { apiCallWithRetry } from '../../index';
import {newIAFrameWorkPayload, submitFormValues, createFormValuesPatchSet} from '../index';
import inferErrorMessages from '../../../utils/inferErrorMessages';
import { pingConnectionWithAbort, requestToken, requestIClients, pingAndUpdateConnection, pingConnection, createPayload, openOAuthWindowForConnection, commitAndAuthorizeConnection, saveAndAuthorizeConnection, netsuiteUserRoles, requestTradingPartnerConnections } from '.';
import { commitStagedChanges } from '../../resources';
import { selectors } from '../../../reducers/index';
import functionsTransformerMap from '../../../components/DynaForm/fields/DynaTokenGenerator/functionTransformersMap';
import actionTypes from '../../../actions/types';
import getResourceFormAssets from '../../../forms/formFactory/getResourceFromAssets';
import { getAsyncKey } from '../../../utils/saveAndCloseButtons';

jest.mock('../../../forms/formFactory/getResourceFromAssets');

describe('ping and update connection saga', () => {
  const connectionId = 'C1';

  test('should be able to ping and update connection successfully', () => {
    const saga = pingAndUpdateConnection({ connectionId });

    const pingPath = `/connections/${connectionId}/ping`;
    const connectionResourcePath = `/connections/${connectionId}`;
    const mockConnectionResource =
      { name: 'connection1', id: 1};

    expect(saga.next().value).toEqual(
      call(apiCallWithRetry, { path: pingPath, hidden: true })
    );
    expect(saga.next().value).toEqual(
      call(apiCallWithRetry, { path: connectionResourcePath, hidden: true })
    );
    const effect = saga.next(mockConnectionResource).value;

    expect(effect).toEqual(
      put(actions.resource.received('connections', mockConnectionResource))
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

  test('should be able to ping connection successfully ', () => {
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

  test('should be able to throw error message if any', () => {
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
          inferErrorMessages(resp)
        )
      )
      .run();
  });
  test('should handle api error properly', () => {
    const connectionPayload = { name: 'new Connection' };
    const error = new Error('error');

    return expectSaga(pingConnection, { resourceId, values })
      .provide([
        [matchers.call.fn(createPayload), connectionPayload],
        [matchers.call.fn(apiCallWithRetry), throwError(error)],
      ])
      .call.fn(createPayload)
      .call.fn(apiCallWithRetry)
      .put(actions.resource.connections.testErrored(
        resourceId,
        inferErrorMessages(error?.message)
      ))
      .run();
  });
});
describe('request IClients saga', () => {
  const connectionId = 'C1';

  test('should be able to to get IClients successfully', () => expectSaga(requestIClients, { connectionId })
    .provide([
    ])
    .call.fn(newIAFrameWorkPayload)
    .call.fn(apiCallWithRetry)
    .run());
  test('should be able to to get IClients correctly if it is assistant connection', () => {
    const saga = requestIClients({ connectionId });

    const path = '/integrations/1234/iclients?type=rest&assistant=shopify';
    const connectionResource = {connectionType: 'rest', assistant: 'shopify', id: '1234'};

    expect(saga.next().value).toEqual(
      call(newIAFrameWorkPayload, {
        resourceId: connectionId,
      })
    );
    const effect = saga.next(connectionResource).value;

    expect(effect).toEqual(
      call(apiCallWithRetry, { path,
        opts: {
          method: 'GET',
        } })
    );
    expect(saga.next().done).toEqual(true);
  });
  test('should be able to to get IClients correctly if connection has type and does not have assistant', () => {
    const saga = requestIClients({ connectionId });

    const path = '/integrations/1234/iclients?type=netsuite';
    const connectionResource = {connectionType: 'netsuite', id: '1234'};

    expect(saga.next().value).toEqual(
      call(newIAFrameWorkPayload, {
        resourceId: connectionId,
      })
    );
    const effect = saga.next(connectionResource).value;

    expect(effect).toEqual(
      call(apiCallWithRetry, { path,
        opts: {
          method: 'GET',
        } })
    );
    expect(saga.next().done).toEqual(true);
  });
  test('should handle api error properly', () => {
    const saga = requestIClients({ connectionId });

    const path = `/connections/${connectionId}/iclients`;

    expect(saga.next().value).toEqual(
      call(newIAFrameWorkPayload, {
        resourceId: connectionId,
      })
    );

    expect(saga.next().value).toEqual(
      call(apiCallWithRetry, { path,
        opts: {
          method: 'GET',
        } })
    );
    expect(saga.throw(new Error()).value).toEqual(undefined);
    expect(saga.next().done).toEqual(true);
  });
  test('should handle api error properly if it is assistant connection', () => {
    const saga = requestIClients({ connectionId });
    const connectionResource = {connectionType: 'rest', assistant: 'shopify', id: '1234'};

    const pingPath = '/integrations/1234/iclients?type=rest&assistant=shopify';

    expect(saga.next().value).toEqual(
      call(newIAFrameWorkPayload, {
        resourceId: connectionId,
      })
    );
    const effect = saga.next(connectionResource).value;

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
    const connectionResource = {connectionType: 'netsuite', id: '1234'};

    expect(saga.next().value).toEqual(
      call(newIAFrameWorkPayload, {
        resourceId: connectionId,
      })
    );
    const effect = saga.next(connectionResource).value;

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

describe('requestTradingPartnerConnections saga tests', () => {
  const connectionId = 'c1';
  const path = `/connections/${connectionId}/tradingPartner`;
  const response = [
    {
      _id: 'c2',
    },
    {
      _id: 'c3',
    },
  ];

  test('should make an api call to get trading partner connections and dispatch received action', () => expectSaga(requestTradingPartnerConnections, { connectionId })
    .provide([
      [call(apiCallWithRetry, {
        path,
        opts: {
          method: 'GET',
        },
      }), response],
    ])
    .call(apiCallWithRetry, {
      path,
      opts: {
        method: 'GET',
      },
    })
    .put(actions.connection.receivedTradingPartnerConnections(connectionId, response))
    .run());

  test('should not call received action if api call fails with an error', () => {
    const error = {
      code: 404,
    };

    return expectSaga(requestTradingPartnerConnections, { connectionId })
      .provide([
        [call(apiCallWithRetry, {
          path,
          opts: {
            method: 'GET',
          },
        }), throwError(error)],
      ])
      .call(apiCallWithRetry, {
        path,
        opts: {
          method: 'GET',
        },
      })
      .not.put(actions.connection.receivedTradingPartnerConnections())
      .run();
  });
});

describe('Commit and authorize connection saga', () => {
  const resourceId = 'C1';
  const resp = {name: 'conn1'};
  const errorResponse = {error: 'error'};

  test('should be able to commit and authorize connection successfully ', () => expectSaga(commitAndAuthorizeConnection, { resourceId })
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

  test('should be able to save and authorize connection successfully ', () => expectSaga(saveAndAuthorizeConnection, { resourceId, values })
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
  test('should be able to save and does not authorize connection if there are any conflicts ', () => expectSaga(saveAndAuthorizeConnection, { resourceId, values })
    .provide([
      [matchers.call.fn(submitFormValues), resp],
      [select(selectors.createdResourceId), '12345'],
      [select(selectors.resourceData), conflictResponse],
      [matchers.call.fn(newIAFrameWorkPayload), newIAConnDoc],
    ])
    .call.fn(submitFormValues)
    .run());

  test('should handle api error properly', () => {
    const error = new Error('error');

    return expectSaga(saveAndAuthorizeConnection, { resourceId, values })
      .provide([
        [matchers.call.fn(submitFormValues), throwError(error)],
      ])
      .call.fn(submitFormValues)
      .returns(undefined)

      .run();
  });
  test('should be able to handle conflicts properly', () => expectSaga(saveAndAuthorizeConnection, { resourceId, values })
    .provide([
      [matchers.call.fn(submitFormValues), resp],
      [select(selectors.resourceData), conflictResponse],
    ])
    .call.fn(submitFormValues)
    .returns(undefined)
    .run());
  test('should not open oauth window if it is new IA2.0 installer step', () => {
    const connectionResource = {conn: 'conn1'};
    const newIAConnDoc = {installStepConnection: true};

    return expectSaga(saveAndAuthorizeConnection, { resourceId, values })
      .provide([
        [matchers.call.fn(submitFormValues), resp],
        [select(selectors.resourceData), connectionResource],
        [matchers.call.fn(newIAFrameWorkPayload), newIAConnDoc],
      ])
      .call.fn(submitFormValues)
      .call.fn(newIAFrameWorkPayload)
      .returns(true)
      .run();
  });
  test('should handle api error in open oauth window', () => {
    const connectionResource = {conn: 'conn1'};
    const newIAConnDoc = {};
    const error = new Error('error');

    return expectSaga(saveAndAuthorizeConnection, { resourceId, values })
      .provide([
        [matchers.call.fn(submitFormValues), resp],
        [select(selectors.resourceData), connectionResource],
        [matchers.call.fn(newIAFrameWorkPayload), newIAConnDoc],
        [matchers.call.fn(openOAuthWindowForConnection), throwError(error)],
      ])
      .call.fn(submitFormValues)
      .call.fn(newIAFrameWorkPayload)
      .returns(undefined)
      .run();
  });
});

describe('Create payload saga', () => {
  const conn = {master: { _id: 2, name: 'conn', lastModified: new Date().toISOString(), http: {ping: {relativeURI: '/api/v2/users.json'}} }, merged: { _id: 2, name: 'conn', lastModified: new Date().toISOString(), http: {ping: {relativeURI: '/api/v2/users.json'}} }};
  const resourceId = 2;
  const values = {name: 'conn'};
  const patchSet = [{op: 'replace', path: '/name', value: 'ZendeskToday'}, {op: 'add', path: '/http', value: {}}, {op: 'add', path: '/http/ping', value: {}}, {op: 'replace', path: '/http/ping/relativeURI', value: '/api/v3/users.json'}, {op: 'replace', path: '/assistant', value: 'zendesk'}];
  const patchSetAmazonMws = [{op: 'replace', path: '/name', value: 'AmazonMWS'}, {op: 'add', path: '/http', value: {}}, {op: 'add', path: '/http/ping', value: {}}, {op: 'replace', path: '/http/ping/relativeURI', value: '/api/v3/users.json'}, {op: 'replace', path: '/assistant', value: 'amazonmws'}];

  // fake the return value of getResourceFormAssets when createFormValuesPatchSet calls this fn

  getResourceFormAssets.mockReturnValue({fieldMap: {field1: {fieldId: 'something'}}, preSave: null});
  test('should be able to check payload calls successfully', () => expectSaga(createPayload, { resourceId, values })
    .provide([
      [select(selectors.resourceData), conn],
    ])
    .call.fn(createFormValuesPatchSet)
    .run());
  test('should be able to verify payload for rest assistants successfully', () => expectSaga(createPayload, { resourceId, values })
    .provide([
      [select(selectors.resourceData), conn],
      [matchers.call.fn(createFormValuesPatchSet), {patchSet}],
    ])
    .call.fn(createFormValuesPatchSet)
    .returns({name: 'ZendeskToday', assistant: 'zendesk', type: 'rest', rest: {pingRelativeURI: '/api/v3/users.json'}})
    .run());
  test('should be able to verify payload for http assistants successfully', () => expectSaga(createPayload, { resourceId, values })
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
    success: true, accounts: [{account: {type: 'production'}}],
  }};
  const error = {message: '{"errors":[{"message":"Error message"}]}'};
  const errorsJSON = JSON.parse(error.message);
  const { errors } = errorsJSON;
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
  test('should update netsuite user roles successfully when we get only connection Id', () => expectSaga(netsuiteUserRoles, { connectionId})
    .provide([
      [matchers.call.fn(apiCallWithRetry), resp],
    ])
    .call.fn(apiCallWithRetry)
    .put(
      actions.resource.connections.netsuite.receivedUserRoles(
        connectionId,
        resp
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
  test('should handle api error properly', () => expectSaga(netsuiteUserRoles, { connectionId, values })
    .provide([
      [matchers.call.fn(apiCallWithRetry), throwError(error)],
    ])
    .call.fn(apiCallWithRetry)
    .put(
      actions.resource.connections.netsuite.requestUserRolesFailed(
        connectionId,
        errors[0].message
      ))
    .run());

  test('should return directly when there is no connection Id and form values', () => {
    const saga = netsuiteUserRoles({ connectionId: undefined, values: undefined });

    expect(saga.next().done).toEqual(true);
  });
});

describe('Request token saga', () => {
  const resourceId = '1234';

  test('should be able to verify request token successfully', () => {
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
  test('should be able to verify request token successfully', () => {
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
        inferErrorMessages(e.message)
      )
    )
    );
  });
});
describe('pingConnectionWithAbort', () => {
  const params = {resourceId: 1234};
  const {resourceId} = params;

  test('should be able to ping successfully without abort', () => {
    const saga = pingConnectionWithAbort(params);
    const raceBetweenApiCallAndAbort = race({
      testConn: call(pingConnection, params),
      abortPing: take(
        action =>
          action.type === actionTypes.CONNECTION.TEST_CANCELLED &&
          action.resourceId === resourceId
      ),
    });

    expect(JSON.stringify(saga.next().value)).toEqual(
      JSON.stringify(raceBetweenApiCallAndAbort)
    );
  });
  test('should be able to abort ping call', () => {
    const saga = pingConnectionWithAbort(params);
    const response = {abortPing: true};
    const raceBetweenApiCallAndAbort = race({
      testConn: call(pingConnection, params),
      abortPing: take(
        action =>
          action.type === actionTypes.CONNECTION.TEST_CANCELLED &&
          action.resourceId === resourceId
      ),
    });

    expect(JSON.stringify(saga.next().value)).toEqual(
      JSON.stringify(raceBetweenApiCallAndAbort)
    );

    expect(saga.next(response).value).toEqual(put(actions.asyncTask.success(getAsyncKey('connections', resourceId))));
    expect(saga.next(response).value).toEqual(
      put(
        actions.resource.connections.testCancelled(
          resourceId,
          'Request Cancelled'
        )
      )
    );
  });
});
