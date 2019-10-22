/* global describe, test, expect */

import reducer from './';
import actions from '../../../actions';

describe('Connection Oauth authorized response', () => {
  test('should return initial state when action is not matched', () => {
    const state = reducer(undefined, { type: 'RANDOM_ACTION' });

    expect(state).toEqual({});
  });

  test('should return isLoading flag set to true when metdata request is sent', () => {
    const connectionId = 'connectionId';
    const requestReducer = reducer(
      undefined,
      actions.resource.connections.authorized(connectionId)
    );

    expect(requestReducer).toEqual({ connectionId: { authorized: true } });
  });
});
