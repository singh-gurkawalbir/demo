/* global describe, test, expect */

import reducer, * as selectors from './';
import actions from '../../../actions';

describe('api access tokens reducers', () => {
  describe('access token received action', () => {
    test('should create new entry in api access tokens when new id is received', () => {
      const apiAccessTokens = [
        { _id: 'id1', token: 'abc' },
        { _id: 'id2', token: 'def' },
      ];
      const newToken = { _id: 'id3', token: 'ghi' };
      const state = reducer(apiAccessTokens, 'some action');
      const newState = reducer(
        state,
        actions.accessToken.tokenReceived(newToken)
      );

      expect(newState).toEqual([...apiAccessTokens, newToken]);
    });
    test('should update the state properly when an api access token received', () => {
      const apiAccessTokens = [
        { _id: 'id1', token: 'abc' },
        { _id: 'id2', token: 'def' },
      ];
      const updatedToken = { _id: 'id2', token: 'ghi' };
      const state = reducer(apiAccessTokens, 'some action');
      const newState = reducer(
        state,
        actions.accessToken.tokenReceived(updatedToken)
      );
      const updatedTokens = [
        { _id: 'id1', token: 'abc' },
        { _id: 'id2', token: 'ghi' },
      ];

      expect(newState).toEqual(updatedTokens);
    });
  });

  describe('api access token mask action', () => {
    test('should retain default state when invalid id is provided', () => {
      const apiAccessTokens = [
        { _id: 'id1', token: 'abc' },
        { _id: 'id2', token: 'def' },
      ];
      const state = reducer(apiAccessTokens, 'some action');
      const newState = reducer(
        state,
        actions.accessToken.maskToken({ _id: 'id3' })
      );

      expect(newState).toEqual(apiAccessTokens);
    });
    test('should update the state properly when an api access token is masked', () => {
      const apiAccessTokens = [
        { _id: 'id1', token: 'abc' },
        { _id: 'id2', token: 'def' },
      ];
      const state = reducer(apiAccessTokens, 'some action');
      const newState = reducer(
        state,
        actions.accessToken.maskToken({ _id: 'id2' })
      );
      const updatedTokens = [
        { _id: 'id1', token: 'abc' },
        { _id: 'id2', token: null },
      ];

      expect(newState).toEqual(updatedTokens);
    });
  });
});
describe.only('apiAccessToken selector', () => {
  test('should return ***** if state is undefined', () => {
    expect(selectors.apiAccessToken(undefined, 123)).toEqual('*****');
  });
  test('should return api access token when valid id is given', () => {
    const apiAccessTokens = [
      { _id: 'id1', token: 'abc' },
      { _id: 'id2', token: 'def' },
    ];
    const state = reducer(apiAccessTokens, 'some action');

    expect(selectors.apiAccessToken(state, 'id2')).toEqual(apiAccessTokens[1]);
  });
  test('should return undefined when invalid id is given', () => {
    const apiAccessTokens = [
      { _id: 'id1', token: 'abc' },
      { _id: 'id2', token: 'def' },
    ];
    const state = reducer(apiAccessTokens, 'some action');

    expect(selectors.apiAccessToken(state, 'id3')).toEqual('*****');
  });
});
