/* global describe, test, expect */

import reducer, * as selectors from './';
import actions from '../../../actions';

describe('system tokens reducers', () => {
  describe('stack token received action', () => {
    test('should create new entry in stack tokens when new id is received', () => {
      const stackTokens = [
        { _id: 'id1', systemToken: 'abc' },
        { _id: 'id2', systemToken: 'def' },
      ];
      const newToken = { _id: 'id3', systemToken: 'ghi' };
      const state = reducer(stackTokens, 'some action');
      const newState = reducer(state, actions.stack.tokenReceived(newToken));

      expect(newState).toEqual([...stackTokens, newToken]);
    });
    test('should update the state properly when an stacks token received', () => {
      const stackTokens = [
        { _id: 'id1', systemToken: 'abc' },
        { _id: 'id2', systemToken: 'def' },
      ];
      const updatedToken = { _id: 'id2', systemToken: 'ghi' };
      const state = reducer(stackTokens, 'some action');
      const newState = reducer(
        state,
        actions.stack.tokenReceived(updatedToken)
      );
      const updatedTokens = [
        { _id: 'id1', systemToken: 'abc' },
        { _id: 'id2', systemToken: 'ghi' },
      ];

      expect(newState).toEqual(updatedTokens);
    });
  });

  describe('stack token mask action', () => {
    test('should retain default state when invalid id is provided', () => {
      const stackTokens = [
        { _id: 'id1', systemToken: 'abc' },
        { _id: 'id2', systemToken: 'def' },
      ];
      const state = reducer(stackTokens, 'some action');
      const newState = reducer(state, actions.stack.maskToken({ _id: 'id3' }));

      expect(newState).toEqual(stackTokens);
    });
    test('should update the state properly when an stacks token is masked', () => {
      const stackTokens = [
        { _id: 'id1', systemToken: 'abc' },
        { _id: 'id2', systemToken: 'def' },
      ];
      const state = reducer(stackTokens, 'some action');
      const newState = reducer(state, actions.stack.maskToken({ _id: 'id2' }));
      const updatedTokens = [
        { _id: 'id1', systemToken: 'abc' },
        { _id: 'id2', systemToken: null },
      ];

      expect(newState).toEqual(updatedTokens);
    });
  });
});
describe('stackSystemToken selector', () => {
  test('should return ***** if state is undefined', () => {
    expect(selectors.stackSystemToken(undefined, 123)).toEqual('*****');
  });
  test('should return stack token when valid id is given', () => {
    const stackTokens = [
      { _id: 'id1', systemToken: 'abc' },
      { _id: 'id2', systemToken: 'def' },
    ];
    const state = reducer(stackTokens, 'some action');

    expect(selectors.stackSystemToken(state, 'id2')).toEqual(stackTokens[1]);
  });
  test('should return undefined when invalid id is given', () => {
    const stackTokens = [
      { _id: 'id1', systemToken: 'abc' },
      { _id: 'id2', systemToken: 'def' },
    ];
    const state = reducer(stackTokens, 'some action');

    expect(selectors.stackSystemToken(state, 'id3')).toEqual('*****');
  });
});
