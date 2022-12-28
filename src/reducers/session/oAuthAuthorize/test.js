
import reducer, { selectors } from '.';
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
describe('isAuthorized selector', () => {
  test('should return false for invalid params', () => {
    expect(selectors.isAuthorized()).toBeFalsy();
    expect(selectors.isAuthorized({})).toBeFalsy();
    expect(selectors.isAuthorized({}, 'conn-123')).toBeFalsy();
  });
  test('should return false if the doc for the connectionId has authorized false', () => {
    const connectionDoc = {
      _id: 'con-123',
      type: 'rest',
      rest: {},
      authorized: false,
    };
    const state = {
      'con-123': connectionDoc,
    };

    expect(selectors.isAuthorized(state, 'con-123')).toBeFalsy();
  });
  test('should return true if the connection doc has authorized true', () => {
    const connectionDoc = {
      _id: 'con-123',
      type: 'rest',
      rest: {},
      authorized: true,
    };
    const state = {
      'con-123': connectionDoc,
    };

    expect(selectors.isAuthorized(state, 'con-123')).toBeTruthy();
  });
});

