/* global describe, test, expect, jest */
import { call, put, select, race, take } from 'redux-saga/effects';
import { throwError } from 'redux-saga-test-plan/providers';
import { expectSaga } from 'redux-saga-test-plan';
import * as matchers from 'redux-saga-test-plan/matchers';
import actions from '../../../../actions';
import { apiCallWithRetry } from '../../../index';
import { createFormValuesPatchSet} from '../index';
import inferErrorMessages from '../../../../utils/inferErrorMessages';
import { pingConnectionWithAbort, pingConnection, createPayload } from '.';
import { selectors } from '../../../../reducers/index';
import actionTypes from '../../../../actions/types';
import getResourceFormAssets from '../../../../forms/formFactory/getResourceFromAssets';

jest.mock('../../../../forms/formFactory/getResourceFromAssets');
const ssLinkedConnectionId = 'conn1';

describe('ping connection saga', () => {
  const resourceId = 'C1';

  const values = {name: 'conn1'};

  test('should be able to ping connection successfully ', () => {
    const connectionPayload = { name: 'new Connection' };
    const response = {status: 'success'};

    return expectSaga(pingConnection, { resourceId, values, ssLinkedConnectionId })
      .provide([
        [matchers.call.fn(createPayload), connectionPayload],
        [matchers.call.fn(apiCallWithRetry), response],
      ])
      .call.fn(createPayload)
      .call.fn(apiCallWithRetry)
      .put(
        actions.suiteScript.resource.connections.testSuccessful(
          resourceId,
          ssLinkedConnectionId,
        )
      )
      .run();
  });

  test('should be able to throw error message if any', () => {
    const connectionPayload = { name: 'new Connection' };
    const resp = { errors: ['Errors']};

    return expectSaga(pingConnection, { resourceId, values, ssLinkedConnectionId })
      .provide([
        [matchers.call.fn(createPayload), connectionPayload],
        [matchers.call.fn(apiCallWithRetry), resp],
      ])
      .call.fn(createPayload)
      .call.fn(apiCallWithRetry)
      .put(
        actions.suiteScript.resource.connections.testErrored(
          resourceId,
          inferErrorMessages(resp),
          ssLinkedConnectionId
        )
      )
      .run();
  });
  test('should handle api error properly', () => {
    const connectionPayload = { name: 'new Connection' };
    const error = new Error('error');

    return expectSaga(pingConnection, { resourceId, values, ssLinkedConnectionId })
      .provide([
        [matchers.call.fn(createPayload), connectionPayload],
        [matchers.call.fn(apiCallWithRetry), throwError(error)],
      ])
      .call.fn(createPayload)
      .call.fn(apiCallWithRetry)
      .put(actions.suiteScript.resource.connections.testErrored(
        resourceId,
        inferErrorMessages(error.message),
        ssLinkedConnectionId
      ))
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
      [select(selectors.suiteScriptResourceData), conn],
    ])
    .call.fn(createFormValuesPatchSet)
    .run());
  test('should be able to verify payload for rest assistants successfully', () => expectSaga(createPayload, { resourceId, values })
    .provide([
      [select(selectors.suiteScriptResourceData), conn],
      [matchers.call.fn(createFormValuesPatchSet), {patchSet}],
    ])
    .call.fn(createFormValuesPatchSet)
    .returns({name: 'ZendeskToday', assistant: 'zendesk', http: {ping: {relativeURI: '/api/v3/users.json'}}})
    .run());
  test('should be able to verify payload for http assistants successfully', () => expectSaga(createPayload, { resourceId, values })
    .provide([
      [select(selectors.suiteScriptResourceData), conn],
      [matchers.call.fn(createFormValuesPatchSet), {patchSet: patchSetAmazonMws}],
    ])
    .call.fn(createFormValuesPatchSet)
    .returns({name: 'AmazonMWS', assistant: 'amazonmws', http: {ping: {relativeURI: '/api/v3/users.json'}}})
    .run());
});

describe('pingConnectionWithAbort', () => {
  const params = {resourceId: 1234, ssLinkedConnectionId};
  const {resourceId} = params;

  test('should be able to ping successfully without abort', () => {
    const saga = pingConnectionWithAbort(params);
    const raceBetweenApiCallAndAbort = race({
      testConn: call(pingConnection, params),
      abortPing: take(
        action =>
          action.type === actionTypes.SUITESCRIPT.CONNECTION.TEST_CANCELLED &&
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
          action.type === actionTypes.SUITESCRIPT.CONNECTION.TEST_CANCELLED &&
        action.resourceId === resourceId
      ),
    });

    expect(JSON.stringify(saga.next().value)).toEqual(
      JSON.stringify(raceBetweenApiCallAndAbort)
    );

    expect(saga.next(response).value).toEqual(
      put(
        actions.suiteScript.resource.connections.testCancelled(
          resourceId,
          'Request Cancelled',
          ssLinkedConnectionId
        )
      )
    );
  });
});
