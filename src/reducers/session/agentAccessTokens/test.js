/* global describe, test, expect */

import reducer, * as selectors from './';
import actions from '../../../actions';

describe('access tokens reducers', () => {
  describe('agent token received action', () => {
    test('should create new entry in agent tokens when new id is received', () => {
      const agentTokens = [
        { _id: 'id1', accessToken: 'abc' },
        { _id: 'id2', accessToken: 'def' },
      ];
      const newToken = { _id: 'id3', accessToken: 'ghi' };
      const state = reducer(agentTokens, 'some action');
      const newState = reducer(state, actions.agent.tokenReceived(newToken));

      expect(newState).toEqual([...agentTokens, newToken]);
    });
    test('should update the state properly when an agents token received', () => {
      const agentTokens = [
        { _id: 'id1', accessToken: 'abc' },
        { _id: 'id2', accessToken: 'def' },
      ];
      const updatedToken = { _id: 'id2', accessToken: 'ghi' };
      const state = reducer(agentTokens, 'some action');
      const newState = reducer(
        state,
        actions.agent.tokenReceived(updatedToken)
      );
      const updatedTokens = [
        { _id: 'id1', accessToken: 'abc' },
        { _id: 'id2', accessToken: 'ghi' },
      ];

      expect(newState).toEqual(updatedTokens);
    });
  });

  describe('agent token mask action', () => {
    test('should retain default state when invalid id is provided', () => {
      const agentTokens = [
        { _id: 'id1', accessToken: 'abc' },
        { _id: 'id2', accessToken: 'def' },
      ];
      const state = reducer(agentTokens, 'some action');
      const newState = reducer(state, actions.agent.maskToken({ _id: 'id3' }));

      expect(newState).toEqual(agentTokens);
    });
    test('should update the state properly when an agents token is masked', () => {
      const agentTokens = [
        { _id: 'id1', accessToken: 'abc' },
        { _id: 'id2', accessToken: 'def' },
      ];
      const state = reducer(agentTokens, 'some action');
      const newState = reducer(state, actions.agent.maskToken({ _id: 'id2' }));
      const updatedTokens = [
        { _id: 'id1', accessToken: 'abc' },
        { _id: 'id2', accessToken: null },
      ];

      expect(newState).toEqual(updatedTokens);
    });
  });
});
describe('agentAccessToken selector', () => {
  test('should return ***** if state is undefined', () => {
    expect(selectors.agentAccessToken(undefined, 123)).toEqual('*****');
  });
  test('should return agent token when valid id is given', () => {
    const agentTokens = [
      { _id: 'id1', accessToken: 'abc' },
      { _id: 'id2', accessToken: 'def' },
    ];
    const state = reducer(agentTokens, 'some action');

    expect(selectors.agentAccessToken(state, 'id2')).toEqual(agentTokens[1]);
  });
  test('should return undefined when invalid id is given', () => {
    const agentTokens = [
      { _id: 'id1', accessToken: 'abc' },
      { _id: 'id2', accessToken: 'def' },
    ];
    const state = reducer(agentTokens, 'some action');

    expect(selectors.agentAccessToken(state, 'id3')).toEqual('*****');
  });
});
