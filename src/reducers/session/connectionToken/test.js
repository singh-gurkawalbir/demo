/* global describe, test, expect */

import reducer, { selectors } from '.';
import actions from '../../../actions';

describe('Connection token', () => {
  test('should return initial state when action is not matched', () => {
    const defaultState = {1234: { status: 'loading' }};
    const state = reducer(defaultState, { type: 'RANDOM_ACTION' });

    expect(state).toEqual(defaultState);
  });

  test('should clear token when we receive clear token action', () => {
    const resourceId = '1234';
    const requestReducer = reducer(
      undefined,
      actions.resource.connections.clearToken(resourceId));

    expect(requestReducer).toEqual({
      1234: {},
    });
  });
  test('should clear token of particular id when we receive clear token action', () => {
    const resourceId = '1234';
    const resourceIdNew = '12345';
    const requestReducer = reducer(
      undefined,
      actions.resource.connections.requestToken(resourceIdNew));
    const requestReducerNew = reducer(
      requestReducer,
      actions.resource.connections.clearToken(resourceId));

    expect(requestReducerNew).toEqual({
      12345: {status: 'loading'}, 1234: {},
    });
  });
  test('should set isLoading flag when token request is sent', () => {
    const resourceId = '1234';
    const requestReducer = reducer(
      undefined,
      actions.resource.connections.requestToken(resourceId));

    expect(requestReducer).toEqual({
      1234: {status: 'loading'},
    });
  });
  test('should update state correctly when token received', () => {
    const resourceId = '1234';
    const fieldsToBeSetWithValues = {'http.auth.token.token': 'asbabsbasbas'};
    const requestReducer = reducer(
      undefined,
      actions.resource.connections.saveToken(
        resourceId,
        fieldsToBeSetWithValues
      ));

    expect(requestReducer).toEqual({
      1234: {fieldsToBeSetWithValues: {'http.auth.token.token': 'asbabsbasbas'}, status: 'received'},
    });
  });
  test('should update state correctly when we recieve action token failed', () => {
    const resourceId = '1234';
    const message = 'error Message';
    const requestReducer = reducer(
      undefined,
      actions.resource.connections.requestTokenFailed(
        resourceId,
        message
      ));

    expect(requestReducer).toEqual({
      1234: { status: 'failed', message},
    });
  });
});
describe('connection tokens', () => {
  test('should return undefined if no token exists', () => {
    expect(selectors.connectionTokens(undefined)).toEqual({});
    expect(selectors.connectionTokens('')).toEqual({});
  });

  test('should return correct url if token exists', () => {
    const resourceId = '1234';
    const fieldsToBeSetWithValues = {'http.auth.token.token': 'asbabsbasbas'};
    const state = reducer(
      undefined,
      actions.resource.connections.saveToken(
        resourceId,
        fieldsToBeSetWithValues
      ));

    expect(selectors.connectionTokens(state, resourceId)).toEqual(
      {fieldsToBeSetWithValues: {'http.auth.token.token': 'asbabsbasbas'}, status: 'received' }
    );
  });
});
describe('Token request loading', () => {
  test('should return false if state or resource id does not exists', () => {
    expect(selectors.tokenRequestLoading(undefined)).toEqual(false);
    expect(selectors.tokenRequestLoading({})).toEqual(false);
  });
  test('should return true if token status is loading', () => {
    const resourceId = '1234';
    const state = reducer(
      undefined,
      actions.resource.connections.requestToken(resourceId));

    expect(selectors.tokenRequestLoading(state, resourceId)).toEqual(
      true
    );
  });
  test('should return false if token status is not loading', () => {
    const resourceId = '1234';
    const state = reducer(
      undefined,
      actions.resource.connections.clearToken(resourceId));

    expect(selectors.tokenRequestLoading(state, resourceId)).toEqual(
      false
    );
  });
});
